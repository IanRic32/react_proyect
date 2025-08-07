import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import History from "./components/History/History.jsx";
// import GlobalProvider from "./context/contextoGlobal.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <div className="grid grid-cols-[auto_1fr] h-screen">
      <History />
      <App />
    </div>
  /</StrictMode>,
);