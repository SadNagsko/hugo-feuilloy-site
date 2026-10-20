import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App";
import { resolveRoute } from "./data/site";
import "./index.css";

const container = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App path={resolveRoute(window.location.pathname).path} />
  </StrictMode>
);

if (container.hasChildNodes()) hydrateRoot(container, app);
else createRoot(container).render(app);
