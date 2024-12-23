// // // import { useEffect, useRef } from "react";
// // // import * as d3 from "d3";
// // // import * as topojson from "topojson-client";
// // // import { data as topoJsonData } from "./districts_2011"; // Replace with your TopoJSON data file path

// // // // Define the props type
// // // interface TopoJsonMapProps {
// // //   stateCode: number; // Assuming stateCode is a number
// // // }

// // // const TopoJsonMap: React.FC<TopoJsonMapProps> = ({ stateCode }) => {
// // //   const svgRef = useRef<SVGSVGElement | null>(null);

// // //   useEffect(() => {
// // //     const width = 960;
// // //     const height = 600;

// // //     const svg = d3.select(svgRef.current)
// // //       .attr("width", width)
// // //       .attr("height", height);

// // //     // Clear previous render
// // //     svg.selectAll("*").remove();

// // //     // Add background
// // //     svg.append("rect")
// // //       .attr("width", width)
// // //       .attr("height", height)
// // //       .style("fill", "white");

// // //     const g = svg.append("g");

// // //     // Convert TopoJSON to GeoJSON
// // //     const geoJsonData = topojson.feature(topoJsonData, topoJsonData.objects.districts_2011);

// // //     // Filter districts based on state_code
// // //     const filteredFeatures = stateCode === 0
// // //       ? geoJsonData.features  // Show whole map if stateCode is 0
// // //       : geoJsonData.features.filter(district => district.properties.state_code === stateCode); // Filter by stateCode

// // //     // Define projection and path
// // //     const projection = d3.geoMercator()
// // //       .fitSize([width, height], { type: "FeatureCollection", features: filteredFeatures });

// // //     const path = d3.geoPath().projection(projection);

// // //     // Plot the map with filtered districts
// // //     g.selectAll("path")
// // //       .data(filteredFeatures)
// // //       .enter()
// // //       .append("path")
// // //       .attr("d", path)
// // //       .attr("fill", "#808080")
// // //       .attr("stroke", "#000")
// // //       .attr("stroke-width", 0.5)
// // //       .on("mouseenter", function () {
// // //         d3.select(this).attr("fill", "#000");
// // //       })
// // //       .on("mouseleave", function () {
// // //         d3.select(this).attr("fill", "#808080");
// // //       });
// // //   }, [stateCode]); // Re-run when the stateCode changes

// // //   return <svg ref={svgRef}></svg>;
// // // };

// // // export default TopoJsonMap;

// // // // import { useEffect, useRef } from "react";
// // // // import * as d3 from "d3";
// // // // import * as topojson from "topojson-client";
// // // // import { data as topoJsonData } from "./districts_2011"; // Replace with your TopoJSON data file path

// // // // // Define the props type
// // // // interface TopoJsonMapProps {
// // // //   stateCode: number; // Assuming stateCode is a number
// // // // }

// // // // // Define the structure of the TopoJSON data matching Topology
// // // // interface TopoJsonData {
// // // //   type: "Topology"; // The type should be 'Topology' to match topojson-client
// // // //   arcs: number[][][];
// // // //   transform: {
// // // //     scale: [number, number]; // Ensure this is a tuple with exactly two numbers
// // // //     translate: number[];
// // // //   };
// // // //   objects: {
// // // //     districts_2011: {
// // // //       type: "GeometryCollection"; // or another type depending on your data
// // // //       geometries: any[]; // Replace with the actual geometry type if known
// // // //     };
// // // //   };
// // // // }

// // // // // Type assertion to cast the imported TopoJSON data to the correct type
// // // // const topology = topoJsonData as TopoJsonData;

// // // // const TopoJsonMap: React.FC<TopoJsonMapProps> = ({ stateCode }) => {
// // // //   const svgRef = useRef<SVGSVGElement | null>(null);

// // // //   useEffect(() => {
// // // //     const width = 960;
// // // //     const height = 600;

// // // //     const svg = d3.select(svgRef.current)
// // // //       .attr("width", width)
// // // //       .attr("height", height);

// // // //     // Clear previous render
// // // //     svg.selectAll("*").remove();

// // // //     // Add background
// // // //     svg.append("rect")
// // // //       .attr("width", width)
// // // //       .attr("height", height)
// // // //       .style("fill", "white");

// // // //     const g = svg.append("g");
    
// // // //     // Convert TopoJSON to GeoJSON
// // // //     const geoJsonData = topojson.feature(topology, topology.objects.districts_2011);

// // // //     // Filter districts based on state_code
// // // //     const filteredFeatures = stateCode === 0
// // // //       ? geoJsonData.features  // Show whole map if stateCode is 0
// // // //       : geoJsonData.features.filter(district => district.properties.state_code === stateCode); // Filter by stateCode

// // // //     // Define projection and path
// // // //     const projection = d3.geoMercator()
// // // //       .fitSize([width, height], { type: "FeatureCollection", features: filteredFeatures });

// // // //     const path = d3.geoPath().projection(projection);

