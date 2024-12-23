
// import React, { useEffect, useRef } from "react";
// import * as d3 from "d3";
// import { data as geoJsonData } from "./states_2019"// Assuming this is GeoJSON, not TopoJSON
// import { FeatureCollection, Geometry, GeoJsonProperties  } from 'geojson';
// // import { FeatureCollection, } from 'geojson';

// interface HeatMapData {
//   state_id: string; // Ensure state_id matches the type in your data (number or string)
//   ModalPrice: number;
//   state_name: string;
// }

// const HeatMap: React.FC<{ heatMapData: HeatMapData[] }> = ({ heatMapData }) => {
//   const svgRef = useRef<SVGSVGElement | null>(null);

//   useEffect(() => {
//     const width = 960;
//     const height = 600;

//     // Create SVG
//     const svg = d3.select(svgRef.current)
//       .attr("width", width)
//       .attr("height", height)
//       .style("background", "yellow");;

//     // Clear previous render
//     svg.selectAll("*").remove();

//     // Add a white background
//     svg.append("rect")
//       .attr("width", width)
//       .attr("height", height)
//       .style("fill", "white");

//     // Append a group element
//     const g = svg.append("g");

//     // Create an object for mapping state codes to ModalPrice values
//     const modalPriceByState: Record<string, number> = {};
//     heatMapData.forEach((d) => {
//       modalPriceByState[d.state_id] = d.ModalPrice;
//     });

//     // Define a color scale for the heatmap
//     // const color = d3
//     //   .scaleQuantize<number>()
//     //   .domain([
//     //     d3.min(heatMapData, (d) => d.ModalPrice) || 0,
//     //     d3.max(heatMapData, (d) => d.ModalPrice) || 0,
//     //   ])
//     //   .range(d3.schemeBlues[9]);
//     const color = d3
//     .scaleQuantize<string>() // The range will be an array of strings (color codes)
//     .domain([
//       d3.min(heatMapData, (d) => d.ModalPrice) || 0,
//       d3.max(heatMapData, (d) => d.ModalPrice) || 0,
//     ])
//     .range(d3.schemeBlues[9]); // Pass the color array directly here
  
  


//     // // Directly use geoJsonData if it is already in GeoJSON format
//     // const states = geoJsonData;

//     // // // Create a path generator
//     // // const path = d3.geoPath().projection(
//     // //   d3.geoMercator().fitSize([width, height], states)
//     // // );
//     //     // Create a projection and path generator
//     //     const projection = d3
//     //     .geoMercator()
//     //     .fitSize([width, height], states) // Automatically fit GeoJSON to SVG size
//     //     .center([85, 22]) // Adjust as needed to center the map
//     //     .scale(900); // Adjust for zoom level
//     // Directly use geoJsonData if it is already in GeoJSON format
//         const states = geoJsonData.features; // Use only the 'features' array from the GeoJSON
// // Now declare `states` as a FeatureCollection with the correct type.
// // const states: FeatureCollection<Geometry, GeoJsonProperties> = data;

// // Create a projection and path generator
// const projection = d3
//     .geoMercator()
//     .fitSize([width, height], states) // Automatically fit GeoJSON to SVG size
//     .center([85, 22]) // Adjust as needed to center the map
//     .scale(900); // Adjust for zoom level

//         const path = d3.geoPath().projection(projection);

//     // Bind GeoJSON data and create paths
//     svg.selectAll("path")
//       .data(states.features) // Corrected line: use `states.features` if `geoJsonData` is already GeoJSON
//       .enter()
//       .append("path")
//       .attr("d", path as any) // Draw the path
//       .style("fill", (d: any) => {
//         // Match state_code from GeoJSON with state_id from heatMapData
//         const modalPrice = modalPriceByState[d.properties.state_code];
//         return modalPrice ? color(modalPrice) : "#FFFF"; // Default to gray if no data
//       })
//       .style("stroke", "black");

