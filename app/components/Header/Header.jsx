

import CedaHeaderIcon from "../../assets/icons/CedaHeaderIcon";
import CloseIcon from "../../assets/icons/CloseIcon";
import EcometerIcon from "../../assets/icons/EcometerIcon";

export default function Header({ title = null, description = null }) {
  const titleString = (title ? title + " | " : "") + "CEDA EcoMeter";
  const descString = description
    ? description
    : "Handpicked indicators for the Indian Economy, explore our wide range.";

  return (
    <div className="flex flex-row items-center px-6 border-b border-gray-300 w-full h-[90px] gap-5 opacity-100 sm:flex-row ">
      <meta
        name="google-site-verification"
        content="-A-s2rbOu735U-yyBf6HKSHZQson1kOPAmhuM8vFzcY"
      />
      <a href="#">
        <CedaHeaderIcon
          width={250}
          height={85}
          className="w-[250px] h-[85px] "
        />
      </a>

      <div className="flex flex-row items-center flex-1 px-4 mx-4 border-l border-gray-300 gap-8 sm:flex-row sm:items-start sm:px-0 sm:mx-0 sm:gap-2 sm:border-l-0">
        <EcometerIcon />
        <div>
          <h1 className="font-serif text-[16px] leading-[24px] text-blue-900 sm:text-[14px] sm:leading-[20px]">
            Agri-Market Data
          </h1>
          <p className="font-sans text-[12px] leading-[15px] font-normal text-blue-900 sm:text-[10px] sm:leading-[12px]">
            India’s agricultural market unveiled through data
          </p>
        </div>
      </div>

      <a href={process.env.VITE_ECOMETER_CLOSE_LINK}>
        <CloseIcon className="cursor-pointer sm:self-end" />
      </a>
    </div>
  );
}
