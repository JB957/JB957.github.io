import { useState } from "react";

const CreditsChannel = () => {
	const [showTooltip, setShowTooltip] = useState(false);

	return (
		<div
			className="relative transparent-border hover:border-[#00c4ff] rounded-xl transition-border"
			onMouseEnter={() => setShowTooltip(true)}
			onMouseLeave={() => setShowTooltip(false)}
		>
			<div className="bg-slate-700 rounded-lg w-full h-full overflow-hidden channel-height flex items-center justify-center">
				<span className="font-rodin font-black text-white text-2xl md:text-[2.5vw] tracking-wide">
					CREDITS
				</span>
			</div>

			{showTooltip && (
				<div className="font-rodin absolute z-10 left-1/2 transform -translate-x-1/2 mt-2 px-12 py-2 bg-white text-black rounded-full text-xl border-2 border-gray-300 shadow-xl whitespace-nowrap">
					<p>Credits</p>
				</div>
			)}
		</div>
	);
};

export default CreditsChannel;
