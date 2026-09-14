import PropTypes from "prop-types";
import { FaRobot, FaFlagCheckered } from "react-icons/fa";
import ViewFooter from "./ViewFooter";

export default function ProjectView({ project }) {
    const Icon = project.shortName === "OBIII" ? FaRobot : FaFlagCheckered;
    const openRepository = () => window.open(project.href, "_blank", "noopener,noreferrer");
    return (
        <div className={`min-h-screen bg-gradient-to-br ${project.color} text-white`}>
            <main className="mx-auto flex max-w-4xl flex-col items-center px-8 pt-12 pb-[30vw] text-center">
                <Icon className="mb-6 text-7xl" aria-hidden="true" />
                <p className="mb-4 rounded-full border border-white/40 px-5 py-2 font-sans text-lg">RITSEC · {project.role}</p>
                <h1 className="mb-4 font-rodin text-5xl font-bold">{project.title}</h1>
                <h2 className="mb-6 font-sans text-2xl">{project.category}</h2>
                <p className="max-w-2xl font-sans text-xl leading-relaxed">{project.description}</p>
                <a className="mt-8 rounded-full border-2 border-white bg-white px-8 py-3 font-sans text-lg font-bold text-slate-900 transition-colors hover:bg-sky-100 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-sky-300" href={project.href} target="_blank" rel="noopener noreferrer">View repository ↗</a>
                <p className="mt-5 font-sans text-sm text-white/80">Press Start to open the repository.</p>
            </main>
            <ViewFooter onStart={openRepository} />
        </div>
    );
}

ProjectView.propTypes = {
    project: PropTypes.shape({
        shortName: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
        href: PropTypes.string.isRequired,
    }).isRequired,
};
