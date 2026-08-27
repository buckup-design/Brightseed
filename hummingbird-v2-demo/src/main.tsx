import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import "./index.css";
import App from "./App";
import WelcomeScreen from "./components/WelcomeScreen";
import ProjectScreen from "./components/ProjectScreen";
import StrategyScreen from "./components/StrategyScreen";
import { DemoScriptProvider } from "./context/DemoScriptContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* The scripted welcome -> project -> strategy demo shares one
            DemoScriptProvider so its step index survives client-side
            navigation between the three screens. The original filters demo
            (App, below) intentionally mounts outside this provider — it's
            not part of the scripted flow and needs zero wiring to it. */}
        <Route
          element={
            <DemoScriptProvider>
              <Outlet />
            </DemoScriptProvider>
          }
        >
          <Route path="/welcome" element={<WelcomeScreen />} />
          <Route path="/project" element={<ProjectScreen />} />
          <Route path="/strategy" element={<StrategyScreen />} />
        </Route>
        {/* Kept, not discarded — just not part of the scripted flow for now. */}
        <Route path="/filters" element={<App />} />
        <Route path="/" element={<Navigate to="/welcome" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
