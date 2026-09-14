import { Link } from "react-router-dom";
import { useMediaQuery } from "react-responsive";
import PropTypes from "prop-types";
import startButton from "../assets/svgs/start-button.svg";
import wiiMenuButton from "../assets/svgs/wii-menu-button.svg";

const ViewFooter = ({ onStart }) => {
    const handleClick = () => {
        if (onStart) {
            onStart();
            return;
        }

        window.open("/cv.pdf", "_blank");
    };

    // Is screen 600px
    const isMdOrLarger = useMediaQuery({ minHeight: 600 });

    return (
        <footer
            className={`fixed bottom-0 left-0 w-full flex justify-center items-center ec-striped-bg bg-gray-100 border-t-2 border-gray-700 ${
                isMdOrLarger ? "md:py-[3.3vw]" : "md:py-[4vh]"
            } py-8 md:gap-36 gap-2`}
        >
            <Link to={"/main-menu"}>
                <div className="rounded-full border-2 border-[#00C4FF] transform-gpu transition-transform duration-200 ease-out hover:-translate-y-1 hover:scale-[1.04] focus-visible:-translate-y-1 focus-visible:scale-[1.04]">
                    <img
                        src={wiiMenuButton}
                        alt="wiiMenuButton"
                        className={`object-contain ${isMdOrLarger ? "md:w-96" : "md:w-[50vh]"} w-48`}
                    />
                </div>
            </Link>
            <div
                className="rounded-full border-2 border-[#00C4FF] cursor-pointer transform-gpu transition-transform duration-200 ease-out hover:-translate-y-1 hover:scale-[1.04] focus-visible:-translate-y-1 focus-visible:scale-[1.04]"
                onClick={handleClick}
                onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        handleClick();
                    }
                }}
                role="button"
                tabIndex={0}
                aria-label="Press Start"
            >
                <img
                    src={startButton}
                    alt="startButton"
                    className={`object-contain ${isMdOrLarger ? "md:w-96" : "md:w-[50vh]"} w-48`}
                />
            </div>
        </footer>
    );
};

ViewFooter.propTypes = {
    onStart: PropTypes.func,
};

export default ViewFooter;