//     // Add a tooltip for interactivity
//     const tooltip = d3
//       .select("body")
//       .append("div")
//       .style("position", "absolute")
//       .style("visibility", "hidden")
//       .style("background", "#fff")
//       .style("padding", "5px")
//       .style("border", "1px solid #ccc");

//     svg.selectAll("path")
//       .on("mouseover", function (event, d: any) {
//         const stateName = d.properties.state_name || "Unknown State";
//         const modalPrice = modalPriceByState[d.properties.state_code] || "No data";
//         tooltip
//           .style("visibility", "visible")
//           .html(`<strong>${stateName}</strong><br>Modal Price: ${modalPrice}`);
//       })
//       .on("mousemove", function (event) {
//         tooltip
//           .style("top", event.pageY + 10 + "px")
//           .style("left", event.pageX + 10 + "px");
//       })
//       .on("mouseout", function () {
//         tooltip.style("visibility", "hidden");
//       });
//   }, [heatMapData]);

//   return <svg ref={svgRef}></svg>;
// };

// export default HeatMap;



import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { data as geoJsonData } from "./states_2019"; // Assuming this is GeoJSON, not TopoJSON
import { FeatureCollection, Geometry, GeoJsonProperties } from "geojson";

interface HeatMapData {
  state_id: string; // Ensure state_id matches the type in your data (number or string)
  ModalPrice: number;
  state_name: string;
}

const HeatMap: React.FC<{ heatMapData: HeatMapData[] }> = ({ heatMapData }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const width = 960;
    const height = 600;

    // Create SVG
    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .style("background", "yellow");

    // Clear previous render
    svg.selectAll("*").remove();

    // Add a white background
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "white");

    // Append a group element
    const g = svg.append("g");

    // Create an object for mapping state codes to ModalPrice values
    const modalPriceByState: Record<string, number> = {};
    heatMapData.forEach((d) => {
      modalPriceByState[d.state_id] = d.ModalPrice;
    });

    // Define a color scale for the heatmap
    const color = d3
      .scaleQuantize<string>() // The range will be an array of strings (color codes)
      .domain([
        d3.min(heatMapData, (d) => d.ModalPrice) || 0,
        d3.max(heatMapData, (d) => d.ModalPrice) || 0,
      ])
      .range(d3.schemeBlues[9]); // Pass the color array directly here

    // Use Type Assertion to tell TypeScript that geoJsonData is of type FeatureCollection
    const states = geoJsonData as FeatureCollection<Geometry, GeoJsonProperties>; // Type assertion

    // Create a projection and path generator
    const projection = d3
      .geoMercator()
      .fitSize([width, height], states) // Automatically fit GeoJSON to SVG size
      .center([85, 22]) // Adjust as needed to center the map
      .scale(900); // Adjust for zoom level

    const path = d3.geoPath().projection(projection);

    // Bind GeoJSON data and create paths
    svg.selectAll("path")
      .data(states.features) // Use `states.features` from the GeoJSON object
      .enter()
      .append("path")
      .attr("d", path as any) // Draw the path
      .style("fill", (d: any) => {
        // Match state_code from GeoJSON with state_id from heatMapData
        const modalPrice = modalPriceByState[d.properties.state_code];
        return modalPrice ? color(modalPrice) : "#FFFF"; // Default to gray if no data
      })
      .style("stroke", "black");

    // Add a tooltip for interactivity
    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "#fff")
      .style("padding", "5px")
      .style("border", "1px solid #ccc");

    svg.selectAll("path")
      .on("mouseover", function (event, d: any) {
        const stateName = d.properties.state_name || "Unknown State";
        const modalPrice = modalPriceByState[d.properties.state_code] || "No data";
        tooltip
          .style("visibility", "visible")
          .html(`<strong>${stateName}</strong><br>Modal Price: ${modalPrice}`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", event.pageY + 10 + "px")
          .style("left", event.pageX + 10 + "px");
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
      });
  }, [heatMapData]);

  return <svg ref={svgRef}></svg>;
};

export default HeatMap;
