import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import PropTypes from "prop-types";
import startButton from "../assets/svgs/start-button.svg";
import wiiMenuButton from "../assets/svgs/wii-menu-button.svg";
import { resumeUrl } from "../data/resume";

const ViewFooter = ({ onStart, startLabel = "Press Start" }) => {
    const StartControl = onStart ? "button" : "a";

    // Is screen 600px
    const isMdOrLarger = useMediaQuery({ minHeight: 600 });

    return (
        <footer
            className={`fixed bottom-0 left-0 w-full flex justify-center items-center ec-striped-bg bg-gray-100 border-t-2 border-gray-700 ${
                isMdOrLarger ? "md:py-[3.3vw]" : "md:py-[4vh]"
            } py-8 md:gap-36 gap-2`}
        >
            <Link to={"/main-menu"} aria-label="Return to Wii menu">
                <div className="rounded-full border-2 border-[#00C4FF] transform-gpu transition-transform duration-200 ease-out hover:-translate-y-1 hover:scale-[1.04] focus-visible:-translate-y-1 focus-visible:scale-[1.04]">
                    <img
                        src={wiiMenuButton}
                        alt="wiiMenuButton"
                        className={`object-contain ${isMdOrLarger ? "md:w-96" : "md:w-[50vh]"} w-48`}
                    />
                </div>
            </Link>
            <StartControl
                className="rounded-full border-2 border-[#00C4FF] cursor-pointer transform-gpu transition-transform duration-200 ease-out hover:-translate-y-1 hover:scale-[1.04] focus-visible:-translate-y-1 focus-visible:scale-[1.04]"
                {...(onStart
                    ? { type: "button", onClick: onStart }
                    : { href: resumeUrl, target: "_blank", rel: "noopener noreferrer" })}
                aria-label={onStart ? startLabel : "View resume (PDF, opens in a new tab)"}
            >
                <img
                    src={startButton}
                    alt=""
                    className={`object-contain ${isMdOrLarger ? "md:w-96" : "md:w-[50vh]"} w-48`}
                />
            </StartControl>
        </footer>
    );
};

ViewFooter.propTypes = {
    onStart: PropTypes.func,
    startLabel: PropTypes.string,
};

export default ViewFooter;
