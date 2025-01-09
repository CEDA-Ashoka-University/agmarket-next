


// import { useEffect, useRef, useState } from "react";
// import * as d3 from "d3";
// import * as topojson from "topojson-client"; // TopoJSON for district data
// import { data as districtTopoJsonData } from "./districts_2011"; // TopoJSON
// import { data as stateGeoJsonData } from "./states_2019"; // GeoJSON
// import { data as stateTopoJsonData } from "./india_topo"
// import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from "@nextui-org/react"; // Added NextUI imports

// const TopoJsonMap = ({ initialMapData, stateCode }) => {
//   const svgRef = useRef(null);
//   const legendRef = useRef(null); // Ref for legend
//   const [filteredMapData, setFilteredMapData] = useState(initialMapData?.priceData || []);
//   const [selectedCat, setSelectedCat] = useState(""); // State for dropdown selection
//   const [highestPrice, setHighestPrice] = useState(null);
//   const [lowestPrice, setLowestPrice] = useState(null);
//   const [stateName, setstateName] = useState(null);
//   console.log("mapdata12",initialMapData?.priceData)


//   useEffect(() => {
//     const width = 910;
//     const height = 400;

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

//     // Safely access data
//     const mapData = filteredMapData;
//     if (!mapData.length) {
//       console.warn("No data available for map rendering.");
//       return;
//     }
//     console.log("mapdata12",initialMapData)
    
//     // Build modal price mapping
//     const modalPriceByRegion = {};
//     mapData.forEach((d) => {
//       const key = stateCode === "0" ? d.state_id : d.district_id;
//       if (key && d.ModalPrice) {
//         modalPriceByRegion[key] = d.ModalPrice;
//       }
//     });

//     const modalPrices = Object.values(modalPriceByRegion);

//     const colorList = ['#F5B49A', '#F28765', '#F07368', '#F05C6B', '#C2284C'];
//     const color = d3.scaleQuantize()
//       .domain([d3.min(modalPrices) || 0, d3.max(modalPrices) || 1])
//       .range(colorList);

//     // Select GeoJSON or TopoJSON data based on stateCode
//     let geoJsonData;
//     if (stateCode === "0") {
//       geoJsonData = topojson.feature(
//         stateTopoJsonData,
//         stateTopoJsonData.objects.india
//       );
//     } else {
//       geoJsonData = topojson.feature(
//         districtTopoJsonData,
//         districtTopoJsonData.objects.districts_2011
//       );
//     }

//     const filteredFeatures = stateCode === "0"
//       ? geoJsonData.features
//       : geoJsonData.features.filter(
//         (district) => district.properties.state_code === Number(stateCode)
//       );
//     console.log("check the filteredFeatures", filteredFeatures)
//     // Define projection and path
//     const projection = d3.geoMercator();
//     const path = d3.geoPath().projection(projection);

//     // Center and scale map based on stateCode
//     if (stateCode === "0") {
//       const center = [78.9629, 22.5937];
//       const scale = 700;
//       projection.scale(scale).center(center).translate([width / 2, height / 2]);
//     } else {
//       const bounds = { type: "FeatureCollection", features: filteredFeatures };
//       projection.fitExtent([[0, 0], [width, height]], bounds);
//     }


//     //// ----------if we want to use fit extent to scale the map use the below code-----------
//     // Define projection and path
//     // const projection = d3.geoMercator();
//     // const path = d3.geoPath().projection(projection);

//     // // Center and scale map based on stateCode
//     // if (stateCode === "0") {
//     //   // Use fitExtent for the whole country
//     //   const bounds = {
//     //     type: "FeatureCollection",
//     //     features: geoJsonData.features, // Use all features for the country map
//     //   };
//     //   projection.fitExtent([[0, 0], [width, height]], bounds);
//     // } else {
//     //   // Use fitExtent for the selected state
//     //   const bounds = {
//     //     type: "FeatureCollection",
//     //     features: filteredFeatures, // Filtered features for the selected state
//     //   };
//     //   projection.fitExtent([[0, 0], [width, height]], bounds);
//     // }
//     ////////-----------------------///////////////////

//     // Draw the map
//     g.selectAll("path")
//       .data(filteredFeatures)
//       .enter()
//       .append("path")
//       .attr("d", path)
//       .attr("stroke", "#000")
//       .attr("stroke-width", 0.5)
//       .style("fill", (d) => {
//         const regionCode =
//           stateCode === "0"
//             ? d.properties.state_code || d.state_code // Check for state code at both levels
//             : d.properties.district_code || d.district_code; // Check for district code at both levels

