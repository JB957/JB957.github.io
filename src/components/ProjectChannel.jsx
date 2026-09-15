import PropTypes from "prop-types";
import ProjectIcon from "./ProjectIcon";

export default function ProjectChannel({ project }) {
    return (
        <div className="relative transparent-border hover:border-[#00c4ff] rounded-xl transition-border">
            <div className={`bg-gradient-to-br ${project.color} rounded-lg w-full channel-height flex flex-col items-center justify-center gap-2 px-3 text-center text-white`}>
                <ProjectIcon icon={project.icon} className="text-[3vw]" />
                <span className="font-rodin font-black text-[2vw]">{project.shortName}</span>
                <span className="font-sans text-xs lg:text-sm">{project.role} · {project.category}</span>
            </div>
        </div>
    );
}

ProjectChannel.propTypes = {
    project: PropTypes.shape({
        shortName: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
    }).isRequired,
};
