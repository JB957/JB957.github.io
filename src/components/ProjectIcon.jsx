import PropTypes from "prop-types";
import { FaDesktop, FaFlagCheckered, FaRobot } from "react-icons/fa";
import gooseLogo from "../assets/Jpegs/Goose.png";

const icons = { bot: FaRobot, scoring: FaFlagCheckered, desktop: FaDesktop };

export default function ProjectIcon({ icon, className }) {
    if (icon === "goose") {
        return <img src={gooseLogo} alt="Detective Goose logo" width={123} height={141} className={`h-[1.5em] w-[1.5em] shrink-0 object-contain [image-rendering:pixelated] ${className || ""}`} />;
    }
    const Icon = icons[icon] || FaDesktop;
    return <Icon className={className} aria-hidden="true" />;
}

ProjectIcon.propTypes = { icon: PropTypes.string.isRequired, className: PropTypes.string };