//         console.log("regionCode", regionCode);
//         console.log("d:", d) // Debugging log
//         const modalPrice = modalPriceByRegion[regionCode];
//         return modalPrice ? color(modalPrice) : "#FFFFFF"; // Default to white for missing data
//       });


//     // Add tooltip
//     const tooltip = d3
//       .select("body")
//       .append("div")
//       .style("position", "absolute")
//       .style("visibility", "hidden")
//       .style("background", "#fff")
//       .style("padding", "5px")
//       .style("border", "1px solid #ccc")
//       .style("border-radius", "5px")
//       .style("font-size", "12px")
//       .style("box-shadow", "0px 4px 8px rgba(0, 0, 0, 0.2)");

//     svg.selectAll("path")
//       .on("mouseover", function (event, d) {
//         const regionName =
//           stateCode === "0"
//             ? d.properties.state_name
//             : d.properties.district_name;
//         const modalPrice =
//           modalPriceByRegion[
//           stateCode === "0"
//             ? d.properties.state_code
//             : d.properties.district_code
//           ] || "No data";

//         tooltip
//           .style("visibility", "visible")
//           .html(`<strong>${regionName}</strong><br>Modal Price: ${modalPrice}`);
//       })
//       .on("mousemove", function (event) {
//         tooltip
//           .style("top", `${event.pageY + 10}px`)
//           .style("left", `${event.pageX + 10}px`);
//       })
//       .on("mouseout", function () {
//         tooltip.style("visibility", "hidden");
//       });

//     // Calculate highest and lowest prices
//     const sortedPrices = Object.entries(modalPriceByRegion).sort((a, b) => b[1] - a[1]);
//     if (sortedPrices.length) {
//       const [highest, lowest] = [sortedPrices[0], sortedPrices[sortedPrices.length - 1]];
//       setHighestPrice({
//         name: stateCode === "0"
//           ? geoJsonData.features.find(f => f.properties.state_code === Number(highest[0]))?.properties.state_name
//           : geoJsonData.features.find(f => f.properties.district_code === Number(highest[0]))?.properties.district_name,
//         price: highest[1],
//       });
//       setLowestPrice({
//         name: stateCode === "0"
//           ? geoJsonData.features.find(f => f.properties.state_code === Number(lowest[0]))?.properties.state_name
//           : geoJsonData.features.find(f => f.properties.district_code === Number(lowest[0]))?.properties.district_name,
//         price: lowest[1],
//       });
//     }


//     // Add custom legend with gradient bar
//     const legendContainer = d3.select(legendRef.current);
//     legendContainer.selectAll("*").remove(); // Clear previous legend

//     const legendSvg = legendContainer.append("svg")
//       .attr("width", 300)
//       .attr("height", 60)
//       .style("font-family", "Arial, sans-serif");

//     // Gradient definition
//     const defs = legendSvg.append("defs");
//     const linearGradient = defs.append("linearGradient")
//       .attr("id", "gradient")
//       .attr("x1", "0%")
//       .attr("x2", "100%")
//       .attr("y1", "0%")
//       .attr("y2", "0%");

//     // Add color stops
//     color.range().forEach((colorValue, i) => {
//       linearGradient.append("stop")
//         .attr("offset", `${(i / (color.range().length - 1)) * 100}%`)
//         .attr("stop-color", colorValue);
//     });

//     // Draw the gradient bar
//     legendSvg.append("rect")
//       .attr("x", 20)
//       .attr("y", 20)
//       .attr("width", 200)
//       .attr("height", 20)
//       .style("fill", "url(#gradient)")
//       .attr("rx", 5);

//     // Add labels
//     const legendScale = d3.scaleLinear()
//       .domain(color.domain())
//       .range([20, 220]);

//     const legendAxis = d3.axisBottom(legendScale)
//       .tickSize(0)
//       .tickPadding(10)
//       .ticks(5)
//       .tickFormat(d3.format(".2s"));

//     legendSvg.append("g")
//       .attr("transform", "translate(0, 40)")
//       .call(legendAxis)
//       .call((g) => g.select(".domain").remove()); // Remove the axis line

//     // Add title for the legend
//     legendSvg.append("text")
//       .attr("x", 20)
//       .attr("y", 10)
//       .text("Heatmap: By Value")
//       .style("font-size", "12px")
//       .style("font-weight", "bold")
//       .style("fill", "#1A375F");

