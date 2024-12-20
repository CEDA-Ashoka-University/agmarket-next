export interface PriceData {
  commodity_id: string;  // Add commodity_id here
  date: string;
  modalPrice: number;
  commodity_name:string;
  avg_modal_price:number;
  change?: string;  // Optional field for change in price
}
  
  export interface TabProps {
    label: string;
    isActive?: boolean;
  }
  
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
  quantity: number;
  district_id: string;
  market_id: string;
  market_name: string;
}

export interface PriceTableProps {
  priceData: PriceData[];
  quantityData: QuantityData[];
}