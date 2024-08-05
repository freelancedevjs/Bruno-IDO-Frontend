import React, {
  Dispatch,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
interface IDropdownProps {
  label?: string;
  className?: string;
  dropdownList: string[];
  selectedOption: string | undefined;
  setSelectedOption: Dispatch<SetStateAction<string | undefined>>;
}

const DropdownV2: React.FC<IDropdownProps> = ({
  dropdownList,
  setSelectedOption,
  selectedOption,
  label,
  className,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);
    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, []);

  const handleSelectOption = (item: string) => {
    setSelectedOption(item);
    setShowDropdown(false);
  };

  return (
    <div ref={dropdownRef} className={`relative w-full  ${className}`}>
      <label
        htmlFor={label}
        className={`block text-lg font-medium mb-3 text-gray16`}>
        {label}
      </label>
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        id="dropdownDefault"
        data-dropdown-toggle="dropdown"
        className="luminousGradBg text-white h-16 lg:h-[80px] relative  appearance-none  focus:outline-none font-medium  text-base   text-center inline-flex justify-between items-center px-4 py-3 w-full"
        type="button">
        {selectedOption ?? label}
        <svg
          className="absolute right-7 w-4 h-4"
          aria-hidden="true"
          fill="#00ffa3"
          stroke="#00ffa3"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div
        id="dropdown"
        className={`${
          showDropdown ? "block" : "hidden"
        } absolute z-50 border border-gray-800  bg-black divide-y divide-gray-100 shadow w-full pt-5 rounded-xl`}>
        <ul className="text-base text-white" aria-labelledby="dropdownDefault">
          {dropdownList.map((dl, index) => (
            <li key={`dl-${index}`}>
              <div
                onClick={() => handleSelectOption(dl)}
                className="block cursor-pointer hover:bg-gray-900 font-medium text-base mb-5  py-2 px-6">
                {dl}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DropdownV2;
