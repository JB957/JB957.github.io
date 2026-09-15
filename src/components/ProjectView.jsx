import PropTypes from "prop-types";
import ProjectIcon from "./ProjectIcon";
import ViewFooter from "./ViewFooter";
import { resumeUrl } from "../data/resume";

export default function ProjectView({ project }) {
    const openRepository = () => window.open(project.href, "_blank", "noopener,noreferrer");
    return (
        <div className={`min-h-screen bg-gradient-to-br ${project.color} text-white`}>
            <main className="mx-auto flex max-w-4xl flex-col items-center px-8 pt-12 pb-[max(12rem,18vw)] text-center">
                <ProjectIcon icon={project.icon} className="mb-6 text-7xl" />
                <p className="mb-4 rounded-full border border-white/40 px-5 py-2 font-sans text-lg">{project.organization} · {project.role}</p>
                <h1 className="mb-4 font-rodin text-5xl font-bold">{project.title}</h1>
                <h2 className="mb-6 font-sans text-2xl">{project.category}</h2>
                <p className="mb-5 font-sans text-sm text-white/80">{[project.period, project.status].filter(Boolean).join(" · ")}</p>
                <p className="max-w-2xl font-sans text-xl leading-relaxed">{project.description}</p>
                <section className="mt-7 max-w-2xl text-left font-sans">
                    <h2 className="text-xl font-bold">What I built</h2>
                    <ul className="mt-4 list-disc space-y-3 pl-5 text-lg leading-relaxed">{project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}</ul>
                </section>
                <ul className="mt-6 flex flex-wrap justify-center gap-2" aria-label="Project technologies">
                    {project.technologies.map((technology) => <li key={technology} className="rounded-full border border-white/40 px-4 py-2 font-sans text-sm">{technology}</li>)}
                </ul>
                <a className="mt-8 rounded-full border-2 border-white bg-white px-8 py-3 font-sans text-lg font-bold text-slate-900 transition-colors hover:bg-sky-100 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-sky-300" href={project.href || resumeUrl} target="_blank" rel="noopener noreferrer">{project.href ? "View repository" : "View resume (PDF)"} ↗</a>
                <p className="mt-5 font-sans text-sm text-white/80">Press Start to open {project.href ? "the repository" : "my resume"}.</p>
            </main>
            <ViewFooter onStart={project.href ? openRepository : undefined} startLabel="Open project repository" />
        </div>
    );
}

ProjectView.propTypes = {
    project: PropTypes.shape({
        icon: PropTypes.string.isRequired,
        organization: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        href: PropTypes.string,
        period: PropTypes.string,
        status: PropTypes.string.isRequired,
        highlights: PropTypes.arrayOf(PropTypes.string).isRequired,
        technologies: PropTypes.arrayOf(PropTypes.string).isRequired,
    }).isRequired,
};
