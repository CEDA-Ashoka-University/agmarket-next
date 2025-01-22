// import React from "react";

// interface TableData {
//   date: string;
//   change?: string;
//   [key: string]: any; // Flexible to handle various fields
// }

// interface CommonTableProps {
//   data: TableData[];
//   columns: { key: string; label: string }[];
// }

// const CommonTable: React.FC<CommonTableProps> = ({ data, columns }) => {
//   console.log("common table",data)
//   return (
//     <div className="w-full border border-gray-200 rounded-md overflow-auto" style={{ maxHeight: "360px" }}>
//       <table className="w-full text-left border-collapse">
//         <thead className="sticky top-0 bg-gray-100 shadow">
//           <tr>
//             {columns.map((column) => (
//               <th
//                 key={column.key}
//                 className="px-1 py-1 text-xs font-medium text-gray-700 border border-gray-300"
//               >
//                 {column.label}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {data.map((item, index) => (
//             <tr
//               key={index}
//               className={`${
//                 index % 2 === 0 ? "bg-white" : "bg-gray-50"
//               } hover:bg-gray-100`}
//             >
//               {columns.map((column) => (
//                 <td
//                   key={column.key}
//                   className={`px-4 py-2 text-sm border border-gray-300 ${
//                     column.key === "change"
//                       ? item[column.key]?.includes("+")
//                         ? "text-green-600"
//                         : item[column.key]?.includes("-")
//                         ? "text-red-600"
//                         : "text-gray-700"
//                       : "text-gray-700"
//                   }`}
//                 >
//                   {item[column.key] ?? "N/A"}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default CommonTable;

import React, { useEffect, useState } from "react";

interface TableData {
  date: string;
  change?: string;
  [key: string]: any; // Flexible to handle various fields
}

interface CommonTableProps {
  data: TableData[];
  columns: { key: string; label: string }[];
}

const CommonTable: React.FC<CommonTableProps> = ({ data, columns }) => {
  // const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   // Trigger loading state when data or columns are updated
  //   setIsLoading(true);
  //   const timeout = setTimeout(() => {
  //     setIsLoading(false);
  //   }, 600); // Simulate a short loading period (adjust as needed)

  //   return () => clearTimeout(timeout); // Cleanup timeout on unmount or prop change
  // }, [data, columns]);

  return (
    <div className="w-full border border-gray-200 rounded-md overflow-auto" style={{ maxHeight: "360px" }}>
      {/* {isLoading ? ( */}
        {/* <div className="flex items-center justify-center h-40">
          <div className="loader border-t-4 border-b-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
          <span className="ml-2 text-blue-500 font-medium">Loading...</span>
        </div> */}
      {/* ) : ( */}
        <table className="w-full text-left border-collapse">
          <thead className="sticky top-0 bg-gray-100 shadow">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-1 py-1 text-xs font-medium text-gray-700 border border-gray-300"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-white" : "bg-gray-50"
                } hover:bg-gray-100`}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-4 py-2 text-sm border border-gray-300 ${
                      column.key === "change"
                        ? item[column.key]?.includes("+")
                          ? "text-green-600"
                          : item[column.key]?.includes("-")
                          ? "text-red-600"
                          : "text-gray-700"
                        : "text-gray-700"
                    }`}
                  >
                    {item[column.key] ?? "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      {/* // )} */}
    </div>
  );
};

export default CommonTable;
