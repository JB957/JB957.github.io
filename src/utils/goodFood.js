export const SCHEDULE_URL = "https://raw.githubusercontent.com/ritsec/ops-bot-iii/main/commands/scheduled/goodfood.go";
export const SOURCE_URL = "https://github.com/ritsec/ops-bot-iii/blob/main/commands/scheduled/goodfood.go";
export const DINING_URL = "https://www.rit.edu/dining/visiting-chefs";
export const TIME_ZONE = "America/New_York";
export const CACHE_KEY = "good-food-schedule-v1";
export const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const campusClock = new Intl.DateTimeFormat("en-US", {
    timeZone: TIME_ZONE, year: "numeric", month: "numeric", day: "numeric",
    hour: "numeric", minute: "numeric", second: "numeric", hourCycle: "h23",
});

function localParts(date) {
    return Object.fromEntries(campusClock.formatToParts(date).filter(({ type }) => type !== "literal").map(({ type, value }) => [type, Number(value)]));
}

function campusTimestamp(year, month, day, hour, minute) {
    const target = Date.UTC(year, month - 1, day, hour, minute);
    let result = target;
    // Resolve the campus UTC offset for this particular date, including DST.
    for (let pass = 0; pass < 3; pass++) {
        const p = localParts(result);
        result += target - Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    }
    return result;
}

function cronDays(value) {
    const dayNumber = (token) => {
        const named = DAYS.findIndex((day) => day.slice(0, 3).toUpperCase() === token.toUpperCase());
        if (named !== -1) return named;
        if (/^[0-7]$/.test(token)) return Number(token) % 7;
        throw new Error("The bot’s schedule format has changed.");
    };
    if (value === "*") return [0, 1, 2, 3, 4, 5, 6];
    return [...new Set(value.split(",").flatMap((part) => {
        const range = part.split("-");
        if (range.length === 1) return [dayNumber(part)];
        if (range.length !== 2) throw new Error("The bot’s schedule format has changed.");
        const start = dayNumber(range[0]);
        const end = dayNumber(range[1]);
        if (end < start) throw new Error("The bot’s schedule format has changed.");
        return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    }))];
}

// Read the same cron calls OBIII uses for its Good Food pings. Never execute Go.
export function parseGoodFoodSchedule(source) {
    const code = source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
    const calls = [...code.matchAll(/^\s*makePing\s*\(\s*"([^"\n]+)"\s*,\s*"([^"\n]+)"\s*\)/gm)];
    if (!calls.length) throw new Error("No readable Good Food schedule was found in OBIII.");
    const slots = calls.flatMap(([, cron, location]) => {
        const fields = cron.trim().split(/\s+/);
        if (fields.length !== 6 || fields[0] !== "0" || fields[3] !== "*" || fields[4] !== "*" ||
            !/^\d+$/.test(fields[1]) || !/^\d+$/.test(fields[2]) || Number(fields[1]) > 59 || Number(fields[2]) > 23 || !location.trim()) {
            throw new Error("The bot’s schedule format has changed.");
        }
        return cronDays(fields[5]).map((day) => ({ day, hour: Number(fields[2]), minute: Number(fields[1]), location: location.trim() }));
    });
    return slots.filter((slot, index) => slots.findIndex((other) => JSON.stringify(other) === JSON.stringify(slot)) === index)
        .sort((a, b) => a.day - b.day || a.hour - b.hour || a.minute - b.minute || a.location.localeCompare(b.location));
}

export async function fetchGoodFoodSchedule(signal) {
    const response = await fetch(`${SCHEDULE_URL}?t=${Date.now()}`, { cache: "no-store", signal });
    if (!response.ok) throw new Error("OBIII’s schedule could not be reached.");
    return { slots: parseGoodFoodSchedule(await response.text()), checkedAt: Date.now() };
}

export function readCachedSchedule(storage) {
    try {
        const cached = JSON.parse(storage.getItem(CACHE_KEY));
        if (!Number.isFinite(cached?.checkedAt) || cached.checkedAt <= 0 || !Array.isArray(cached.slots) || !cached.slots.length ||
            !cached.slots.every((slot) => Number.isInteger(slot.day) && slot.day >= 0 && slot.day <= 6 &&
                Number.isInteger(slot.hour) && slot.hour >= 0 && slot.hour <= 23 && Number.isInteger(slot.minute) && slot.minute >= 0 && slot.minute <= 59 &&
                typeof slot.location === "string" && slot.location.trim())) return null;
        return cached;
    } catch { return null; }
}

export function getServicePlan(slots, now = Date.now()) {
    const p = localParts(now);
    const todayDate = new Date(Date.UTC(p.year, p.month - 1, p.day));
    const visits = [];
    for (let offset = 0; offset <= 7; offset++) {
        const date = new Date(Date.UTC(p.year, p.month - 1, p.day + offset));
        for (const slot of slots.filter((item) => item.day === date.getUTCDay())) {
            visits.push({ ...slot, start: campusTimestamp(date.getUTCFullYear(), date.getUTCMonth() + 1, date.getUTCDate(), slot.hour, slot.minute), isToday: offset === 0 });
        }
    }
    visits.sort((a, b) => a.start - b.start || a.location.localeCompare(b.location));
    return { day: todayDate.getUTCDay(), today: visits.filter((visit) => visit.isToday), next: visits.find((visit) => visit.start >= now) ?? null };
}

export function formatCampusDate(timestamp, options = {}) {
    return new Intl.DateTimeFormat("en-US", { timeZone: TIME_ZONE, ...options }).format(timestamp);
}

export function formatSlotTime(slot) {
    return new Intl.DateTimeFormat("en-US", { timeZone: "UTC", hour: "numeric", minute: "2-digit" })
        .format(Date.UTC(2026, 0, 1, slot.hour, slot.minute));
}

export function countdownParts(start, now) {
    const seconds = Math.max(0, Math.ceil((start - now) / 1000));
    return [Math.floor(seconds / 86400), Math.floor(seconds / 3600) % 24, Math.floor(seconds / 60) % 60, seconds % 60];
}
