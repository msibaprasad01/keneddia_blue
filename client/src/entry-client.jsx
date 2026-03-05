import { BrowserRouter } from "react-router-dom";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "@/lib/leafletIconFix";
import "./index.css";

const initialData = window.__INITIAL_DATA__ || null;
const container = document.getElementById("root");
const app = (
  <BrowserRouter>
    <App initialData={initialData} />
  </BrowserRouter>
);

if (container?.hasChildNodes()) {
  hydrateRoot(container, app);
} else if (container) {
  createRoot(container).render(app);
}
