import { crawlText } from "../data/creditsText";
import ViewFooter from "./ViewFooter";



const crawlDuration = Math.max(24, crawlText.split(/\s+/).length / 2);

const CreditsView = () => {
	return (
		<div className="relative h-dvh w-full overflow-hidden bg-black">
			<main className="credits-stage absolute inset-0 overflow-hidden">
				<div className="credits-crawl-window absolute inset-0">
					<div className="credits-crawl-plane">
					<div
						className="credits-crawl font-rodin"
						style={{ "--crawl-duration": `${crawlDuration}s` }}
					>
						{crawlText}
					</div>
					</div>
				</div>
			</main>

			<div className="relative z-10">
				<ViewFooter />
			</div>
		</div>
	);
};

export default CreditsView;
