import { useEffect, useRef, useState } from "react";
import { addMembers, betWon, COLORS, createMarket, getOdds, MARKET_KEY, placeBet, quoteTrade, readMarket, removeMember, settleMarket, STARTING_BALANCE } from "../utils/kalshi";
import "./KalshiPage.css";

const credits = (value) => Number(value).toLocaleString("en-US", { maximumFractionDigits: 2 });
const percent = (value) => `${(value * 100).toFixed(value > 0 && value < .1 ? 1 : 0)}%`;
const time = (value) => new Date(value).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

function loadMatch() {
    try { return { market: readMarket(), warning: "" }; }
    catch { return { market: createMarket(), warning: "Saved data is unavailable. This session starts with a fresh match." }; }
}

export default function KalshiPage() {
    const [initial] = useState(loadMatch);
    const [market, setMarket] = useState(initial.market);
    const [selectedId, setSelectedId] = useState(initial.market.members[0]?.id || "");
    const [side, setSide] = useState("yes");
    const [amount, setAmount] = useState("25");
    const [names, setNames] = useState("");
    const [winnerId, setWinnerId] = useState("");
    const [range, setRange] = useState("ALL");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [storageWarning, setStorageWarning] = useState(initial.warning);
    const [dialog, setDialog] = useState(null);
    const tradePanel = useRef(null);
    const nameInput = useRef(null);
    const modal = useRef(null);
    const trigger = useRef(null);

    useEffect(() => {
        const previousTitle = document.title;
        document.title = "Electronics Team Kalshi | Blooket market";
        return () => { document.title = previousTitle; };
    }, []);

    useEffect(() => {
        try { localStorage.setItem(MARKET_KEY, JSON.stringify(market)); }
        catch { setStorageWarning("Browser storage is unavailable or full. Keep this tab open; your match may not survive a refresh."); }
    }, [market]);

    useEffect(() => {
        if (dialog) modal.current?.showModal();
        else if (modal.current?.open) modal.current.close();
    }, [dialog]);

    const odds = getOdds(market);
    const selected = market.members.find(({ id }) => id === selectedId) || market.members[0];
    const winner = market.members.find(({ id }) => id === market.winner);
    const quote = selected ? quoteTrade(market, selected.id, side, amount) : null;
    const sorted = [...market.members].sort((a, b) => odds[b.id] - odds[a.id]);
    const volume = market.bets.reduce((sum, bet) => sum + bet.amount, 0);
    const baseline = market.history[0]?.odds || odds;
    const chartMembers = [...new Set([selected?.id, ...sorted.slice(0, 5).map((m) => m.id)])].filter(Boolean).slice(0, 5).map((id) => market.members.find((m) => m.id === id));
    const cutoff = range === "ALL" ? 0 : Date.now() - (range === "1H" ? 3600000 : 86400000);
    const priorPoint = [...market.history].reverse().find((point) => point.time < cutoff);
    const points = [...(priorPoint ? [{ ...priorPoint, time: cutoff }] : []), ...market.history.filter((point) => point.time >= cutoff)];
    const colorFor = (id) => COLORS[market.members.findIndex((m) => m.id === id) % COLORS.length];
    const canTrade = market.members.length >= 2 && !winner;
    const lineupLocked = market.bets.length > 0 || !!winner;

    function update(action, success) {
        try {
            const next = action(market);
            setMarket(next);
            setMessage(success);
            setError("");
            return next;
        } catch (failure) { setError(failure.message); setMessage(""); return null; }
    }

    function chooseTrade(id, choice) {
        setSelectedId(id);
        setSide(choice);
        setError("");
        if (window.matchMedia("(max-width: 900px)").matches) tradePanel.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }

    function submitNames(event) {
        event.preventDefault();
        const next = update((current) => addMembers(current, names), "Lineup updated. You’re ready to make a prediction.");
        if (next) { setNames(""); if (!selected) setSelectedId(next.members[0].id); }
    }

    function buy(event) {
        event.preventDefault();
        if (selected) update((current) => placeBet(current, selected.id, side, amount), `Bought ${quote?.shares} ${side.toUpperCase()} shares on ${selected.name} for ${credits(quote?.cost)} credits.`);
    }

    function closeDialog() { setDialog(null); trigger.current?.focus(); }
    function openDialog(kind, event) { trigger.current = event.currentTarget; setDialog(kind); }

    return (
        <div className="kalshi-page">
            <header className="ek-nav">
                <a className="ek-brand" href="/kalshi" aria-label="Electronics Team Kalshi home"><span className="ek-logo" aria-hidden="true">ek<span>↗</span></span><span>Electronics Team <b>Kalshi</b></span></a>
                <nav aria-label="Market navigation"><a className="ek-active" href="#ek-market">Markets</a><a href="#ek-positions">My positions</a><button onClick={(event) => openDialog("help", event)}>How it works</button></nav>
                <div className="ek-wallet"><span className="ek-status-dot" />Play money<span className="ek-wallet-divider" /><b>{credits(market.balance)}</b><span className="ek-muted">cr</span></div>
            </header>

            <main className="ek-container" id="ek-market">
                <div className="ek-breadcrumb">ELECTRONICS TEAM <span>/</span> BLOOKET <span>/</span> MATCH WINNER</div>
                <div className="ek-market-heading"><div className="ek-market-icon" aria-hidden="true">ϟ</div><div><p className="ek-eyebrow">A LITTLE FRIENDLY COMPETITION</p><h1>Which new member will win Blooket?</h1></div><span className={`ek-market-status ${winner ? "is-settled" : ""}`}><span className="ek-status-dot" />{winner ? "MARKET SETTLED" : "MARKET OPEN"}</span></div>
                <div className="ek-market-meta"><span>{market.members.length} members</span><span>{credits(volume)} cr traded</span><span>{market.bets.length} {market.bets.length === 1 ? "trade" : "trades"}</span><span>Settles on the Blooket winner</span></div>

                {storageWarning && <p className="ek-notice ek-warning" role="status">{storageWarning}</p>}
                <div className="ek-feedback" aria-live="polite">{message && <p className="ek-notice">✓ {message}</p>}{error && <p className="ek-notice ek-error" role="alert">{error}</p>}</div>
                {winner && <div className="ek-result"><span aria-hidden="true">✦</span><div><strong>{winner.name} wins the match.</strong><p>Winning shares paid 1 credit each. Your balance is {credits(market.balance)} credits.</p></div><button className="ek-secondary" onClick={(event) => openDialog("reset", event)}>New match ↗</button></div>}

                <div className="ek-layout">
                    <div className="ek-main-column">
                        <section className="ek-card ek-chart-card" aria-label="Member market probabilities">
                            <div className="ek-chart-heading"><div><div className="ek-big-probability">{selected ? percent(winner ? (selected.id === winner.id ? 1 : 0) : odds[selected.id]) : "—"}<span className="ek-trend">{selected && !winner ? "CHANCE TO WIN" : winner ? "FINAL RESULT" : "WAITING FOR LINEUP"}</span></div><p>{selected ? <><i style={{ background: colorFor(selected.id) }} /> <strong>{selected.name}</strong> <span className="ek-muted">{winner ? "final outcome" : "wins the match"}</span></> : <span className="ek-muted">Every great market starts with a few names.</span>}</p></div><div className="ek-ranges" aria-label="Chart time range">{["1H", "1D", "ALL"].map((item) => <button key={item} aria-pressed={range === item} onClick={() => setRange(item)}>{item}</button>)}</div></div>
                            <div className="ek-chart">
                                <svg viewBox="0 0 720 252" role="img" aria-label={selected ? "Probability history based on this browser’s trades. Exact current percentages are in the member list below." : "Empty probability chart. Add members to start."} preserveAspectRatio="none">
                                    {[0, 25, 50, 75, 100].map((tick) => <g key={tick}><line x1="0" x2="675" y1={230 - tick * 2.1} y2={230 - tick * 2.1} className="ek-gridline" /><text x="687" y={234 - tick * 2.1}>{tick}%</text></g>)}
                                    {chartMembers.map((member) => {
                                        const series = points.length ? points : [{ time: Date.now(), odds }];
                                        const start = series[0].time;
                                        const end = Math.max(start + 60000, series[series.length - 1].time);
                                        const coords = series.map((point) => `${(point.time - start) / (end - start) * 665},${230 - (point.odds[member.id] ?? odds[member.id]) * 210}`);
                                        coords.push(`665,${230 - odds[member.id] * 210}`);
                                        return <polyline key={member.id} points={coords.join(" ")} fill="none" stroke={colorFor(member.id)} strokeWidth={member.id === selected?.id ? "3" : "1.8"} opacity={member.id === selected?.id ? 1 : .65} vectorEffect="non-scaling-stroke" />;
                                    })}
                                </svg>
                                {!market.members.length && <div className="ek-chart-empty"><span aria-hidden="true">↗</span><strong>The next breakout member?</strong><p>Add your team, then back your pick.</p><button onClick={() => nameInput.current?.focus()}>Build the lineup <span aria-hidden="true">→</span></button></div>}
                            </div>
                            <div className="ek-chart-time"><span>{points.length ? time(points[0].time) : "Match start"}</span><span>{market.bets.length ? "Latest trade" : "Prices move when you trade"}</span></div>
                            <div className="ek-chart-legend">{chartMembers.map((member) => <button key={member.id} aria-pressed={selected?.id === member.id} onClick={() => setSelectedId(member.id)}><i style={{ background: colorFor(member.id) }} />{member.name}</button>)}</div>
                        </section>

                        <section className="ek-members" aria-labelledby="ek-lineup-heading">
                            <div className="ek-section-heading"><div><h2 id="ek-lineup-heading">The lineup <span>{market.members.length}</span></h2><p>Who’s taking the top spot?</p></div><span className="ek-small-pill">Winner takes the match</span></div>
                            <div className="ek-card ek-market-list">
                                <div className="ek-list-header"><span>MEMBER</span><span>CHANCE</span><span>MAKE YOUR PICK</span></div>
                                {!sorted.length && <div className="ek-empty-lineup"><span className="ek-empty-symbol" aria-hidden="true">＋</span><h3>A clean slate. A new favorite.</h3><p>Add the members playing in your next Blooket match.</p></div>}
                                {sorted.map((member) => {
                                    const yesPrice = quoteTrade(market, member.id, "yes", 1).price;
                                    const noPrice = quoteTrade(market, member.id, "no", 1).price;
                                    const chance = winner ? (member.id === winner.id ? 1 : 0) : odds[member.id];
                                    const owned = market.bets.filter((b) => b.memberId === member.id).length;
                                    return <div key={member.id} className={`ek-member-row ${selected?.id === member.id ? "is-selected" : ""}`}>
                                        <button className="ek-member-name" onClick={() => setSelectedId(member.id)} aria-label={`Select ${member.name}`}><span className="ek-avatar" style={{ "--member-color": colorFor(member.id) }}>{member.name[0].toUpperCase()}</span><span><strong>{member.name}{winner?.id === member.id && <span className="ek-winner-label">WINNER</span>}</strong><small>{owned ? `${owned} ${owned === 1 ? "position" : "positions"} held` : "Blooket contender"}</small></span></button>
                                        <div className="ek-member-chance"><strong>{percent(chance)}</strong><div><span style={{ width: `${chance * 100}%`, background: colorFor(member.id) }} /></div></div>
                                        <div className="ek-row-actions"><button className="ek-yes" disabled={!canTrade} onClick={() => chooseTrade(member.id, "yes")} aria-label={`Buy Yes on ${member.name} at ${yesPrice} cents`}>Yes {yesPrice}¢</button><button className="ek-no" disabled={!canTrade} onClick={() => chooseTrade(member.id, "no")} aria-label={`Buy No on ${member.name} at ${noPrice} cents`}>No {noPrice}¢</button>{!lineupLocked && <button className="ek-remove" aria-label={`Remove ${member.name}`} onClick={() => update((current) => removeMember(current, member.id), `${member.name} removed from the lineup.`)}>×</button>}</div>
                                    </div>;
                                })}
                                {!lineupLocked && <form className="ek-add-form" onSubmit={submitNames}><label htmlFor="ek-names">Add members <span>Separate multiple names with commas</span></label><div><input id="ek-names" ref={nameInput} value={names} onChange={(event) => setNames(event.target.value)} placeholder="e.g. Alex, Jordan, Sam" autoComplete="off" maxLength={800} required /><button className="ek-primary" type="submit">＋ Add<span className="ek-desktop-word"> members</span></button></div></form>}
                                {lineupLocked && <div className="ek-lineup-note">Lineup locked after the first trade. Start a new match to change members.</div>}
                            </div>
                        </section>

                        <section className="ek-positions" id="ek-positions" aria-labelledby="ek-positions-heading"><div className="ek-section-heading"><div><h2 id="ek-positions-heading">My positions <span>{market.bets.length}</span></h2><p>Your picks, all in one place.</p></div><span className="ek-muted">{credits(volume)} cr invested</span></div><div className="ek-card">
                            {!market.bets.length ? <div className="ek-empty-positions"><span aria-hidden="true">↗</span><div><h3>No picks yet</h3><p>Choose a member and buy Yes or No to open your first position.</p></div></div> : <div className="ek-position-list">{[...market.bets].reverse().map((bet) => <div className="ek-position" key={bet.id}><span className={`ek-side-label ${bet.side}`}>{bet.side.toUpperCase()}</span><div><strong>{market.members.find((m) => m.id === bet.memberId)?.name}</strong><small>{credits(bet.shares)} shares at {bet.price}¢ · {time(bet.time)}</small></div><div className="ek-position-value"><strong>{winner ? `${betWon(bet, winner.id) ? "+" : ""}${credits(betWon(bet, winner.id) ? bet.shares : 0)} cr` : `${credits(bet.amount)} cr`}</strong><small>{winner ? betWon(bet, winner.id) ? "Paid out" : "Didn’t win" : `${credits(bet.shares)} cr potential payout`}</small></div></div>)}</div>}
                        </div></section>
                    </div>

                    <aside className="ek-sidebar">
                        <section className="ek-card ek-trade" ref={tradePanel} aria-labelledby="ek-trade-heading"><div className="ek-trade-top"><h2 id="ek-trade-heading">Make your prediction</h2><span>PLAY MONEY</span></div><p className="ek-trade-subtitle">{selected ? <><strong>{selected.name}</strong> wins the match</> : "Pick your Blooket favorite"}</p>
                            <form onSubmit={buy}>
                                <div className="ek-trade-sides"><button type="button" className={side === "yes" ? "is-yes" : ""} aria-pressed={side === "yes"} onClick={() => setSide("yes")}>Yes {selected ? `${quoteTrade(market, selected.id, "yes", 1).price}¢` : "—"}</button><button type="button" className={side === "no" ? "is-no" : ""} aria-pressed={side === "no"} onClick={() => setSide("no")}>No {selected ? `${quoteTrade(market, selected.id, "no", 1).price}¢` : "—"}</button></div>
                                <label className="ek-amount-label" htmlFor="ek-amount">Amount <span>{credits(market.balance)} cr available</span></label><div className="ek-amount"><span>cr</span><input id="ek-amount" type="number" min="0.01" step="0.01" max={market.balance} value={amount} onChange={(event) => setAmount(event.target.value)} required disabled={!canTrade} /><span>credits</span></div>
                                <div className="ek-quick-amounts">{[10, 25, 100].map((value) => <button key={value} type="button" disabled={!canTrade} onClick={() => setAmount(String(Math.min(value, market.balance)))}>{value} cr</button>)}<button type="button" disabled={!canTrade} onClick={() => setAmount(String(market.balance))}>Max</button></div>
                                <dl className="ek-trade-summary"><div><dt>Price per share</dt><dd>{quote ? `${quote.price}¢` : "—"}</dd></div><div><dt>Whole shares</dt><dd>{quote && Number.isFinite(quote.shares) ? credits(Math.max(0, quote.shares)) : "—"}</dd></div><div><dt>Total cost</dt><dd>{quote && Number.isFinite(quote.cost) ? `${credits(Math.max(0, quote.cost))} cr` : "—"}</dd></div><div className="ek-payout"><dt>Payout if you’re right <span title="Includes your original cost">ⓘ</span></dt><dd>{quote && Number.isFinite(quote.payout) ? `${credits(Math.max(0, quote.payout))} cr` : "—"}</dd></div></dl>
                                <button className={`ek-buy ${side === "no" ? "buy-no" : ""}`} disabled={!canTrade || !quote || quote.shares < 1 || !Number.isFinite(Number(amount)) || Number(amount) > market.balance || Number(amount) <= 0}>{winner ? "Match settled" : market.members.length < 2 ? "Add 2+ members to trade" : `Buy ${side === "yes" ? "Yes" : "No"}`} <span aria-hidden="true">→</span></button>
                            </form>{(message || error) && <p className={`ek-trade-feedback ${error ? "ek-down" : "ek-up"}`}>{error || message}</p>}<p className="ek-play-note">Just bragging rights. No real money, ever.</p>
                        </section>

                        <section className="ek-card ek-movers"><div className="ek-section-heading"><h2>Market movers</h2><span>THIS MATCH</span></div>{!sorted.length ? <p className="ek-muted">The favorites will show up here once you add your lineup.</p> : [...sorted].sort((a, b) => (odds[b.id] - baseline[b.id]) - (odds[a.id] - baseline[a.id])).slice(0, 5).map((member) => { const change = ((odds[member.id] - baseline[member.id]) * 100) || 0; return <div className="ek-mover" key={member.id}><span><i style={{ background: colorFor(member.id) }} />{member.name}</span><b className={change < 0 ? "ek-down" : "ek-up"}>{change > 0 ? "↗ +" : change < 0 ? "↘ " : ""}{change.toFixed(1)} pts</b></div>; })}</section>

                        <section className="ek-card ek-rules"><span className="ek-card-eyebrow">THE FINE PRINT, SIMPLIFIED</span><h2>Know the game.</h2><p>You’re predicting who finishes first in the Blooket match. Buy <strong>Yes</strong> if you think they’ll win, or <strong>No</strong> if you don’t.</p><p>A winning share pays <strong>1 credit</strong>. Prices move with this browser’s bets; they aren’t connected to Blooket scores.</p><button onClick={(event) => openDialog("help", event)}>How it works <span aria-hidden="true">↗</span></button></section>

                        <section className="ek-card ek-manage"><details><summary>Match controls <span aria-hidden="true">＋</span></summary><p>After the game, select the official first-place member. If there’s a tie, play a tiebreaker first.</p><label htmlFor="ek-winner">Blooket winner</label><select id="ek-winner" value={winnerId} onChange={(event) => setWinnerId(event.target.value)} disabled={!!winner || market.members.length < 2}><option value="">Choose the winner…</option>{market.members.map((member) => <option key={member.id} value={member.id}>{member.name}</option>)}</select><button className="ek-primary" disabled={!!winner || !winnerId} onClick={(event) => openDialog("settle", event)}>Settle match</button><button className="ek-reset" onClick={(event) => openDialog("reset", event)}>Start a new match</button></details></section>
                        <p className="ek-local-note"><span aria-hidden="true">◉</span> Your browser. Your market.<br />Names, balance, and bets stay on this device. They aren’t shared with other players.</p>
                    </aside>
                </div>
                <footer className="ek-footer"><span className="ek-footer-brand">Electronics Team Kalshi<span>Made for match day.</span></span><p>An independent play-money game. Not affiliated with Kalshi or Blooket.</p><span>NO CASH. ALL CONFIDENCE. ↗</span></footer>
            </main>

            <dialog className="ek-dialog" ref={modal} onCancel={closeDialog} onClick={(event) => { if (event.target === event.currentTarget) closeDialog(); }} aria-labelledby="ek-dialog-heading">
                <button className="ek-dialog-close" aria-label="Close dialog" onClick={closeDialog}>×</button>
                {dialog === "help" && <><p className="ek-eyebrow">WELCOME TO THE MARKET</p><h2 id="ek-dialog-heading">Big predictions.<br />Zero real money.</h2><ol><li><strong>Build your lineup.</strong> Add at least two members before betting. Each starts with an equal chance; the first trade locks the names.</li><li><strong>Back your prediction.</strong> You start with {credits(STARTING_BALANCE)} virtual credits. Buy Yes for a member to win, or No for anyone else to win.</li><li><strong>Watch the market move.</strong> Yes bets support a member. No bets spread support across the others. Prices include virtual starting liquidity and are capped at 1–99¢.</li><li><strong>Finish the match.</strong> Select the official Blooket winner in Match controls. Winning whole shares each return 1 credit, including the original stake. Losing shares return 0.</li></ol><p>Use a tiebreaker if needed. The quoted whole-share cost is deducted when you buy. Each new match resets the balance and bets while keeping your lineup. Everything saves locally in this browser.</p><button className="ek-primary" onClick={closeDialog}>Got it. Let’s play →</button></>}
                {dialog === "settle" && <><p className="ek-eyebrow">OFFICIAL RESULT</p><h2 id="ek-dialog-heading">{market.members.find((m) => m.id === winnerId)?.name} takes first?</h2><p>Confirm this is the official Blooket winner. This closes betting and pays all winning Yes and No shares. The result cannot be changed.</p><button className="ek-primary" onClick={() => { update((current) => settleMarket(current, winnerId), "Match settled. Winning shares have been paid to your balance."); closeDialog(); }}>Confirm winner & settle</button><button className="ek-reset" onClick={closeDialog}>Keep playing</button></>}
                {dialog === "reset" && <><p className="ek-eyebrow">FRESH ROUND</p><h2 id="ek-dialog-heading">Ready for the next match?</h2><p>This clears all bets and results and resets your balance to {credits(STARTING_BALANCE)} credits. Your member lineup stays. Any unsettled bets will be discarded.</p><button className="ek-primary" onClick={() => { setMarket(createMarket(market.members.map((m) => m.name))); setSelectedId(""); setWinnerId(""); setMessage("New match. Same team. A fresh 1,000 credits."); setError(""); closeDialog(); }}>Start fresh match</button><button className="ek-reset" onClick={closeDialog}>Keep this match</button></>}
            </dialog>
        </div>
    );
}
