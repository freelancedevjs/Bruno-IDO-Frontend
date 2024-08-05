import React, { Fragment, useState, useId } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Image from "next/image";
import GoogleImage from "@public/icons/google.svg";
import AppleImage from "@public/icons/apple.svg";
import OutlookImage from "@public/icons/outlook.svg";
import YahooImage from "@public/icons/yahoo.svg";
import { IPoolDetailsData } from "@components/NewDetail";
import moment from "moment";
import { AddToCalendarButton } from "add-to-calendar-button-react";
import useWidth from "@hooks/useWidth";

interface Iprops {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  data: IPoolDetailsData;
}

const CalenderModal = (props: Iprops) => {
  const { isOpen, setIsOpen, data } = props;
  const width = useWidth();
  const [selectedDateType, setSelectedDateType] = useState<
    "priority" | "public"
  >(data.sale_type == "whitelist" ? "priority" : "public");

  function closeModal() {
    setIsOpen(false);
  }

  const id = useId();

  const publicTime = React.useMemo(() => {
    let time;
    if (data.sale_type == "whitelist") {
      time = data.whitelist_ends_time;
    } else {
      time = data.start_time;
    }
    return time;
  }, [data]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0">
          <div className="fixed inset-0 bg-black bg-opacity-60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95">
              <Dialog.Panel className="w-full max-w-[800px] transform overflow-hidden bg-[#0B0D1B] pt-12 pb-10 text-left align-middle shadow-xl transition-all relative">
                <div className="px-6 lg:px-24 mt-4 pb-5">
                  <div className="text-primary font-semibold text-xl sm:text-2xl md:text-3xl">
                    Add a reminder to your Calendar
                  </div>
                  <div className="mt-6">
                    {data.sale_type == "whitelist" && (
                      <div className="flex items-center gap-4 sm:gap-6 xl:gap-8">
                        <div
                          onClick={() => setSelectedDateType("priority")}
                          className="flex-shrink-0 h-7 md:h-10 w-7 md:w-10 rounded-full border border-[#6100FF] p-1 sm:p-2 cursor-pointer">
                          <div
                            className={`w-full h-full rounded-full ${
                              selectedDateType == "priority"
                                ? "bg-[#6100FF] border border-black"
                                : ""
                            }`}></div>
                        </div>
                        <label htmlFor={id}>
                          <div className="text-lg sm:text-xl md:text-2xl text-white font-semibold">
                            Priority Access - {data?.nft?.name} NFT Holders
                          </div>
                          <div className="text-base sm:text-lg md:text-xl mt-2 text-[#757575]">
                            {moment
                              .utc(data.start_time)
                              .format(" MMMM Do YYYY, h:mm:ss a")}
                          </div>
                        </label>
                      </div>
                    )}
                    <div className="flex items-center gap-4 sm:gap-6 xl:gap-8 mt-6">
                      <div
                        onClick={() => setSelectedDateType("public")}
                        className="flex-shrink-0 h-7 md:h-10 w-7 md:w-10  p-1 sm:p-2 rounded-full border border-[#6100FF] cursor-pointer">
                        <div
                          className={`w-full h-full rounded-full ${
                            selectedDateType == "public"
                              ? "bg-[#6100FF] border border-black"
                              : ""
                          }`}></div>
                      </div>
                      <label htmlFor={id}>
                        <div className="text-lg sm:text-xl md:text-2xl text-white font-semibold">
                          Public Open Access
                        </div>
                        <div className="text-base sm:text-lg md:text-xl mt-2 text-[#757575]">
                          {moment
                            .utc(publicTime)
                            .format(" MMMM Do YYYY, h:mm:ss a")}
                        </div>
                      </label>
                    </div>
                  </div>
                  <div className="mt-12">
                    <div className="text-xl sm:text-2xl text-white font-semibold">
                      Choose Calendar
                    </div>
                    <div
                      className={`flex ${
                        width < 450 ? "flex-col" : "flex-row items-center"
                      } justify-between  mt-4`}>
                      <div className="flex items-center gap-4 md:gap-6">
                        <Image width={30} src={GoogleImage} />
                        <div className=" text-white text-base sm:text-xl">
                          Google Calendar
                        </div>
                      </div>
                      <AddToCalendarButton
                        label={` ${width < 450 ? "Add" : "Add to calendar"} `}
                        options={["Google"]}
                        name={data.title}
                        location="Bipzy"
                        startDate={
                          selectedDateType == "priority"
                            ? moment.utc(data.start_time).format("YYYY-MM-DD")
                            : moment.utc(publicTime).format("YYYY-MM-DD")
                        }
                        endDate={moment.utc(data.end_time).format("YYYY-MM-DD")}
                        startTime={
                          selectedDateType == "priority"
                            ? moment.utc(data.start_time).format("kk:mm")
                            : moment.utc(publicTime).format("kk:mm")
                        }
                        endTime={moment.utc(data.end_time).format("kk:mm")}
                        timeZone="UTC"></AddToCalendarButton>
                    </div>
                    <div
                      className={`flex ${
                        width < 450 ? "flex-col" : "flex-row items-center"
                      } justify-between  mt-4`}>
                      <div className="flex items-center gap-4 md:gap-6">
                        <Image width={30} src={AppleImage} />
                        <div className=" text-white text-base sm:text-xl">
                          iCal
                        </div>
                      </div>
                      <AddToCalendarButton
                        label={` ${width < 450 ? "Add" : "Add to calendar"} `}
                        options={["Apple"]}
                        name={data.title}
                        location="Bipzy"
                        startDate={
                          selectedDateType == "priority"
                            ? moment.utc(data.start_time).format("YYYY-MM-DD")
                            : moment.utc(publicTime).format("YYYY-MM-DD")
                        }
                        endDate={moment.utc(data.end_time).format("YYYY-MM-DD")}
                        startTime={
                          selectedDateType == "priority"
                            ? moment.utc(data.start_time).format("kk:mm")
                            : moment.utc(publicTime).format("kk:mm")
                        }
                        endTime={moment.utc(data.end_time).format("kk:mm")}
                        timeZone="UTC"></AddToCalendarButton>
                    </div>
                    <div
                      className={`flex ${
                        width < 450 ? "flex-col" : "flex-row items-center"
                      } justify-between  mt-4`}>
                      <div className="flex items-center gap-4 md:gap-6">
                        <Image width={30} src={OutlookImage} />
                        <div className=" text-white text-base sm:text-xl">
                          Outlook
                        </div>
                      </div>
                      {/* <div className=" text-2xl text-primary font-semibold">
                        Add
                      </div> */}
                      <AddToCalendarButton
                        label={` ${width < 450 ? "Add" : "Add to calendar"} `}
                        options={["Outlook.com"]}
                        name={data.title}
                        location="Bipzy"
                        startDate={
                          selectedDateType == "priority"
                            ? moment.utc(data.start_time).format("YYYY-MM-DD")
                            : moment.utc(publicTime).format("YYYY-MM-DD")
                        }
                        endDate={moment.utc(data.end_time).format("YYYY-MM-DD")}
                        startTime={
                          selectedDateType == "priority"
                            ? moment.utc(data.start_time).format("kk:mm")
                            : moment.utc(publicTime).format("kk:mm")
                        }
                        endTime={moment.utc(data.end_time).format("kk:mm")}
                        timeZone="UTC"></AddToCalendarButton>
                    </div>
                    <div
                      className={`flex ${
                        width < 450 ? "flex-col" : "flex-row items-center"
                      } justify-between  mt-4`}>
                      <div className="flex items-center gap-4 md:gap-6">
                        <Image width={30} src={YahooImage} />
                        <div className=" text-white text-base sm:text-xl">
                          Yahoo Mail
                        </div>
                      </div>
                      <AddToCalendarButton
                        label={` ${width < 450 ? "Add" : "Add to calendar"} `}
                        options={["Yahoo "]}
                        name={data.title}
                        location="Bipzy"
                        startDate={
                          selectedDateType == "priority"
                            ? moment.utc(data.start_time).format("YYYY-MM-DD")
                            : moment.utc(publicTime).format("YYYY-MM-DD")
                        }
                        endDate={moment.utc(data.end_time).format("YYYY-MM-DD")}
                        startTime={
                          selectedDateType == "priority"
                            ? moment.utc(data.start_time).format("kk:mm")
                            : moment.utc(publicTime).format("kk:mm")
                        }
                        endTime={moment.utc(data.end_time).format("kk:mm")}
                        timeZone="UTC"></AddToCalendarButton>
                    </div>
                  </div>
                </div>
                <div
                  onClick={closeModal}
                  className=" bg-[#5C5C5C] rounded-full w-[35px] md:w-[50px] h-[35px] md:h-[50px] text-black flex justify-center items-center text-4xl rotate-45 cursor-pointer absolute right-4 md:right-8 top-4 md:top-7">
                  +
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CalenderModal;
