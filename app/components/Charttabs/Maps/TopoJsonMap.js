import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { data as stateDistrictJsonData } from "./india-districts-727"
import { ChartButton } from "../ChartButton";
import domtoimage from 'dom-to-image';
import ShareSocialModal from '../../ShareSocialModal/ShareSocialModal'
import CedaIcon from "../../../assets/icons/CedaIcon"
import ShareIcon from "@/app/assets/icons/ShareIcon";
import DownloadIcon from "@/app/assets/icons/DownloadIcon";
import DownloadDataModal from "../../DowloadDataModal/DownloadDataModal";
import Buttons from "../../../ui/Button/Button"
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";

const TopoJsonMap = ({ initialMapData, stateCode }) => {

  const [mapdata, setinitialData] = useState(initialMapData || []);



  const svgRef = useRef(null);
  const legendRef = useRef(null);
  const containerRef = useRef(null);
  const [filteredMapData, setFilteredMapData] = useState(
    mapdata?.priceData || []
  );
  const [openModalName, setOpenModalName] = useState("");
  const [selectedTab, setSelectedTab] = useState("Price");
  const [selectedCat, setSelectedCat] = useState("");
  const [highestPrice, setHighestPrice] = useState(null);
  const [lowestPrice, setLowestPrice] = useState(null);
  const chartContainerRef = useRef(null);
  const [width_chart, setChartWidth] = useState(650); // Default width
  useEffect(() => {
    const updateWidth = () => {
      if (chartContainerRef.current) {
        const newWidth = chartContainerRef.current.clientWidth * 0.8;
        if (newWidth > 0) {
          setChartWidth(newWidth);
        }
      }
    };

    updateWidth(); // Set initial width
    window.addEventListener("resize", updateWidth);

    return () => {
      window.removeEventListener("resize", updateWidth);
    };
  }, []);


  useEffect(() => {
    setinitialData(initialMapData);
  }, [initialMapData]);


  const handleTabChange = (tab) => {
    setSelectedTab(tab); // Change the selected tab
    const dataKey = tab === "Price" ? "priceData" : "quantityData";
    const defaultCategory =
      initialMapData?.[dataKey]?.[0]?.month ||
      initialMapData?.[dataKey]?.[0]?.date ||
      initialMapData?.[dataKey]?.[0]?.year;
  };



  const sortedCategories = [
    ...new Set(
      (initialMapData?.priceData || []).map((item) => item.month || item.date || item.year)
    ),
  ].sort((a, b) => {
    // Handle %m-%Y format (e.g., "04-2024")
    const parseMonthYear = (dateStr) => {
      if (/^\d{2}-\d{4}$/.test(dateStr)) { // Matches %m-%Y format
        const [month, year] = dateStr.split("-").map(Number);
        return new Date(year, month - 1); // Construct Date object (month is 0-based)
      }
      return new Date(dateStr); // Fallback for other date formats
    };

    return parseMonthYear(b) - parseMonthYear(a);
  });




  useEffect(() => {
    if (!initialMapData) return;

    const dataKey = selectedTab === "Price" ? "priceData" : "quantityData";

    // Determine the first available category from updated data
    const defaultCategory =
      initialMapData?.[dataKey]?.[0]?.month ||
      initialMapData?.[dataKey]?.[0]?.date ||
      initialMapData?.[dataKey]?.[0]?.year;

    // Check if the selected category is still valid
    const isSelectedCatValid = initialMapData?.[dataKey]?.some(
      (item) => (item.month || item.date || item.year) === selectedCat
    );

    // If the current selection is invalid, update to the default category
    if (!isSelectedCatValid && defaultCategory) {
      setSelectedCat(defaultCategory);
    }

    // Filter data based on the updated or selected category
    const updatedData = initialMapData?.[dataKey]?.filter(
      (item) => (item.month || item.date || item.year) === (isSelectedCatValid ? selectedCat : defaultCategory)
    );

    setFilteredMapData(updatedData || []);
  }, [initialMapData, selectedTab, selectedCat]);

 


  const handleCatChange = (category) => {
    setSelectedCat(category); // This will trigger the update of selectedCat
    const dataKey = selectedTab === "Price" ? "priceData" : "quantityData";

    // Filter the data for the selected category
    const updatedData = initialMapData?.[dataKey]?.filter(
      (item) => (item.month || item.date || item.year) === category
    );


    setFilteredMapData(updatedData || []);
  };

  useEffect(() => {
    if (selectedCat) {
      handleCatChange(selectedCat); // Update the filtered map data when category changes
    }
  }, [selectedCat]);
  const handleDownload = () => {
    const container = containerRef.current;

    if (!container) return;

    // Temporarily hide the unselected tab
    const priceTab = document.querySelector('[data-tab="price"]');
    const quantityTab = document.querySelector('[data-tab="quantity"]');

    // Store the original display values
    const priceTabDisplay = priceTab ? priceTab.style.display : '';
    const quantityTabDisplay = quantityTab ? quantityTab.style.display : '';


    // Hide the tab not selected
    if (selectedTab === "Price" && quantityTab) {
      quantityTab.style.display = "none";
      
    } else if (selectedTab === "Quantity" && priceTab) {
      priceTab.style.display = "none";
    }

    // Define a fixed resolution (adjust as needed)


    // Add a white background and capture the container
    domtoimage
      .toJpeg(container, {
        quality: 1.0,
        bgcolor: "#ffffff",
        width: container.clientWidth * 3, // 3x scaling
        height: container.clientHeight * 3,
        style: {
          transform: "scale(3)", // Scale for better clarity
          transformOrigin: "top left",
          width: container.clientWidth + "px",
          height: container.clientHeight + "px",
        },

      })
      .then((dataUrl) => {
        // Restore the original display values
        if (priceTab) priceTab.style.display = priceTabDisplay;
        if (quantityTab) quantityTab.style.display = quantityTabDisplay;

        // Trigger download
        const link = document.createElement('a');
        link.download = `map_with_${selectedTab.toLowerCase()}.jpg`;
        link.href = dataUrl;
        link.click();
      })
      .catch((error) => {
        // Restore the original display values in case of error
        if (priceTab) priceTab.style.display = priceTabDisplay;
        if (quantityTab) quantityTab.style.display = quantityTabDisplay;

        console.error("Error capturing the map:", error);
      });
  };

  useEffect(() => {
    const width = width_chart;

    const height = 400;
    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);


    svg.selectAll("*").remove();

    svg.append("rect").attr("width", width).attr("height", height).style("fill", "white");
    const g = svg.append("g");

    if (!filteredMapData.length) {
      console.warn("No data available for map rendering.");
      return;
    }
   
    const modalPriceByRegion = {};
    filteredMapData.forEach((d) => {
      const key = stateCode === 0 ? d.district_id : d.district_id;
      if (key && (d.ModalPrice | d.total_quantity)) {
        modalPriceByRegion[key] = d.ModalPrice | d.total_quantity;
      }
    });
   
    const modalPrices = Object.values(modalPriceByRegion);
   
    const colorList = ["#F5B49A", "#F28765", "#F07368", "#F05C6B", "#C2284C"];
    const color = d3
      .scaleQuantize()
      .domain([d3.min(modalPrices) || 0, d3.max(modalPrices) || 1])
      .range(colorList);

    let geoJsonData;
    if (stateCode === 0) {
      // geoJsonData = topojson.feature(
      //   stateTopoJsonData,
      //   stateTopoJsonData.objects.india
      // );
      geoJsonData = topojson.feature(
        stateDistrictJsonData, stateDistrictJsonData.objects.india_districts_727
      )
    } else {
      // geoJsonData = topojson.feature(
      //   districtTopoJsonData,
      //   districtTopoJsonData.objects.districts_2011
      geoJsonData = topojson.feature(
        stateDistrictJsonData, stateDistrictJsonData.objects.india_districts_727
      );
    }

    const filteredFeatures =
      stateCode === 0
        ? geoJsonData.features
        : geoJsonData.features.filter(
          (district) => district.properties.state_code === String(stateCode)
        );


    const projection = d3.geoMercator();
    const path = d3.geoPath().projection(projection);

    if (stateCode === 0) {
      const center = [78.9629, 22.5937];
      const scale = 600;
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
          stateCode === 0
            ? d.properties.district_code
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
          stateCode === 0
            ? d.properties.district_name
            : d.properties.district_name;
        const modalPrice =
          modalPriceByRegion[
          stateCode === 0
            ? d.properties.district_code
            : d.properties.district_code
          ] || "No data";

        tooltip
          .style("visibility", "visible")
          .html(
            `<strong>${regionName}</strong><br>${modalPrice
              ? `${selectedTab === "Price" ? "Modal Price ₹" : "Total Quantity"}: ${modalPrice} ${selectedTab === "Quantity" ? "Tonne" : ""
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
          stateCode === 0
            ? geoJsonData.features.find(
              (f) => f.properties.district_code === highest[0]
            )?.properties.district_name
            :
            geoJsonData.features.find(
              (f) => f.properties.district_code === highest[0]
            )?.properties.district_name,
        price: highest[1],
      });
      setLowestPrice({
        name:
          stateCode === 0
            ? geoJsonData.features.find(
              (f) => f.properties.district_code === lowest[0]
            )?.properties.district_name :
            geoJsonData.features.find(
              (f) => f.properties.district_code === lowest[0]
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
  }, [stateCode, filteredMapData, initialMapData]);





  return (
    <div ref={chartContainerRef} style={{ width: "100%" }}>
      {/* Dropdown and Tabs Container */}
      <div >
        <div ref={containerRef} style={{ width: "100%", flex: 2, position: "relative", padding: "10px", height: '525px' }}>
          <div style={{ display: "flex", alignItems: "center", position: "relative", gap: "15px" }}>

            <div className="flex gap-2 p-1 bg-white">
              <button data-tab="price"
                onClick={() => handleTabChange("Price")}
                className={`px-2.5 py-1 text-sm border rounded cursor-pointer ${selectedTab === "Price" ? "bg-[#1A375F] text-white" : "bg-white text-[#1A375F]"
                  } border-[#1A375F]`}
              >
                Price
              </button>
              <button data-tab="quantity"
                onClick={() => handleTabChange("Quantity")}
                className={`px-2.5 py-1 text-sm border rounded cursor-pointer ${selectedTab === "Quantity" ? "bg-[#1A375F] text-white" : "bg-white text-[#1A375F]"
                  } border-[#1A375F]`}
              >
                Quantity
              </button>
            </div>

            {/* Dropdown */}
            <Dropdown id="datePicker">
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
                {stateCode === 0 ? "India" : filteredMapData[0]?.state_name}

              </p>
            </span>
          </div>
          <svg style={{
            position: "absolute",
            top: '200px',
            // left: '200px',
            width: '600px',
            transform: "translate(25%, 25%)",
            opacity: 0.05,
            // zIndex: -1, // Ensure it's behind
            pointerEvents: "none", // Prevent interference with interactions
          }}
          >
            <g>
              <CedaIcon
                // style={{width:'600px', height:'200px'}}
                width={600} // Adjust width as needed
                height={100} // Adjust height as needed
              />

            </g>
          </svg>

          <svg ref={svgRef} style={{ marginTop: "20px", marginLeft: "40px" }}>


          </svg>

          <div
            ref={legendRef}
            className="absolute top-10 right-10 border border-gray-300 shadow-md rounded-lg p-2 bg-white text-[#1A375F]"
          >
          </div>


          {/* Highest and Lowest Prices */}
          <div style={{ position: "absolute", top: "30%", right: "10%", minWidth: "200px", maxWidth: "200px" }}>
            {highestPrice && (
              <div className="max-w-sm bg-[#c2294c] border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <strong className="text-white font-sans text-sm pl-4"> {selectedTab === "Price" ? "Highest Price" : "Highest Quantity"}</strong>
                <div className="bg-white pl-4 pt-4 pb-4 pr-4 font-sans text-sm text-[#1A375F]">
                  <div >{highestPrice.name} • {selectedTab === "Price" ? "₹" : ""} {highestPrice.price.toLocaleString()} {selectedTab === "Quantity" ? "Tonne" : ""}</div>
                </div>
              </div>
            )}
            {lowestPrice && (
              <div className="bg-clip-padding max-w-sm bg-[#f5af95] border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700" style={{ marginTop: "10px" }}>
                <strong className="text-[#1A375F] font-sans text-sm pl-4 ">{selectedTab === "Price" ? "Lowest Price" : "Lowest Quantity"}</strong>
                <div className="bg-white pl-4 pt-4 pb-4 pr-4 font-sans text-sm text-[#1A375F]">
                  <div>{lowestPrice.name} • {selectedTab === "Price" ? "₹" : ""} {lowestPrice.price.toLocaleString()}{selectedTab === "Quantity" ? " Tonne" : ""}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-6 bg-gray-100 border-t border-blue-950/30 rounded-b-2xl py-4 px-4 h-20 w-full mt-[12px]">

          <Buttons
            className="flex items-center gap-2 bg-white border border-[#1A375F] rounded-lg px-3 py-2 cursor-pointer"
            handleClick={() => setOpenModalName("DOWNLOAD_CHART")}
          >
            <DownloadIcon className="w-3.5 h-4.5" />
            <p className="font-inter font-normal text-sm leading-4 text-primary w-max">
              Download charts
            </p>
          </Buttons>

          <Buttons
            className="flex items-center gap-2 bg-white border border-[#1A375F] rounded-lg px-3 py-2 cursor-pointer"
            handleClick={() => setOpenModalName("SHARE_CHART")}
          >
            <ShareIcon className="w-3.5 h-3.5" />
            <p className="font-inter font-normal text-sm leading-4 text-primary w-max">
              Share Chart
            </p>
          </Buttons>

          {/* <ChartButton
  icon={<ShareIcon />}
  text="Share chart"
  onClick={() => setOpenModalName("SHARE_CHART")}
/> */}

          {openModalName === "DOWNLOAD_CHART" && (
            <DownloadDataModal
              handleCloseModal={() => setOpenModalName("")}
              handleDownloadClick={handleDownload}
            />
          )}
          {openModalName === "SHARE_CHART" && (
            <ShareSocialModal
              handleCloseModal={() => setOpenModalName("")}
              handleDownloadClick={handleDownload}
            />

          )}

        </div>
      </div>

    </div>
  );

};

export default TopoJsonMap;


