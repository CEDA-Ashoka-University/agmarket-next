// "use client";
// import { useState } from "react";
// import { useFetchFilterOptions } from "./hooks/UseFilterOptions";
// import { useFetchFilteredData } from "./hooks/UseFetchFilterData";
// import { useFetchFilteredMapData } from "./hooks/UseFetchFilterMapData"; // Import map data hook
// import { getDefaultDateRange } from "./utils/DateUtils";
// import Filter from "./components/filter/filter";
// import Header from "./components/Header/Header";
// import { ChartContainer } from "./components/Charttabs/ChartContainer";
// import { PriceTable } from "./components/PriceTable/PriceTable";

// // import {PriceTable} from "./components/TableComponents/PriceTable"  #### scrape code

// export default function Home() {
//   const [stateFilter, setStateFilter] = useState<string>("");
//   const [commodityFilter, setCommodityFilter] = useState<string>("");
//   const [districtFilter, setDistrictFilter] = useState<string>("");
//   const [startDate, setStartDate] = useState<string>(getDefaultDateRange().startDate);
//   const [endDate, setEndDate] = useState<string>(getDefaultDateRange().endDate);
//   const [calculationType, setCalculationTypeFilter] = useState<string>(""); // Added state for calculation type

//   const { availableStates, availableCommodities } = useFetchFilterOptions();

//   const { filteredData, isLoading: isDataLoading } = useFetchFilteredData({
//     stateFilter,
//     commodityFilter,
//     districtFilter,
//     startDate,
//     endDate,
//     calculationType, // Included calculation type in the filter options
//   });
 

//   const { filteredMapData, isLoading: isMapLoading } = useFetchFilteredMapData({
//     stateFilter,
//     commodityFilter,
//     districtFilter,
//     startDate,
//     endDate,
//     calculationType, // Passed filters for map data
//   });

//   return (
//     <div>
//       <Header />
//       <Filter
//         stateFilter={stateFilter}
//         setStateFilter={setStateFilter}
//         commodityFilter={commodityFilter}
//         setCommodityFilter={setCommodityFilter}
//         districtFilter={districtFilter}
//         setDistrictFilter={setDistrictFilter}
//         availableStates={availableStates}
//         availableCommodities={availableCommodities}
//         startDate={startDate}
//         setStartDate={setStartDate}
//         endDate={endDate}
//         setEndDate={setEndDate}
//         calculationtype={calculationType} // Added prop for calculation type
//         setCalculationTypeFilter={setCalculationTypeFilter} // Added setter for calculation type
//       />
//       <section className="flex flex-col md:flex-row gap-4 px-4 py-4 h-[641px]">
//         {/* Price Table Container with Fixed Height and Scroll */}
//         <div className="w-1/3 bg-white text-left shadow-md border border-gray-300 rounded-2xl py-0 h-[617px] flex flex-col">
//           <div className="flex-grow overflow-auto">
//             <PriceTable
//               priceData={filteredData.priceData}
//               quantityData={filteredData.quantityData}
//               calculationType={calculationType as "daily" | "monthly" | "yearly"}
//             />
//           </div>

//           {/* Action Buttons at the Bottom */}
//           {/* <div className="flex gap-6 bg-gray-100 border-t border-blue-950/30 rounded-b-2xl py-4 px-6 h-20">
//             <ActionButton
//               icon="https://cdn.builder.io/api/v1/image/assets/TEMP/86ad0de7b198337402923cf87d9baa86116ee50092bfcc24e1c54d8581194069?placeholderIfAbsent=true&apiKey=5b3d0929746d4ec3b24a0cb1c5bb8afc"
//               label="Download data"
//             />
//             <ActionButton
//               icon="https://cdn.builder.io/api/v1/image/assets/TEMP/8bff28cbdfaed95c92dea24f79f045501c64332b90fab6bc4c4081c2a257b235?placeholderIfAbsent=true&apiKey=5b3d0929746d4ec3b24a0cb1c5bb8afc"
//               label="Share table"
//             />
//           </div> */}
//         </div>

//         {/* ChartView Section */}
//         <div className="w-full lg:flex-1 min-w-max bg-white text-left  p-2 h-[641px]">
//           <ChartContainer
//             priceDataWithChange={filteredData.priceData}
//             qtyDataWithChange={filteredData.quantityData}
//             filteredMapData={filteredMapData}
//             stateFilter={Number(stateFilter)} // Pass mapData from the new hook
//           />
//         </div>
//       </section>
//     </div>
//   );
// }

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
        <div className="w-full max-w-[928px] bg-white text-left pt-2 h-[617px] shadow-md border  border-gray-300 rounded-2xl">
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
            />
          )}
        </div>
      </section>
    </div>
  );
}
