// hooks/useFetchFilteredData.ts
import { useEffect, useState } from "react";
import { DataEntry } from "../types";

interface FilterProps {
  stateFilter: string;
  commodityFilter: string;
  districtFilter: string;
  startDate: string;
  endDate: string;
  calculationType:string;
}

export const useFetchFilteredData = ({
  stateFilter="0",
  commodityFilter="1",
  districtFilter,
  startDate="2024-08-01",
  endDate,
  calculationType="monthly",
}: FilterProps) => {
  const [filteredData, setFilteredData] = useState<DataEntry[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchFilteredData = async () => {
      if (!stateFilter && !commodityFilter && !districtFilter) return;

      setIsLoading(true);
      try {
        const today = new Date();
        const past90Days = new Date();
        past90Days.setDate(today.getDate() - 90);

        const calculatedStartDate = startDate || past90Days.toISOString().split("T")[0];
        const calculatedEndDate = endDate || today.toISOString().split("T")[0];

        const res = await fetch(`/api/priceqtyapi`, {
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
        setFilteredData(data);
        console.log("data:",data.priceData)
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredData();
  }, [stateFilter, commodityFilter, districtFilter, startDate, endDate, calculationType]);

  return { filteredData, isLoading };
};
