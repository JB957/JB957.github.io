import { GiSpellBook } from "react-icons/gi";
import "./SkillsJournal.css";

export default function TechnologiesChannel() {
    return (
        <div className="relative transparent-border hover:border-[#00c4ff] rounded-xl transition-border">
            <div className="skills-channel channel-height">
                <GiSpellBook aria-hidden="true" />
                <strong>Skills journal</strong>
                <span>Open my toolkit</span>
            </div>
        </div>
    );
}
