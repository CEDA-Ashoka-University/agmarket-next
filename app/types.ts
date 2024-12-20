// types.ts

/** Represents a single data entry */
export interface DataEntry {
    date: string;          // Date of the record
    state: string;         // State name
    commodity: string;     // Commodity name
    district: string;      // District name
    price: number;         // Price value
  }
  
  /** Represents the response from the filter options API */
  export interface FilterOptionsResponse {
    states: { state_name: string }[];         // List of states with names
    commodities: { commodity_name: string }[]; // List of commodities with names
  }
  
  /** Represents the filters applied by the user */
  export interface Filters {
    stateFilter: string;      // Selected state filter
    commodityFilter: string;  // Selected commodity filter
    districtFilter: string;   // Selected district filter
    startDate: string;        // Selected start date
    endDate: string;          // Selected end date
  }
  
  /** Props for the Filter component */
  export interface FilterProps extends Filters {
    setStateFilter: (state: string) => void;      // Setter for state filter
    setCommodityFilter: (commodity: string) => void; // Setter for commodity filter
    setDistrictFilter: (district: string) => void; // Setter for district filter
    setStartDate: (date: string) => void;         // Setter for start date
    setEndDate: (date: string) => void;           // Setter for end date
    availableStates: string[];                    // List of available states
    availableCommodities: string[];               // List of available commodities
    availableDistricts: string[];                 // List of available districts
  }
  
  /** Props for the PriceTable component */
  export interface PriceTableProps {
    data: DataEntry[];      // Array of filtered data to display
  }
  
  /** Props for fetching filtered data */
  export interface FetchFilteredDataProps {
    stateFilter: string;      // Selected state filter
    commodityFilter: string;  // Selected commodity filter
    districtFilter: string;   // Selected district filter
    startDate: string;        // Selected start date
    endDate: string;          // Selected end date
  }
  