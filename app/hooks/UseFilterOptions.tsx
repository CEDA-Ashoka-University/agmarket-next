// hooks/useFetchFilterOptions.ts
import { useEffect, useState } from "react";

export const useFetchFilterOptions = () => {
  const [availableStates, setAvailableStates] = useState<string[]>([]);
  const [availableCommodities, setAvailableCommodities] = useState<string[]>([]);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        const res = await fetch(`/api/filterOptions`);
        const data = await res.json();
        setAvailableStates(
          data.states.map((state: { state_name: string }) => state.state_name)
        );
        setAvailableCommodities(
          data.commodities.map(
            (commodity: { commodity_name: string }) => commodity.commodity_name
          )
        );
      } catch (error) {
        console.error("Error fetching states and commodities:", error);
      }
    };

    fetchFilterOptions();
  }, []);

  return { availableStates, availableCommodities };
};
