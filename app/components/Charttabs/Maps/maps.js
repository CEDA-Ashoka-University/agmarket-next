import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client"; // TopoJSON for district data
import { data as districtTopoJsonData } from "./districts_2011"; // TopoJSON
import { data as stateGeoJsonData } from "./states_2019"; // GeoJSON

const TopoJsonMap = ({ initialMapData, stateCode }) => {
  const svgRef = useRef(null);
  const [filteredMapData, setFilteredMapData] = useState(initialMapData?.data || []);
  const [selectedCat, setSelectedCat] = useState(""); // State for dropdown selection

  useEffect(() => {
    if (!filteredMapData.length) return; // Exit if no data is available

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

    // Safely access data
    const mapData = filteredMapData;
    const cats = [...new Set(mapData.map((q) => q.month || q.date))];

    // console.log("Unique categories (cats):", cats);

    // Build modal price mapping
    const modalPriceByRegion = {};
    mapData.forEach((d) => {
      const key = stateCode === "0" ? d.state_id : d.district_id;
      if (key && d.ModalPrice) {
        modalPriceByRegion[key] = d.ModalPrice;
      }
    });

    const modalPrices = Object.values(modalPriceByRegion);
    const color = d3
      .scaleQuantize()
      .domain([d3.min(modalPrices) || 0, d3.max(modalPrices) || 1])
      .range(d3.schemeBlues[9]);

    // Select GeoJSON or TopoJSON data based on stateCode
    let geoJsonData;

    if (stateCode === "0") {
      // Use GeoJSON directly for states
      geoJsonData = stateGeoJsonData;
    } else {
      // Convert TopoJSON to GeoJSON for districts
      geoJsonData = topojson.feature(
        districtTopoJsonData,
        districtTopoJsonData.objects.districts_2011
      );
    }

    const filteredFeatures = stateCode === "0"
      ? geoJsonData.features
      : geoJsonData.features.filter(
          (district) => district.properties.state_code === Number(stateCode)
        );

    // Define projection and path
    const projection = d3.geoMercator();
    const path = d3.geoPath().projection(projection);

    if (stateCode === "0") {
      // Manually set scale and center for national map
      const center = [78.9629, 22.5937]; // Approximate center of India (longitude, latitude)
      const scale = 1000; // Adjust scale as needed

      projection
        .scale(scale)
        .center(center)
        .translate([width / 2, height / 2]); // Center the map in the SVG
    } else {
      // Automatically fit district map to the canvas
      const bounds = { type: "FeatureCollection", features: filteredFeatures };
      projection.fitExtent([[0, 0], [width, height]], bounds);
    }

    // Draw the map
    g.selectAll("path")
      .data(filteredFeatures)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#808080")
      .attr("stroke", "#000")
      .attr("stroke-width", 0.5)
      .style("fill", (d) => {
        const regionCode = stateCode === "0" ? d.properties.state_code : d.properties.district_code;
        const modalPrice = modalPriceByRegion[regionCode];
        return modalPrice ? color(modalPrice) : "#FFFFFF"; // Default to white for missing data
      })
      .style("stroke", "black");

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

    svg.selectAll("path")
      .on("mouseover", function (event, d) {
        const regionName = stateCode === "0" ? d.properties.state_name : d.properties.district_name;
        const modalPrice = modalPriceByRegion[
          stateCode === "0" ? d.properties.state_code : d.properties.district_code
        ] || "No data";

        tooltip
          .style("visibility", "visible")
          .html(`<strong>${regionName}</strong><br>Modal Price: ${modalPrice}`);
      })
      .on("mousemove", function (event) {
        tooltip
          .style("top", `${event.pageY + 10}px`)
          .style("left", `${event.pageX + 10}px`);
      })
      .on("mouseout", function () {
        tooltip.style("visibility", "hidden");
      });
  }, [stateCode, filteredMapData]);

  // Update filtered data based on dropdown selection
  const handleCatChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedCat(selectedValue);

    // Filter the data based on the selected category
    const updatedData = initialMapData?.data?.filter(
      (item) => (item.month || item.date) === selectedValue
    );
    // console.log("updatedhandelData",updatedData)
    setFilteredMapData(updatedData || []);
  };

  return (
    <div>
      <label htmlFor="category-select">Filter by Category:</label>
      <select id="category-select" value={selectedCat} onChange={handleCatChange}>
        <option value="">All</option>
        {[...new Set(initialMapData?.data?.map((q) => q.month || q.date))].map(
          (cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          )
        )}
      </select>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default TopoJsonMap;
