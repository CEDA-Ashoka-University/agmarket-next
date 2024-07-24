

// types.ts
export interface PriceData {
    id: number;
    district_id: number;
    market_id: number;
    market_name: string;
    district_name: string;
    state_name: string;
    commodity_id: number;
    variety: string | null;
    grade: string | null;
    min_price: number | null;
    max_price: number | null;
    modal_price: number | null;
    date: string; // or Date, depending on how you receive it
  }
  