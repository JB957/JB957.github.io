import test from "node:test";
import assert from "node:assert/strict";
import { addMembers, createMarket, getOdds, placeBet, quoteTrade, readMarket, removeMember, settleMarket } from "../src/utils/kalshi.js";

const lineup = () => addMembers(createMarket(), "Alex, Jordan, Sam");

test("members start equal, support moves odds, and probabilities sum to one", () => {
    const market = lineup();
    const id = market.members[0].id;
    assert.equal(getOdds(market)[id], 1 / 3);
    const supported = placeBet(market, id, "yes", 25);
    assert.ok(getOdds(supported)[id] > getOdds(market)[id]);
    assert.ok(Math.abs(Object.values(getOdds(supported)).reduce((a, b) => a + b, 0) - 1) < 1e-12);
    const opposed = placeBet(market, id, "no", 25);
    assert.ok(getOdds(opposed)[id] < getOdds(market)[id]);
    assert.equal(supported.history.length, 2);
});

test("whole-share quotes charge exactly the displayed cost", () => {
    const market = lineup();
    const id = market.members[0].id;
    const quote = quoteTrade(market, id, "yes", 25);
    assert.deepEqual(quote, { price: 33, shares: 75, cost: 24.75, payout: 75 });
    const bought = placeBet(market, id, "yes", 25);
    assert.equal(bought.balance, 975.25);
    assert.equal(bought.bets[0].amount, quote.cost);
    assert.equal(bought.bets[0].shares, quote.shares);
    assert.equal(market.balance, 1000);
});

test("rejects overspending, invalid amounts, and trades without a real market", () => {
    const market = lineup();
    const id = market.members[0].id;
    for (const amount of [0, -10, NaN, Infinity, "abc", 1000.01]) {
        assert.throws(() => placeBet(market, id, "yes", amount));
    }
    assert.throws(() => placeBet(market, "missing", "yes", 25));
    assert.throws(() => placeBet(market, id, "other", 25));
    assert.throws(() => placeBet(createMarket(), id, "yes", 25));
    assert.throws(() => placeBet(addMembers(createMarket(), "Alex"), id, "yes", 25));
    assert.throws(() => placeBet(market, id, "yes", .01));
});

test("duplicate names and lineup edits after trading are rejected", () => {
    const market = lineup();
    assert.throws(() => addMembers(market, "alex"));
    assert.throws(() => addMembers(market, "Pat, pat"));
    assert.throws(() => addMembers(market, " "));
    assert.throws(() => addMembers(market, "a".repeat(33)));
    assert.throws(() => addMembers(market, Array.from({ length: 22 }, (_, i) => `Player ${i}`).join(",")));
    const traded = placeBet(market, market.members[0].id, "yes", 25);
    assert.throws(() => addMembers(traded, "Taylor"));
    assert.throws(() => removeMember(traded, traded.members[0].id));
    assert.equal(removeMember(market, market.members[0].id).members.length, 2);
});

test("settlement pays winning Yes and No shares once and closes betting", () => {
    let market = lineup();
    const [alex, jordan] = market.members;
    market = placeBet(market, alex.id, "yes", 25);
    market = placeBet(market, jordan.id, "no", 25);
    market = placeBet(market, jordan.id, "yes", 25);
    market = placeBet(market, alex.id, "no", 25);
    const expected = Math.round((market.balance + market.bets[0].shares + market.bets[1].shares) * 100) / 100;
    const settled = settleMarket(market, alex.id);
    assert.equal(settled.balance, expected);
    assert.equal(settled.winner, alex.id);
    assert.throws(() => settleMarket(settled, jordan.id));
    assert.throws(() => placeBet(settled, alex.id, "yes", 10));
    assert.throws(() => settleMarket(market, "unknown"));
    assert.throws(() => settleMarket(addMembers(createMarket(), "Alex"), "unknown"));
});

test("full balance can be spent without overdrawing; a new match resets the account", () => {
    let market = lineup();
    market = placeBet(market, market.members[0].id, "yes", market.balance);
    assert.ok(market.balance >= 0 && market.balance < .33);
    assert.throws(() => placeBet(market, market.members[0].id, "yes", 1));
    const fresh = createMarket(market.members.map((member) => member.name));
    assert.equal(fresh.balance, 1000);
    assert.equal(fresh.bets.length, 0);
    assert.deepEqual(fresh.members.map((member) => member.name), ["Alex", "Jordan", "Sam"]);
});

test("saved matches round-trip and malformed data is rejected", () => {
    const market = lineup();
    const original = globalThis.localStorage;
    try {
        globalThis.localStorage = { getItem: () => JSON.stringify(market) };
        assert.deepEqual(readMarket(), market);
        globalThis.localStorage = { getItem: () => JSON.stringify({ ...market, balance: -1 }) };
        assert.throws(readMarket);
        globalThis.localStorage = { getItem: () => "not json" };
        assert.throws(readMarket);
        globalThis.localStorage = { getItem: () => null };
        assert.equal(readMarket().balance, 1000);
    } finally { globalThis.localStorage = original; }
});
