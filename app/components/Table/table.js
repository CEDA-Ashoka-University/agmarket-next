


// import { Card, Typography } from "@material-tailwind/react";

// const TABLE_HEAD = ["Date", "State", "Commodity", "Price (₹)", "Change (₹)"];

// // Function to calculate the change and map it to filteredData
// const calculatePriceChange = (filteredData) => {
//   console.log("table.js:",filteredData)
//   return filteredData.map((data, index, array) => {
//     if (index === 0) {
//       // No change for the first entry (no previous data)
//       return { ...data, change: "N/A" };
//     }

//     // Calculate change from the previous entry
//     const previousPrice = array[index - 1].price;
//     const currentPrice = data.price;
//     const priceChange = currentPrice - previousPrice;

//     // Format the change with a "+" or "-" and two decimal points
//     const changeFormatted =
//       priceChange > 0
//         ? `+ ₹${priceChange.toFixed(2)}`
//         : `- ₹${Math.abs(priceChange).toFixed(2)}`;

//     return { ...data, change: changeFormatted };
//   });
// };

// const Table = ({ filteredData }) => {
//   // First, calculate the price change
//   const dataWithChange = calculatePriceChange(filteredData);

//   // Extract the most recent price and commodity from the filtered data
//   const latestEntry = filteredData[0]; // assuming first entry is the most recent
//   const latestPrice = latestEntry?.price || "N/A"; // get the latest price
//   const selectedCommodity = latestEntry?.commodity || "Commodity"; // get the selected commodity name

//   return (
//     <Card className="p-6 shadow-lg">
//       <div className="mb-4">
//         <Typography variant="h5" className="font-bold">
//           {selectedCommodity} (India)
//         </Typography>
//         <Typography className="text-4xl font-semibold text-blue-800 mt-2">
//           ₹{latestPrice.toLocaleString()} <span className="text-xl">/quintal</span>
//         </Typography>
//         <div className="flex items-center space-x-4 mt-2">
//           <div className="text-green-600 bg-green-100 px-3 py-1 rounded-md">
//             <span className="text-lg">▲ ₹32.55</span> {/* Update dynamically if needed */}
//           </div>
//           <div className="text-green-600 bg-green-100 px-3 py-1 rounded-md">
//             <span className="text-lg">+0.22%</span> {/* Update dynamically if needed */}
//           </div>
//         </div>
//         <Typography className="text-sm text-gray-500 mt-2">
//           Modal price as on {latestEntry?.date || "N/A"}
//         </Typography>
//         <Typography className="text-sm text-gray-500">
//           Change from the price on {filteredData[1]?.date || "N/A"} {/* Previous day's date */}
//         </Typography>
//       </div>

//       <table className="w-full min-w-max table-auto text-left border-t border-gray-200">
//         <thead className="border-b border-gray-200 bg-gray-100">
//           <tr>
//             {TABLE_HEAD.map((head) => (
//               <th key={head} className="p-3 text-gray-600">
//                 <Typography variant="small" className="font-semibold">
//                   {head}
//                 </Typography>
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {dataWithChange.map((data, index) => (
//             <tr
//               key={index}
//               className={`${
//                 index % 2 === 0 ? "bg-white" : "bg-gray-50"
//               } border-b border-gray-200`}
//             >
//               <td className="p-3 text-gray-800">{data.date}</td>
//               <td className="p-3 text-gray-800">{data.state}</td>
//               <td className="p-3 text-gray-800">{data.commodity}</td>
//               <td className="p-3 text-gray-800">₹{data.price}</td>
//               <td
//                 className={`p-3 ${
//                   data.change && data.change.includes("+")
//                     ? "text-green-600"
//                     : data.change && data.change.includes("-")
//                     ? "text-red-600"
//                     : "text-gray-800"
//                 }`}
//               >
//                 {data.change || "N/A"}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </Card>
//   );
// };

// export default Table;

import { Card, Typography } from "@material-tailwind/react";
import styles from "./Table.module.css";

const TABLE_HEAD = ["Date", "State", "Commodity", "Price (₹)", "Change (₹)"];

// Function to calculate the change and map it to filteredData
const calculatePriceChange = (filteredData) => {
  // Access the actual array inside filteredData
  const dataArray = filteredData?.data || [];

  if (!Array.isArray(dataArray) || dataArray.length === 0) {
    return [];
  }

  return dataArray.map((data, index, array) => {
    if (index === 0) {
      // No change for the first entry (no previous data)
      return { ...data, change: "N/A" };
    }

    // Calculate change based on modal_price (or adjust if using a different price field)
    const previousPrice = array[index - 1].modal_price;
    const currentPrice = data.modal_price;
    const priceChange = currentPrice - previousPrice;

    // Format the change with a "+" or "-" and two decimal points
    const changeFormatted =
      priceChange > 0
        ? `+ ₹${priceChange.toFixed(2)}`
        : `- ₹${Math.abs(priceChange).toFixed(2)}`;

    return { ...data, change: changeFormatted };
  });
};

const Table = ({ filteredData }) => {
  // Check if filteredData and filteredData.data exist
  const dataArray = filteredData?.data || [];

  // Ensure there is at least one entry in the data array
  const latestEntry = dataArray.length > 0 ? dataArray[0] : null;

  // Set default values if no data is available
  const latestPrice = latestEntry?.modal_price || "N/A"; // Get the latest modal_price
  const selectedCommodity = latestEntry?.commodity_name || "Commodity"; // Adjust to commodity_name
  const latestDate = latestEntry?.date || "N/A"; // Get the latest date

  return (
    <Card className={styles.tableContainer} >
      {/* //"p-6 shadow-lg"> */}
      <div className="mb-4">
        <Typography variant="h5" className="font-bold">
          {selectedCommodity} (India)
        </Typography>
        <Typography className="text-4xl font-semibold text-blue-800 mt-2">
          ₹{latestPrice.toLocaleString()} <span className="text-xl">/quintal</span>
        </Typography>
        <div className="flex items-center space-x-4 mt-2">
          <div className="text-green-600 bg-green-100 px-3 py-1 rounded-md">
            <span className="text-lg">▲ ₹32.55</span> {/* Update dynamically if needed */}
          </div>
          <div className="text-green-600 bg-green-100 px-3 py-1 rounded-md">
            <span className="text-lg">+0.22%</span> {/* Update dynamically if needed */}
          </div>
        </div>
        <Typography className="text-sm text-gray-500 mt-2">
          Modal price as on {latestDate}
        </Typography>
        <Typography className="text-sm text-gray-500">
          Change from the price on {dataArray[1]?.date || "N/A"} {/* Previous day's date */}
        </Typography>
      </div>

      <table className="w-full min-w-max table-auto text-left border-t border-gray-200">
        <thead className="border-b border-gray-200 bg-gray-100">
          <tr>
            {TABLE_HEAD.map((head) => (
              <th key={head} className="p-3 text-gray-600">
                <Typography variant="small" className="font-semibold">
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {calculatePriceChange(filteredData).map((data, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-50"
              } border-b border-gray-200`}
            >
              <td className="p-3 text-gray-800">{data.date}</td>
              <td className="p-3 text-gray-800">{data.state_name}</td>
              <td className="p-3 text-gray-800">{data.commodity_name}</td>
              <td className="p-3 text-gray-800">₹{data.modal_price}</td>
              <td
                className={`p-3 ${
                  data.change && data.change.includes("+")
                    ? "text-green-600"
                    : data.change && data.change.includes("-")
                    ? "text-red-600"
                    : "text-gray-800"
                }`}
              >
                {data.change || "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
};

export default Table;