// // // //     // Plot the map with filtered districts
// // // //     g.selectAll("path")
// // // //       .data(filteredFeatures)
// // // //       .enter()
// // // //       .append("path")
// // // //       .attr("d", path)
// // // //       .attr("fill", "#808080")
// // // //       .attr("stroke", "#000")
// // // //       .attr("stroke-width", 0.5)
// // // //       .on("mouseenter", function () {
// // // //         d3.select(this).attr("fill", "#000");
// // // //       })
// // // //       .on("mouseleave", function () {
// // // //         d3.select(this).attr("fill", "#808080");
// // // //       });
// // // //   }, [stateCode]); // Re-run when the stateCode changes

// // // //   return <svg ref={svgRef}></svg>;
// // // // };

// // // // export default TopoJsonMap;

// // import { useEffect, useRef } from "react";
// // import * as d3 from "d3";
// // import * as topojson from "topojson-client";
// // import { data as topoJsonData } from "./districts_2011"; // Replace with your TopoJSON data file path

// // // Define the props type
// // interface TopoJsonMapProps {
// //   stateCode: number; // Assuming stateCode is a number
// // }

// // const TopoJsonMap: React.FC<TopoJsonMapProps> = ({ stateCode }) => {
// //   const svgRef = useRef<SVGSVGElement | null>(null);

// //   useEffect(() => {
// //     const width = 960;
// //     const height = 600;

// //     const svg = d3.select(svgRef.current)
// //       .attr("width", width)
// //       .attr("height", height);

// //     // Clear previous render
// //     svg.selectAll("*").remove();

// //     // Add background
// //     svg.append("rect")
// //       .attr("width", width)
// //       .attr("height", height)
// //       .style("fill", "white");

// //     const g = svg.append("g");

// //     // Convert TopoJSON to GeoJSON
// //     const geoJsonData = topojson.feature(topoJsonData, topoJsonData.objects.districts_2011);

// //     // Filter districts based on state_code
// //     const filteredFeatures = stateCode === 0
// //       ? geoJsonData.features  // Show whole map if stateCode is 0
// //       : geoJsonData.features.filter(district => district.properties.state_code === stateCode); // Filter by stateCode

// //     // Define projection and path
// //     const projection = d3.geoMercator()
// //       .fitSize([width, height], { type: "FeatureCollection", features: filteredFeatures });

// //     const path = d3.geoPath().projection(projection);

// //     // Plot the map with filtered districts
// //     g.selectAll("path")
// //       .data(filteredFeatures)
// //       .enter()
// //       .append("path")
// //       .attr("d", path)
// //       .attr("fill", "#808080")
// //       .attr("stroke", "#000")
// //       .attr("stroke-width", 0.5)
// //       .on("mouseenter", function () {
// //         d3.select(this).attr("fill", "#000");
// //       })
// //       .on("mouseleave", function () {
// //         d3.select(this).attr("fill", "#808080");
// //       });
// //   }, [stateCode]); // Re-run when the stateCode changes

// //   return <svg ref={svgRef}></svg>;
// // };

// // export default TopoJsonMap;

// import { useEffect, useRef } from "react";
// import * as d3 from "d3";
// import * as topojson from "topojson-client";
// import { data as topoJsonData } from "./districts_2011"; // Replace with your TopoJSON data file path

// // Define the custom types that match the expected structure
// interface GeoJsonProperties {
//   area_id: number;
//   level: number;
//   state_code: number;
//   district_name: string;
// }

// interface GeometryObject {
//   arcs: number[][];
//   type: string;
//   properties: GeoJsonProperties;
// }

// interface GeometryCollection {
//   type: "GeometryCollection";
//   geometries: GeometryObject[];
// }

// interface Topology {
//   type: "Topology";
//   arcs: number[][][];
//   transform: {
//     scale: number[];
//     translate: number[];
//   };
//   objects: {
//     districts_2011: GeometryCollection;
//   };
// }

// // Define the props type
// interface TopoJsonMapProps {
//   stateCode: number; // Assuming stateCode is a number
// }

// const TopoJsonMap: React.FC<TopoJsonMapProps> = ({ stateCode }) => {
//   const svgRef = useRef<SVGSVGElement | null>(null);

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
//     const geoJsonData = topojson.feature(
//       topoJsonData as Topology, // Cast to Topology type
//       topoJsonData.objects.districts_2011
//     );

//     // Filter districts based on state_code
//     const filteredFeatures = stateCode === 0
//       ? geoJsonData.features  // Show whole map if stateCode is 0
//       : geoJsonData.features.filter(district => district.properties.state_code === stateCode); // Filter by stateCode

//     // Define projection and path
//     const projection = d3.geoMercator()
//       .fitSize([width, height], { type: "FeatureCollection", features: filteredFeatures });

//     const path = d3.geoPath().projection(projection);

//     // Plot the map with filtered districts
//     g.selectAll("path")
//       .data(filteredFeatures)
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
//   }, [stateCode]); // Re-run when the stateCode changes

//   return <svg ref={svgRef}></svg>;
// };

// export default TopoJsonMap;
import { useEffect, useRef } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { data as topoJsonData } from "./districts_2011"; // Replace with your TopoJSON data file path

const TopoJsonMap = ({ stateCode }) => {
  const svgRef = useRef(null);

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
