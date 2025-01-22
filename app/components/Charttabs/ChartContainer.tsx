

// import React, { useState, useEffect } from "react";
// import styles from "./Charts.module.css";
// import { ChartButton } from "./ChartButton";
// import LineChart1 from "./LineChart1";
// import { PriceData, QtyData } from "./types";
// // import Maps from "./Maps/Maps"
// import HeatMap from "./Maps/HeatMap"
// // import {Tooltip} from "react-tooltip";
// import TopoJsonMap from "./Maps/TopoJsonMap";
// import MapWithFilter from "./Maps/filterMap";


// interface ChartContainerProps {
//   priceDataWithChange: PriceData[];
//   qtyDataWithChange: QtyData[];
//   filteredMapData: any[]; // Replace `any[]` with the correct type if known
//   stateFilter: number;
// }
// const mockData: PriceData[] = [
//   {
//     avg_max_price: 2760,
//     avg_min_price: 2600,
//     avg_modal_price: 2700,
//     change: "+251.00",
//     commodity_name: "Wheat",
//     date: "2024-10-01T00:00:00.000Z",
//     moving_average: 2700,
//     state_id: 3,
//     state_name: "Punjab",
//   },
//   {
//     avg_max_price: 2449,
//     avg_min_price: 2449,
//     avg_modal_price: 2449,
//     change: "-151",
//     commodity_name: "Wheat",
//     date: "2024-09-28T00:00:00.000Z",
//     moving_average: 2405.89,
//     state_id: 3,
//     state_name: "Punjab",
//   },
// ];
// const heatMapData = [
//   { "state_id": "29", "ModalPrice": 2918.625, "state_name": "Karnataka" },
//   { "state_id": "19", "ModalPrice": 2600, "state_name": "West Bengal" },
//   { "state_id": "24", "ModalPrice": 2455.72, "state_name": "Gujarat" },
//   { "state_id": "27", "ModalPrice": 2441.76, "state_name": "Maharashtra" },
//   { "state_id": "7", "ModalPrice": 2291, "state_name": "NCT of Delhi" },
//   { "state_id": "9", "ModalPrice": 2197.65, "state_name": "Uttar Pradesh" },
//   { "state_id": "8", "ModalPrice": 2177.34, "state_name": "Rajasthan" },
//   { "state_id": "23", "ModalPrice": 2102.27, "state_name": "Madhya Pradesh" },
//   { "state_id": "10", "ModalPrice": 2100, "state_name": "Bihar" },
//   { "state_id": "22", "ModalPrice": 2096, "state_name": "Chhattisgarh" }
// ];
// export const ChartContainer: React.FC<ChartContainerProps> = ({
//     priceDataWithChange,
//     qtyDataWithChange,
//     filteredMapData,
//     stateFilter
//   }) => {

//   const [openTab, setOpenTab] = useState(1);
//   const [data, setData] = useState(filteredMapData || []);
//   const [pricedata,setPriceData] = useState(priceDataWithChange||[])

//   useEffect(() => {
//     setData(filteredMapData);
//   }, [filteredMapData]);

//   useEffect(()=>{
//     setPriceData(priceDataWithChange);
//   },[priceDataWithChange]);

  
//   console.log("price data inside chartcontainer",filteredMapData)
  

//   return (
//     <div >
//       <div role="tablist" className={styles.chartTypeSelector}>
//         {["Timeseries", "Heatmap"].map((tab, index) => (
//           <div
//             key={index}
//             role="tab"
//             tabIndex={0}
//             aria-selected={openTab === index + 1}
//             className={`px-5 py-1 text-center rounded-md -mt-5 ${
//               openTab === index + 1 ? "bg-blue-950 text-white " : " bg-white text-blue-950 border border-blue-950"
//             }`}
//             onClick={() => setOpenTab(index + 1)}
//           >
//             {tab}
//           </div>
//         ))}
//       </div>
//     <div className={styles.chartcontainer}>


//       {/* Tab Content */}
//       <div className={styles.tabContent}>
//         {/* Timeseries Tab */}
//         <div className={openTab === 1 ? "block" : "hidden"}>
//           <div className={styles.chartWrapper}>
//             <LineChart1 PriceData={priceDataWithChange} QtyData = {qtyDataWithChange} />
//           </div>
//         </div>

//         {/* Heatmap Tab */}
//         <div className={openTab === 2 ? "block" : "hidden"}>
        
//           <TopoJsonMap initialMapData={filteredMapData} stateCode = {stateFilter} />
          
//         </div>
//       </div>
      
