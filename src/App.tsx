import { BrowserRouter, Routes, Route } from "react-router-dom";
import SteamLanding from "./Pages/Landing/Landing";
import SteamStatDashboard from "./Pages/Report/SteamStatDashboard.tsx";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<SteamLanding />} />
                <Route path="/report" element={<SteamStatDashboard />} />
            </Routes>
        </BrowserRouter>
    );
}
