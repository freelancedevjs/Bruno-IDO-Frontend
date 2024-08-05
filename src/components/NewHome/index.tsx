import React, { useRef } from "react";
import Hero from "./hero";
import UnlockSection from "./unlock";
import FaqSection from "./faq";
import ProjectSection from "./project";
import HowToParticipate from "./HowToParticipate";
import Advantages from "./advantages";
import Projects from "./projects";

interface IHome {
  additionalProps: {
    projectsRef: React.MutableRefObject<HTMLDivElement | null>;
    scrollToProjectSection: () => void;
  };
}

const NewHome: React.FC<IHome> = ({ additionalProps }) => {
  const { projectsRef, scrollToProjectSection } = additionalProps;
  const howToParticipateRef = useRef<HTMLDivElement | null>(null);

  const scrollToHowToParticipate = () => {
    howToParticipateRef.current &&
      howToParticipateRef?.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div>
      <Hero
        projectFun={scrollToProjectSection}
        howToParticipateFun={scrollToHowToParticipate}
      />
      <Advantages />
      <Projects projectsRef={projectsRef} />
      <HowToParticipate howToParticipateRef={howToParticipateRef} />
      <UnlockSection />
      <FaqSection />
      <ProjectSection />
    </div>
  );
};

export default NewHome;