//       <div className={styles.footer}>
//         <div className={styles.actionButtons}>
//           <ChartButton
//             icon="https://cdn.builder.io/api/v1/image/assets/TEMP/11765651394374b6b9612a55c2b357118ffccaf24c9930bc589282fa25505338?placeholderIfAbsent=true&apiKey=5b3d0929746d4ec3b24a0cb1c5bb8afc"
//             text="Download chart"
//           />
//           <ChartButton
//             icon="https://cdn.builder.io/api/v1/image/assets/TEMP/fdc24a00e9f1688797bcaa3a71dabf14ed5176c1612528d9a886f3eb432a31a6?placeholderIfAbsent=true&apiKey=5b3d0929746d4ec3b24a0cb1c5bb8afc"
//             text="Share chart"
//           />
          
//         </div>
//       </div>
//     </div>
//     </div>
//   );
// };



import React, { useState, useEffect } from "react";
import styles from "./Charts.module.css";
import { ChartButton } from "./ChartButton";
import LineChart from "./LineChart";
// import { PriceData, QtyData } from "./types";
import { PriceData, QuantityData } from "../PriceTable/Types";
// import Maps from "./Maps/Maps"

// import {Tooltip} from "react-tooltip";
import TopoJsonMap from "./Maps/TopoJsonMap";



interface ChartContainerProps {
  priceDataWithChange: PriceData[];
  qtyDataWithChange: QuantityData[];
  filteredMapData: any[]; // Replace `any[]` with the correct type if known
  stateFilter: number;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
    priceDataWithChange,
    qtyDataWithChange,
    filteredMapData,
    stateFilter
  }) => {

  const [openTab, setOpenTab] = useState(1);
  const [data, setData] = useState(filteredMapData || []);
  const [pricedata,setPriceData] = useState(priceDataWithChange||[])

  useEffect(() => {
    setData(filteredMapData);
  }, [filteredMapData]);

  useEffect(()=>{
    setPriceData(priceDataWithChange);
  },[priceDataWithChange]);

  
  // console.log("price data inside chartcontainer",filteredMapData, stateFilter)
  

  return (
    <div >
      <div role="tablist" className="flex items-center -space-x-px text-[14px] text-[#1A377F] leading-[1.4] z-10 self-center pl-[40%] relative bg-transparent">
        {["Timeseries", "Heatmap"].map((tab, index) => (
          <div
            key={index}
            role="tab"
            tabIndex={0}
            aria-selected={openTab === index + 1}
            className={`px-5 py-1 text-center rounded-md -mt-5 ${
              openTab === index + 1 ? "bg-blue-950 text-white " : " bg-white text-blue-950 border border-blue-950"
            }`}
            onClick={() => setOpenTab(index + 1)}
          >
            {tab}
          </div>
        ))}
      </div>
    {/* <div className="rounded-[32px] max-w-[928px] font-sans font-medium shadow-md border border-gray-300 relative -mt-[18px] z-0 h-[617px]"> */}
    <div className=" max-w-[928px] rounded-2xl font-sans font-medium shadow-md  relative -mt-[18px] z-0 h-[617px]">


      {/* Tab Content */}
      <div >
        {/* Timeseries Tab */}
        <div className={openTab === 1 ? "block" : "hidden"}>
          <div className="rounded-[32px] max-w-[928px] font-sans font-medium h-[524px]">
            <LineChart PriceData={priceDataWithChange} QtyData = {qtyDataWithChange} />
            
          </div>
        </div>

        {/* Heatmap Tab */}
        <div className={openTab === 2 ? "block" : "hidden"}>
        
          <TopoJsonMap initialMapData={filteredMapData} stateCode = {stateFilter} />
          
        </div>
      </div>
      
      {/* <div className="bg-gray-100 rounded-b-[32px] pt-[17px] px-[24px] pb-[30px] border-t border-t-[rgba(26,55,95,0.3)]">
        <div className="flex gap-6">
          <ChartButton
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/11765651394374b6b9612a55c2b357118ffccaf24c9930bc589282fa25505338?placeholderIfAbsent=true&apiKey=5b3d0929746d4ec3b24a0cb1c5bb8afc"
            text="Download chart"
          />
          <ChartButton
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/fdc24a00e9f1688797bcaa3a71dabf14ed5176c1612528d9a886f3eb432a31a6?placeholderIfAbsent=true&apiKey=5b3d0929746d4ec3b24a0cb1c5bb8afc"
            text="Share chart"
          />
          
        </div>
      </div> */}
    </div>
    </div>
  );
};
