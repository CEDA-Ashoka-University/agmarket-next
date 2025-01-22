export interface ChartButtonProps {
  icon: string;
  text: string;
  onClick?: () => void;
}

export interface ChartFilterButtonProps {
  text: string;
  isActive?: boolean;
  onClick?: () => void;
}

export interface DateRangeProps {
  startDate: string;
  endDate: string;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
}

export interface LegendItemProps {
  color: string;
  label: string;
}
// export interface PriceData {
//   avg_max_price: number;
//   avg_min_price: number;
//   avg_modal_price: number;
//   change?: string;
//   commodity_name: string;
//   date: string;
//   moving_average: number;
//   state_id: number;
//   state_name?: string;
//   district_name?: string;
// }

// types.ts
export interface PriceData {
  avg_max_price: number;
  avg_min_price: number;
  avg_modal_price: number;
  change?: string;
  commodity_name: string;
  date: string;
  moving_average: number;
  state_id: number;
  state_name?: string;
  district_name?: string;
}

export interface ChartButtonProps {
  icon: string;
  text: string;
  onClick?: () => void;
}

export interface ChartFilterButtonProps {
  text: string;
  isActive?: boolean;
  onClick?: () => void;
}

export interface DateRangeProps {
  startDate: string;
  endDate: string;
  onStartDateChange?: (date: string) => void;
  onEndDateChange?: (date: string) => void;
}

export interface LegendItemProps {
  color: string;
  label: string;
}

export interface LineChartProps {
  data: PriceData[];
  width?: number;
  height?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
}

// export interface PriceData {
//   date: string;
//   district_name?: string;
//   state_name?: string;
//   commodity_name: string;
//   avg_modal_price: number;
//   change?: string;
//   avg_max_price: number;
//   avg_min_price: number;
//   moving_average: number;
//   state_id: number;

// }
export interface QtyData {
  date: string;
  district_name?: string;
  state_name?: string;
  commodity_name: string;
  total_quantity: number;
  change?: string;
}
export interface TabsProps {
  priceDataWithChange: PriceData[];
  qtyDataWithChange : QtyData[];
}

export interface DataEntry{
  filteredData:[]
}