import { useState, useRef } from "react";
import { IoWarningSharp } from "react-icons/io5";
import { PiMouseLeftClickFill } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";

const WarningMenu = () => {
    const [fadeOutBackground, setFadeOutBackground] = useState(false);
    const contentRef = useRef();
    const isNavigating = useRef(false);
    const navigate = useNavigate();

    const handleClick = () => {
        if (isNavigating.current) return;
        isNavigating.current = true;

        gsap.to(contentRef.current, {
            opacity: 0,
            duration: 0.5,
            onComplete: () => {
                // Esperar 2 segundos antes de cambiar el fondo
                setTimeout(() => {
                    setFadeOutBackground(true);
                    navigate("/main-menu"); // Navegar después de la animación
                }, 1000);
            },
        });
    };

    return (
        <div
            className={`flex min-h-screen w-full cursor-pointer bg-black ${
                fadeOutBackground ? "fade-out" : ""
            }`}
            onClick={handleClick}
            role="button"
            tabIndex={0}
            aria-label="Continue to the Wii menu"
            onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    handleClick();
                }
            }}
        >
            <div
                className="flex flex-col items-center justify-center w-full text-center"
                ref={contentRef}
            >
                <div className="flex items-center">
                    <div className="text-6xl pl-2 md:pl-0 md:text-8xl text-yellow-400">
                        <IoWarningSharp />
                    </div>
                    <div className="font-rodin font-black text-3xl md:text-5xl text-white md:ml-4">
                        WARNING BEST PERSONAL WEBSITE
                    </div>
                </div>
                <div className="flex items-center mt-24">
                    <div className="font-rodin font-black text-xl md:text-3xl text-center text-white md:ml-4">
                        HI, MY NAME IS <i>JOSEPH BIRD</i>. I AM A SOFTWARE
                        DEVELOPER.
                    </div>
                </div>
                <div className="flex items-center mt-4">
                    <div className="font-rodin font-black text-xl md:text-3xl text-center text-white md:ml-4">
                        I PERSUING A DEGREE IN CYBER SECURITY AT RIT
                    </div>
                </div>
                <div className="flex items-center mt-24">
                    <div className="font-rodin font-black text-xl md:text-3xl text-center text-white md:ml-4">
                        THIS IS MY PORTFOLIO INSPIRED BY THE WII MAIN MENU.
                    </div>
                </div>
                <div className="flex items-center mt-4">
                    <div className="font-rodin font-black text-xl md:text-3xl text-center text-white md:ml-4">
                        FOR THE BEST EXPERIENCE, VIEW IT ON A DESKTOP.
                    </div>
                </div>

                <div className="flex items-center mt-16">
                    <div className="font-rodin font-black text-xl md:text-3xl text-center text-white md:ml-4 animate-blink">
                        <div>
                            Click anywhere{" "}
                            <span className="inline-flex items-center">
                                <PiMouseLeftClickFill />
                            </span>{" "}
                            to continue
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WarningMenu;
