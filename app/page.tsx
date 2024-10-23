
// "use client"
// import { useEffect, useState } from 'react';
// import Filter from './components/filter/filter';
// import LineChart from './components/LineChart/LineChart';
// import HeatmapChart from './components/HeatmapChart/HeatmapChart'; // Import the heatmap chart component
// import Table from './components/Table/table';
// import Header from "./components/Header/Header";
// import { ToggleButtonGroup, ToggleButton } from '@mui/material'; // Import toggle buttons

// interface DataEntry {
//   date: string;
//   state: string;
//   commodity: string;
//   price: number;
// }

// const dummyData = [
//   { date: '2024-10-01', state: 'Bihar', commodity: 'wheat', price: 210 },
//   { date: '2024-10-01', state: 'Bihar', commodity: 'rice', price: 160 },
//   { date: '2024-10-01', state: 'UP', commodity: 'wheat', price: 220 },
//   { date: '2024-10-01', state: 'UP', commodity: 'rice', price: 170 },
//   { date: '2024-10-01', state: 'Haryana', commodity: 'wheat', price: 230 },
//   { date: '2024-10-01', state: 'Haryana', commodity: 'rice', price: 180 },
//   { date: '2024-10-02', state: 'Bihar', commodity: 'wheat', price: 215 },
//   { date: '2024-10-02', state: 'Bihar', commodity: 'rice', price: 165 },
//   { date: '2024-10-02', state: 'UP', commodity: 'wheat', price: 225 },
//   { date: '2024-10-02', state: 'UP', commodity: 'rice', price: 175 },
//   { date: '2024-10-02', state: 'Haryana', commodity: 'wheat', price: 235 },
//   { date: '2024-10-02', state: 'Haryana', commodity: 'rice', price: 185 },
//   { date: '2024-10-03', state: 'Bihar', commodity: 'wheat', price: 220 },
//   { date: '2024-10-03', state: 'Bihar', commodity: 'rice', price: 170 },
//   { date: '2024-10-03', state: 'UP', commodity: 'wheat', price: 230 },
//   { date: '2024-10-03', state: 'UP', commodity: 'rice', price: 180 },
//   { date: '2024-10-03', state: 'Haryana', commodity: 'wheat', price: 240 },
//   { date: '2024-10-03', state: 'Haryana', commodity: 'rice', price: 190 },
//   { date: '2024-10-04', state: 'Bihar', commodity: 'wheat', price: 225 },
//   { date: '2024-10-04', state: 'Bihar', commodity: 'rice', price: 175 },
//   { date: '2024-10-04', state: 'UP', commodity: 'wheat', price: 235 },
//   { date: '2024-10-04', state: 'UP', commodity: 'rice', price: 185 },
//   { date: '2024-10-04', state: 'Haryana', commodity: 'wheat', price: 245 },
//   { date: '2024-10-04', state: 'Haryana', commodity: 'rice', price: 195 },
//   { date: '2024-10-05', state: 'Bihar', commodity: 'wheat', price: 230 },
//   { date: '2024-10-05', state: 'Bihar', commodity: 'rice', price: 180 },
//   { date: '2024-10-05', state: 'UP', commodity: 'wheat', price: 240 },
//   { date: '2024-10-05', state: 'UP', commodity: 'rice', price: 190 },
//   { date: '2024-10-05', state: 'Haryana', commodity: 'wheat', price: 250 },
//   { date: '2024-10-05', state: 'Haryana', commodity: 'rice', price: 200 }
// ];

// export default function Home() {
//   const [filteredData, setFilteredData] = useState<DataEntry[]>(dummyData);
//   const [stateFilter, setStateFilter] = useState<string>('Bihar');
//   const [commodityFilter, setCommodityFilter] = useState<string>('wheat');
//   const [availableStates, setAvailableStates] = useState<string[]>([]);
//   const [availableCommodities, setAvailableCommodities] = useState<string[]>([]);
//   const [view, setView] = useState<'line' | 'heatmap'>('line'); // State for toggling views

//   useEffect(() => {
//     const uniqueStates = Array.from(new Set(dummyData.map((d) => d.state)));
//     const uniqueCommodities = Array.from(new Set(dummyData.map((d) => d.commodity)));
//     setAvailableStates(uniqueStates);
//     setAvailableCommodities(uniqueCommodities);
//   }, []);

//   useEffect(() => {
//     const newFilteredData = dummyData.filter(
//       (d) => d.state === stateFilter && d.commodity === commodityFilter
//     );
//     setFilteredData(newFilteredData);
//   }, [stateFilter, commodityFilter]);

