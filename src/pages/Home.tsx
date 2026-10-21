import { About } from "../components/About";
import { Approach } from "../components/Approach";
import { Contact } from "../components/Contact";
import { Hero } from "../components/Hero";
import { Offers } from "../components/Offers";
import { Projects } from "../components/Projects";
import { Statement } from "../components/Statement";

export function Home() {
  return (
    <>
      <Hero />
      <Statement />
      <Approach />
      <Projects />
      <Offers />
      <About />
      <Contact />
    </>
  );
}
