import React, { useState, useEffect } from "react";
// import LineChart from "./LineChart";
import { PriceData, QuantityData } from "../PriceTable/Types";
import TopoJsonMap from "./Maps/TopoJsonMap";
import ParentChart from "./Timeseries/ParentChart"

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
  const [pricedata, setPriceData] = useState(priceDataWithChange || [])

  useEffect(() => {
    setData(filteredMapData);
  }, [filteredMapData]);

  useEffect(() => {
    setPriceData(priceDataWithChange);
  }, [priceDataWithChange]);




  return (
    <div >
      <div role="tablist" className="flex items-center -space-x-px text-[14px] text-[#1A377F] leading-[1.4] z-10 self-center pl-[40%] relative bg-transparent">
        {["Timeseries", "Heatmap"].map((tab, index) => (
          <div
            key={index}
            role="tab"
            tabIndex={0}
            aria-selected={openTab === index + 1}
            className={`px-5 py-1 text-center rounded-md -mt-5 ${openTab === index + 1 ? "bg-blue-950 text-white " : " bg-white text-blue-950 border border-blue-950"
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
              {/* <LineChart PriceData={priceDataWithChange} QtyData={qtyDataWithChange} /> */}
              <ParentChart PriceData={priceDataWithChange} QtyData={qtyDataWithChange} />
            </div>
          </div>

          {/* Heatmap Tab */}
          <div className={openTab === 2 ? "block" : "hidden"}>

            <TopoJsonMap initialMapData={filteredMapData} stateCode={stateFilter} />

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
