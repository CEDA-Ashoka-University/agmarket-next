// import { useEffect } from 'react';
// import * as d3 from 'd3';

// interface DataEntry {
//   date: string;
//   state: string;
//   commodity: string;
//   price: number;
// }

// interface LineChartProps {
//   filteredData: DataEntry[];
// }

// const LineChart: React.FC<LineChartProps> = ({ filteredData }) => {
//   useEffect(() => {
//     // Select the SVG element
//     const svg = d3.select('#chart')
//       .attr('width', 600)
//       .attr('height', 400);

//     // Clear previous chart
//     svg.selectAll('*').remove();

//     // Define margins and dimensions
//     const margin = { top: 20, right: 30, bottom: 40, left: 50 };
//     const width = +svg.attr('width') - margin.left - margin.right;
//     const height = +svg.attr('height') - margin.top - margin.bottom;

//     const chartArea = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

//     // Parse the date
//     const parseDate = d3.timeParse('%Y-%m-%d');

//     // Scale functions
//     const x = d3.scaleTime()
//       .domain(d3.extent(filteredData, (d) => parseDate(d.date)) as [Date, Date])
//       .range([0, width]);

//     const y = d3.scaleLinear()
//       .domain([0, d3.max(filteredData, (d) => d.price) || 0])
//       .range([height, 0]);

//     // Axes
//     const xAxis = d3.axisBottom(x).ticks(6);
//     const yAxis = d3.axisLeft(y);

//     chartArea.append('g')
//       .attr('transform', `translate(0,${height})`)
//       .call(xAxis);

//     chartArea.append('g').call(yAxis);

//     // Line generator
//     const line = d3.line<DataEntry>()
//       .x((d) => x(parseDate(d.date)!)) // Ensure date is parsed correctly
//       .y((d) => y(d.price));

//     // Append line path
//     chartArea.append('path')
//       .datum(filteredData)
//       .attr('fill', 'none')
//       .attr('stroke', 'steelblue')
//       .attr('stroke-width', 1.5)
//       .attr('d', line);

//   }, [filteredData]);

//   return <svg id="chart"></svg>;
// };

// export default LineChart;
import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { Card, Typography } from "@material-tailwind/react";

// import { Card, Typography } from '@mui/material';  // Assuming you're using MUI for styling
Chart.register(...registerables);

const LineChart = ({ filteredData }) => {
  // Preparing data for the chart
  const labels = filteredData.map(data => data.date); // Extracting dates for x-axis
  const modalPrices = filteredData.map(data => data.price); // Modal Prices for y-axis
  const maxPrices = filteredData.map(data => data.price.max); // Max Prices for y-axis
  const minPrices = filteredData.map(data => data.price.min); // Min Prices for y-axis

  // Assuming you have a function that calculates the 7-day moving average from the data
  const movingAverage = calculateMovingAverage(modalPrices);

  const data = {
    labels, // Dates on x-axis
    datasets: [
      {
        label: 'Modal Price',
        data: modalPrices,
        borderColor: 'orange',
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
        },
      },
      y: {
        beginAtZero: false,
        title: {
          display: true,
          text: 'Price (₹)',
        },
        ticks: {
          callback: function (value) {
            return `₹ ${value}`;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };

  return (
    <Card className="p-6 shadow-lg">
      <div className="mb-4">
              </div>
      <div>
        <Line data={data} options={options} />
      </div>
    </Card>
  );
};

// Helper function to calculate 7-day moving average
const calculateMovingAverage = (prices, period = 7) => {
  let avg = [];
  for (let i = 0; i < prices.length; i++) {
    if (i < period - 1) {
      avg.push(null); // Not enough data for moving average
    } else {
      const sum = prices.slice(i - period + 1, i + 1).reduce((acc, val) => acc + val, 0);
      avg.push(sum / period);
    }
  }
  return avg;
};

export default LineChart;
