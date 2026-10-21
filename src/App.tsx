import { MotionConfig } from "motion/react";
import { Footer } from "./components/Footer";
import { MobileCtaBar } from "./components/MobileCtaBar";
import { Navbar } from "./components/Navbar";
import { legalNotice, privacyPolicy } from "./data/legal";
import { findContentPage } from "./data/pages";
import { site, type RoutePath } from "./data/site";
import { useLenis } from "./hooks/useLenis";
import { Home } from "./pages/Home";
import { LegalPage } from "./pages/LegalPage";
import { ArticlePage } from "./pages/content/ArticlePage";
import { CaseStudyPage } from "./pages/content/CaseStudyPage";
import { CityPage } from "./pages/content/CityPage";
import { ServicePage } from "./pages/content/ServicePage";

function Page({ path }: { path: RoutePath }) {
  if (path === site.links.legal) return <LegalPage document={legalNotice} />;
  if (path === site.links.privacy) return <LegalPage document={privacyPolicy} />;
  const page = findContentPage(path);
  switch (page?.kind) {
    case "service":
      return <ServicePage page={page} />;
    case "city":
      return <CityPage page={page} />;
    case "case":
      return <CaseStudyPage page={page} />;
    case "article":
      return <ArticlePage page={page} />;
  }
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
        <Footer ctaBar={path === "/"} />
        {path === "/" && <MobileCtaBar />}
      </div>
    </MotionConfig>
  );
}
