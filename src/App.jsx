import { projects } from "./data/projects";
import ProjectView from "./components/ProjectView";
import { useMediaQuery } from "react-responsive";
import BmoPage from "./components/BmoPage";
// App.jsx
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import MainMenu from "./components/MainMenu";
import AboutMe from "./components/AboutMe";
import TechnologiesView from "./components/TechnologiesView";
import WorkExperienceView from "./components/WorkExperienceView";
import LinkedinView from "./components/LinkedinView";
import CreditsView from "./components/Credits-View";

function App() {
    const isMobile = useMediaQuery({ maxWidth: 767 });
    return (
        <Routes>
            <Route path="/main-menu" element={<MainMenu />} />
            <Route path="/" element={<Navigate to="/main-menu" replace />} />
            <Route path="/about-me" element={isMobile ? <BmoPage /> : <AboutMe />} />
            <Route path="/technologies-view" element={isMobile ? <BmoPage /> : <TechnologiesView />} />
            <Route path="/work-experience" element={isMobile ? <BmoPage /> : <WorkExperienceView />} />
            <Route path="/linkedin-view" element={isMobile ? <BmoPage /> : <LinkedinView />} />
            <Route path="/credits-view" element={isMobile ? <BmoPage /> : <CreditsView />} />
            <Route path="/github-view" element={<BmoPage />} />
            <Route path="/source-view" element={<BmoPage />} />
            {projects.map((project) => (
                <Route key={project.path} path={project.path} element={isMobile ? <BmoPage /> : <ProjectView project={project} />} />
            ))}
        </Routes>
    );
}

export default App;
