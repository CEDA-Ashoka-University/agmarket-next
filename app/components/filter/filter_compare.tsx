import React, { useEffect, useState } from "react";
import styles from "./Filters.module.css"; // Import CSS module

interface FilterProps {
  stateFilter: string;
  setStateFilter: React.Dispatch<React.SetStateAction<string>>;
  commodityFilter: string;
  setCommodityFilter: React.Dispatch<React.SetStateAction<string>>;
  districtFilter: string;
  setDistrictFilter: React.Dispatch<React.SetStateAction<string>>;
  setCalculationTypeFilter: React.Dispatch<React.SetStateAction<string>>;
  calculationtype: string;
  disableDateFilters?: boolean; // New prop to freeze date filters
   availableStates: string[];
  availableCommodities: string[];
//   disableDateFilters?: boolean; /
startDate: string;
  setStartDate: React.Dispatch<React.SetStateAction<string>>;
  endDate: string;
  setEndDate: React.Dispatch<React.SetStateAction<string>>;
 
}

const Filter: React.FC<FilterProps> = ({
  stateFilter,
  setStateFilter,
  commodityFilter,
  setCommodityFilter,
  districtFilter,
  setDistrictFilter,
  startDate,
  endDate,
  calculationtype,
  setCalculationTypeFilter,
  disableDateFilters = false,
}) => {
  const [availableStates, setAvailableStates] = useState<{ state_id: number; state_name: string }[]>([]);
  const [availableCategories, setAvailableCategories] = useState<{ category_id: number; category_name: string }[]>([]);
  const [availableCommodities, setAvailableCommodities] = useState<{ commodity_id: number; commodity_name: string; category_id: number }[]>([]);
  const [filteredCommodities, setFilteredCommodities] = useState<{ commodity_id: number; commodity_name: string }[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [availableDistricts, setAvailableDistricts] = useState<{ district_id: number; district_name: string }[]>([]);

  useEffect(() => {
    setCategoryFilter("1");
    setStateFilter("0");
    setCommodityFilter("1");
    setDistrictFilter("0");
    setCalculationTypeFilter("monthly");
  }, [setCategoryFilter, setStateFilter, setCommodityFilter, setDistrictFilter, setCalculationTypeFilter]);

  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        const res = await fetch(`/api/all`);
        const data = await res.json();
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

        <label className={styles.label}>
          Commodity:
          <select
            className={styles.select}
            value={commodityFilter}
            onChange={(e) => setCommodityFilter(e.target.value)}
            disabled={!categoryFilter}
          >
            <option value="">Select a commodity</option>
            {filteredCommodities.map((commodity) => (
              <option key={commodity.commodity_id} value={commodity.commodity_id}>
                {commodity.commodity_name}
              </option>
            ))}
          </select>
        </label>

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

        {/* <label className={styles.label}>
          Start Date:
          <input
            type="date"
            className={styles.input}
            value={startDate}
            disabled={disableDateFilters}
          />
        </label>

        <label className={styles.label}>
          End Date:
          <input
            type="date"
            className={styles.input}
            value={endDate}
            disabled={disableDateFilters}
          />
        </label> */}

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
