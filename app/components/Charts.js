'use client'
// const Charts = () => {
//   return (
//     <>
//       <section>
//         <div className="flex m-4 gap-2">
//           <div className="flex-1 px-2 justify-center w-16 bg-gray-700 shadow rounded h-300px">
//             <div className="">
//               <p className="text-gray-900 font-bold">Total returns</p>
//               <p className="py-4 font-bold">$30,000 </p>
//               <p className="text-green-300">+34.5%</p>
//             </div>
//           </div>
//           <div className="flex-1 px-2 justify-center w-16 bg-gray-700 shadow rounded max-h-300px">
//             <div className="">
//               <p className="text-gray-900 font-bold">Total sales</p>
//               <p className="py-4 font-bold">$30,000 </p>
//               <p className="text-green-300">+34.5%</p>
//             </div>
//           </div>
//           <div className="flex-1 px-2 justify-center w-16  bg-gray-700 shadow rounded max-h-300px">
//             <div className="">
//               <p className="text-gray-900 font-bold">Total subscriptions</p>
//               <p className="py-4 font-bold">$30,000 </p>
//               <p className="text-green-300">+34.5%</p>
//             </div>
//           </div>
//           <div className="flex-1 px-2 justify-center w-16  bg-gray-700 shadow rounded h-300px">
//             <div className="">
//               <p className="text-gray-900 font-bold">Total returns</p>
//               <p className="py-4 font-bold ">$30,000 </p>
//               <p className="text-green-300">+34.5%</p>
//             </div>
//           </div>
//         </div>
//       </section>

//       <section className="flex my-4 px-4 gap-3">
//         <div className="w-1/2 h-[300px] bg-gray-700 rounded"></div>

//         <div className="w-1/2 h-[300px] bg-gray-700 rounded"></div>
//       </section>

//       <section className="flex my-4 px-4 gap-2">
//         <div className=" w-1/3 h-[250px] bg-gray-700 rounded"></div>
//         <div className=" w-1/3 h-[250px] bg-gray-700 rounded"></div>
//         <div className=" w-1/3 h-[250px] bg-gray-700 rounded"></div>
//       </section>
//     </>
//   );
// };

// export default Charts;
import { useEffect, useState } from 'react';
import * as d3 from 'd3';

const dummyData = [
  { date: '2024-10-01', state: 'Bihar', commodity: 'wheat', price: 210 },
  { date: '2024-10-01', state: 'Bihar', commodity: 'rice', price: 160 },
  { date: '2024-10-01', state: 'UP', commodity: 'wheat', price: 220 },
  { date: '2024-10-01', state: 'UP', commodity: 'rice', price: 170 },
  { date: '2024-10-01', state: 'Haryana', commodity: 'wheat', price: 230 },
  { date: '2024-10-01', state: 'Haryana', commodity: 'rice', price: 180 },
  { date: '2024-10-02', state: 'Bihar', commodity: 'wheat', price: 215 },
  { date: '2024-10-02', state: 'Bihar', commodity: 'rice', price: 165 },
  { date: '2024-10-02', state: 'UP', commodity: 'wheat', price: 225 },
  { date: '2024-10-02', state: 'UP', commodity: 'rice', price: 175 },
  { date: '2024-10-02', state: 'Haryana', commodity: 'wheat', price: 235 },
  { date: '2024-10-02', state: 'Haryana', commodity: 'rice', price: 185 },
  { date: '2024-10-03', state: 'Bihar', commodity: 'wheat', price: 220 },
  { date: '2024-10-03', state: 'Bihar', commodity: 'rice', price: 170 },
  { date: '2024-10-03', state: 'UP', commodity: 'wheat', price: 230 },
  { date: '2024-10-03', state: 'UP', commodity: 'rice', price: 180 },
  { date: '2024-10-03', state: 'Haryana', commodity: 'wheat', price: 240 },
  { date: '2024-10-03', state: 'Haryana', commodity: 'rice', price: 190 },
  { date: '2024-10-04', state: 'Bihar', commodity: 'wheat', price: 225 },
  { date: '2024-10-04', state: 'Bihar', commodity: 'rice', price: 175 },
  { date: '2024-10-04', state: 'UP', commodity: 'wheat', price: 235 },
  { date: '2024-10-04', state: 'UP', commodity: 'rice', price: 185 },
  { date: '2024-10-04', state: 'Haryana', commodity: 'wheat', price: 245 },
  { date: '2024-10-04', state: 'Haryana', commodity: 'rice', price: 195 },
  { date: '2024-10-05', state: 'Bihar', commodity: 'wheat', price: 230 },
  { date: '2024-10-05', state: 'Bihar', commodity: 'rice', price: 180 },
  { date: '2024-10-05', state: 'UP', commodity: 'wheat', price: 240 },
  { date: '2024-10-05', state: 'UP', commodity: 'rice', price: 190 },
  { date: '2024-10-05', state: 'Haryana', commodity: 'wheat', price: 250 },
  { date: '2024-10-05', state: 'Haryana', commodity: 'rice', price: 200 }
];

const LineChart = () => {
  const [filteredData, setFilteredData] = useState(dummyData);
  const [stateFilter, setStateFilter] = useState('Bihar');
  const [commodityFilter, setCommodityFilter] = useState('wheat');
  const [availableStates, setAvailableStates] = useState([]);
  const [availableCommodities, setAvailableCommodities] = useState([]);

  // Extract unique states and commodities from the dataset
  useEffect(() => {
    const uniqueStates = [...new Set(dummyData.map(d => d.state))];
    const uniqueCommodities = [...new Set(dummyData.map(d => d.commodity))];
    setAvailableStates(uniqueStates);
    setAvailableCommodities(uniqueCommodities);
  }, []);

  // Dynamically update the filtered data when filters are changed
  useEffect(() => {
    const newFilteredData = dummyData.filter(d =>
      d.state === stateFilter && d.commodity === commodityFilter
    );
    setFilteredData(newFilteredData);
  }, [stateFilter, commodityFilter]);

  // Redraw chart when filteredData changes
  useEffect(() => {
    const svg = d3.select('#chart')
      .attr('width', 600)
      .attr('height', 400);
    
    // Clear the previous chart
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const width = svg.attr('width') - margin.left - margin.right;
    const height = svg.attr('height') - margin.top - margin.bottom;

    const chartArea = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(filteredData, d => new Date(d.date)))
      .range([0, width]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(filteredData, d => d.price)])
      .range([height, 0]);

    const xAxis = d3.axisBottom(x).ticks(6);
    const yAxis = d3.axisLeft(y);

    chartArea.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    chartArea.append('g')
      .call(yAxis);

    const line = d3.line()
      .x(d => x(new Date(d.date)))
      .y(d => y(d.price));

    chartArea.append('path')
      .datum(filteredData)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);
  }, [filteredData]);

  return (
    <div>
      <div>
        <label>
          State:
          <select value={stateFilter} onChange={e => setStateFilter(e.target.value)}>
            {availableStates.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </label>

        <label>
          Commodity:
          <select value={commodityFilter} onChange={e => setCommodityFilter(e.target.value)}>
            {availableCommodities.map(commodity => (
              <option key={commodity} value={commodity}>{commodity}</option>
            ))}
          </select>
        </label>
      </div>

      <svg id="chart"></svg>
    </div>
  );
};

export default LineChart;
