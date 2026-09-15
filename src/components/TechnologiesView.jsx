import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { GiSpellBook, GiAnvil, GiCog, GiCloudRing } from "react-icons/gi";
import { technologies } from "../data/technologies";
import { projects } from "../data/projects";
import ViewFooter from "./ViewFooter";
import "./SkillsJournal.css";

const skillIcons = [GiSpellBook, GiAnvil, GiCog, GiCloudRing];
const questPaths = [
    ["/hermes", "/desktop-detective-goose"],
    ["/ops-bot-iii", "/hermes"],
    ["/ops-bot-iii", "/work-experience"],
    ["/work-experience"],
];
const toolCount = new Set(technologies.flatMap((category) => category.items)).size;

export default function TechnologiesView() {
    const [selected, setSelected] = useState(0);
    const tabs = useRef([]);
    const skill = technologies[selected];

    const navigateSkills = (event) => {
        const offsets = { ArrowDown: 1, ArrowUp: -1 };
        if (!(event.key in offsets) && event.key !== "Home" && event.key !== "End") return;
        event.preventDefault();
        const next = event.key === "Home" ? 0 : event.key === "End" ? technologies.length - 1 : (selected + offsets[event.key] + technologies.length) % technologies.length;
        setSelected(next);
        tabs.current[next]?.focus();
    };

    return (
        <div className="skills-page">
            <main className="skills-content">
                <header className="skills-heading"><p>Joseph’s field notes</p><h1>Skills journal</h1><span>A growing collection of tools, projects, and things I’ve learned.</span></header>
                <div className="skills-journal">
                    <div className="skills-journal-top"><strong>Choose a skill</strong><span>{technologies.length} disciplines · {toolCount} tools</span></div>
                    <div className="skills-journal-body">
                        <div className="skills-tabs" role="tablist" aria-label="Skill categories" aria-orientation="vertical" onKeyDown={navigateSkills}>
                            {technologies.map((category, index) => {
                                const Icon = skillIcons[index];
                                return <button key={category.title} ref={(node) => { tabs.current[index] = node; }} id={`skill-tab-${index}`} role="tab" type="button" className="skills-tab" aria-selected={selected === index} aria-controls="skill-panel" tabIndex={selected === index ? 0 : -1} onClick={() => setSelected(index)}>
                                    <span className="skills-tab-icon"><Icon aria-hidden="true" /></span>
                                    <span><span className="skills-tab-title">{category.title}</span><span className="skills-tab-count">{category.items.length} tools in inventory</span></span>
                                </button>;
                            })}
                        </div>
                        <section className="skills-panel" id="skill-panel" role="tabpanel" aria-labelledby={`skill-tab-${selected}`} tabIndex={0}>
                            <h2>{skill.title}</h2>
                            <p className="skills-description">{skill.description}</p>
                            <h3>In my inventory</h3>
                            <ul className="skill-inventory">{skill.items.map((item) => <li key={item}>{item}</li>)}</ul>
                            <h3>From the quest log</h3>
                            <ul className="skills-quests">{questPaths[selected].map((path) => <li key={path}><Link to={path}>{projects.find((project) => project.path === path)?.title || "Infrastructure engineering at FM"} →</Link></li>)}</ul>
                        </section>
                    </div>
                    <div className="skills-journal-bottom"><span>Always learning. Always building.</span><span>Press Start for my resume.</span></div>
                </div>
            </main>
            <ViewFooter />
        </div>
    );
}
