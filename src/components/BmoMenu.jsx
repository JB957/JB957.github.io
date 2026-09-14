import BmoControls from "./BmoControls";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./BmoMenu.css";

const entries = [
    { label: "About me", to: "/about-me" },
    { label: "Experience", to: "/work-experience" },
    { label: "Technologies", to: "/technologies-view" },
    { label: "LinkedIn", to: "/linkedin-view" },
    { label: "GitHub", to: "/github-view" },
    { label: "Source code", to: "/source-view" },
    { label: "Credits", to: "/credits-view" },
];

export default function BmoMenu() {
    const [selected, setSelected] = useState(0);
    const links = useRef([]);

    const move = (step) => {
        const next = (selected + step + entries.length) % entries.length;
        setSelected(next);
        links.current[next]?.scrollIntoView({ block: "nearest" });
    };
    const openSelected = () => links.current[selected]?.click();

    const handleKeyDown = (event) => {
        if (["ArrowUp", "ArrowLeft", "ArrowDown", "ArrowRight"].includes(event.key)) {
            event.preventDefault();
            move(event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 1);
        } else if (event.key === "Enter" && event.target === event.currentTarget) {
            event.preventDefault();
            openSelected();
        }
    };

    return (
        <main className="bmo-menu" onKeyDown={handleKeyDown} tabIndex={0} aria-label="BMO portfolio menu">
            <div className="bmo-console">
                <header className="bmo-heading"><span>JOSEPH BIRD</span><span>PORTFOLIO / BMO</span></header>
                <nav className="bmo-screen" aria-label="Portfolio pages">
                    {entries.map((entry, index) => (
                        <Link
                            key={entry.to}
                            ref={(node) => { links.current[index] = node; }}
                            to={entry.to}
                            target={entry.external ? "_blank" : undefined}
                            rel={entry.external ? "noopener noreferrer" : undefined}
                            className={`bmo-entry ${selected === index ? "is-selected" : ""}`}
                            onFocus={() => setSelected(index)}
                            onClick={() => setSelected(index)}
                        >
                            <span aria-hidden="true">›</span> {entry.label}
                            {entry.external && <span className="bmo-external" aria-label="opens in a new tab">↗</span>}
                        </Link>
                    ))}
                </nav>
                <div className="bmo-slot-row" aria-hidden="true"><div className="bmo-slot" /><div className="bmo-light" /></div>
                <BmoControls
                    onPrevious={() => move(-1)}
                    onNext={() => move(1)}
                    onAction={openSelected}
                    actionLabel={`Open ${entries[selected].label}`}
                />
                <div className="bmo-bottom"><div className="bmo-speakers" aria-hidden="true"><i /><i /></div><span>BMO</span></div>
                <p className="bmo-hint">Scroll & tap, or use the D-pad + GO</p>
                <span className="sr-only" role="status">Selected: {entries[selected].label}</span>
            </div>
        </main>
    );
}
