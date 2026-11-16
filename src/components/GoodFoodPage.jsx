import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CACHE_KEY, DAYS, DINING_URL, SOURCE_URL, countdownParts, fetchGoodFoodSchedule, formatCampusDate, formatSlotTime, getServicePlan, readCachedSchedule } from "../utils/goodFood";
import goodFoodImage from "../assets/Jpegs/good-food.jpg";
import "./GoodFoodPage.css";

export default function GoodFoodPage() {
    const [schedule, setSchedule] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [request, setRequest] = useState(0);
    const [now, setNow] = useState(Date.now);

    useEffect(() => {
        const oldTitle = document.title;
        document.title = "Good Food | Yes, Chef. — P-House at RIT";
        const timer = window.setInterval(() => setNow(Date.now()), 1000);
        return () => { document.title = oldTitle; window.clearInterval(timer); };
    }, []);

    useEffect(() => {
        const controller = new AbortController();
        let timedOut = false;
        let active = true;
        const timeout = window.setTimeout(() => { timedOut = true; controller.abort(); }, 12000);
        setLoading(true);
        setError("");
        fetchGoodFoodSchedule(controller.signal).then((fresh) => {
            if (!active) return;
            setSchedule(fresh);
            setNow(Date.now());
            try { localStorage.setItem(CACHE_KEY, JSON.stringify(fresh)); } catch { /* Live data still works without storage. */ }
        }).catch((failure) => {
            if (!active) return;
            let cached = null;
            try { cached = readCachedSchedule(localStorage); } catch { /* Storage may be blocked. */ }
            setSchedule(cached);
            setError(timedOut ? "The schedule check timed out." : failure.message || "The schedule could not be checked.");
        }).finally(() => {
            window.clearTimeout(timeout);
            if (active) setLoading(false);
        });
        return () => { active = false; controller.abort(); window.clearTimeout(timeout); };
    }, [request]);

    const plan = getServicePlan(schedule?.slots || [], now);
    const next = plan.next;
    const countdown = next ? countdownParts(next.start, now) : null;
    const checkedTime = schedule && formatCampusDate(schedule.checkedAt, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit", timeZoneName: "short" });

    return (
        <div className="gf-page">
            <a className="gf-skip" href="#gf-main">Skip to the schedule</a>
            <header className="gf-header">
                <Link className="gf-brand" to="/good-food" aria-label="Good Food home"><span className="gf-pitchfork" aria-hidden="true">♆</span><span>GOOD FOOD<span className="gf-brand-sub">THE P-HOUSE TRACKER</span></span></Link>
                <nav aria-label="Good Food navigation"><a href="#gf-schedule">The schedule</a><a href={DINING_URL} target="_blank" rel="noreferrer">RIT Dining <span aria-hidden="true">↗</span></a><Link className="gf-home" to="/main-menu">Back home <span aria-hidden="true">↗</span></Link></nav>
            </header>

            <main id="gf-main">
                <section className="gf-hero" aria-labelledby="gf-heading">
                    <div className="gf-hero-copy"><p className="gf-eyebrow"><span /> RIT VISITING CHEF · P-HOUSE / P.H. EXPRESS</p><h1 id="gf-heading">GOOD FOOD.<em>YES, CHEF.</em></h1><p className="gf-intro">The only kitchen drama we need:<br />finding out where P-House is next.</p><a className="gf-red-button" href="#gf-pass">Where’s the good food? <span aria-hidden="true">↓</span></a><div className="gf-hero-footnote"><span className="gf-tiny-fork" aria-hidden="true">♆</span><span>Big flavor. Campus legend. Absolutely worth the walk.</span></div></div>
                    <figure className="gf-portrait"><div className="gf-photo-top"><span>THE MAN. THE MYTH. THE GOOD FOOD.</span><span aria-hidden="true">✦</span></div><img src={goodFoodImage} width="640" height="640" alt="The P-House chef serving a meal above the clouds, with the words Good Food is Waiting" fetchPriority="high" /><figcaption><span>GOOD FOOD IS WAITING.</span><span>ARE YOU?</span></figcaption><span className="gf-photo-stamp" aria-hidden="true">CAMPUS<br /><b>LEGEND</b><br />RIT, NY</span></figure>
                </section>

                <div className="gf-ribbon" aria-hidden="true">{Array.from({ length: 4 }, (_, i) => <span key={i}>GOOD FOOD IS WAITING <b>✦</b> YES, CHEF <b>✦</b></span>)}</div>

                <section className="gf-pass" id="gf-pass" aria-labelledby="gf-pass-heading">
                    <div className="gf-section-heading"><div><p className="gf-eyebrow">ORDER UP</p><h2 id="gf-pass-heading">Next on the pass<span>.</span></h2></div><div className="gf-campus-clock"><span>ROCHESTER, NEW YORK</span><b>{formatCampusDate(now, { weekday: "short", hour: "numeric", minute: "2-digit", timeZoneName: "short" })}</b></div></div>
                    <div className="gf-service-board" aria-busy={loading}>
                        <div className="gf-next-service"><div className="gf-board-label"><span className={`gf-status-dot ${loading ? "is-checking" : ""}`} />{loading ? "CHECKING THE KITCHEN" : error ? schedule ? "SAVED WEEKLY SCHEDULE" : "SCHEDULE UNAVAILABLE" : "NEXT SCHEDULED VISIT"}</div><h3>{loading ? "One moment, chef…" : next ? next.location : "Hold the pass."}</h3><p className="gf-next-date">{loading ? "Fetching the latest schedule from OBIII." : next ? <>{formatCampusDate(next.start, { weekday: "long", month: "short", day: "numeric" })}<span> / </span>{formatSlotTime(next)} ET</> : "We couldn’t check the schedule. Give it another try."}</p><p className="gf-board-note">{next && !loading ? "Scheduled start time · service end time is not listed by OBIII." : "Fresh schedule data on every page refresh."}</p></div>
                        <div className="gf-countdown"><p>THE WAIT FOR GOOD FOOD</p><div className="gf-countdown-digits" role="timer" aria-label={countdown && !loading ? `${countdown[0]} days, ${countdown[1]} hours, ${countdown[2]} minutes, ${countdown[3]} seconds until the next scheduled visit` : "Waiting for schedule"}>{["DAYS", "HRS", "MINS", "SECS"].map((label, index) => <div key={label}><strong>{countdown && !loading ? String(countdown[index]).padStart(2, "0") : "--"}</strong><span>{label}</span></div>)}</div><span className="gf-countdown-caption">Patience, chef. Good things take time.</span></div>
                    </div>
                    <div className="gf-refresh-line"><p role="status">{loading ? "Checking OBIII’s latest weekly schedule…" : error ? `${error} ${schedule ? `Showing a saved copy from ${checkedTime}.` : "No schedule data available."}` : `Schedule checked ${checkedTime}.`}</p><button onClick={() => setRequest((value) => value + 1)} disabled={loading}><span aria-hidden="true" className={loading ? "gf-spin" : ""}>↻</span> {loading ? "Checking…" : "Refresh schedule"}</button></div>
                    <div className="gf-today"><span className="gf-today-label">TODAY’S TICKET</span><p>{loading ? "Finding today’s stops…" : !schedule ? "Check the schedule again to see today’s stops." : !plan.today.length ? "No Good Food visits on OBIII’s schedule today. Even legends take a break." : plan.today.map((visit, index) => <span className="gf-today-stop" key={`${visit.start}-${visit.location}`}>{index > 0 && <span aria-hidden="true"> + </span>}<b>{visit.location}</b> <span>· {visit.start <= now ? "started" : "starts"} {formatSlotTime(visit)}</span></span>)}</p></div>
                </section>

                <section className="gf-schedule-section" id="gf-schedule" aria-labelledby="gf-schedule-heading">
                    <div className="gf-schedule-intro"><p className="gf-eyebrow">KNOW THE ROTATION</p><h2 id="gf-schedule-heading">This week’s<br /><em>game plan.</em></h2><p>Same chef. Different kitchens.<br />Plan your pilgrimage accordingly.</p><a href={SOURCE_URL} target="_blank" rel="noreferrer">From RITSEC’s OBIII schedule <span aria-hidden="true">↗</span></a><div className="gf-chef-note"><span aria-hidden="true">♆</span><p>“Where’s the good food?”<br /><b>Consider this your answer.</b></p></div></div>
                    <div className="gf-week"><div className="gf-week-top"><span>THE WEEKLY LINEUP</span><span>ALL TIMES EASTERN</span></div>{DAYS.map((_, i) => {
                        const day = (i + 1) % 7;
                        const slots = schedule?.slots.filter((slot) => slot.day === day) || [];
                        return <div key={day} className={`gf-day ${day === plan.day ? "is-today" : ""}`}><div className="gf-day-name"><span>{DAYS[day].slice(0, 3)}</span>{day === plan.day && <small>TODAY</small>}</div><div className="gf-day-services">{loading ? <span className="gf-day-empty">Checking…</span> : !schedule ? <span className="gf-day-empty">Schedule unavailable</span> : slots.length ? slots.map((slot) => <div className="gf-slot" key={`${slot.hour}-${slot.minute}-${slot.location}`}><b>{slot.location}</b><time>{formatSlotTime(slot)}</time></div>) : <span className="gf-day-empty">Chef’s day off <span aria-hidden="true">—</span></span>}</div></div>;
                    })}<div className="gf-week-bottom">A weekly plan, chef. Check RIT Dining for changes.</div></div>
                </section>

                <aside className="gf-source-note"><span aria-hidden="true">*</span><p>This tracker follows <a href={SOURCE_URL} target="_blank" rel="noreferrer">OBIII’s recurring Good Food pings</a>, fetched fresh on reload. It isn’t a live availability feed; RIT’s official listings may include other visits, holiday changes, or cancellations. <a href={DINING_URL} target="_blank" rel="noreferrer">Check RIT’s visiting chef calendar ↗</a></p></aside>
            </main>
            <footer className="gf-footer"><div><span className="gf-footer-brand">GOOD FOOD<span>.</span></span><p>An unofficial P-House fan page. Made for hungry RIT people.</p></div><Link to="/main-menu">A Joseph Bird production <span aria-hidden="true">↗</span></Link></footer>
            <div className="gf-checkers" aria-hidden="true" />
        </div>
    );
}
