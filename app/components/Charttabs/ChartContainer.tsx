import React, { useState, useEffect } from "react";
// import LineChart from "./LineChart";
import { PriceData, QuantityData } from "../PriceTable/Types";
import TopoJsonMap from "./Maps/TopoJsonMap";
import ParentChart from "./Timeseries/ParentChart"
import BarPlot from "./BarPlot/BarPlot";

interface ChartContainerProps {
  priceDataWithChange: PriceData[];
  qtyDataWithChange: QuantityData[];
  filteredMapData: any[]; // Replace `any[]` with the correct type if known
  stateFilter: number;
  startDate: string;
  endDate:string;
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  priceDataWithChange,
  qtyDataWithChange,
  filteredMapData,
  stateFilter,
  startDate,
  endDate
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
        {["Timeseries", "Heatmap","Bar chart"].map((tab, index) => (
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
      <div className=" max-w-[928px] rounded-2xl font-sans font-medium  relative -mt-[18px] z-0 h-[617px]">


        {/* Tab Content */}
        <div >
          {/* Timeseries Tab */}
          <div className={openTab === 1 ? "block" : "hidden"}>
            <div className="rounded-[32px] max-w-[928px] font-sans font-medium h-[524px]">
              {/* <LineChart PriceData={priceDataWithChange} QtyData={qtyDataWithChange} /> */}
              <ParentChart PriceData={priceDataWithChange} QtyData={qtyDataWithChange} startsDate={startDate} endsDate={endDate}/>
            </div>
          </div>

          {/* Heatmap Tab */}
          <div className={openTab === 2 ? "block" : "hidden"}>

            <TopoJsonMap initialMapData={filteredMapData} stateCode={stateFilter} />

          </div>

          <div className={openTab === 3 ? "block" : "hidden"}>

            <BarPlot initialMapData={filteredMapData} stateCode={stateFilter} />

            </div>

        </div>

      </div>
    </div>
  );
};
