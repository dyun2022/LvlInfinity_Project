import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { AuthProvider } from "./context/AuthContext";
import { CyberpunkWarp } from "./components/background";
import LandingPage from "./pages/LandingPage/LandingPage";
import { LoginPage } from "./pages/AuthPages/LoginPage";
import { RegisterPage } from "./pages/AuthPages/RegisterPage";
import { CharacterCreationPage } from "./pages/AuthPages/CharacterCreationPage";
import { WorldPage } from "./pages/WorldPage/WorldPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { PageTransition } from "./components/layout";
import "./App.css";

function AppContent() {
	const location = useLocation();

	return (
		<div style={{ position: "relative", width: "100%", minHeight: "100vh", overflow: "hidden" }}>
			<div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0 }}>
				<CyberpunkWarp isDark />
			</div>

			<div style={{ position: "relative", zIndex: 10, minHeight: "100vh" }}>
				<AnimatePresence mode="wait">
					<Routes location={location} key={location.pathname}>
						<Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />
						<Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
						<Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
						<Route
							path="/character-creation"
							element={<PageTransition><ProtectedRoute><CharacterCreationPage /></ProtectedRoute></PageTransition>}
						/>
						<Route
							path="/world"
							element={<PageTransition><ProtectedRoute><WorldPage /></ProtectedRoute></PageTransition>}
						/>
						<Route path="*" element={<Navigate to="/" replace />} />
					</Routes>
				</AnimatePresence>
			</div>
		</div>
	);
}

function App() {
	return (
		<AuthProvider>
			<Router>
				<AppContent />
			</Router>
		</AuthProvider>
	);
}

export default App;