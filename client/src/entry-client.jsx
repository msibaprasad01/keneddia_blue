import { BrowserRouter } from "react-router-dom";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import "@/lib/leafletIconFix";
import "./index.css";

const container = document.getElementById("root");

async function bootstrap() {
  if (!container) {
    return;
  }

  const hasSsrMarkup = container.hasChildNodes();
  const initialData = hasSsrMarkup ? window.__SSR_INITIAL_DATA__ || {} : {};
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
