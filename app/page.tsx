

// "use client";
// import { useState } from "react";
// import { useFetchFilterOptions } from "./hooks/UseFilterOptions";
// import { useFetchFilteredData } from "./hooks/UseFetchFilterData";
// import { getDefaultDateRange } from "./utils/DateUtils";
// import Filter from "./components/filter/filter";
// import Header from "./components/Header/Header";
// import { ChartContainer } from "./components/Charttabs/ChartContainer";
// import { PriceTable } from "./components/PriceTable/PriceTable";
// import styles from "./page.module.css"; // Import CSS module
// import {ActionButton} from "./components/ActionButton"

// export default function Home() {
//   const [stateFilter, setStateFilter] = useState<string>("");
//   const [commodityFilter, setCommodityFilter] = useState<string>("");
//   const [districtFilter, setDistrictFilter] = useState<string>("");
//   const [startDate, setStartDate] = useState<string>(getDefaultDateRange().startDate);
//   const [endDate, setEndDate] = useState<string>(getDefaultDateRange().endDate);
//   const [calculationType, setCalculationTypeFilter] = useState<string>(""); // Added state for calculation type

//   const { availableStates, availableCommodities } = useFetchFilterOptions();
//   const { filteredData, isLoading } = useFetchFilteredData({ // passing data to hooks for api post
//     stateFilter,
//     commodityFilter,
//     districtFilter,
//     startDate,
//     endDate,
//     calculationType, // Included calculation type in the filter options
//   });
//   console.log("page.tsx:", filteredData);

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

//       <section className={styles.container}>
//         {/* Price Table Container with Fixed Height and Scroll */}
//         <div className={styles.priceTableWrapper}>
//           <PriceTable priceData={filteredData.priceData} quantityData={filteredData.quantityData} />
//           <div className={styles.actions}>
//           <ActionButton
//           icon="https://cdn.builder.io/api/v1/image/assets/TEMP/86ad0de7b198337402923cf87d9baa86116ee50092bfcc24e1c54d8581194069?placeholderIfAbsent=true&apiKey=5b3d0929746d4ec3b24a0cb1c5bb8afc"
//           label="Download data"
//         // onClick={}
//         />
//          <ActionButton
//           icon="https://cdn.builder.io/api/v1/image/assets/TEMP/8bff28cbdfaed95c92dea24f79f045501c64332b90fab6bc4c4081c2a257b235?placeholderIfAbsent=true&apiKey=5b3d0929746d4ec3b24a0cb1c5bb8afc"
//           label="Share table"
//         // onClick={}
//         />
//       </div>
//         </div>

//         {/* ChartView Section */}
//         <div className={styles.chartViewWrapper}>

//           <ChartContainer priceDataWithChange={filteredData.priceData} qtyDataWithChange={filteredData.quantityData} />
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
import styles from "./page.module.css"; // Import CSS module
import { ActionButton } from "./components/ActionButton";
import { stat } from "fs/promises";

export default function Home() {
  const [stateFilter, setStateFilter] = useState<string>("");
  const [commodityFilter, setCommodityFilter] = useState<string>("");
  const [districtFilter, setDistrictFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<string>(getDefaultDateRange().startDate);
  const [endDate, setEndDate] = useState<string>(getDefaultDateRange().endDate);
  const [calculationType, setCalculationTypeFilter] = useState<string>(""); // Added state for calculation type

  const { availableStates, availableCommodities } = useFetchFilterOptions();
  const { filteredData, isLoading: isDataLoading } = useFetchFilteredData({
    stateFilter,
    commodityFilter,
    districtFilter,
    startDate,
    endDate,
    calculationType, // Included calculation type in the filter options
  });

  const { filteredMapData, isLoading: isMapLoading } = useFetchFilteredMapData({
    stateFilter,
    commodityFilter,
    districtFilter,
    startDate,
    endDate,
    calculationType, // Passed filters for map data
  });
  console.log("state filter",stateFilter)
  // console.log("Filtered Data:", filteredData);
  // console.log("Map Data 1233:", filteredMapData);

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
        calculationtype={calculationType} // Added prop for calculation type
        setCalculationTypeFilter={setCalculationTypeFilter} // Added setter for calculation type
      />

      <section className={styles.container}>
        {/* Price Table Container with Fixed Height and Scroll */}
        <div className={styles.priceTableWrapper}>
          <PriceTable
            priceData={filteredData.priceData}
            quantityData={filteredData.quantityData}
          />
          <div className={styles.actions}>
            <ActionButton
              icon="https://cdn.builder.io/api/v1/image/assets/TEMP/86ad0de7b198337402923cf87d9baa86116ee50092bfcc24e1c54d8581194069?placeholderIfAbsent=true&apiKey=5b3d0929746d4ec3b24a0cb1c5bb8afc"
              label="Download data"
              // onClick={}
            />
            <ActionButton
              icon="https://cdn.builder.io/api/v1/image/assets/TEMP/8bff28cbdfaed95c92dea24f79f045501c64332b90fab6bc4c4081c2a257b235?placeholderIfAbsent=true&apiKey=5b3d0929746d4ec3b24a0cb1c5bb8afc"
              label="Share table"
              // onClick={}
            />
          </div>
        </div>

        {/* ChartView Section */}
        <div className={styles.chartViewWrapper}>
          <ChartContainer
            priceDataWithChange={filteredData.priceData}
            qtyDataWithChange={filteredData.quantityData}
            filteredMapData={filteredMapData}
            stateFilter={stateFilter} // Pass mapData from the new hook
          />
        </div>
      </section>
    </div>
  );
}

