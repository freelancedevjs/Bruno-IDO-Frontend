import SidebarComp from "@components/Sidebar";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Footer from "@components/Footer";
import useWidth from "@hooks/useWidth";
import NewHeader from "@components/NewHeader";
import parioBgLeft from "@public/images/left-bg-elment.png";
import parioBgRight from "@public/images/right-bg-elment.png";

const LayoutContainer = ({ children }: { children: React.ReactNode }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const router = useRouter();
  const width = useWidth();

  const returnContainerClass = () => {
    if (router.pathname === "/") {
      return " ";
    } else {
      return " z-20 relative";
    }
  };
  // const returnContainerClass2 = () => {
  //   if (router.pathname === "/") {
  //     return " ";
  //   } else {
  //     return "container mx-auto";
  //   }
  // };
  const projectsRef = useRef<HTMLDivElement | null>(null);

  const scrollToProjectSection = () => {
    projectsRef.current &&
      projectsRef?.current.scrollIntoView({ behavior: "smooth" });
  };

  const additionalProps = {
    projectsRef,
    scrollToProjectSection,
  };
  return (
    <>
      <div className={`relative dark overflow-hidden bg-footer`}>
        <NewHeader
          setIsDrawerOpen={setIsDrawerOpen}
          isDrawerOpen={isDrawerOpen}
          additionalProps={additionalProps}
        />
        {isDrawerOpen && (
          <SidebarComp
            setIsDrawerOpen={setIsDrawerOpen}
            isDrawerOpen={isDrawerOpen}
          />
        )}
        <div className={`transition-all ease-linear duration-200  `}>
          <div
            className={`${returnContainerClass()} min-h-[calc(100vh-386px)]`}>
            {React.Children.map(children, (child) => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, additionalProps);
              }
              return child;
            })}
          </div>
        </div>
        <Footer className="" />
      </div>
    </>
  );
};

export default LayoutContainer;
