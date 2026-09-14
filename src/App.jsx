// App.jsx
import { Route, Routes } from "react-router-dom"; // Importa Routes
import "./App.css";
import MainMenu from "./components/MainMenu";
import WarningMenu from "./components/WarningMenu";
import AboutMe from "./components/AboutMe";
import TechnologiesView from "./components/TechnologiesView";
import WorkExperienceView from "./components/WorkExperienceView";
import LinkedinView from "./components/LinkedinView";
import CreditsView from "./components/Credits-View";

function App() {
    return (
        <Routes>
            <Route path="/main-menu" element={<MainMenu />} />
            <Route path="/" element={<WarningMenu />} />
            <Route path="/about-me" element={<AboutMe />} />
            <Route path="/technologies-view" element={<TechnologiesView />} />
            <Route path="/work-experience" element={<WorkExperienceView />} />
            <Route path="/linkedin-view" element={<LinkedinView />} />
            <Route path="/credits-view" element={<CreditsView />} />
        </Routes>
    );
}

export default App;
