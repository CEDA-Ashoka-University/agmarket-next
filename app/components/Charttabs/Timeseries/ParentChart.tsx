import { useState } from "react";
import PriceLineChart from "./PriceLineChart";
import QuantityLineChart from "./QuantityLineChart";
import { ChartButton } from "../ChartButton";
import domtoimage from 'dom-to-image';


interface PriceDataItem {
    date: string;
    avg_modal_price: number;
    avg_min_price: number;
    avg_max_price: number;
    moving_average?: number;
    commodity_name: string;
    month?: string;
    year?: string;
    state_name?: string;
  }

  
  
  interface QtyDataItem {
    date: string;
    total_quantity: number;
    commodity_name: string;
    month?: string;
    year?: string;
    state_name?: string;
  }
  
interface ParentProps {
  PriceData: PriceDataItem[];
  QtyData: QtyDataItem[];
}

const ChartParent: React.FC<ParentProps> = ({ PriceData, QtyData }) => {
  const [selectedTab, setSelectedTab] = useState<"Price" | "Quantity">("Price");

  const handleTabChange = (tab: "Price" | "Quantity") => {
    setSelectedTab(tab);
  };


  const handleDownloadChart = () => {
    const container = document.getElementById("chart-container");

    if (!container) return;

   

    // Temporarily hide the unselected tab
    const priceTab = document.getElementById("Price_button");
    const quantityTab = document.getElementById("Quantity_button");

    // Store the original display values
    const priceTabDisplay = priceTab ? priceTab.style.display : '';
    const quantityTabDisplay = quantityTab ? quantityTab.style.display : '';
    console.log("download",priceTab)
    // Hide the tab not selected
    if (selectedTab === "Price" && quantityTab) {
      quantityTab.style.display = "none";
    } else if (selectedTab === "Quantity" && priceTab) {
      priceTab.style.display = "none";
    }

    // Add a white background and capture the container
    domtoimage
      .toJpeg(container, {
        quality: 1.0,
        style: {
          backgroundColor: '#ffffff', // Ensure a white background
        },
      })
      .then((dataUrl) => {
        // Restore the original display values
        if (priceTab) priceTab.style.display = priceTabDisplay;
        if (quantityTab) quantityTab.style.display = quantityTabDisplay;

        // Trigger download
        const link = document.createElement('a');
        link.download = `map_with_${selectedTab.toLowerCase()}.jpg`;
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        // Restore the original display values in case of error
        if (priceTab) priceTab.style.display = priceTabDisplay;
        if (quantityTab) quantityTab.style.display = quantityTabDisplay;

        console.error("Error capturing the map:", error);
      });
  };
  
  return (
    <>
    <div id="chart-container" className="relative bg-white"
    
    >
    <div
          id="active-tab-label"
          style={{
            position: "absolute",
            top: "10px",
            left: "10px",
            fontSize: "16px",
            fontWeight: "bold",
            color: "#1A375F",
            display:"none"
          }}
        >
          {selectedTab}
        </div>
      <div id="tab1" className=" flex gap-2  bg-white pl-4 mt-2">
        <button id= "Price_button"
          onClick={() => handleTabChange("Price")}
          className={`px-2.5 py-1 align-middle text-sm border rounded cursor-pointer ${selectedTab === "Price" ? "bg-[#1A375F] text-white"
                : "bg-white text-[#1A375F]"
                } border-[#1A375F]`}
        >
          Price
        </button>
        <button id= "Quantity_button"
          onClick={() => handleTabChange("Quantity")}
          className={`px-2.5 py-1 align-middle text-sm border rounded cursor-pointer ${selectedTab === "Quantity"
            ? "bg-[#1A375F] text-white"
            : "bg-white text-[#1A375F]"
            } border-[#1A375F]`}
        >
          Quantity
        </button>
      </div>
      <div className="mt-4">
  {selectedTab === "Price" ? (
    <div data-tabs="Price">
      <PriceLineChart PriceData={PriceData} />
    </div>
  ) : (
    <div data-tabs="Quantity">
      <QuantityLineChart QtyData={QtyData} />
    </div>
  )}
</div>
</div>

      <div className="bg-gray-100 rounded-b-[32px] pt-[16px] px-[24px] pb-[16px] border-t border-t-[rgba(26,55,95,0.3)]"
        style={{
          marginTop: '73px',
          width: '928px',
        }}
      >
        <div className="flex gap-6">
          <ChartButton
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/11765651394374b6b9612a55c2b357118ffccaf24c9930bc589282fa25505338?placeholderIfAbsent=true&apiKey=5b3d0929746d4ec3b24a0cb1c5bb8afc"
            text="Download chart"
            onClick={handleDownloadChart}
          />
          <ChartButton
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/fdc24a00e9f1688797bcaa3a71dabf14ed5176c1612528d9a886f3eb432a31a6?placeholderIfAbsent=true&apiKey=5b3d0929746d4ec3b24a0cb1c5bb8afc"
            text="Share chart"
          />

        </div>
      </div>

    </>
  );
};

export default ChartParent;
