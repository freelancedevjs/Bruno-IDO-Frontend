import Button from "@atoms/Button";
import { FC } from "react";

interface AdminProps {}

const Admin: FC<AdminProps> = ({}) => {
  return (
    <div className="pt-40 p-6">
      <div className="p-10 flex flex-col gap-8 bg-[#f3f6f9] max-w-7xl mx-auto">
        <div className="py-6 px-8 shadow-md bg-white rounded-md">
          <p className="font-semibold text-lg sm:text-2xl ">
            Deploy Smart Contract IDO
          </p>
          <div className="flex flex-col sm:flex-row gap-y-4 gap-x-6 my-4 mb-6">
            <Button className="rounded-sm bg-voilet-btn border-0 text-white text-base sm:text-lg w-full sm:w-max truncate">
              1. Connect Wallet
            </Button>
            <Button className="rounded-sm bg-red-btn border-0 text-white text-base sm:text-lg w-full sm:w-max truncate">
              2. Deploy
            </Button>
          </div>

          <div className="flex flex-col md:flex-row gap-y-2 gap-x-6 md:items-center">
            <p className="sm:whitespace-nowrap">Contract Address Generated:</p>
            <input
              type="text"
              className="outline-none border w-full p-3 placeholder:text-gray19"
              placeholder="0x3aa510DC091980E3fDdEde457E7597BFd5d4d64C"
            />
          </div>
        </div>
        <div className="py-6 px-8 shadow-md bg-white rounded-md">
          <p className="font-semibold text-lg sm:text-2xl mb-4">
            ATH From Bipzy - ROI Calculator
          </p>

          <div className="flex flex-col md:flex-row gap-y-2 gap-x-6 md:items-center mb-6">
            <p className="sm:whitespace-nowrap">Token Address:</p>
            <input
              type="text"
              className="outline-none border w-full p-3 placeholder:text-gray19"
              placeholder="0xa7bd657c5838472ddf85ff0797a2e6fce8fd4833"
            />
          </div>
          <div className="flex md:justify-end w-full">
            <Button className="rounded-sm w-full sm:w-max bg-voilet-btn border-0 outline-0 text-white text-base sm:text-lg">
              Update
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
