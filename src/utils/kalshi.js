export const STARTING_BALANCE = 1000;
export const MARKET_KEY = "electronics-kalshi-v1";
export const COLORS = ["#a47aff", "#37d89a", "#efbc59", "#49c9e5", "#ed82b5", "#7798ff", "#ed925a", "#b7cf66"];

const round = (value) => Math.round((value + Number.EPSILON) * 100) / 100;

export function createMarket(names = []) {
    return { version: 1, members: names.map((name) => ({ id: crypto.randomUUID(), name })), bets: [], balance: STARTING_BALANCE, winner: null, history: [] };
}

// A small amount of virtual liquidity starts every member at equal odds.
// Yes spending supports that member; No spending supports all other members.
export function getOdds(market) {
    const weights = Object.fromEntries(market.members.map(({ id }) => [id, 100]));
    for (const bet of market.bets) {
        if (bet.side === "yes") weights[bet.memberId] += bet.amount;
        else for (const member of market.members) {
            if (member.id !== bet.memberId) weights[member.id] += bet.amount / Math.max(1, market.members.length - 1);
        }
    }
    const total = Object.values(weights).reduce((sum, value) => sum + value, 0);
    return Object.fromEntries(market.members.map(({ id }) => [id, weights[id] / total]));
}

export function quoteTrade(market, memberId, side, amount) {
    const probability = getOdds(market)[memberId];
    if (probability === undefined || !["yes", "no"].includes(side)) return null;
    const price = Math.min(99, Math.max(1, Math.round((side === "yes" ? probability : 1 - probability) * 100)));
    // Whole shares keep costs and settlement exact to the credit cent.
    const shares = Math.floor((Math.round(Number(amount) * 100) + 0.00001) / price);
    return { price, shares, cost: round(shares * price / 100), payout: shares };
}

function snapshot(market) {
    return { ...market, history: [...market.history, { time: Date.now(), odds: getOdds(market) }].slice(-200) };
}

export function addMembers(market, input) {
    if (market.winner || market.bets.length) throw new Error("Start a new match to change the lineup after betting begins.");
    const names = input.split(/[\n,]/).map((name) => name.trim()).filter(Boolean);
    if (!names.length) throw new Error("Enter at least one member’s name.");
    if (market.members.length + names.length > 24) throw new Error("A match can have up to 24 members.");
    const seen = new Set(market.members.map(({ name }) => name.toLowerCase()));
    for (const name of names) {
        if (name.length > 32) throw new Error("Keep each name to 32 characters or fewer.");
        if (seen.has(name.toLowerCase())) throw new Error(`${name} is already in this match.`);
        seen.add(name.toLowerCase());
    }
    return snapshot({ ...market, members: [...market.members, ...names.map((name) => ({ id: crypto.randomUUID(), name }))], history: [] });
}

export function removeMember(market, id) {
    if (market.winner || market.bets.length) throw new Error("The lineup is locked after the first bet.");
    return snapshot({ ...market, members: market.members.filter((member) => member.id !== id), history: [] });
}

export function placeBet(market, memberId, side, amount) {
    if (market.winner) throw new Error("This match has settled. Start a new match to bet again.");
    if (market.members.length < 2) throw new Error("Add at least two members before placing a bet.");
    const budget = Number(amount);
    if (!Number.isFinite(budget) || budget <= 0) throw new Error("Enter a positive amount of credits.");
    if (budget > market.balance) throw new Error("That amount exceeds your available balance.");
    const quote = quoteTrade(market, memberId, side, budget);
    if (!quote || quote.shares < 1) throw new Error("Choose a member and an amount large enough for one share.");
    const bet = { id: crypto.randomUUID(), memberId, side, amount: quote.cost, shares: quote.shares, price: quote.price, time: Date.now() };
    return snapshot({ ...market, bets: [...market.bets, bet], balance: round(market.balance - quote.cost) });
}

export function betWon(bet, winner) {
    return bet.side === "yes" ? bet.memberId === winner : bet.memberId !== winner;
}

export function settleMarket(market, winner) {
    if (market.winner) throw new Error("This match has already settled.");
    if (market.members.length < 2 || !market.members.some(({ id }) => id === winner)) throw new Error("Choose the Blooket winner from the lineup.");
    const payout = market.bets.reduce((sum, bet) => sum + (betWon(bet, winner) ? bet.shares : 0), 0);
    return { ...market, winner, balance: round(market.balance + payout) };
}

export function readMarket() {
    const raw = localStorage.getItem(MARKET_KEY);
    if (!raw) return createMarket();
    const market = JSON.parse(raw);
    const valid = market?.version === 1 && Array.isArray(market.members) && market.members.length <= 24 &&
        market.members.every((m) => typeof m.id === "string" && typeof m.name === "string" && m.name.trim() && m.name.length <= 32) &&
        new Set(market.members.map((m) => m.id)).size === market.members.length &&
        Number.isFinite(market.balance) && market.balance >= 0 && Array.isArray(market.bets) &&
        market.bets.every((b) => market.members.some((m) => m.id === b.memberId) && ["yes", "no"].includes(b.side) &&
            Number.isFinite(b.amount) && b.amount > 0 && Number.isInteger(b.shares) && b.shares > 0 &&
            Number.isInteger(b.price) && b.price >= 1 && b.price <= 99 && Number.isFinite(b.time)) &&
        (market.winner === null || market.members.some((m) => m.id === market.winner)) &&
        Array.isArray(market.history) && market.history.length <= 200 && market.history.every((h) => Number.isFinite(h.time) &&
            h.odds && market.members.every((m) => Number.isFinite(h.odds[m.id]) && h.odds[m.id] >= 0 && h.odds[m.id] <= 1));
    if (!valid) throw new Error("Saved match data couldn’t be read.");
    return market;
}
