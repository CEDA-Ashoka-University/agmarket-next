

// export default Filter;

import React, { useEffect, useState } from "react";
import styles from "./Filters.module.css"; // Import CSS module

interface FilterProps {
  stateFilter: string;
  setStateFilter: React.Dispatch<React.SetStateAction<string>>;
  commodityFilter: string;
  setCommodityFilter: React.Dispatch<React.SetStateAction<string>>;
  districtFilter: string;
  setDistrictFilter: React.Dispatch<React.SetStateAction<string>>;
  startDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  endDate: string;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
  calculationtype: string;
  setCalculationTypeFilter: React.Dispatch<React.SetStateAction<string>>;
  // setDistrictFilter: React.Dispatch<React.SetStateAction<string>>;
  availableStates: string[];
  availableCommodities: string[];
  availableDistricts: string[];
}

const Filter: React.FC<FilterProps> = ({
  stateFilter,
  setStateFilter,
  commodityFilter,
  setCommodityFilter,
  districtFilter,
  setDistrictFilter,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  calculationtype,
  setCalculationTypeFilter,
}) => {
  const [availableStates, setAvailableStates] = useState<{ state_id: number; state_name: string }[]>([]);
  const [availableCategories, setAvailableCategories] = useState<{ category_id: number; category_name: string }[]>([]);
  const [availableCommodities, setAvailableCommodities] = useState<{ commodity_id: number; commodity_name: string; category_id: number }[]>([]);
  const [filteredCommodities, setFilteredCommodities] = useState<{ commodity_id: number; commodity_name: string }[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [availableDistricts, setAvailableDistricts] = useState<{ district_id: number; district_name: string }[]>([]);

    // Set default values here
    useEffect(() => {
      setCategoryFilter("1");

      setStateFilter("0"); // Default: All India
      setCommodityFilter("1"); // Default: Wheat commodity selected
      setDistrictFilter("0"); // Default: All Districts
      setStartDate("2024-01-01"); // Default: 90 days ago
      setEndDate(new Date().toISOString().split("T")[0]); // Default: Today
      setCalculationTypeFilter("monthly"); // Default: Daily calculation
    }, [setStateFilter, setCommodityFilter, setDistrictFilter, setStartDate, setEndDate, setCalculationTypeFilter]);
  

  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        const res = await fetch(`/api/all`);
        const data = await res.json();
        console.log("inside filter data", data);
        setAvailableStates(data.states || []);
        setAvailableCategories(data.categories || []);
        setAvailableCommodities(data.commodities || []);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    }

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    async function fetchDistricts() {
      if (stateFilter) {
        try {
          const res = await fetch(`/api/filterOptions?stateId=${stateFilter}`);
          const data = await res.json();
          setAvailableDistricts(data || []);
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      }
    }

    fetchDistricts();
  }, [stateFilter]);

  // Update commodities based on the selected category
  useEffect(() => {
    if (categoryFilter) {
      const filtered = availableCommodities.filter(
        (commodity) => commodity.category_id === Number(categoryFilter)
      );
      setFilteredCommodities(filtered);
    } else {
      setFilteredCommodities([]);
    }
  }, [categoryFilter, availableCommodities]);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        {/* Category Filter */}
        <label className={styles.label}>
          Category:
          <select
            className={styles.select}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="">Select a category</option>
            {availableCategories.map((category) => (
              <option key={category.category_id} value={category.category_id}>
                {category.category_name}
              </option>
            ))}
          </select>
        </label>

        {/* Commodity Filter */}
        <label className={styles.label}>
          Commodity:
          <select
            className={styles.select}
            value={commodityFilter}
            onChange={(e) => setCommodityFilter(e.target.value)}
            disabled={!categoryFilter} // Disable if no category is selected
          >
            <option value="">Select a commodity</option>
            {filteredCommodities.map((commodity) => (
              <option key={commodity.commodity_id} value={commodity.commodity_id}>
                {commodity.commodity_name}
              </option>
            ))}
          </select>
        </label>

        {/* State Filter */}
        <label className={styles.label}>
          State:
          <select
            className={styles.select}
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
          >
            <option value="">Select a state</option>
            <option value="0"> All India</option>
            {availableStates.map((state) => (
              <option key={state.state_id} value={state.state_id.toString()}>
                {state.state_name}
              </option>
            ))}
          </select>
        </label>

        {/* District Filter */}
        <label className={styles.label}>
          District:
          <select
            className={styles.select}
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
          >
            <option value="">Select a district</option>
            <option value="0">All Districts</option>
            {availableDistricts.map((district) => (
              <option key={district.district_id} value={district.district_id}>
                {district.district_name}
              </option>
            ))}
          </select>
        </label>

        {/* Start Date Filter */}
        <label className={styles.label}>
          Start Date:
          <input
            type="date"
            className={styles.input}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>

        {/* End Date Filter */}
        <label className={styles.label}>
          End Date:
          <input
            type="date"
            className={styles.input}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>

        {/* Calculation Type Filter */}
        <label className={styles.label}>
          Calculation Type:
          <select
            className={styles.select}
            value={calculationtype}
            onChange={(e) => setCalculationTypeFilter(e.target.value)}
          >
            <option value="">Select calculation type</option>
            <option value="daily">Daily</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
          </select>
        </label>
      </div>
    </div>
  );
};

export default Filter;
