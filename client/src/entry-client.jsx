import { BrowserRouter } from "react-router-dom";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "@/lib/leafletIconFix";
import "./index.css";
import { loadInitialDataForUrl } from "@/ssr/loadInitialData";

const container = document.getElementById("root");

async function bootstrap() {
  if (!container) {
    return;
  }

  const hasSsrMarkup = container.hasChildNodes();
  let initialData = null;

  if (hasSsrMarkup) {
    try {
      initialData = await loadInitialDataForUrl(window.location.href);
    } catch {
      initialData = null;
    }
  }
  const app = (
    <BrowserRouter>
      <App initialData={initialData} />
    </BrowserRouter>
  );

  if (hasSsrMarkup) {
    hydrateRoot(container, app);
    return;
  }

  createRoot(container).render(app);
}

bootstrap();
