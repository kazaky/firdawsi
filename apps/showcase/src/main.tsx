import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/el-messiri/arabic-400.css";
import "@fontsource/el-messiri/arabic-600.css";
import "@fontsource/el-messiri/arabic-700.css";
import "@fontsource/el-messiri/latin-400.css";
import "@fontsource/el-messiri/latin-600.css";
import "@fontsource/el-messiri/latin-700.css";
import "@fontsource/noto-kufi-arabic/arabic-500.css";
import "@fontsource/noto-kufi-arabic/arabic-600.css";
import "@fontsource/noto-sans/latin-400.css";
import "@fontsource/noto-sans/latin-600.css";
import "@fontsource/noto-sans-arabic/arabic-400.css";
import "@fontsource/noto-sans-arabic/arabic-600.css";
import "@firdawsi/web/styles.css";
import "./styles.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
