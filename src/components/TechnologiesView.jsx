import { technologies } from "../data/technologies";
import ViewFooter from "./ViewFooter";

export default function TechnologiesView() {
    return (
        <div className="min-h-screen bg-blue-950 text-white">
            <main className="mx-auto max-w-6xl px-8 pt-10 pb-[max(12rem,18vw)] font-mono">
                <p className="mb-3 text-sm uppercase tracking-widest text-sky-300">My toolkit</p>
                <h1 className="text-4xl font-bold">Technologies & skills</h1>
                <p className="mt-4 max-w-3xl leading-relaxed text-blue-100">The tools I use to build software, automate infrastructure, and develop platforms for security competitions.</p>
                <div className="mt-8 grid gap-5 md:grid-cols-2">
                    {technologies.map(({ title, description, items }, index) => (
                        <section key={title} className="rounded-xl border border-blue-700 bg-blue-900/60 p-6">
                            <span className="text-sm text-sky-300" aria-hidden="true">0{index + 1} /</span>
                            <h2 className="mt-2 text-xl font-bold text-sky-200">{title}</h2>
                            <p className="mt-3 text-sm leading-relaxed text-blue-100">{description}</p>
                            <ul className="mt-5 flex flex-wrap gap-2">
                                {items.map((item) => <li key={item} className="rounded-md border border-blue-600 bg-blue-950/60 px-3 py-2 text-sm">{item}</li>)}
                            </ul>
                        </section>
                    ))}
                </div>
                <p className="mt-6 text-sm text-blue-100">Press Start to view the full resume.</p>
            </main>
            <ViewFooter />
        </div>
    );
}
