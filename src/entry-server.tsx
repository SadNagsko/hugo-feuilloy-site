import { StrictMode } from "react";
import { renderToString } from "react-dom/server";
import App from "./App";
import { routeHead } from "./data/seo";
import { routes, site, type RoutePath } from "./data/site";

export { routeHead, routes, site };

export function render(path: RoutePath) {
  return renderToString(
    <StrictMode>
      <App path={path} />
    </StrictMode>,
  );
}
