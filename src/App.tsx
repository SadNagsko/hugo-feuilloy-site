import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Navbar } from "./components/Navbar";
import { Offers } from "./components/Offers";
import { Projects } from "./components/Projects";
import { Statement } from "./components/Statement";
import { useLenis } from "./hooks/useLenis";

export default function App() {
  useLenis();

  return (
    <div id="top">
      <Navbar />
      <main>
        <Hero />
        <Statement />
        <Projects />
        <Offers />
        <About />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
