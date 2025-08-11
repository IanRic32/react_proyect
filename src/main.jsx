import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import History from "./History/History.jsx";
import { GlobalProvider } from './context/globalContext';
import "./index.css";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="grid grid-cols-[auto_1fr] h-screen">
      <GlobalProvider>
        <History />
        <App />
      </GlobalProvider>
    </div>
  </StrictMode>
);