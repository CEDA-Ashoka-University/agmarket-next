"use client";
import { useState } from "react";
import { useFetchFilterOptions } from "./hooks/UseFilterOptions";
import { useFetchFilteredData } from "./hooks/UseFetchFilterData";
import { useFetchFilteredMapData } from "./hooks/UseFetchFilterMapData"; // Import map data hook
import { getDefaultDateRange } from "./utils/DateUtils";
import Filter from "./components/filter/filter";
import Header from "./components/Header/Header";
import { ChartContainer } from "./components/Charttabs/ChartContainer";
import { PriceTable } from "./components/PriceTable/PriceTable";
import LoadingIcon from "./assets/icons/LoadingIcon"; // Assuming you have a loading icon component

export default function Home() {
  const [stateFilter, setStateFilter] = useState<string>("");
  const [commodityFilter, setCommodityFilter] = useState<string>("");
  const [districtFilter, setDistrictFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(getDefaultDateRange().startDate);
  const [endDate, setEndDate] = useState<string>(getDefaultDateRange().endDate);
  const [calculationType, setCalculationTypeFilter] = useState<string>("");

  const { availableStates, availableCommodities } = useFetchFilterOptions();

  const { filteredData, isLoading: isDataLoading } = useFetchFilteredData({
    stateFilter,
    commodityFilter,
    districtFilter,
    startDate,
    endDate,
    calculationType,
  });


  const { filteredMapData, isLoading: isMapLoading } = useFetchFilteredMapData({
    stateFilter,
    commodityFilter,
    districtFilter,
    startDate,
    endDate,
    calculationType,
  });

  const isLoading = isDataLoading || isMapLoading; // Combined loading state
  // console.log("checking the start and end date",startDate,endDate)
  return (
    <div>
      <Header />
      <Filter
        stateFilter={stateFilter}
        setStateFilter={setStateFilter}
        commodityFilter={commodityFilter}
        setCommodityFilter={setCommodityFilter}
        districtFilter={districtFilter}
        setDistrictFilter={setDistrictFilter}
        availableStates={availableStates}
        availableCommodities={availableCommodities}
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        calculationtype={calculationType}
        setCalculationTypeFilter={setCalculationTypeFilter}
      />
      <section className="flex flex-col md:flex-row gap-4 px-4 py-4 h-[641px]">
        {/* Price Table Container */}
        <div className="w-1/3 bg-white text-left shadow-md border border-gray-300 rounded-2xl py-0 h-[617px] flex flex-col">
          <div className="flex-grow overflow-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <LoadingIcon /> {/* Show loading icon */}
              </div>
            ) : (
              <PriceTable
                priceData={filteredData.priceData}
                quantityData={filteredData.quantityData}
                calculationType={calculationType as "daily" | "monthly" | "yearly"}
              />
            )}
          </div>
        </div>

        {/* ChartView Section */}
        {/* <div className="w-full lg:flex-1 min-w-max bg-white text-left p-2 h-[641px] shadow-md border  border-gray-300 rounded-2xl"> */}
        <div className="w-full  bg-white text-left pt-2 h-[617px] shadow-md border  border-gray-300 rounded-2xl">
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <LoadingIcon /> {/* Show loading icon */}
            </div>
          ) : (
            <ChartContainer
              priceDataWithChange={filteredData.priceData}
              qtyDataWithChange={filteredData.quantityData}
              filteredMapData={filteredMapData}
              stateFilter={Number(stateFilter)}
              startDate = {startDate}
              endDate={endDate}
            />
          )}
        </div>
        
        
      </section>
      <div className="text-right font-inter font-normal italic mr-5 text-[11px] leading-[13.31px] tracking-[0%] underline decoration-solid decoration-auto">
      Source: Directorate of Marketing & Inspection (DMI),Ministry of Agriculture and Farmers Welfare, Government of India
</div>
    </div>
  );
}
