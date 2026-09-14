import PropTypes from "prop-types";

export default function BmoControls({ onPrevious, onNext, onAction, actionLabel, actionText = "GO", onBack, onTop }) {
    return (
        <div className="bmo-controls">
            <div className="bmo-dpad" role="group" aria-label="Menu navigation">
                <span className="bmo-dpad-shape" aria-hidden="true" />
                <button className="bmo-up" aria-label={onBack ? "Scroll up" : "Previous menu item"} onClick={onPrevious}>▲</button>
                <button className="bmo-left" aria-label={onBack ? "Scroll up" : "Previous menu item"} onClick={onPrevious}>◀</button>
                <button className="bmo-right" aria-label={onBack ? "Scroll down" : "Next menu item"} onClick={onNext}>▶</button>
                <button className="bmo-down" aria-label={onBack ? "Scroll down" : "Next menu item"} onClick={onNext}>▼</button>
            </div>
            <div className="bmo-action-buttons">
                <button className="bmo-triangle" onClick={onBack || onPrevious} aria-label={onBack ? "Back to menu" : "Previous menu item"}>
                    <svg viewBox="0 0 60 60" aria-hidden="true"><path d="M30 5 L56 53 H4 Z" fill="#22d7e5" stroke="#102f2a" strokeWidth="2" /></svg>
                </button>
                <button className="bmo-green" onClick={onTop || onNext} aria-label={onTop ? "Scroll to top" : "Next menu item"} />
                <button className="bmo-select" onClick={onAction} aria-label={actionLabel}><span>{actionText}</span></button>
            </div>
        </div>
    );
}

BmoControls.propTypes = {
    onPrevious: PropTypes.func.isRequired,
    onNext: PropTypes.func.isRequired,
    onAction: PropTypes.func.isRequired,
    actionLabel: PropTypes.string.isRequired,
    actionText: PropTypes.string,
    onBack: PropTypes.func,
    onTop: PropTypes.func,
};
