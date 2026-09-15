import { Link } from "react-router-dom";
import { aboutText, education, engineeringText, focusAreas, headline } from "../data/aboutText";
import { projects } from "../data/projects";
import { resumeUrl } from "../data/resume";
import ViewFooter from "./ViewFooter";
import avatar from "../assets/Jpegs/Me.png";

export default function AboutMe() {
    return (
        <div className="min-h-screen bg-gradient-to-r from-orange-100 to-orange-200 text-gray-800">
            <main className="mx-auto max-w-5xl px-8 pt-10 pb-[max(12rem,18vw)] font-sans">
                <header className="flex items-center gap-8">
                    <img src={avatar} alt="Joseph Bird" className="h-32 w-32 shrink-0 rounded-full border-4 border-orange-500 object-cover shadow-lg" />
                    <div>
                        <p className="mb-2 text-sm font-bold uppercase tracking-widest text-orange-800">About me</p>
                        <h1 className="font-rodin text-4xl font-bold">Joseph Bird</h1>
                        <p className="mt-3 text-xl text-orange-900">{headline}</p>
                    </div>
                </header>
                <p className="mt-8 text-xl leading-relaxed">{aboutText}</p>
                <ul className="mt-5 flex flex-wrap gap-2" aria-label="Focus areas">
                    {focusAreas.map((focus) => <li key={focus} className="rounded-full border border-orange-300 bg-white/70 px-4 py-2 text-sm font-semibold text-orange-900">{focus}</li>)}
                </ul>
                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                    <section className="rounded-2xl border border-orange-300 bg-white/75 p-6">
                        <h2 className="mb-3 text-xl font-bold text-orange-900">What I build</h2>
                        <p className="leading-relaxed">{engineeringText}</p>
                        <ul className="mt-4 space-y-2">
                            {projects.map((project) => <li key={project.path}><Link to={project.path} className="inline-block py-1 font-bold text-orange-900 underline underline-offset-4 hover:text-orange-700">{project.title} →</Link></li>)}
                        </ul>
                    </section>
                    <section className="rounded-2xl border border-orange-300 bg-white/75 p-6">
                        <h2 className="mb-3 text-xl font-bold text-orange-900">Education & certifications</h2>
                        <p className="font-semibold">{education.school}</p>
                        <p className="mt-2">{education.degree}</p>
                        <p className="mt-2 text-sm text-orange-800">{education.graduation}</p>
                        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed">
                            {education.certifications.map((certification) => <li key={certification}>{certification}</li>)}
                        </ul>
                    </section>
                </div>
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="mt-7 inline-flex rounded-full bg-orange-900 px-6 py-3 font-bold text-white hover:bg-orange-800 focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-orange-600">View resume (PDF) ↗</a>
                <p className="mt-3 text-sm text-orange-900">You can also press Start to open my resume.</p>
            </main>
            <ViewFooter />
        </div>
    );
}
