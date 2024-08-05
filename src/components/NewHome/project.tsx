import Heading from "@atoms/Heading";
import Link from "next/link";
import { IoCheckmarkCircle } from "react-icons/io5";
const ProjectSection = () => {
  return (
    <div className="project-section py-24 px-4">
      <div className="mb-10 text-center">
        <p className="text-[#AD00FF] xl:mr-40  capitalize text-2xl font-normal">
          Do You Want To Launch Your
        </p>
        <Heading
          variant="secondary"
          text={"Project in bipzy?"}
          className="text-center"
        />
      </div>
      <div className="text-white text-center">
        <ul className="inline-block">
          <li className="flex items-center text-left text-base sm:text-2xl justify-start mb-6 gap-1">
            <IoCheckmarkCircle size={35} /> Unique fictionless token sale
            process
          </li>
          <li className="flex items-center text-left text-base sm:text-2xl justify-start mb-6 gap-1">
            <IoCheckmarkCircle size={35} /> The best reputation in the crypto
            market
          </li>
          <li className="flex items-center text-left text-base sm:text-2xl justify-start mb-6 gap-1">
            <IoCheckmarkCircle size={35} /> Endorsed by experts and industry
            leaders
          </li>
        </ul>
      </div>
      <div className="text-center mt-12">
        <Link href={"/apply"}>
          <span className="bg-[#AD00FF] cursor-pointer text-lg md:text-xl px-6 md:px-12 py-3 rounded-md text-white">
            Apply To Launch
          </span>
        </Link>
      </div>
    </div>
  );
};

export default ProjectSection;
