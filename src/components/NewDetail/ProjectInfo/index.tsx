import React from "react";
import { IPoolDetailsData } from "..";
import moment from "moment";
import MorePads from "../MorePads";
import dynamic from "next/dynamic";
const EditerMarkdown = dynamic(
  () =>
    import("@uiw/react-md-editor").then((mod) => {
      return mod.default.Markdown;
    }),
  { ssr: false }
);

interface Iprops {
  data: IPoolDetailsData;
}

const ProjectInfo = (props: Iprops) => {
  const { data } = props;

  const tokenDetail = React.useMemo(() => {
    return [
      { title: "Token Name", value: data.token.name },
      { title: "Symbol", value: data.token.symbol },
      { title: "Total Supply", value: data.token.supply },
      { title: "Network", value: data.network },
    ];
  }, [data]);

  const launchData = React.useMemo(() => {
    return [
      {
        title: "Min Investment",
        value: `${data.min_buy} USDT`,
      },
      {
        title: "Max Investment",
        value: `${data.max_buy} USDT`,
      },
      { title: "Type Round", value: data.round_type },
      {
        title: "Claim Start Date",
        value: moment
          .utc(data.claim_starts_at)
          .format(" MMMM Do YYYY, hh:mm:ss a"),
      },
    ];
  }, [data]);

  return (
    <>
      <div className="projectDetailModal px-6 lg:px-14 py-10 lg:py-16">
        <div className=" text-2xl text-primary font-semibold mb-5">
          Token Data
        </div>
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {tokenDetail.map((detail, index) => {
            return (
              <div key={index} className="px-10 py-8 tokenDetailCard">
                <div className="text-lg font-semibold mb-1">{detail.title}</div>
                <div className="text-sm text-[#6B6B6B] capitalize">
                  {detail.value}
                </div>
              </div>
            );
          })}
        </div>
        <div className=" text-2xl text-primary font-semibold mt-12 mb-5">
          Launch Data
        </div>
        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {launchData.map((detail, index) => {
            return (
              <div key={index} className="px-10 py-8 tokenDetailCard">
                <div className="text-lg font-semibold mb-1">{detail.title}</div>
                <div className="text-sm text-[#6B6B6B]">{detail.value}</div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="py-20">
        <div className=" text-5xl font-semibold text-primary-green mb-16">
          About the Gem
        </div>
        <EditerMarkdown
          source={data.description}
          style={{ whiteSpace: "pre-wrap" }}
        />
      </div>
      <MorePads pool_address={data.pool_address} />
    </>
  );
};

export default ProjectInfo;
