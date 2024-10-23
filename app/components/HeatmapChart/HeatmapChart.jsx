// "use client";
// import React from 'react';
// import { Chart, registerables } from 'chart.js';
// import { Scatter } from 'react-chartjs-2';

// Chart.register(...registerables);

// const HeatmapChart = ({ filteredData }) => {
//   // Prepare data for the heatmap
//   const states = Array.from(new Set(filteredData.map(d => d.state)));
//   const commodities = Array.from(new Set(filteredData.map(d => d.commodity)));

//   const data = {
//     datasets: [{
//       label: 'Commodity Prices',
//       data: filteredData.map(entry => ({
//         x: commodities.indexOf(entry.commodity), // X-axis value (index of the commodity)
//         y: states.indexOf(entry.state),          // Y-axis value (index of the state)
//         r: entry.price / 10                       // Radius size based on price (adjust as needed)
//       })),
//       backgroundColor: 'rgba(75, 192, 192, 0.6)',
//       hoverBackgroundColor: 'rgba(75, 192, 192, 1)',
//     }],
//   };

//   const options = {
//     scales: {
//       x: {
//         type: 'linear', // Use 'linear' for scatter chart
//         position: 'bottom',
//         title: {
//           display: true,
//           text: 'Commodities',
//         },
//         ticks: {
//           callback: (value) => commodities[value], // Show commodity names on x-axis
//         },
//       },
//       y: {
//         type: 'linear', // Use 'linear' for scatter chart
//         position: 'left',
//         title: {
//           display: true,
//           text: 'States',
//         },
//         ticks: {
//           callback: (value) => states[value], // Show state names on y-axis
//         },
//       },
//     },
//     plugins: {
//       tooltip: {
//         callbacks: {
//           label: (context) => {
//             const { r } = context.raw;
//             return `Price: ${r * 10}`; // Display price based on radius
//           },
//         },
//       },
//     },
//   };

//   return (
//     <div>
//       <h2>Heatmap Chart</h2>
//       <Scatter data={data} options={options} />
//     </div>
//   );
// };

// export default HeatmapChart;

"use client";
import React from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { useMemo } from 'react';
import 'leaflet/dist/leaflet.css';

// Example GeoJSON data for Indian states
const indiaStatesGeoJSON = [
  // Include the GeoJSON data for Indian states here
  // Example: {"type": "Feature", "properties": {"name": "State Name", "price": 300}, "geometry": {...}}
];

const getColor = (price) => {
  return price > 500 ? '#800026' :
         price > 400 ? '#BD0026' :
         price > 300 ? '#E31A1C' :
         price > 200 ? '#FC4E2A' :
         price > 100 ? '#FD8D3C' :
         price > 0   ? '#FEB24C' :
                        '#FFEDA0';
};

const style = (feature) => {
  return {
    fillColor: getColor(feature.properties.price), // Use the price to determine color
    weight: 1,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7,
  };
};

const onEachFeature = (feature, layer) => {
  layer.bindPopup(`<h3>${feature.properties.name}</h3><p>Price: ${feature.properties.price}</p>`);
};

const HeatmapChart = ({ filteredData }) => {
  // Prepare GeoJSON data with prices
  const geoJSONData = useMemo(() => {
    return indiaStatesGeoJSON.map(state => {
      const stateData = filteredData.find(d => d.state === state.properties.name);
      return {
        ...state,
        properties: {
          ...state.properties,
          price: stateData ? stateData.price : 0, // Set price to 0 if no data
        },
      };
    });
  }, [filteredData]);

  return (
    <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "600px", width: "100%" }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON data={geoJSONData} style={style} onEachFeature={onEachFeature} />
    </MapContainer>
  );
};

export default HeatmapChart;