//     return () => tooltip.remove(); // Cleanup tooltip on component unmount
//   }, [stateCode, filteredMapData]);

//   const handleCatChange = (category) => {
//     setSelectedCat(category);
//     const updatedData = initialMapData?.priceData?.filter(
//       (item) => (item.month || item.date) === category
//     );
//     setFilteredMapData(updatedData || []);
//   };
//   // console.log("filteredMapData",filteredMapData)
//   // const handleCatChange = (event) => {
//   //   const selectedValue = event.target.value;
//   //   setSelectedCat(selectedValue);

//   //   const updatedData = initialMapData?.data?.filter(
//   //     (item) => (item.month || item.date) === selectedValue
//   //   );
//   //   setFilteredMapData(updatedData || []);
//   // };

//   const sortedCategories = [
//     ...new Set(
//       (initialMapData?.priceData || []).map((item) => item.month || item.date)
//     ),
//   ].sort((a, b) => new Date(b) - new Date(a)); // Sort in descending order by date

//   return (
//     <div style={{ display: "flex" }}>
//       <div style={{ flex: 2, position: "relative", padding: "10px" }}>
//         <div className="flex pl-10 pt-5 mb-4">
      //   <div className="flex gap-1.5 items-center text-sm font-medium text-[#1A375F] pr-4">
      //   <span >   
      //     <p>{filteredMapData[0]?.commodity_name} 
      //     <span className="mx-2 text-lg text-gray-400">•</span> 
      //        {filteredMapData[0]?.state_name} </p>
      //   </span>
      // </div>

          // <Dropdown>
          //   <DropdownTrigger>
          //     <Button className="flex items-center pl-2 bg-white text-[#1A375F] border border-[#1A375F] rounded-md px-4 py-2 text-sm hover:bg-gray-50 w-auto">
          //       <span className="mr-2">{selectedCat || "Select Date/Month"}</span>
          //       <svg
          //         className="w-4 h-4 text-gray-500 dark:text-gray-400"
          //         aria-hidden="true"
          //         xmlns="http://www.w3.org/2000/svg"
          //         fill="currentColor"
          //         viewBox="0 0 20 20"
          //       >
          //         <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
          //       </svg>
          //     </Button>


          //   </DropdownTrigger>
          //   <DropdownMenu className=" bg-white rounded-lg shadow dark:bg-gray-700 max-h-48 overflow-y-auto w-auto" aria-label="Category Select">
          //     {sortedCategories.map((category, idx) => (
          //       <DropdownItem className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white" key={idx} onClick={() => handleCatChange(category)}>
          //         {category}
          //       </DropdownItem>
          //     ))}
          //   </DropdownMenu>
          // </Dropdown>
//         </div>
//         <svg ref={svgRef} style={{ marginTop: "20px" }}></svg>
//         <div
//           ref={legendRef}
//           className="absolute top-10 right-10 border border-gray-300 shadow-md rounded-lg p-2 bg-white text-[#1A375F]"

//         ></div>
//       </div>
//       <div style={{ position: "absolute", top: "30%", left: "10px", minWidth: "200px", maxWidth: "300px" }}>
//         {highestPrice && (
//           <div className="max-w-sm bg-[#c2294c] border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
//             <strong className="text-white font-sans text-sm pl-4">Highest price</strong>
//             <div className="bg-white pl-4 pt-4 pb-4 pr-4 font-sans text-sm text-[#1A375F]">
//               <div >{highestPrice.name} • ₹{highestPrice.price.toLocaleString()}</div>
//             </div>
//           </div>
//         )}
//         {lowestPrice && (
//           <div className="bg-clip-padding max-w-sm bg-[#f5af95] border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" style={{ marginTop: "10px" }}>
//             <strong className="text-[#1A375F] font-sans text-sm pl-4 ">Lowest price</strong>
//             <div className="bg-white pl-4 pt-4 pb-4 pr-4 font-sans text-sm text-[#1A375F]">
//               <div>{lowestPrice.name} • ₹{lowestPrice.price.toLocaleString()}</div>
//             </div>
//           </div>
//         )}
//       </div>


//     </div>
//   );
// };

// export default TopoJsonMap;





import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { data as districtTopoJsonData } from "./districts_2011";
import { data as stateGeoJsonData } from "./states_2019";
import { data as stateTopoJsonData } from "./india_topo";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

