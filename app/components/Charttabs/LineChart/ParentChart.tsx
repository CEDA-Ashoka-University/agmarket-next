import React, { useState } from "react";
import LineChart from "./LineChart"

interface PriceDataItem {
  date: string;
  avg_modal_price: number;
  avg_min_price: number;
  avg_max_price: number;
  commodity_name: string;
}

interface QtyDataItem {
  date: string;
  total_quantity: number;
  commodity_name: string;
}

interface ParentChartProps {
  PriceData: PriceDataItem[];
  QtyData: QtyDataItem[];
}

const ParentChart: React.FC<ParentChartProps> = ({ PriceData, QtyData }) => {
  const [selectedTab, setSelectedTab] = useState<"Price" | "Quantity">("Price");

  const handleTabChange = (tab: "Price" | "Quantity") => {
    setSelectedTab(tab);
  };

  const data = selectedTab === "Price" ? PriceData : QtyData;

  return (
    <div>
      <div>
        <button onClick={() => handleTabChange("Price")}>Price</button>
        <button onClick={() => handleTabChange("Quantity")}>Quantity</button>
      </div>
      <LineChart data={data} selectedTab={selectedTab} />
    </div>
  );
};

export default ParentChart;
