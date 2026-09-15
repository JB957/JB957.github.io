import PropTypes from "prop-types";
import ProjectIcon from "./ProjectIcon";
import "./ProjectThemes.css";

export default function ProjectChannel({ project }) {
    return (
        <div className="relative transparent-border hover:border-[#00c4ff] rounded-xl transition-border">
            <div className={`project-channel project-channel-${project.icon} channel-height`}>
                <ProjectIcon icon={project.icon} className="text-[3vw]" />
                <span className="project-channel-title">{project.shortName}</span>
                <span className="project-channel-caption">{project.icon === "goose" ? "In progress · GitHub coming later" : project.icon === "engine" ? "RITSEC competition scoring engine" : "RITSEC’s community Discord bot"}</span>
            </div>
        </div>
    );
}

ProjectChannel.propTypes = {
    project: PropTypes.shape({
        shortName: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
    }).isRequired,
};
