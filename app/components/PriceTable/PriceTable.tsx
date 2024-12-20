



import * as React from "react";


import { ActionButton } from "./ActionButton";
import { PriceData, QuantityData, PriceTableProps } from "../PriceTable/Types";
import styles from "./PriceTable.module.css"; // Import the CSS module

import Tabs from "../Tabletab/tabletab"

export const PriceTable: React.FC<PriceTableProps> = ({
  priceData,
  quantityData,
}) => {
  const priceDataArray = Array.isArray(priceData) ? priceData : [];
  const quantityDataArray = Array.isArray(quantityData) ? quantityData : [];
  const TABLE_HEAD = ["Date", "State", "Commodity", "Price (₹)", "Change (₹)"];

  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is 0-based
  //   const year = date.getFullYear();
  //   return `${day}/${month}/${year}`;
  // };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) {
      return "Invalid date"; // Handle null or undefined cases
    }
  
    const hasTimeComponent = dateString.includes("T");
  
    if (hasTimeComponent) {
      // Parse daily format (YYYY-MM-DDTHH:mm:ss.sssZ)
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return "Invalid date";
      }
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    } else {
      // Handle monthly format (YYYY-MM)
      const [year, month] = dateString.split("-");
      if (!year || !month) {
        return "Invalid date";
      }
      return `${month}/${year}`;
    }
  };
  

  const calculatePriceChange = (dataArray: PriceData[]) => {
    return dataArray.map((data, index, array) => {
      const currentPrice = data.avg_modal_price;
      const previousPrice =
        index < array.length - 1 ? array[index + 1].avg_modal_price : 0;

      const priceChange =  currentPrice - previousPrice;
      const changeFormatted =
        previousPrice === 0
          ? "N/A"
          : priceChange > 0
            ? `+${priceChange.toFixed(2)}`
            : `-${Math.abs(priceChange.toFixed(2))}`;

      return { ...data, change: changeFormatted };
    });
  };

  const priceDataWithChange = calculatePriceChange(priceDataArray);
  const latestPriceEntry = priceDataWithChange[0];
  console.log("testing for latestprice", priceDataWithChange)
  const latestPrice = latestPriceEntry?.avg_modal_price || "N/A";
  const selectedCommodity = latestPriceEntry?.commodity_name || "Commodity";

  const calculateQtyChange = (dataArray: QtyData[]) => {
    return dataArray.map((data,index,array)=>{
      const currentQty = data.total_quantity;
      const previousQty = index< array.length -1 ? array[index+1].total_quantity :0;
      const qtyChange = previousQty-currentQty;
      const changeFormatted = 
        previousQty === 0
          ? "N/A"
          : qtyChange > 0 
            ? `+${qtyChange.toFixed(2)}`
            :`-${Math.abs(qtyChange.toFixed(2))}`;
      return {...data, change: changeFormatted};
    })
  };

  const qtyDataWithChange = calculateQtyChange(quantityDataArray);
  const latestQtyEntry = qtyDataWithChange[0];
  const latestQty = latestQtyEntry?.total_quantity ||"N/A";
  const selectedCommodity1 = latestQtyEntry?.commodity_name ||"Commodity";

  const [activeTab, setActiveTab] = React.useState("Price & Qty");

  return (
    <div className={styles.pricetablecontainer}>

      <div className={styles.header}>
        <h2 className={styles.title}>{selectedCommodity}</h2>
        <div className={styles.priceInfo}>
          <div className={styles.currentPrice}>
            <div className={styles.priceValue}>
              <span className={styles.amount}> ₹ {latestPrice.toLocaleString()}</span>
              <span className={styles.unit}>/quintal</span>
            </div>
            <div className={styles.priceDate}> Modal price as on{" "}
              {formatDate(latestPriceEntry?.date || latestPriceEntry?.month) || "N/A"}</div>
          </div>
          <div className={styles.divider} />
          <div className={styles.priceChange}>
            <div className={styles.changeValue}>
              <div
                className={`${styles.changeBadge} ${latestPriceEntry?.change && parseFloat(latestPriceEntry.change) < 0
                    ? styles.negative
                    : styles.positive
                  }`}
              >
                ₹ {latestPriceEntry?.change || "N/A"}
              </div>
              <div
                className={`${styles.changePercent} ${latestPriceEntry?.change && parseFloat(latestPriceEntry.change) < 0
                    ? styles.negative
                    : styles.positive
                  }`}
              >
                {latestPriceEntry?.change && priceDataWithChange[1]?.avg_modal_price
                  ? (() => {
                    const changeValue = parseFloat(latestPriceEntry.change);
                    const avgPrice = priceDataWithChange[1]?.avg_modal_price ?? 1;

                    // Ensure valid numbers
                    if (isNaN(changeValue) || isNaN(avgPrice)) {
                      return '(N/A)';
                    }

                    return `(${(Math.abs(changeValue) / avgPrice).toFixed(2)})%`;
                  })()
                  : '(N/A)'}
              </div>


            </div>
            <div className={styles.changeDate}>change from the price on {formatDate(priceDataWithChange[1]?.date ||priceDataWithChange[1]?.month )}</div>
          </div>
        </div>
      </div>



      <div className={styles.tableWrapper}>
        <Tabs priceDataWithChange={priceDataWithChange} qtyDataWithChange = {qtyDataWithChange}/>
      </div>
      {/* <div className={styles.actions}>
        <ActionButton
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/86ad0de7b198337402923cf87d9baa86116ee50092bfcc24e1c54d8581194069?placeholderIfAbsent=true&apiKey=5b3d0929746d4ec3b24a0cb1c5bb8afc"
          label="Download data"
        // onClick={}
        />
        <ActionButton
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/8bff28cbdfaed95c92dea24f79f045501c64332b90fab6bc4c4081c2a257b235?placeholderIfAbsent=true&apiKey=5b3d0929746d4ec3b24a0cb1c5bb8afc"
          label="Share table"
        // onClick={}
        />
      </div> */}

    </div>




    // </div>

  );
};
