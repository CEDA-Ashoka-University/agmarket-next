
import React from "react";
import CommonTable from "./common_table";

// Define the type for the price data
interface PriceData {
  date: string;
  month?: string; // Optional for monthly calculation type
  district_name?: string;
  state_name?: string;
  commodity_name: string;
  avg_modal_price: number;
  change?: string;
  year?:string;
}
interface QtyData {
  date: string;
  month?: string; // Optional for monthly calculation type
  district_name?: string;
  state_name?: string;
  commodity_name: string;
  total_quantity: number;
  change?: string;
  year?:string;
}
interface TabsProps {
  priceDataWithChange: PriceData[];
  qtyDataWithChange: QtyData[];
  calculationType: "daily" | "monthly"| "yearly";
}

const Tabs: React.FC<TabsProps> = ({ priceDataWithChange, qtyDataWithChange, calculationType }) => {
  const [openTab, setOpenTab] = React.useState(1);

  const formatDate = (dateString: string | undefined | null, calculationType: "daily" | "monthly"|"yearly") => {
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
      const [year,month] = dateString.split("-");
      if (!year || !month) {
        return "Invalid date"; // Ensure valid format
      }
      return `${year}`; // Format as MM-YYYY
    }

    return "Invalid date"; // Fallback for unsupported calculation types
  };

  // // Process the data for Price Table and Quantity Table
  // const formattedPriceData = priceDataWithChange.map((item) => ({
  //   ...item,
  //   date: calculationType === "monthly" ? formatDate(item.month, calculationType) : formatDate(item.date, calculationType),
  // }));

  // const formattedQtyData = qtyDataWithChange.map((item) => ({
  //   ...item,
  //   date: calculationType === "monthly" ? formatDate(item.month, calculationType) : formatDate(item.date, calculationType),
  // }));

  // Process the data for Price Table and Quantity Table
const formattedPriceData = priceDataWithChange.map((item) => ({
  ...item,
  date: calculationType === "monthly" 
    ? formatDate(item.month, calculationType) 
    : calculationType === "yearly"
    ? formatDate(item.year, calculationType) 
    : formatDate(item.date, calculationType),
}));

const formattedQtyData = qtyDataWithChange.map((item) => ({
  ...item,
  date: calculationType === "monthly" 
    ? formatDate(item.month, calculationType) 
    : calculationType === "yearly"
    ? formatDate(item.year, calculationType) 
    : formatDate(item.date, calculationType),
}));

  const priceColumns = [
    { key: "date", label: calculationType === "monthly" ? "Month" : "Date" },
    { key: "avg_modal_price", label: "Price (₹)" },
       { key: "avg_min_price", label: "Min Price (₹)" },
    { key: "avg_max_price", label: "Max Price (₹)" },
    { key: "change", label: "Change (₹)" },
  ];

  const qtyColumns = [
    { key: "date", label: calculationType === "monthly" ? "Month" : "Date" },
    { key: "total_quantity", label: "Qty (Tonne)" },
    { key: "change", label: "Change (Tonne)" },
  ];

  return (
    <div className="flex flex-col w-full">
      {/* Tab Header */}
      <div className="flex gap-0 items-center text-sm font-medium leading-snug max-w-[440px] text-blue-950">
       {/* "flex justify-start space-x-2 mb-4"  */}
        {["Prices (Min, Max, Mode)", "Arrival Qty"].map((tab, index) => (
          <button
            key={index}
            className={`px-5 py-2 rounded-md text-sm font-medium ${
              openTab === index + 1
                ? "bg-blue-950 text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
            onClick={() => setOpenTab(index + 1)}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-grow">
        {openTab === 1 && (
          <CommonTable data={formattedPriceData} columns={priceColumns} />
        )}
        {openTab === 2 && (
          <CommonTable data={formattedQtyData} columns={qtyColumns} />
        )}
      </div>
    </div>
  );
};

export default Tabs;
