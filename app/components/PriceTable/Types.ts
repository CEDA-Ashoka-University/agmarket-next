// export interface PriceData {
//   commodity_id: string;  // Add commodity_id here
//   date: string;
//   modalPrice: number;
//   commodity_name:string;
//   avg_modal_price:number;
//   change?: string;  // Optional field for change in price
//   month:string;
// }

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
  month:string;
  year:string;
}

  
  export interface TabProps {
    label: string;
    isActive?: boolean;
  }
  type TabsProps = {
    priceDataWithChange: PriceData[];
    qtyDataWithChange: QuantityData[];
    calculationType: "daily" | "monthly" | "yearly"; // Ensure "yearly" is included here
  };
  
  export interface PriceRowProps {
    date: string;
    quantity: number;
    modalPrice: number;
    change: number;
  }
  
  export interface ActionButtonProps {
    icon: string;
    label: string;
  }

  // Define the QuantityData and PriceData interfaces
  export interface QuantityData {
  date: string;
  commodity_id: string;
  total_quantity: number;
  district_id: string;
  market_id: string;
  market_name: string;
  commodity_name: string;
  month:string;
  year:string;
}

export interface PriceTableProps {
  priceData: PriceData[];
  quantityData: QuantityData[];
  calculationType: "daily" | "monthly" | "yearly"; // Include "yearly"
}