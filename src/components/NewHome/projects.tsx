import React, { useMemo } from "react";
import PadCard2 from "@molecules/PadCard2";
import Heading from "@atoms/Heading";
import Link from "next/link";
import { useQuery } from "jsonapi-react";
import Loader from "@components/Loader";

const Tabs: string[] = ["All", "Live Now", "Upcoming", "Ended"];

interface IProjects {
  projectsRef: React.RefObject<HTMLDivElement | null>;
}

const Projects = React.forwardRef<HTMLDivElement, IProjects>(
  ({ projectsRef }, ref) => {
    const [selectedTab, setSelectedTabs] = React.useState<string>("All");

    const filter = useMemo(() => {
      let filterObj: {
        live?: boolean;
        upcoming?: boolean;
        ended?: boolean;
      } = {};
      if (selectedTab === "Live Now") {
        filterObj["live"] = true;
      }
      if (selectedTab === "Upcoming") {
        filterObj["upcoming"] = true;
      }
      if (selectedTab === "Ended") {
        filterObj["ended"] = true;
      }
      return filterObj;
    }, [selectedTab]);

    const {
      data: launchpadList,
      isFetching,
      isLoading,
    } = useQuery([
      "presales",
      {
        filter: filter,
        sort: ["-starts_at"],
        page: {
          number: 1,
          size: 6,
        },
      },
    ]);

    return (
      <div ref={ref} className="blue-gradient-bg px-6 sm:px-8 md:px-20">
        <div
          ref={projectsRef as React.RefObject<HTMLDivElement>}
          className=" container mx-auto py-20 md:pt-[150px] pb-0 text-center">
          <div className=" text-secondary text-2xl md:text-3xl font-normal mb-4">
            Bipzy Latest Launchpad
          </div>
          <Heading
            text={"Projects"}
            className="text-center"
            textSize="lg:text-[5rem]"
          />
          <div className="flex sm:justify-center mt-20 mb-20 overflow-x-auto">
            {Tabs.map((tab, index) => {
              return (
                <div
                  onClick={() => setSelectedTabs(tab)}
                  className={`${
                    index == 0
                      ? "rounded-tl-xl"
                      : index == Tabs.length - 1
                      ? "rounded-tr-xl"
                      : ""
                  } py-5 px-4 whitespace-nowrap w-[200px] cursor-pointer border border-[#6B6B6B] ${
                    selectedTab == tab
                      ? "bg-[#6400FF] text-primary border-[#6400FF] text-lg md:text-2xl"
                      : "text-[#6B6B6B] text-lg md:text-xl"
                  } `}
                  key={index}>
                  {tab}
                </div>
              );
            })}
          </div>

          {isLoading || isFetching ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <Loader />
            </div>
          ) : (
            <>
              {launchpadList && launchpadList?.length > 0 ? (
                <div className=" grid grid-1 md:grid-cols-2 lg:grid-cols-3 lg:min-h-[702px] gap-x-14 gap-y-16">
                  {launchpadList?.map((data: any, index: number) => {
                    return <PadCard2 data={data} id={data.id} key={index} />;
                  })}
                </div>
              ) : (
                <div className="text-white flex justify-center items-center text-xl text-center min-h-[300px]">
                  <p>No Projects Found</p>
                </div>
              )}
            </>
          )}
          <div className="flex justify-center py-10 md:py-20">
            <Link href={"/launchpad/list"}>
              <button className=" border-2 border-primary rounded-lg text-xl font-semibold text-primary w-full max-w-[368px] py-5 bg-dull-green ">
                View All Projects
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
);

Projects.displayName = "Projects";

export default Projects;
