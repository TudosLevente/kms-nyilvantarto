import { createRoot } from "react-dom/client";
import { App } from "./App.jsx";
import "./styles.css";

const container = document.getElementById("root");
const root = window.__kmsRoot || createRoot(container);
window.__kmsRoot = root;
root.render(<App />);
