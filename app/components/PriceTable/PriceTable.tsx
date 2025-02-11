
import * as React from "react";
import { useState, useEffect } from "react";
import { PriceData, QuantityData, PriceTableProps } from "./Types";
import ShareSocialModal from '../ShareSocialModal/ShareSocialModal'
import ShareIcon from "../../assets/icons/ShareIcon"
import DownloadIcon from "../../assets/icons/DownloadIcon"
import Buttons from "../../ui/Button/Button"
import DownloadDataModal from '../DowloadDataModal/DownloadDataModal'
import Tabs from "./tabletab";
import { ActionButton } from "./ActionButton";
export const PriceTable: React.FC<PriceTableProps> = ({
  priceData,
  quantityData,
  calculationType
}) => {
  const priceDataArray = Array.isArray(priceData) ? priceData : [];
  const quantityDataArray = Array.isArray(quantityData) ? quantityData : [];
  const TABLE_HEAD = ["Date", "State", "Commodity", "Price (₹)", "Change (₹)"];
  
  const [openModalName, setOpenModalName] = useState("");
  


  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) {
      return "Invalid date"; // Handle null or undefined cases
    }

    if (calculationType === "daily") {
      // Extract year, month, and day from YYYY-MM-DD format
      const [year, month, day] = dateString.split("-");
      if (!year || !month || !day) {
        return "Invalid date"; // Ensure valid format
      }
      return `${day}/${month}/${year}`; // Format as DD-MM-YYYY
    }

    if (calculationType === "monthly") {
      // Extract year and month from YYYY-MM-DD format
      const [year, month] = dateString.split("-");
      if (!year || !month) {
        return "Invalid date"; // Ensure valid format
      }
      return `${month}/${year}`; // Format as MM-YYYY
    }
    else if (calculationType=="yearly"){
      // const [year,month] = dateString.split("-");
      // if (!year || !month) {
        // return "Invalid date"; // Ensure valid format
      // }
      return `${dateString}`; // Format as MM-YYYY
    }
    

    return "Invalid date"; // Fallback for unsupported calculation types
  };




  const calculatePriceChange = (dataArray: PriceData[]) =>
    dataArray.map((data, index, array) => {
      const currentPrice = data.avg_modal_price;
      const previousPrice = index < array.length - 1 ? array[index + 1].avg_modal_price : 0;
      const priceChange = currentPrice - previousPrice;

      const changeFormatted: string =
        previousPrice === 0
          ? "N/A"
          : priceChange > 0
            ? `+${priceChange.toFixed(2)}`
            : `-${Math.abs(priceChange).toFixed(2)}`; // Corrected this line

      return { ...data, change: changeFormatted };
    });


  const priceDataWithChange = calculatePriceChange(priceDataArray);
  const latestPriceEntry = priceDataWithChange[0];
  const latestPrice = latestPriceEntry?.avg_modal_price || "N/A";
  const selectedCommodity = latestPriceEntry?.commodity_name || "Commodity";
  // console.log("priceDataWithChange",priceData)
  const calculateQtyChange = (dataArray: QuantityData[]) =>
    dataArray.map((data, index, array) => {
      const currentQty = data.total_quantity;
      const previousQty = index < array.length - 1 ? array[index + 1].total_quantity : 0;
      const qtyChange = previousQty - currentQty;
      const changeFormatted =
        previousQty === 0
          ? "N/A"
          : qtyChange > 0
            ? `+${qtyChange.toFixed(2)}`
            : `-${Math.abs(qtyChange).toFixed(2)}`;

      return { ...data, change: changeFormatted };
    });

  const qtyDataWithChange = calculateQtyChange(quantityDataArray);
  const latestQtyEntry = qtyDataWithChange[0];
  const latestQty = latestQtyEntry?.total_quantity || "N/A";
  const selectedCommodity1 = latestQtyEntry?.commodity_name || "Commodity";

  const downloadCSV = (data: any[], filename: string) => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [
        Object.keys(data[0]).join(","), // Add headers
        ...data.map((row) =>
          Object.values(row)
            .map((value) => (typeof value === "string" ? `"${value}"` : value))
            .join(",")
        ),
      ].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [activeTab, setActiveTab] = React.useState("Price & Qty");
  return (
    <div>
      <div className="flex flex-col max-w-full rounded-3xl">
        <div className="p-2">
          <h2 className="text-lg font-semibold text-blue-900">{selectedCommodity}</h2>
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-0">
                <span className="text-2xl font-bold text-blue-900">₹ {latestPrice.toLocaleString()}</span>
                <span className="text-sm font-semibold text-blue-900">/quintal</span>
              </div>
              <div className="mt-2 text-xs text-blue-900">
                Modal price as on {formatDate(latestPriceEntry?.date || latestPriceEntry?.month || latestPriceEntry?.year) || "N/A"}
              </div>
            </div>
            <div className="w-px h-14 bg-black"></div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={`px-3 py-1.5 rounded-lg font-bold text-sm ${latestPriceEntry?.change && parseFloat(latestPriceEntry.change) < 0
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                    }`}
                >
                  ₹ {latestPriceEntry?.change || "N/A"}
                </div>
                <div
                  className={`font-bold ${latestPriceEntry?.change && parseFloat(latestPriceEntry.change) < 0 ? "text-red-600" : "text-green-600"
                    }`}
                >
                  {latestPriceEntry?.change && priceDataWithChange[1]?.avg_modal_price
                    ? (() => {
                      const changeValue = parseFloat(latestPriceEntry.change);
                      const avgPrice = priceDataWithChange[1]?.avg_modal_price ?? 1;

                      if (isNaN(changeValue) || isNaN(avgPrice)) return "(N/A)";
                      return `(${(Math.abs(changeValue) / avgPrice).toFixed(2)})%`;
                    })()
                    : "(N/A)"}
                </div>
              </div>
              <div className="mt-2 text-xs text-blue-900">
                change from the price on {formatDate(priceDataWithChange[1]?.date || priceDataWithChange[1]?.month|| priceDataWithChange[1]?.year)}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 h-[417px]">
          <Tabs
            priceDataWithChange={priceDataWithChange}
            qtyDataWithChange={qtyDataWithChange}
            calculationType={calculationType as "daily" | "monthly" | "yearly"}
          />
        </div>
        <div className="flex gap-6 bg-gray-100 border-t border-blue-950/30 rounded-b-2xl py-4 px-6 h-20">
        {/* <ActionButton
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/86ad0de7b198337402923cf87d9baa86116ee50092bfcc24e1c54d8581194069?placeholderIfAbsent=true&apiKey=5b3d0929746d4ec3b24a0cb1c5bb8afc"
            label="Download data"
            onClick={() => {
              downloadCSV(priceDataWithChange, "price_data.csv");
              downloadCSV(qtyDataWithChange, "quantity_data.csv");
            }}
          />
                        <ActionButton
              icon="https://cdn.builder.io/api/v1/image/assets/TEMP/8bff28cbdfaed95c92dea24f79f045501c64332b90fab6bc4c4081c2a257b235?placeholderIfAbsent=true&apiKey=5b3d0929746d4ec3b24a0cb1c5bb8afc"
             label="Share chart"
              onClick={() => setOpenModalName("SHARE_CHART")}
              />
                    {openModalName === "SHARE_CHART" && (
            <ShareSocialModal
              handleCloseModal={() => setOpenModalName("")}
              // handleDownloadClick={handleDownloadChart}
            />
            
          )} */}

<Buttons
  className="flex items-center gap-2 bg-white border border-[#1A375F] rounded-lg px-3 py-2 cursor-pointer"
  handleClick={() => setOpenModalName("DOWNLOAD_CHART")}
>
  <DownloadIcon className="w-3.5 h-3.5" /> 
  <p className="font-inter font-normal text-sm leading-4 text-primary w-max">
    Download charts
  </p>
</Buttons>

<Buttons
  className="flex items-center gap-2 bg-white border border-[#1A375F] rounded-lg px-3 py-2 cursor-pointer"
  handleClick={() => setOpenModalName("SHARE_CHART")}
>
  <ShareIcon className="w-3.5 h-3.5" />
  <p className="font-inter font-normal text-sm leading-4 text-primary w-max">
    Share Chart
  </p>
</Buttons>

{openModalName === "DOWNLOAD_CHART" && (
  <DownloadDataModal
    handleCloseModal={() => setOpenModalName("")}
    handleDownloadClick={() => {
      downloadCSV(priceDataWithChange, "price_data.csv");
      downloadCSV(qtyDataWithChange, "quantity_data.csv");
    }}
  />
)}

{openModalName === "SHARE_CHART" && (
  <ShareSocialModal
    handleCloseModal={() => setOpenModalName("")}
    // handleDownloadClick={handleDownloadChart}
  />
)}

 
            
      </div>
      </div>
    </div>
  );
};
