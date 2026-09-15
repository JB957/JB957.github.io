import PropTypes from "prop-types";
import { FaDatabase, FaHardHat, FaTerminal, FaRocket } from "react-icons/fa";
import ProjectIcon from "./ProjectIcon";
import ViewFooter from "./ViewFooter";
import "./ProjectThemes.css";

const contributionIcons = [FaDatabase, FaTerminal, FaRocket];

export default function ProjectView({ project }) {
    const isGoose = project.icon === "goose";
    const isHermes = project.icon === "engine";
    const openRepository = () => window.open(project.href, "_blank", "noopener,noreferrer");

    return (
        <div className={`project-stage project-${project.icon}`}>
            <main className="project-content">
                {isGoose ? (
                    <div className="construction-banner"><FaHardHat aria-hidden="true" /> Under construction <span>Work in progress</span></div>
                ) : (
                    <div className="project-brandbar">
                        <span>{isHermes ? "RITSEC / COMPETITION SYSTEMS" : "RITSEC / COMMUNITY TOOLS"}</span>
                        <a href={isHermes ? "https://ists.io/" : "https://ritsec.club/"} target="_blank" rel="noopener noreferrer">{isHermes ? "ISTS" : "ritsec.club"} ↗</a>
                    </div>
                )}

                <header className="project-hero">
                    <div className="project-introduction">
                        <p className="project-eyebrow">{isGoose ? "Personal project / Rust" : `${project.organization} · ${project.role}`}</p>
                        <h1>{isHermes ? "HERMES" : project.title}</h1>
                        <p className="project-subtitle">{isHermes ? "The scoring engine behind the competition." : isGoose ? "A little detective. A worksite full of ideas." : "Security through community. One bot at a time."}</p>
                        {isHermes && <div className="team-badges"><span className="red-team">Red team</span><span aria-hidden="true">×</span><span className="blue-team">Blue team</span></div>}
                    </div>
                    {isGoose ? (
                        <div className="goose-worksite" aria-label="Detective Goose walking through a construction site">
                            <svg className="worksite-crane" viewBox="0 0 300 230" aria-hidden="true">
                                <g fill="none" stroke="#ae772d" strokeWidth="7" strokeLinejoin="round">
                                    <path d="M200 215V25H32L200 6L272 25H200M184 215L216 175L184 135L216 95L184 55M184 25V215M216 25V215M32 25V72M265 25V150" />
                                    <path d="M256 150V163Q267 174 276 161" />
                                </g>
                            </svg>
                            <div className="worksite-goose"><ProjectIcon icon="goose" /></div>
                            <div className="worksite-cone cone-one" aria-hidden="true" />
                            <div className="worksite-cone cone-two" aria-hidden="true" />
                            <div className="worksite-ground" aria-hidden="true" />
                        </div>
                    ) : <div className="project-hero-logo"><ProjectIcon icon={project.icon} /></div>}
                </header>

                <p className="project-description">{project.description}</p>

                {isHermes && <section className="hermes-pipeline" aria-label="What Hermes connects">
                    <div><span>01 / CHECK</span><h2>Scoring checks</h2><p>Go services for the competition.</p></div>
                    <div><span>02 / CONNECT</span><h2>Competition APIs</h2><p>Scoring and inject workflows.</p></div>
                    <div><span>03 / COMPETE</span><h2>Team interfaces</h2><p>Tools for competitors and admins.</p></div>
                </section>}

                {isGoose && <section className="construction-notice" aria-labelledby="construction-status">
                    <FaHardHat aria-hidden="true" />
                    <div><h2 id="construction-status">In progress</h2><p>{project.repositoryNote}</p></div>
                </section>}

                <section className="project-contributions">
                    <h2>{isGoose ? "On the workbench" : isHermes ? "Building the engine" : "Built for the RITSEC community"}</h2>
                    {project.icon === "ritsec" ? <div className="obiii-contributions">
                        {project.highlights.map((highlight, index) => {
                            const Icon = contributionIcons[index % contributionIcons.length];
                            return <article key={highlight}><Icon aria-hidden="true" /><p>{highlight}</p></article>;
                        })}
                    </div> : <ul>{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>}
                </section>

                <div className="project-bottom">
                    <ul className="project-stack" aria-label="Project technologies">{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
                    <p className="project-period">{[project.period, project.status].filter(Boolean).join(" · ")}</p>
                </div>
                {project.href && <a className="project-repository" href={project.href} target="_blank" rel="noopener noreferrer">View repository ↗</a>}
                <p className="project-hint">{isGoose ? "More to come. The goose is still on the job." : "Press Start to open the repository."}</p>
            </main>
            <ViewFooter onStart={project.href ? openRepository : undefined} startDisabled={!project.href} startLabel={project.href ? "Open project repository" : "GitHub repository available once the project is finished"} />
        </div>
    );
}

ProjectView.propTypes = {
    project: PropTypes.shape({
        icon: PropTypes.string.isRequired,
        organization: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        href: PropTypes.string,
        period: PropTypes.string,
        status: PropTypes.string.isRequired,
        repositoryNote: PropTypes.string,
        highlights: PropTypes.arrayOf(PropTypes.string).isRequired,
        technologies: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
};
