import { FaFileAlt } from "react-icons/fa";

export default function ResumeChannel() {
    return (
        <div className="relative transparent-border hover:border-[#00c4ff] rounded-xl transition-border">
            <div className="channel-height flex flex-col items-center justify-center gap-2 rounded-lg bg-gradient-to-br from-sky-100 to-blue-200 px-3 text-center text-sky-950">
                <FaFileAlt className="text-[3vw]" aria-hidden="true" />
                <span className="font-rodin text-[2vw] font-black">Resume</span>
                <span className="font-sans text-xs lg:text-sm">Open PDF ↗</span>
            </div>
        </div>
    );
}