//   const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: 'line' | 'heatmap') => {
//     if (newView !== null) {
//       setView(newView);
//     }
//   };

//   return (
//     <div>
//       <Header />
//       <Filter
//         stateFilter={stateFilter}
//         setStateFilter={setStateFilter}
//         commodityFilter={commodityFilter}
//         setCommodityFilter={setCommodityFilter}
//         availableStates={availableStates}
//         availableCommodities={availableCommodities}
//       />
      
     

//       <section className="flex my-4 px-4 gap-3">
//         <div className="w-15 min-w-max table-auto text-left">
//           <Table filteredData={filteredData} />
//         </div>
//         <div style={{ flex: 1 }}>
//         <ToggleButtonGroup
//         value={view}
//         exclusive
//         onChange={handleViewChange}
//         aria-label="chart view"
//         className="mb-4"
//       >
//         <ToggleButton value="line" aria-label="line chart">
//           Line Chart
//         </ToggleButton>
//         <ToggleButton value="heatmap" aria-label="heatmap">
//           Heatmap
//         </ToggleButton>
//       </ToggleButtonGroup>
//           {view === 'line' ? (
//             <LineChart filteredData={filteredData} />
//           ) : (
//             <HeatmapChart filteredData={filteredData} />
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }

// "use client";
// import { useEffect, useState } from 'react';
// import Filter from './components/filter/filter';
// import LineChart from './components/LineChart/LineChart';
// import HeatmapChart from './components/HeatmapChart/HeatmapChart'; // Import the heatmap chart component
// import Table from './components/Table/table';
// import Header from "./components/Header/Header";
// import { ToggleButtonGroup, ToggleButton } from '@mui/material'; // Import toggle buttons

// interface DataEntry {
//   date: string;
//   state: string;
//   commodity: string;
//   district: string;
//   price: number;
// }

// const dummyData = [
//   { date: '2024-10-01', state: 'Bihar', district: 'Patna', commodity: 'wheat', price: 210 },
//   { date: '2024-10-01', state: 'Bihar', district: 'Patna', commodity: 'rice', price: 160 },
//   { date: '2024-10-01', state: 'UP', district: 'Lucknow', commodity: 'wheat', price: 220 },
//   { date: '2024-10-01', state: 'UP', district: 'Lucknow', commodity: 'rice', price: 170 },
//   { date: '2024-10-01', state: 'Haryana', district: 'Hisar', commodity: 'wheat', price: 230 },
//   { date: '2024-10-01', state: 'Haryana', district: 'Hisar', commodity: 'rice', price: 180 },
//   // Add more dummy data as required
// ];

// export default function Home() {
//   const [filteredData, setFilteredData] = useState<DataEntry[]>(dummyData);
//   const [stateFilter, setStateFilter] = useState<string>('Bihar');
//   const [commodityFilter, setCommodityFilter] = useState<string>('wheat');
//   const [districtFilter, setDistrictFilter] = useState<string>('Patna');
//   const [availableStates, setAvailableStates] = useState<string[]>([]);
//   const [availableCommodities, setAvailableCommodities] = useState<string[]>([]);
//   const [availableDistricts, setAvailableDistricts] = useState<string[]>([]);
//   const [view, setView] = useState<'line' | 'heatmap'>('line'); // State for toggling views

//   useEffect(() => {
//     const uniqueStates = Array.from(new Set(dummyData.map((d) => d.state)));
//     const uniqueCommodities = Array.from(new Set(dummyData.map((d) => d.commodity)));
//     setAvailableStates(uniqueStates);
//     setAvailableCommodities(uniqueCommodities);
//   }, []);

//   // Update available districts based on selected state
//   useEffect(() => {
//     const uniqueDistricts = Array.from(new Set(dummyData.filter((d) => d.state === stateFilter).map((d) => d.district)));
//     setAvailableDistricts(uniqueDistricts);
//   }, [stateFilter]);

//   // Filter data based on state, commodity, and district
//   useEffect(() => {
//     const newFilteredData = dummyData.filter(
//       (d) =>
//         d.state === stateFilter &&
//         d.commodity === commodityFilter &&
//         d.district === districtFilter
//     );
//     setFilteredData(newFilteredData);
//   }, [stateFilter, commodityFilter, districtFilter]);

//   const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: 'line' | 'heatmap') => {
//     if (newView !== null) {
//       setView(newView);
//     }
//   };

