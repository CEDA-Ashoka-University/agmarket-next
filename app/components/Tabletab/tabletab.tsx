

// export default Tabs;
import React from "react";
import { Card, Typography } from "@material-tailwind/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell } from "@nextui-org/react";
import styles from "./PriceTable.module.css";

import { useInfiniteScroll } from "@nextui-org/use-infinite-scroll";
// Define the type for the price data
interface PriceData {
  date: string;
  district_name?: string;
  state_name?: string;
  commodity_name: string;
  avg_modal_price: number;
  change?: string;
}
interface QtyData {
  date: string;
  district_name?: string;
  state_name?: string;
  commodity_name: string;
  total_quantity: number;
  change?: string;
}
interface TabsProps {
  priceDataWithChange: PriceData[];
  qtyDataWithChange: QtyData[];
}

const Tabs: React.FC<TabsProps> = ({ priceDataWithChange, qtyDataWithChange }) => {
  const [openTab, setOpenTab] = React.useState(1);

  // Define table headers
  const TABLE_HEAD = [
    { key: "date", label: "Date" },
    // { key: "state", label: "State" },
    // { key: "commodity", label: "Commodity" },
    { key: "price", label: "Price (₹)" },
    { key: "minprice", label: "Min Price (₹)" },
    { key: "maxprice", label: "Max Price (₹)" },
    { key: "change", label: "Change (₹)" }
  ];
  const TABLE_HEAD_QTY = [
    { key: "date", label: "Date" },
    // { key: "state", label: "State" },
    // { key: "commodity", label: "Commodity" },
    { key: "qty", label: "qty (Tonn)" },

    { key: "change", label: "Change (Tonn)" }
  ];
  // Format the date to DD/MM/YYYY format
  // const formatDate = (dateString: string) => {
  //   const date = new Date(dateString);
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const month = String(date.getMonth() + 1).padStart(2, "0");
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
  

  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full">
          <div
            role="tablist"
            className="flex gap-0 items-center text-sm font-medium leading-snug max-w-[440px] text-blue-950"
          >
            {['Prices(Min, Max, Mode)', 'Arrival Qty'].map((tab, index) => (
              <div
                key={index}
                role="tab"
                tabIndex={0}
                aria-selected={openTab === index + 1}
                className={`gap-2 self-stretch px-5 py-1 my-auto text-center min-h-[28px] ${openTab === index + 1
                    ? "text-white rounded-md bg-blue-950"
                    : "border border-solid border-blue-950 border-opacity-10"
                  }`}
                onClick={(e) => {
                  e.preventDefault();
                  setOpenTab(index + 1);
                }}
              >
                {tab}
              </div>
            ))}
          </div>

          <div className={styles.tabContent}>
            <div className="px-4 py-5 flex-auto">
              <div className="tab-content tab-space">
                {/* Tab 1 Content */}
                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                  <div className={styles.tableWrapper}>
                    <Table isHeaderSticky 
                      aria-label="Example static collection table"
                      classNames={{
                        base: "max-h-[264px] overflow-scroll",
                        table: "min-h-[400px]",
                      }}>

                      <TableHeader  columns={TABLE_HEAD}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                      </TableHeader>
                      <TableBody>
                        {priceDataWithChange.slice(0, 10).map((data, index) => (
                          <TableRow
                            className={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
                            key={index}
                          >
                            <TableCell>{formatDate(data.date || data.month)}</TableCell>
                            {/* <TableCell>{data.district_name || data.state_name}</TableCell>
                            <TableCell>{data.commodity_name}</TableCell> */}
                            <TableCell>₹{data.avg_modal_price.toFixed(2)}</TableCell>
                            <TableCell>₹{data.avg_min_price.toFixed(2)}</TableCell>
                            <TableCell>₹{data.avg_max_price.toFixed(2)}</TableCell>
                            <TableCell
                              className={
                                data.change && data.change.includes("+")
                                  ? styles.tableDataPositive
                                  : data.change && data.change.includes("-")
                                    ? styles.tableDataNegative
                                    : ""
                              }
                            >
                              {data.change || "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Tab 2 Content (Settings) */}
                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                  <div className={styles.tableWrapper}>
                    <Table aria-label="Example static collection table">
                      <TableHeader columns={TABLE_HEAD_QTY}>
                        {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                      </TableHeader>
                      <TableBody>
                        {qtyDataWithChange.slice(0, 10).map((data, index) => (
                          <TableRow
                            className={index % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd}
                            key={index}
                          >
                            <TableCell>{formatDate(data.date || data.month)}</TableCell>
                            {/* <TableCell>district_name</TableCell>
                            <TableCell>commodity name</TableCell> */}
                            <TableCell>{data.total_quantity.toFixed(2)} </TableCell>
                            {/* <TableCell>{data.change}</TableCell> */}

                            <TableCell
                              className={
                                data.change && data.change.includes("+")
                                  ? styles.tableDataPositive
                                  : data.change && data.change.includes("-")
                                    ? styles.tableDataNegative
                                    : ""
                              }
                            >
                              {data.change || "N/A"}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* Tab 3 Content (Options) */}
                <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                  <p>Options content here...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Tabs;
