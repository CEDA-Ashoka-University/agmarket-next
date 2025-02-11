import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import domtoimage from 'dom-to-image';
import ShareSocialModal from '../../ShareSocialModal/ShareSocialModal'
import CedaIcon from "../../../assets/icons/CedaIcon"
import Buttons from "../../../ui/Button/Button"
import ShareIcon from "@/app/assets/icons/ShareIcon";
import DownloadIcon from "@/app/assets/icons/DownloadIcon";
import DownloadDataModal from "../../DowloadDataModal/DownloadDataModal";
import {
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { ChartButton } from "../ChartButton";
const BarPlot = ({ initialMapData, stateCode }) => {
  const [mapdata, setinitialData] = useState(initialMapData || []);
  const [openModalName, setOpenModalName] = useState("");
  const svgRef = useRef(null);
  const [selectedTab, setSelectedTab] = useState("Price");
  const [selectedCat, setSelectedCat] = useState("");
  const containerRef = useRef(null);
  const [filteredMapData, setFilteredMapData] = useState(
    mapdata?.priceData || []
  );
  const chartContainerRef = useRef(null);
  const [width_chart, setChartWidth] = useState(800); // Default width

  useEffect(() => {
    console.log("chartContainerRef.current", containerRef.current);
    if (chartContainerRef.current) {
      console.log("chartContainerRef.current.clientWidth", containerRef.current.clientWidth);
    }
  }, []);
  useEffect(() => {
    const updateWidth = () => {
      if (chartContainerRef.current) {
        const newWidth = chartContainerRef.current.clientWidth;
        console.log("get the width", newWidth);

        if (newWidth !== width_chart && newWidth > 0) {
          setChartWidth(newWidth);
        }
      } else {
        console.log("chartContainerRef is null");
      }
    };

    window.addEventListener("resize", updateWidth);

    // Delay execution to allow rendering to complete
    setTimeout(updateWidth, 1); // Small delay ensures the DOM has updated

    return () => window.removeEventListener("resize", updateWidth);
  }, []);


  const handleTabChange = (tab) => {
    setSelectedTab(tab);
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
    // const updatedData = initialMapData?.[dataKey]?.filter(
    //   (item) => (item.month || item.date || item.year) === (isSelectedCatValid ? selectedCat : defaultCategory)
    // );
    const modalPriceByRegion = {};
    filteredMapData.forEach((d) => {
      const key = stateCode === 0 ? d.district_id : d.district_id;
      if (key && (d.ModalPrice | d.total_quantity)) {
        modalPriceByRegion[key] = d.ModalPrice | d.total_quantity;
      }
    });
    // // console.log("Map data", filteredMapData)
    const modalPrices = Object.values(modalPriceByRegion);

    const updatedData = initialMapData?.[dataKey]
      ?.filter(
        (item) =>
          (item.month || item.date || item.year) === (isSelectedCatValid ? selectedCat : defaultCategory)
      )
      .sort((a, b) =>
        selectedTab === "Price" ? b.ModalPrice - a.ModalPrice : b.total_quantity - a.total_quantity
      )
      .slice(0, 20);

    setFilteredMapData(updatedData || []);
  }, [initialMapData, selectedTab, selectedCat]);

  const modalPriceByRegion = {};
  filteredMapData.forEach((d) => {
    const key = stateCode === 0 ? d.district_id : d.district_id;
    if (key && (d.ModalPrice | d.total_quantity)) {
      modalPriceByRegion[key] = d.ModalPrice | d.total_quantity;
    }
  });
  // console.log("Map data", filteredMapData)
  const modalPrices = Object.values(modalPriceByRegion);

  const handleCatChange = (category) => {
    setSelectedCat(category); // This will trigger the update of selectedCat
    const dataKey = selectedTab === "Price" ? "priceData" : "quantityData";

    // Filter data based on selected category
    let updatedData = initialMapData?.[dataKey]?.filter(
      (item) => (item.month || item.date || item.year) === category
    ) || [];

    // Sort by ModalPrice or total_quantity
    updatedData = updatedData
      .sort((a, b) => (selectedTab === "Price" ? b.ModalPrice - a.ModalPrice : b.total_quantity - a.total_quantity))
      .slice(0, 20); // Keep only top 20 entries

    console.log("Category Change:", category);
    console.log("Sorted & Filtered Data (Top 20):", updatedData);

    setFilteredMapData(updatedData);
  };
  console.log("inside bar plot", modalPriceByRegion)

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
    // console.log("bar price table", priceTab)
    // Hide the tab not selected
    if (selectedTab === "Price" && quantityTab) {
      quantityTab.style.display = "none";
    } else if (selectedTab === "Quantity" && priceTab) {
      priceTab.style.display = "none";
    }

    // Add a white background and capture the container
    domtoimage
      // .toJpeg(container, {
      //   quality: 2.0,
      //   style: {
      //     backgroundColor: '#ffffff', // Ensure a white background
      //   },
      // })

      .toPng(container, {
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
    // if (loading || !filteredMapData.length) return; 
    const width = width_chart;
    // console.log("width bar chart",width,width_chart)
    const height = 400;
    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height);
    svg.selectAll("*").remove();

    if (!filteredMapData.length) return;

    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const xScale = d3
      .scaleBand()
      .domain(filteredMapData.map(d => d.district_name))
      .range([0, chartWidth])
      .padding(0.4);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(filteredMapData, d => selectedTab === "Price" ? d.ModalPrice : d.total_quantity)])
      .nice()
      .range([chartHeight, 0]);

    const g = svg.append("g").attr("transform", `translate(${margin.left}, ${margin.top})`);

    g.append("g")
      .attr("transform", `translate(0, ${chartHeight})`)
      .call(d3.axisBottom(xScale).tickSize(0))
      .selectAll("text")
      .style("text-anchor", "end")
      .style("font-size", "10px")
      .attr("dx", "-0.8em")
      .attr("dy", "5.em")
      .attr("transform", "rotate(-45)");

    g.append("g")
      .call(
        d3.axisLeft(yScale).tickFormat((d) =>
          selectedTab === "Price" ? d : d3.format(".2s")(d).replace("G", "B")
        )
      );
    svg.append("text")
      .attr("transform", "rotate(-90)") // Rotate the text vertically
      .attr("x", -chartHeight / 2) // Center it relative to the y-axis
      .attr("y", margin.left - 40) // Adjust spacing from the axis
      .attr("text-anchor", "middle") // Center the text
      .style("font-family", "Inter, sans-serif") // Apply font styling
      .style("font-weight", "500")
      .style("font-size", "12px")
      .style("fill", "#1a375f")
      .text(selectedTab === "Price" ? "₹/Quintal →" : "Total Quantity");



    const colorScale = d3.scaleLinear()
      .domain([d3.min(filteredMapData, d => d[selectedTab === "Price" ? "ModalPrice" : "total_quantity"]),
      d3.max(filteredMapData, d => d[selectedTab === "Price" ? "ModalPrice" : "total_quantity"])])
      .range(["#F6C6B3", "#AC123D"]); // 

    const tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("background", "white")
      .style("color", "black")
      .style("padding", "5px 10px")
      .style("border-radius", "4px")
      .style("font-size", "12px")
      .style("box-shadow", "0px 0px 5px rgba(0, 0, 0, 0.3)")
      .style("visibility", "hidden");

    g.selectAll(".bar")
      .data(filteredMapData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.district_name))
      .attr("y", d => yScale(selectedTab === "Price" ? d.ModalPrice : d.total_quantity))
      .attr("width", xScale.bandwidth())
      .attr("height", d => chartHeight - yScale(selectedTab === "Price" ? d.ModalPrice : d.total_quantity))
      .attr("fill", d => colorScale(d[selectedTab === "Price" ? "ModalPrice" : "total_quantity"]))
      .on("mouseover", function (event, d) {
        d3.select(this).attr("fill", "#D96B5F"); // Highlight bar
        tooltip.style("visibility", "visible")
          .html(
            `<p><strong>District:</strong> ${d.district_name}</p>
        <p><strong>State:</strong> ${d.state_name}</p>
        <p><strong>${selectedTab === "Price" ? "Modal Price" : "Total Quantity"}:</strong> 
        ${selectedTab === "Price" ? `₹${d.ModalPrice}` : d.total_quantity}</p>`
          );
      })
      .on("mousemove", function (event) {
        tooltip.style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 20) + "px");
      })
      .on("mouseout", function (event, d) {
        d3.select(this).attr("fill", colorScale(d[selectedTab === "Price" ? "ModalPrice" : "total_quantity"])); // Reset color
        tooltip.style("visibility", "hidden"); // Hide tooltip
      });

  }, [filteredMapData, selectedTab]);
  return (
    <div ref={chartContainerRef} style={{ width: "100%" }}>
      {/* Dropdown and Tabs Container */}
      <div >
        <div ref={containerRef} style={{  position: "relative", padding: "10px", height: '525px',width:"100%" }}>
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


          <svg ref={svgRef} style={{ marginTop: "20px", height: "450px" }}></svg>

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

export default BarPlot;
