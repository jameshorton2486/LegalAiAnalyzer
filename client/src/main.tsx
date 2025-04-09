import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "@/lib/utils"; // Import utils to ensure they're available globally

createRoot(document.getElementById("root")!).render(<App />);
