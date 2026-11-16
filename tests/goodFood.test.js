import test from "node:test";
import assert from "node:assert/strict";
import { CACHE_KEY, countdownParts, fetchGoodFoodSchedule, getServicePlan, parseGoodFoodSchedule, readCachedSchedule } from "../src/utils/goodFood.js";

const botSource = `
// makePing("0 0 9 * * SUN", "Not a real visit")
/* makePing("0 0 9 * * SAT", "Also not a visit") */
makePing("0 0 11 * * MON", "RITZ")
makePing("0 0 11 * * TUE", "Crossroads")
makePing("0 0 11 * * WED", "Brick City Cafe")
skipPing("0 0 11 * * THU")
makePing("0 0 16 * * WED", "RITZ")
makePing("0 0 16 * * THU", "Crossroads")
makePing("0 0 16 * * FRI", "RITZ")
`;
const slots = parseGoodFoodSchedule(botSource);

test("reads OBIII’s visits while excluding skipped and commented pings", () => {
    assert.equal(slots.length, 6);
    assert.deepEqual(slots[0], { day: 1, hour: 11, minute: 0, location: "RITZ" });
    assert.deepEqual(slots.filter((slot) => slot.day === 3).map((slot) => slot.location), ["Brick City Cafe", "RITZ"]);
    for (const source of ["<html>Unavailable</html>", 'makePing("0 0 26 * * MON", "RITZ")', 'makePing("0 0 11 1 * MON", "RITZ")', 'makePing("0 0 11 * * WHAT", "RITZ")']) {
        assert.throws(() => parseGoodFoodSchedule(source));
    }
});

test("keeps today’s earlier visits and finds the next start after a meal begins", () => {
    const plan = getServicePlan(slots, Date.parse("2026-11-18T17:00:00Z"));
    assert.equal(plan.day, 3);
    assert.equal(plan.today.length, 2);
    assert.equal(plan.next.location, "RITZ");
    assert.equal(new Date(plan.next.start).toISOString(), "2026-11-18T21:00:00.000Z");
});

test("uses the RIT calendar day even when UTC is already tomorrow", () => {
    const plan = getServicePlan(slots, Date.parse("2026-11-17T02:00:00Z"));
    assert.equal(plan.day, 1);
    assert.equal(plan.today[0].location, "RITZ");
    assert.equal(plan.next.location, "Crossroads");
});

test("weekends roll forward, including across both daylight saving changes", () => {
    for (const [now, expected] of [
        ["2026-11-20T22:00:00Z", "2026-11-23T16:00:00.000Z"],
        ["2026-03-07T17:00:00Z", "2026-03-09T15:00:00.000Z"],
        ["2026-10-31T16:00:00Z", "2026-11-02T16:00:00.000Z"],
    ]) assert.equal(new Date(getServicePlan(slots, Date.parse(now)).next.start).toISOString(), expected);
    assert.equal(getServicePlan(slots, Date.parse("2026-11-21T17:00:00Z")).today.length, 0);
    assert.equal(getServicePlan([], Date.now()).next, null);
    const weekly = [{ day: 1, hour: 11, minute: 0, location: "RITZ" }];
    assert.equal(new Date(getServicePlan(weekly, Date.parse("2026-11-16T17:00:00Z")).next.start).toISOString(), "2026-11-23T16:00:00.000Z");
});

test("validates saved schedules and tolerates unavailable browser storage", () => {
    const cached = { slots, checkedAt: 1794866000000 };
    assert.deepEqual(readCachedSchedule({ getItem: (key) => key === CACHE_KEY ? JSON.stringify(cached) : null }), cached);
    for (const raw of ["broken", "null", JSON.stringify({ ...cached, slots: [{ day: 9 }] }), JSON.stringify({ slots, checkedAt: null })]) {
        assert.equal(readCachedSchedule({ getItem: () => raw }), null);
    }
    assert.equal(readCachedSchedule({ getItem: () => { throw new Error("Storage blocked"); } }), null);
});

test("refreshes use an uncached source request and reject network/format failures", async () => {
    const originalFetch = globalThis.fetch;
    const calls = [];
    const controller = new AbortController();
    try {
        globalThis.fetch = async (url, options) => { calls.push({ url, options }); return { ok: true, text: async () => botSource }; };
        const result = await fetchGoodFoodSchedule(controller.signal);
        assert.deepEqual(result.slots, slots);
        assert.equal(calls[0].options.cache, "no-store");
        assert.equal(calls[0].options.signal, controller.signal);
        assert.match(calls[0].url, /goodfood\.go\?t=\d+$/);
        globalThis.fetch = async () => ({ ok: true, text: async () => 'makePing("0 30 12 * * MON", "New kitchen")' });
        const updated = await fetchGoodFoodSchedule();
        assert.deepEqual(updated.slots, [{ day: 1, hour: 12, minute: 30, location: "New kitchen" }]);
        globalThis.fetch = async () => ({ ok: false });
        await assert.rejects(fetchGoodFoodSchedule(), /could not be reached/);
        globalThis.fetch = async () => ({ ok: true, text: async () => "unreadable" });
        await assert.rejects(fetchGoodFoodSchedule(), /No readable/);
    } finally { globalThis.fetch = originalFetch; }
});

test("countdowns don’t go negative and include days", () => {
    assert.deepEqual(countdownParts(90061000, 0), [1, 1, 1, 1]);
    assert.deepEqual(countdownParts(0, 1000), [0, 0, 0, 0]);
});
