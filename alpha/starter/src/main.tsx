import { createRoot } from "react-dom/client";
import "@firdawsi/tokens/css";
import "@firdawsi/web/styles.css";
import "./styles.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(<App />);
