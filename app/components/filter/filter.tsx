// import Button from 'react-bootstrap/Button';
// import ButtonGroup from 'react-bootstrap/ButtonGroup';
// import Dropdown from 'react-bootstrap/Dropdown';
// import "./SingleSelectDropdown.css"


// interface FilterProps {
//     stateFilter: string;
//     setStateFilter: (state: string) => void;
//     commodityFilter: string;
//     setCommodityFilter: (commodity: string) => void;
//     availableStates: string[];
//     availableCommodities: string[];
//   }
  
//   const Filter: React.FC<FilterProps> = ({
//     stateFilter,
//     setStateFilter,
//     commodityFilter,
//     setCommodityFilter,
//     availableStates,
//     availableCommodities,
//   }) => {
//     return (
//         <div className="flex flex-col w-full mb-4">
//           <div className="flex w-full justify-between gap-4 px-4 py-2 bg-white text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
            
//           <label className="flex-1 font-sans font-bold">
//               Category
//               <select
//                 className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 value={commodityFilter}
//                 onChange={(e) => setCommodityFilter(e.target.value)}
//               >
//                 {availableCommodities.map((commodity) => (
//                   <option key={commodity} value={commodity}>
//                     {commodity}
//                   </option>
//                 ))}
//               </select>
//             </label>

//             <label className="flex-1 font-sans font-bold">
//               Commodity
//               <select
//                 className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 value={commodityFilter}
//                 onChange={(e) => setCommodityFilter(e.target.value)}
//               >
//                 {availableCommodities.map((commodity) => (
//                   <option key={commodity} value={commodity}>
//                     {commodity}
//                   </option>
//                 ))}
//               </select>
//             </label>


            
//             <label className="flex-1 font-sans font-bold">
//               State:
//               <select
//                 className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 value={stateFilter}
//                 onChange={(e) => setStateFilter(e.target.value)}
//               >
//                 {availableStates.map((state) => (
//                   <option key={state} value={state}>
//                     {state}
//                   </option>
//                 ))}
//               </select>
//             </label>
      
//             <label className="flex-1 font-sans font-bold">
//               District
//               <select
//                 className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 value={commodityFilter}
//                 onChange={(e) => setCommodityFilter(e.target.value)}
//               >
//                 {availableCommodities.map((commodity) => (
//                   <option key={commodity} value={commodity}>
//                     {commodity}
//                   </option>
//                 ))}
//               </select>
//             </label>
//             <label className="flex-1 font-sans font-bold">
//               Mandi
//               <select
//                 className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                 value={commodityFilter}
//                 onChange={(e) => setCommodityFilter(e.target.value)}
//               >
//                 {availableCommodities.map((commodity) => (
//                   <option key={commodity} value={commodity}>
//                     {commodity}
//                   </option>
//                 ))}
//               </select>
//             </label>
        
//           </div>
//         </div>
//       );
//   };
  
//   export default Filter;
  
import React, { useEffect, useState } from 'react';
import "./SingleSelectDropdown.css";

interface FilterProps {
  stateFilter: string;
  setStateFilter: (value: string) => void;
  commodityFilter: string;
  setCommodityFilter: (value: string) => void;
  districtFilter: string;
  setDistrictFilter: (value: string) => void;
}

const Filter: React.FC<FilterProps> = ({
  stateFilter,
  setStateFilter,
  commodityFilter,
  setCommodityFilter,
  districtFilter,
  setDistrictFilter,
}) => {
  const [availableStates, setAvailableStates] = useState<{ state_id: number; state_name: string }[]>([]);
  const [availableCommodities, setAvailableCommodities] = useState<{ commodity_id: number; commodity_name: string }[]>([]);
  const [availableDistricts, setAvailableDistricts] = useState<{ district_id: number; district_name: string }[]>([]);

  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        const res = await fetch(`/api/all`);
        const data = await res.json();
        setAvailableStates(data.states || []);
        setAvailableCommodities(data.commodities || []);
      } catch (error) {
        console.error("Error fetching filter options:", error);
      }
    }

    fetchFilterOptions();
  }, []);

  useEffect(() => {
    async function fetchDistricts() {
      if (stateFilter) {
        try {
          const res = await fetch(`/api/filterOptions?stateId=${stateFilter}`);
          const data = await res.json();
          setAvailableDistricts(data || []);
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      }
    }

    fetchDistricts();
  }, [stateFilter]);

  return (
    <div className="flex flex-col w-full mb-4">
      <div className="flex w-full justify-between gap-4 px-4 py-2 bg-white text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
        <label className="flex-1 font-sans font-bold">
          Commodity:
          <select
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={commodityFilter}
            onChange={(e) => setCommodityFilter(e.target.value)}
          >
            <option value="">Select a commodity</option>
            {availableCommodities.map((commodity) => (
              <option key={commodity.commodity_id} value={commodity.commodity_id}>
                {commodity.commodity_name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex-1 font-sans font-bold">
          State:
          <select
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
          >
            <option value="">Select a state</option>
            {availableStates.map((state) => (
              <option key={state.state_id} value={state.state_id.toString()}>
                {state.state_name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex-1 font-sans font-bold">
          District:
          <select
            className="block w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
          >
            <option value="">Select a district</option>
            {availableDistricts.map((district) => (
              <option key={district.district_id} value={district.district_id}>
                {district.district_name}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default Filter;
