import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { routes, site, type RoutePath } from "./data/site";

export { routes, site };

export function render(path: RoutePath) {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  );
}