const TopoJsonMap = ({ initialMapData, stateCode }) => {
  const svgRef = useRef(null);
  const legendRef = useRef(null);
  const [filteredMapData, setFilteredMapData] = useState(
    initialMapData?.priceData || []
  );
  const [selectedTab, setSelectedTab] = useState("Price");
  const [selectedCat, setSelectedCat] = useState("");
  const [highestPrice, setHighestPrice] = useState(null);
  const [lowestPrice, setLowestPrice] = useState(null);

  useEffect(() => {
    const width = 910;
    const height = 400;
    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);
    svg.selectAll("*").remove();

    svg.append("rect").attr("width", width).attr("height", height).style("fill", "white");
    const g = svg.append("g");

    if (!filteredMapData.length) {
      console.warn("No data available for map rendering.");
      return;
    }
    console.log("filtermap data qty and price",filteredMapData)
    const modalPriceByRegion = {};
    filteredMapData.forEach((d) => {
      const key = stateCode === "0" ? d.state_id : d.district_id;
      if (key && (d.ModalPrice|d.total_quantity)) {
        modalPriceByRegion[key] = d.ModalPrice|d.total_quantity;
      }
    });

    const modalPrices = Object.values(modalPriceByRegion);
    const colorList = ["#F5B49A", "#F28765", "#F07368", "#F05C6B", "#C2284C"];
    const color = d3
      .scaleQuantize()
      .domain([d3.min(modalPrices) || 0, d3.max(modalPrices) || 1])
      .range(colorList);

    let geoJsonData;
    if (stateCode === "0") {
      geoJsonData = topojson.feature(
        stateTopoJsonData,
        stateTopoJsonData.objects.india
      );
    } else {
      geoJsonData = topojson.feature(
        districtTopoJsonData,
        districtTopoJsonData.objects.districts_2011
      );
    }

    const filteredFeatures =
      stateCode === "0"
        ? geoJsonData.features
        : geoJsonData.features.filter(
            (district) => district.properties.state_code === Number(stateCode)
          );

    const projection = d3.geoMercator();
    const path = d3.geoPath().projection(projection);

    if (stateCode === "0") {
      const center = [78.9629, 22.5937];
      const scale = 700;
      projection.scale(scale).center(center).translate([width / 2, height / 2]);
    } else {
      const bounds = { type: "FeatureCollection", features: filteredFeatures };
      projection.fitExtent([[0, 0], [width, height]], bounds);
    }

    g.selectAll("path")
      .data(filteredFeatures)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("stroke", "#000")
      .attr("stroke-width", 0.5)
      .style("fill", (d) => {
        const regionCode =
          stateCode === "0"
            ? d.properties.state_code
            : d.properties.district_code;
        const modalPrice = modalPriceByRegion[regionCode];
        return modalPrice ? color(modalPrice) : "#FFFFFF";
      });

    const tooltip = d3
      .select("body")
      .append("div")
      .style("position", "absolute")
      .style("visibility", "hidden")
      .style("background", "#fff")
      .style("padding", "5px")
      .style("border", "1px solid #ccc")
      .style("border-radius", "5px")
      .style("font-size", "12px")
      .style("box-shadow", "0px 4px 8px rgba(0, 0, 0, 0.2)");

    svg
      .selectAll("path")
      .on("mouseover", function (event, d) {
        const regionName =
          stateCode === "0"
            ? d.properties.state_name
            : d.properties.district_name;
        const modalPrice =
          modalPriceByRegion[
            stateCode === "0"
              ? d.properties.state_code
              : d.properties.district_code
          ] || "No data";

          tooltip
          .style("visibility", "visible")
          .html(
            `<strong>${regionName}</strong><br>${
              modalPrice
                ? `${selectedTab === "Price" ? "Modal Price ₹" : "Total Quantity"}: ${modalPrice} ${
                    selectedTab === "Quantity" ? "Tonn" : ""
                  }`
                : "No data available"
            }`);
      })
      
      .on("mousemove", function (event) {
        tooltip
          .style("top", `${event.pageY + 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
      });

    const sortedPrices = Object.entries(modalPriceByRegion).sort(
      (a, b) => b[1] - a[1]
    );

    if (sortedPrices.length) {
      const [highest, lowest] = [
        sortedPrices[0],
        sortedPrices[sortedPrices.length - 1],
      ];
      setHighestPrice({
        name:
          stateCode === "0"
            ? geoJsonData.features.find(
                (f) => f.properties.state_code === Number(highest[0])
              )?.properties.state_name
            : geoJsonData.features.find(
                (f) => f.properties.district_code === Number(highest[0])
              )?.properties.district_name,
        price: highest[1],
      });
      setLowestPrice({
        name:
          stateCode === "0"
            ? geoJsonData.features.find(
                (f) => f.properties.state_code === Number(lowest[0])
              )?.properties.state_name
            : geoJsonData.features.find(
                (f) => f.properties.district_code === Number(lowest[0])
              )?.properties.district_name,
        price: lowest[1],
      });
    }

        // Add custom legend with gradient bar
    const legendContainer = d3.select(legendRef.current);
    legendContainer.selectAll("*").remove(); // Clear previous legend

    const legendSvg = legendContainer.append("svg")
      .attr("width", 300)
      .attr("height", 60)
      .style("font-family", "Arial, sans-serif");

    // Gradient definition
    const defs = legendSvg.append("defs");
    const linearGradient = defs.append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    // Add color stops
    color.range().forEach((colorValue, i) => {
      linearGradient.append("stop")
        .attr("offset", `${(i / (color.range().length - 1)) * 100}%`)
        .attr("stop-color", colorValue);
    });

    // Draw the gradient bar
    legendSvg.append("rect")
      .attr("x", 20)
      .attr("y", 20)
      .attr("width", 200)
      .attr("height", 20)
      .style("fill", "url(#gradient)")
      .attr("rx", 5);

    // Add labels
    const legendScale = d3.scaleLinear()
      .domain(color.domain())
      .range([20, 220]);

    const legendAxis = d3.axisBottom(legendScale)
      .tickSize(0)
      .tickPadding(10)
      .ticks(5)
      .tickFormat(d3.format(".2s"));

    legendSvg.append("g")
      .attr("transform", "translate(0, 40)")
      .call(legendAxis)
      .call((g) => g.select(".domain").remove()); // Remove the axis line

    // Add title for the legend
    legendSvg.append("text")
      .attr("x", 20)
      .attr("y", 10)
      .text("Heatmap: By Value")
      .style("font-size", "12px")
      .style("font-weight", "bold")
      .style("fill", "#1A375F");

    return () => tooltip.remove();
  }, [stateCode, filteredMapData]);

  // const handleTabChange = (tab) => {
  //   setSelectedTab(tab);
  //   const dataKey = tab === "Price" ? "priceData" : "quantityData";
  //   setFilteredMapData(initialMapData?.[dataKey] || []);
  // };
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    const dataKey = tab === "Price" ? "priceData" : "quantityData";
    const updatedData = initialMapData?.[dataKey]?.filter(
      (item) => (item.month || item.date) === selectedCat
    );
    setFilteredMapData(updatedData || []);
  };

  // const handleCatChange = (category) => {
  //   setSelectedCat(category);
  //   const updatedData = initialMapData?.priceData?.filter(
  //     (item) => (item.month || item.date) === category
  //   );
  //   setFilteredMapData(updatedData || []);
  // };

  const handleCatChange = (category) => {
    setSelectedCat(category);
    const dataKey = selectedTab === "Price" ? "priceData" : "quantityData";
    const updatedData = initialMapData?.[dataKey]?.filter(
      (item) => (item.month || item.date) === category
    );
    setFilteredMapData(updatedData || []);
  };

  useEffect(() => {
    const dataKey = selectedTab === "Price" ? "priceData" : "quantityData";
    const updatedData = initialMapData?.[dataKey]?.filter(
      (item) => !selectedCat || (item.month || item.date) === selectedCat
    );
    setFilteredMapData(updatedData || []);
  }, [initialMapData, selectedCat, selectedTab]);

  const sortedCategories = [
    ...new Set(
      (initialMapData?.priceData || []).map((item) => item.month || item.date)
    ),
  ].sort((a, b) => new Date(b) - new Date(a));

    return (
      <div style={{ display: "flex" }}>
        {/* Dropdown and Tabs Container */}
        <div style={{ flex: 2, position: "relative", padding: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", position: "relative", gap:"15px" }}>


                        {/* Tab Interface */}
              {/* <div
              style={{
                // position: "absolute",
                // left: "-120px", // Position to the right of the dropdown
                top: "0",
                display: "flex",
                gap: "8px",
                padding: "5px",
                background: "#fff",
                // border: "1px solid #1A375F",
                // borderRadius: "5px",
                // boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <button
                onClick={() => handleTabChange("Price")}
                style={{
                  padding: "5px 10px",
                  background: selectedTab === "Price" ? "#1A375F" : "#FFF",
                  color: selectedTab === "Price" ? "#FFF" : "#1A375F",
                  border: "1px solid #1A375F",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Price
              </button>
              <button
                onClick={() => handleTabChange("Quantity")}
                style={{
                  padding: "5px 10px",
                  background: selectedTab === "Quantity" ? "#1A375F" : "#FFF",
                  color: selectedTab === "Quantity" ? "#FFF" : "#1A375F",
                  border: "1px solid #1A375F",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "12px",
                }}
              >
                Quantity
              </button>
            </div> */}
            <div className="flex gap-2 p-1 bg-white">
    <button
      onClick={() => handleTabChange("Price")}
      className={`px-2.5 py-1 text-sm border rounded cursor-pointer ${
        selectedTab === "Price" ? "bg-[#1A375F] text-white" : "bg-white text-[#1A375F]"
      } border-[#1A375F]`}
    >
      Price
    </button>
    <button
      onClick={() => handleTabChange("Quantity")}
      className={`px-2.5 py-1 text-sm border rounded cursor-pointer ${
        selectedTab === "Quantity" ? "bg-[#1A375F] text-white" : "bg-white text-[#1A375F]"
      } border-[#1A375F]`}
    >
      Quantity
    </button>
  </div>
            
            {/* Dropdown */}
            <Dropdown>
              <DropdownTrigger>
                <Button className="flex items-center pl-2 bg-white text-[#1A375F] border border-[#1A375F] rounded-md px-4 py-2 text-sm hover:bg-gray-50 w-auto">
                  <span className="mr-2">{selectedCat || "Select Date/Month"}</span>
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                  </svg>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                className="bg-white rounded-lg shadow dark:bg-gray-700 max-h-48 overflow-y-auto w-auto"
                aria-label="Category Select"
              >
                {sortedCategories.map((category, idx) => (
                  <DropdownItem
                    className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    key={idx}
                    onClick={() => handleCatChange(category)}
                  >
                    {category}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

    

          </div>
    
          {/* Map and Legend */}
          <div className="flex gap-1.5 items-center text-sm font-medium text-[#1A375F] pl-4 pr-4 pt-2">
        <span >   
          <p>{filteredMapData[0]?.commodity_name} 
          <span className="mx-2 text-sm text-gray-400">•</span> 
             {filteredMapData[0]?.state_name} </p>
        </span>
      </div>
          <svg ref={svgRef} style={{ marginTop: "20px" }}></svg>
          <div
            ref={legendRef}
            className="absolute top-10 right-10 border border-gray-300 shadow-md rounded-lg p-2 bg-white text-[#1A375F]"
          ></div>
        </div>
    
        {/* Highest and Lowest Prices */}
            <div style={{ position: "absolute", top: "30%", left: "10px", minWidth: "200px", maxWidth: "300px" }}>
    {highestPrice && (
          <div className="max-w-sm bg-[#c2294c] border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
            <strong className="text-white font-sans text-sm pl-4"> {selectedTab === "Price" ? "Highest Price" : "Highest Quantity"}</strong>
            <div className="bg-white pl-4 pt-4 pb-4 pr-4 font-sans text-sm text-[#1A375F]">
              <div >{highestPrice.name} • {selectedTab === "Price" ? "₹" : ""} {highestPrice.price.toLocaleString()} {selectedTab==="Quantity" ? "Tonn":""}</div>
            </div>
          </div>
        )}
        {lowestPrice && (
          <div className="bg-clip-padding max-w-sm bg-[#f5af95] border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" style={{ marginTop: "10px" }}>
            <strong className="text-[#1A375F] font-sans text-sm pl-4 ">{selectedTab === "Price" ? "Lowest Price" : "Lowest Quantity"}</strong>
            <div className="bg-white pl-4 pt-4 pb-4 pr-4 font-sans text-sm text-[#1A375F]">
              <div>{lowestPrice.name} • {selectedTab === "Price" ? "₹" : ""} {lowestPrice.price.toLocaleString()}{selectedTab==="Quantity" ? " Tonn":""}</div>
            </div>
          </div>
        )}
       </div>

      </div>
    );
  
};

export default TopoJsonMap;
