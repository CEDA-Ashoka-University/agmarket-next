import { useEffect, useState } from "react";
// import {DataEntry} from "../types";
import { filterProps } from "framer-motion";

interface FilterProps{
  stateFilter: string;
  commodityFilter:string;
  districtFilter:string;
  startDate:string;
  endDate:string;
  calculationType:string;
}

interface DataEntry{
  filteredData:[]
}


export const useFetchFilteredMapData=({
  stateFilter,
  commodityFilter,
  districtFilter,
  startDate,
  endDate,
  calculationType
}:FilterProps)=>{
  

  const [filteredMapData, setFilteredMapData] = useState<DataEntry[]>([]);
  const[isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFilteredMapData = async () => {
      if (!stateFilter && !commodityFilter && !districtFilter) return;

      setIsLoading(true);
      try {
        const today = new Date();
        const past90Days = new Date();
        past90Days.setDate(today.getDate() - 90);

        const calculatedStartDate = startDate || past90Days.toISOString().split("T")[0];
        const calculatedEndDate = endDate || today.toISOString().split("T")[0];
        
        const res = await fetch(`/api/priceqtymapsapi`, {
          
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            state_id: stateFilter,
            commodity_id: commodityFilter,
            district_id: districtFilter,
            calculation_type: calculationType,
            start_date: calculatedStartDate,
            end_date: calculatedEndDate,
            
          }),
        });

        if (!res.ok) throw new Error(`Failed to fetch data: ${res.statusText}`);
        const data = await res.json();
        // console.log("map data121", data)
        setFilteredMapData(data);
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredMapData();
  }, [stateFilter, commodityFilter, districtFilter, startDate, endDate, calculationType]);

  return { filteredMapData, isLoading };
};
