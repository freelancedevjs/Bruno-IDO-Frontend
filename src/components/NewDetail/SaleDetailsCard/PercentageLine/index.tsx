import React from "react";

interface Iprops {
  percentage: number;
}

const PercentageLine = (props: Iprops) => {
  return (
    <div>
      <div className=" flex items-center justify-between mb-3">
        <div className=" text-base font-light text-[#FFFFFF]">
          Progress: {props.percentage.toFixed(2)}%
        </div>
        {/* <div className=" text-lg text-primary font-semibold">
          {props.raised} / {props.total}
        </div> */}
      </div>
      <div className="w-full h-11 bg-dull-green rounded-lg">
        <div
          style={{ width: `${props.percentage}%` }}
          className={`h-full bg-primary rounded-lg `}></div>
      </div>
    </div>
  );
};

export default PercentageLine;
