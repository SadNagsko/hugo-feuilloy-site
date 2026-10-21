import { MotionConfig } from "motion/react";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { legalNotice, privacyPolicy } from "./data/legal";
import { site, type RoutePath } from "./data/site";
import { useLenis } from "./hooks/useLenis";
import { Home } from "./pages/Home";
import { LegalPage } from "./pages/LegalPage";

function Page({ path }: { path: RoutePath }) {
  if (path === site.links.legal) return <LegalPage document={legalNotice} />;
  if (path === site.links.privacy) return <LegalPage document={privacyPolicy} />;
  return <Home />;
}

export default function App({ path }: { path: RoutePath }) {
  useLenis();

  return (
    <MotionConfig reducedMotion="user">
      <div id="top">
        <Navbar home={path === "/"} />
        <main>
          <Page path={path} />
        </main>
        <Footer />
      </div>
    </MotionConfig>
  );
}
