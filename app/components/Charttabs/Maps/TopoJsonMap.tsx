// import React, { useEffect, useRef } from "react";
// import * as d3 from "d3";
// import * as topojson from "topojson-client";
// import {data as topoJsonData} from "./districts_2011"; // Assuming this is your TopoJSON file

// const TopoJsonMap: React.FC = () => {
//   const svgRef = useRef<SVGSVGElement | null>(null);

//   useEffect(() => {
//     const width = 960;
//     const height = 600;

//     // Create SVG
//     const svg = d3.select(svgRef.current)
//       .attr("width", width)
//       .attr("height", height);

//     // Clear previous render
//     svg.selectAll("*").remove();

//     // Add a white background
//     svg.append("rect")
//       .attr("width", width)
//       .attr("height", height)
//       .style("fill", "white");

//     // Convert TopoJSON to GeoJSON
//     const geoJsonData = topojson.feature(topoJsonData, topoJsonData.objects.districts_2011);
//     console.log(geoJsonData)
//     // Create a projection and path generator
//     const projection = d3.geoMercator()
//       .fitSize([width, height], geoJsonData) // Automatically fit GeoJSON to SVG size
//       .center([85, 22]) // Adjust as needed to center the map
//       .scale(900); // Adjust for zoom level

//     const path = d3.geoPath().projection(projection);

//     // Bind GeoJSON data and create paths
//     svg.selectAll("path")
//       .data(geoJsonData.features)
//       .enter()
//       .append("path")
//       .attr("d", path as any) // Draw the path
//       .style("fill", "#ddd") // Default fill color
//       .style("stroke", "black");
//   }, []);

//   return <svg ref={svgRef}></svg>;
// };

// export default TopoJsonMap;

// import { useEffect, useRef } from "react";
// import * as d3 from "d3";
// import * as topojson from "topojson-client";
// import { data as topoJsonData } from "./districts_2011"; // Replace with your TopoJSON data file path

// const TopoJsonMap = () => {
//   const svgRef = useRef();

//   useEffect(() => {
//     const width = 960;
//     const height = 600;

//     const svg = d3.select(svgRef.current)
//       .attr("width", width)
//       .attr("height", height);

//     // Clear previous render
//     svg.selectAll("*").remove();

//     // Add background
//     svg.append("rect")
//       .attr("width", width)
//       .attr("height", height)
//       .style("fill", "white");

//     const g = svg.append("g");

//     // Convert TopoJSON to GeoJSON
//     const geoJsonData = topojson.feature(topoJsonData, topoJsonData.objects.districts_2011);

//     // Define projection and path
//     const projection = d3.geoMercator()
//       .fitSize([width, height], geoJsonData);

//     const path = d3.geoPath().projection(projection);

//     // Plot the map
//     g.selectAll("path")
//       .data(geoJsonData.features)
//       .enter()
//       .append("path")
//       .attr("d", path)
//       .attr("fill", "#808080")
//       .attr("stroke", "#000")
//       .attr("stroke-width", 0.5)
//       .on("mouseenter", function () {
//         d3.select(this).attr("fill", "#000");
//       })
//       .on("mouseleave", function () {
//         d3.select(this).attr("fill", "#808080");
//       });
//   }, []);

//   return <svg ref={svgRef}></svg>;
// };

// export default TopoJsonMap;

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { data as topoJsonData } from "./districts_2011"; // Replace with your TopoJSON data file path

const TopoJsonMap = ({ stateCode }) => {
  const svgRef = useRef();

  useEffect(() => {
    const width = 960;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Clear previous render
    svg.selectAll("*").remove();

    // Add background
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "white");

    const g = svg.append("g");

    // Convert TopoJSON to GeoJSON
    const geoJsonData = topojson.feature(topoJsonData, topoJsonData.objects.districts_2011);

    // Filter districts based on state_code
    // const filteredFeatures = geoJsonData.features.filter(district => district.properties.state_code === stateCode);
    const filteredFeatures = stateCode === 0
      ? geoJsonData.features  // Show whole map if stateCode is 0
      : geoJsonData.features.filter(district => district.properties.state_code === stateCode); // Filter by stateCode
    // Define projection and path
    const projection = d3.geoMercator()
      .fitSize([width, height], { type: "FeatureCollection", features: filteredFeatures });

    const path = d3.geoPath().projection(projection);

    // Plot the map with filtered districts
    g.selectAll("path")
      .data(filteredFeatures)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#808080")
      .attr("stroke", "#000")
      .attr("stroke-width", 0.5)
      .on("mouseenter", function () {
        d3.select(this).attr("fill", "#000");
      })
      .on("mouseleave", function () {
        d3.select(this).attr("fill", "#808080");
      });
  }, [stateCode]); // Re-run when the stateCode changes

  return <svg ref={svgRef}></svg>;
};

export default TopoJsonMap;
