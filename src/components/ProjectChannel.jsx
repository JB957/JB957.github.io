import PropTypes from "prop-types";
import { FaRobot, FaFlagCheckered } from "react-icons/fa";

export default function ProjectChannel({ project }) {
    const Icon = project.shortName === "OBIII" ? FaRobot : FaFlagCheckered;
    return (
        <div className="relative transparent-border hover:border-[#00c4ff] rounded-xl transition-border">
            <div className={`bg-gradient-to-br ${project.color} rounded-lg w-full channel-height flex flex-col items-center justify-center gap-2 px-3 text-center text-white`}>
                <Icon className="text-[3vw]" aria-hidden="true" />
                <span className="font-rodin font-black text-[2vw]">{project.shortName}</span>
                <span className="font-sans text-xs lg:text-sm">{project.role} · {project.category}</span>
            </div>
        </div>
    );
}

ProjectChannel.propTypes = {
    project: PropTypes.shape({
        shortName: PropTypes.string.isRequired,
        color: PropTypes.string.isRequired,
        role: PropTypes.string.isRequired,
        category: PropTypes.string.isRequired,
    }).isRequired,
};
