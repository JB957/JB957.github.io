import PropTypes from "prop-types";
import { TbEngine } from "react-icons/tb";
import { GiHotMeal } from "react-icons/gi";
import walkingSheet from "../assets/Jpegs/Walking_sprite_sheet.png";
import ritsecLogo from "../assets/Jpegs/RITSEC.png";
import weatherLogo from "../assets/svgs/weather.svg";
import "./ProjectIcons.css";

export default function ProjectIcon({ icon, className }) {
    if (icon === "good-food") return <GiHotMeal className={className} aria-hidden="true" />;
    if (icon === "goose") {
        return <span role="img" aria-label="Walking Detective Goose" className={`goose-sprite ${className || ""}`} style={{ backgroundImage: `url(${walkingSheet})` }} />;
    }
    if (icon === "ritsec") return <img src={ritsecLogo} alt="RITSEC logo" className={`ritsec-project-logo ${className || ""}`} />;
    if (icon === "weather") return <img src={weatherLogo} alt="Weather app logo: sun and cloud" className={`weather-project-logo ${className || ""}`} />;
    return <TbEngine className={className} aria-hidden="true" />;
}

ProjectIcon.propTypes = { icon: PropTypes.string.isRequired, className: PropTypes.string };
