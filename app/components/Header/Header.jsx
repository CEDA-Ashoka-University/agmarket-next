

// import CedaHeaderIcon from "../../assets/icons/CedaHeaderIcon";
// import CloseIcon from "../../assets/icons/CloseIcon";
// import AgmarkIcon from "../../assets/icons/AgmarkIcon";
// import { dropdownData } from "../constants/CedaHeader";
// import { useState, useRef } from "react";
// import { Link } from "react-router-dom";
// import { FaChevronDown} from "react-icons/fa"


// function Dropdown({ title, entries, isLast }) {
//   const [isOpen, setIsOpen] = useState(false);
//   const dropdownRef = useRef(null);

//   const handleMouseEnter = () => {
//     setIsOpen(true);
//   };

//   const handleMouseLeave = () => {
//     setIsOpen(false);
//   };

//   const handleDropdownLeave = () => {
//     setIsOpen(false);
//   };

//   return (
//     <div>
//       <button
//         onMouseEnter={handleMouseEnter}
//         onMouseLeave={handleMouseLeave}
//         className="button-header"
//       >
//         {title}
//         <span className="toggle-icon">
//           <FaChevronDown />
//         </span>
//       </button>
//       {isOpen && (
//         <ul
//           ref={dropdownRef}
//           onMouseEnter={handleMouseEnter}
//           onMouseLeave={handleDropdownLeave}
//           className="dropdown-content"
//         >
//           {entries.map((entry, index) => {
//             return (
//               <li key={index} className="dropdown-item">
//                 {entry.url ? (
//                   <a href={entry.url} className="hover:underline">
//                     {entry.title}
//                   </a>
//                 ) : (
//                   <Dropdown title={entry.title} entries={entry.entries} />
//                 )}
//               </li>
//             );
//           })}
//         </ul>
//       )}
//     </div>
//   );
// }



// export default function Header({ title = null, description = null }) {
//   const titleString = (title ? title + " | " : "") + "CEDA Agmark";
//   const descString = description
//     ? description
//     : "Handpicked indicators for the Indian Economy, explore our wide range.";

//   return (
//     <div className="flex flex-row items-center px-6 border-b border-gray-300 w-full h-[90px] gap-5 opacity-100 sm:flex-row ">
//       <meta
//         name="google-site-verification"
//         content="-A-s2rbOu735U-yyBf6HKSHZQson1kOPAmhuM8vFzcY"
//       />
//       <a href="#">
//         <CedaHeaderIcon
//           width={250}
//           height={85}
//           className="w-[250px] h-[85px] "
//         />
//       </a>

//       <div className="flex flex-row items-center flex-1 px-4 mx-4 border-l border-gray-300 gap-8 sm:flex-row sm:items-start sm:px-0 sm:mx-0 sm:gap-2 sm:border-l-0">
//         <AgmarkIcon />
//         <div>
//           <h1 className="font-serif text-[16px] leading-[24px] text-blue-900 sm:text-[14px] sm:leading-[20px]">
//             Agri-Market Data
//           </h1>
//           <p className="font-sans text-[12px] leading-[15px] font-normal text-blue-900 sm:text-[10px] sm:leading-[12px]">
//             India’s agricultural market unveiled through data
//           </p>
//         </div>
//       </div>
//       <div className="flex px-16 mx-16">
//                 {dropdownData.map((dropdown, index) => (
//                     <Dropdown key={index} 
//                               title={dropdown.title} 
//                               entries={dropdown.entries}
//                               isLast={index === dropdownData.length - 1} />
//                 ))}
//             </div>

//       <a href={process.env.VITE_ECOMETER_CLOSE_LINK}>
//         <CloseIcon className="cursor-pointer sm:self-end" />
//       </a>


      
//     </div>
//   );
// }

import CedaHeaderIcon from "../../assets/icons/CedaHeaderIcon";
import CloseIcon from "../../assets/icons/CloseIcon";
import AgmarkIcon from "../../assets/icons/AgmarkIcon";
import { dropdownData } from "../constants/CedaHeader";
import { useState, useRef } from "react";
import { FaChevronDown } from "react-icons/fa";

function Dropdown({ title, entries, isLast }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const handleDropdownLeave = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="flex items-center w-full text-[16px] font-semibold px-[1.375rem] py-[0.725rem] bg-white rounded-lg cursor-pointer"
      >
        {title}
        <span className="flex items-center justify-center ml-1">
          <FaChevronDown />
        </span>
      </button>
      {isOpen && (
        <ul
          ref={dropdownRef}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleDropdownLeave}
          className="absolute text-[14px] bg-white z-50 p-4 rounded-lg shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px]"
        >
          {entries.map((entry, index) => (
            <li key={index} className="flex flex-col items-start min-w-full">
              {entry.url ? (
                <a
                  href={entry.url}
                  className="block px-2 py-2 text-[#1A375F] hover:bg-gray-100 min-w-full"
                >
                  {entry.title}
                </a>
              ) : (
                <Dropdown title={entry.title} entries={entry.entries} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Header({ title = null, description = null }) {
  const titleString = (title ? title + " | " : "") + "CEDA Agmark";
  const descString =
    description ||
    "Handpicked indicators for the Indian Economy, explore our wide range.";

  return (
    <div className="flex items-center px-6 border-b border-gray-300 w-full h-[90px] gap-5 sm:flex-row">
      <meta
        name="google-site-verification"
        content="-A-s2rbOu735U-yyBf6HKSHZQson1kOPAmhuM8vFzcY"
      />
      <a href="ceda.ashoka.edu.in">
      <CedaHeaderIcon
          width={250}
          height={85}
          className="w-[250px] h-[85px] "
        />
      </a>

      {/* <div className="flex flex-row items-center flex-1 px-4 mx-4 border-l border-gray-300 gap-8 sm:flex-row sm:items-start sm:px-0 sm:mx-0 sm:gap-2 sm:border-l-0">
        <AgmarkIcon />
        <div>
          <h1 className="font-serif text-[16px] leading-[24px] text-blue-900 sm:text-[14px] sm:leading-[20px]">
            Agri-Market Data
          </h1>
          <p className="font-sans text-[12px] leading-[15px] text-blue-900 sm:text-[10px] sm:leading-[12px]">
            India’s agricultural market unveiled through data
          </p>
        </div>
      </div> */}
      <div className="flex flex-row items-center flex-none px-4 mx-4 border-l border-gray-300 gap-2">
  <AgmarkIcon />
  <div>
    <h1 className="font-serif text-[16px] leading-[24px] text-blue-900">
      Agri-Market Data
    </h1>
    <p className="font-sans text-[12px] leading-[15px] text-blue-900">
      India’s agricultural market unveiled through data
    </p>
  </div>
</div>


      {/* <div className="flex px-16 mx-16 gap-4">
        {dropdownData.map((dropdown, index) => (
          <Dropdown
            key={index}
            title={dropdown.title}
            entries={dropdown.entries}
            isLast={index === dropdownData.length - 1}
          />
        ))}
      </div> */}
      <div className="flex flex-none px-16 mx-16 gap-4">
  {dropdownData.map((dropdown, index) => (
    <Dropdown
      key={index}
      title={dropdown.title}
      entries={dropdown.entries}
      isLast={index === dropdownData.length - 1}
    />
  ))}
</div>


      {/* <a href={process.env.VITE_ECOMETER_CLOSE_LINK}>
        <CloseIcon className="cursor-pointer sm:self-end" />
      </a> */}
    </div>
  );
}