//   return (
//     <div>
//       <Header />
//       <Filter
//         stateFilter={stateFilter}
//         setStateFilter={setStateFilter}
//         commodityFilter={commodityFilter}
//         setCommodityFilter={setCommodityFilter}
//         districtFilter={districtFilter} // Add district filter prop
//         setDistrictFilter={setDistrictFilter} // Add setDistrictFilter prop
//       />
      
//       <section className="flex my-4 px-4 gap-3">
//         <div className="w-15 min-w-max table-auto text-left">
//           <Table filteredData={filteredData} />
//         </div>
//         <div style={{ flex: 1 }}>
//           <ToggleButtonGroup
//             value={view}
//             exclusive
//             onChange={handleViewChange}
//             aria-label="chart view"
//             className="mb-4"
//           >
//             <ToggleButton value="line" aria-label="line chart">
//               Line Chart
//             </ToggleButton>
//             <ToggleButton value="heatmap" aria-label="heatmap">
//               Heatmap
//             </ToggleButton>
//           </ToggleButtonGroup>
//           {view === 'line' ? (
//             <LineChart filteredData={filteredData} />
//           ) : (
//             <HeatmapChart filteredData={filteredData} />
//           )}
//         </div>
//       </section>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from 'react';
import Filter from './components/filter/filter';
import LineChart from './components/LineChart/LineChart';
import HeatmapChart from './components/HeatmapChart/HeatmapChart';
import Table from './components/Table/table';
import Header from "./components/Header/Header";
import { ToggleButtonGroup, ToggleButton } from '@mui/material';

interface DataEntry {
  date: string;
  state: string;
  commodity: string;
  district: string;
  price: number;
}

export default function Home() {
  const [filteredData, setFilteredData] = useState<DataEntry[]>([]);
  const [stateFilter, setStateFilter] = useState<string>('');
  const [commodityFilter, setCommodityFilter] = useState<string>('');
  const [districtFilter, setDistrictFilter] = useState<string>('');
  const [view, setView] = useState<'line' | 'heatmap'>('line');

  useEffect(() => {
    async function fetchFilterOptions() {
      try {
        const res = await fetch(`/api/filterOptions`);
        const data = await res.json();
        setAvailableStates(data.states.map((state: { state_name: string }) => state.state_name));
        setAvailableCommodities(data.commodities.map((commodity: { commodity_name: string }) => commodity.commodity_name));
      } catch (error) {
        console.error("Error fetching states and commodities:", error);
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
          console.log("district",data)
          setAvailableDistricts(data.map((district: { district_name: string }) => district.district_name));
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      }
    }

    fetchDistricts();
  }, [stateFilter]);

  useEffect(() => {
    async function fetchFilteredData() {
      try {
        const today = new Date();
        const past90Days = new Date();
        past90Days.setDate(today.getDate() - 90);
  
        // Format the dates to only send the date part (YYYY-MM-DD)
        const startDate = past90Days.toISOString().split('T')[0];
        const endDate = today.toISOString().split('T')[0];
  
        const res = await fetch(
          `/api/price?state_id=${stateFilter}&commodity_id=${commodityFilter}&district_id=${districtFilter}&start_date=${startDate}&end_date=${endDate}`
        );
        const data = await res.json();
        setFilteredData(data);
        console.log("filtereddata",filteredData)
        console.log(data)
      } catch (error) {
        console.error("Error fetching filtered data:", error);
      }
    }
  
    if (stateFilter && commodityFilter && districtFilter) {
      fetchFilteredData();
    }
  }, [stateFilter, commodityFilter, districtFilter]);
  

  const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: 'line' | 'heatmap') => {
    if (newView !== null) {
      setView(newView);
    }
  };

  return (
    <div>
      <Header />
      <Filter
        stateFilter={stateFilter}
        setStateFilter={setStateFilter}
        commodityFilter={commodityFilter}
        setCommodityFilter={setCommodityFilter}
        districtFilter={districtFilter}
        setDistrictFilter={setDistrictFilter}
      />
      
      <section className="flex my-4 px-4 gap-3">
        <div className="w-15 min-w-max table-auto text-left">
          <Table filteredData={filteredData} />
        </div>
        {/* <div style={{ flex: 1 }}>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleViewChange}
            aria-label="chart view"
            className="mb-4"
          >
            <ToggleButton value="line" aria-label="line chart">
              Line Chart
            </ToggleButton>
            <ToggleButton value="heatmap" aria-label="heatmap">
              Heatmap
            </ToggleButton>
          </ToggleButtonGroup>
          {view === 'line' ? (
            <LineChart filteredData={filteredData} />
          ) : (
            <HeatmapChart filteredData={filteredData} />
          )}
        </div> */}
      </section>
    </div>
  );
}
