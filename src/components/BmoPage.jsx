import { projects } from "../data/projects";
import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Link, useLocation, useNavigate } from "react-router-dom";
import BmoControls from "./BmoControls";
import { aboutText } from "../data/aboutText";
import { workExperiences } from "../data/workExperiences";
import { crawlText } from "../data/creditsText";
import avatar from "../assets/Jpegs/Me.png";
import "./BmoMenu.css";

const pages = {
    ...Object.fromEntries(projects.map((project) => [project.path, { ...project, action: "OPEN", external: true }])),
    "/": { title: "Hello, friend!", action: "PLAY", href: "/main-menu" },
    "/about-me": { title: "About me", action: "CV", href: "/cv.pdf", external: true },
    "/work-experience": { title: "Experience", action: "CV", href: "/cv.pdf", external: true },
    "/technologies-view": { title: "Technologies", action: "CODE", href: "https://github.com/JB957", external: true },
    "/linkedin-view": { title: "LinkedIn", action: "OPEN", href: "https://www.linkedin.com/in/joey-bird957", external: true },
    "/github-view": { title: "GitHub", action: "OPEN", href: "https://github.com/JB957", external: true },
    "/source-view": { title: "Source code", action: "OPEN", href: "https://github.com/JB957/JB957.github.io", external: true },
    "/credits-view": { title: "Credits", action: "PAUSE" },
};
const technologies = [
    ["Languages", ["HTML", "CSS", "JavaScript", "Java", "Python"]],
    ["Frameworks & libraries", ["React", "Ruby on Rails", "Spring"]],
    ["Databases", ["MySQL", "PostgreSQL"]],
    ["Tools", ["Docker", "Tailwind CSS", "Figma", "Bootstrap", "GSAP"]],
];

export default function BmoPage() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const screen = useRef(null);
    const actionLink = useRef(null);
    const [playing, setPlaying] = useState(true);
    const isCredits = pathname === "/credits-view";
    const page = pages[pathname];
    const project = projects.find((item) => item.path === pathname);
    const reducedMotion = useMediaQuery({ query: "(prefers-reduced-motion: reduce)" });

    useEffect(() => {
        screen.current.scrollTop = 0;
        setPlaying(!reducedMotion);
    }, [pathname, reducedMotion]);

    // Scroll the actual screen so touch and buttons can also browse the full credits.
    useEffect(() => {
        if (!isCredits || !playing) return;
        let frame;
        let previous;
        let position = screen.current.scrollTop;
        let endTime = 0;
        const tick = (time) => {
            const element = screen.current;
            const elapsed = previous === undefined ? 0 : Math.min(time - previous, 100);
            previous = time;
            const end = element.scrollHeight - element.clientHeight;
            if (position >= end) {
                endTime += elapsed;
                if (endTime > 1800) { position = 0; endTime = 0; }
            } else {
                position += elapsed * 0.018;
            }
            element.scrollTop = position;
            frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [isCredits, playing]);

    const scroll = (direction) => {
        setPlaying(false);
        screen.current.scrollBy({ top: direction * screen.current.clientHeight * 0.65, behavior: reducedMotion ? "instant" : "smooth" });
    };
    const top = () => { setPlaying(false); screen.current.scrollTo({ top: 0, behavior: reducedMotion ? "instant" : "smooth" }); };
    const activate = () => isCredits ? setPlaying((value) => !value) : actionLink.current?.click();
    const actionText = isCredits ? (playing ? "PAUSE" : "PLAY") : page.action;

    return (
        <main className="bmo-menu bmo-detail" onKeyDown={(event) => {
            if (event.key === "ArrowUp" || event.key === "ArrowDown") {
                event.preventDefault(); scroll(event.key === "ArrowUp" ? -1 : 1);
            }
        }}>
            <div className="bmo-console">
                <header className="bmo-heading"><Link to="/main-menu">‹ MENU</Link><span>JOSEPH BIRD / BMO</span></header>
                <section className="bmo-screen bmo-page-screen" ref={screen} tabIndex={0} aria-label={page.title} onTouchStart={() => setPlaying(false)} onWheel={() => setPlaying(false)}>
                    <h1>{page.title}</h1>
                    {pathname === "/" && <><div className="bmo-face" aria-hidden="true">•‿•</div><h2>I’m Joseph Bird.</h2><p>Software developer and cybersecurity student at RIT. Welcome to my portfolio!</p><p>Tap PLAY to explore.</p></>}
                    {pathname === "/about-me" && <><img className="bmo-avatar" src={avatar} alt="Joseph Bird" /><p>{aboutText}</p></>}
                    {pathname === "/work-experience" && workExperiences.map((job) => <article className="bmo-card" key={job.id}><span className="bmo-date">{job.year}</span><h2>{job.company}</h2><h3>{job.position}</h3><p>{job.description}</p></article>)}
                    {pathname === "/technologies-view" && technologies.map(([title, items]) => <article className="bmo-card" key={title}><h2>{title}</h2><ul className="bmo-tags">{items.map((item) => <li key={item}>{item}</li>)}</ul></article>)}
                    {pathname === "/linkedin-view" && <><img className="bmo-avatar" src={avatar} alt="Joseph Bird" /><h2>Let’s connect.</h2><p>Visit my LinkedIn profile to learn more about my experience, projects, and professional journey.</p></>}
                    {pathname === "/github-view" && <><div className="bmo-face" aria-hidden="true">{'{ }'}</div><h2>JB957 on GitHub</h2><p>Explore my repositories, projects, and code.</p></>}
                    {pathname === "/source-view" && <><div className="bmo-face" aria-hidden="true">{'</>'}</div><h2>Behind the portfolio</h2><p>Browse the source code for this website on GitHub.</p><p>Built with React and styled with Tailwind CSS.</p></>}
                    {project && <article className="bmo-card"><span className="bmo-date">RITSEC · {project.role}</span><h2>{project.category}</h2><p>{project.description}</p></article>}
                    {isCredits && <div className="bmo-credits-text">{crawlText}</div>}
                    {page.href && (page.external ? <a className="bmo-page-link" ref={actionLink} href={page.href} target="_blank" rel="noopener noreferrer">{project ? "View repository" : page.action === "CV" ? "View resume" : page.action === "CODE" ? "Explore GitHub" : `Open ${page.title}`} ↗</a> : <Link className="bmo-page-link" ref={actionLink} to={page.href}>Let’s play →</Link>)}
                </section>
                <div className="bmo-slot-row" aria-hidden="true"><div className="bmo-slot" /><div className="bmo-light" /></div>
                <BmoControls onPrevious={() => scroll(-1)} onNext={() => scroll(1)} onBack={() => navigate("/main-menu")} onTop={top} onAction={activate} actionText={actionText} actionLabel={isCredits ? `${playing ? "Pause" : "Play"} credits` : page.action === "CV" ? "Open resume" : `Open ${page.title}`} />
                <div className="bmo-bottom"><div className="bmo-speakers" aria-hidden="true"><i /><i /></div><span>BMO</span></div>
                <p className="bmo-hint">D-pad: scroll · △: menu · Green: top · Red: {actionText.toLowerCase()}</p>
            </div>
        </main>
    );
}
