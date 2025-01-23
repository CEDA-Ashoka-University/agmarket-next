// import { useEffect, useRef, useState } from "react";
// import * as d3 from "d3";
// import { ChartButton } from "./ChartButton";
// import html2canvas from "html2canvas";
// import CedaIcon from "@/app/assets/icons/CedaIcon";
// import { Suspense } from "react";

// const MARGINS = {
//   LEFT: 40,
//   RIGHT: 30,
//   TOP: 20,
//   BOTTOM: 30,
// };
// const WIDTH = 800;
// const HEIGHT = 300;

// interface PriceDataItem {
//   date: string;
//   avg_modal_price: number;
//   avg_min_price: number;
//   avg_max_price: number;
//   moving_average?: number;
//   commodity_name: string;
//   month?: string;
//   year?: string;
//   state_name?: string;
// }

// interface QtyDataItem {
//   date: string;
//   total_quantity: number;
//   commodity_name: string;
//   month?: string;
//   year?: string;
//   state_name?: string;
// }

// interface LineChartProps {
//   PriceData: PriceDataItem[];
//   QtyData: QtyDataItem[];
// }


// const LineChart: React.FC<LineChartProps> = ({ PriceData, QtyData }) => {
//   const [selectedTab, setSelectedTab] = useState<"Price" | "Quantity">("Price");
//   const [data, setData] = useState<PriceDataItem[] | QtyDataItem[]>(PriceData || []);
//   // const [data, setData] = useState<PriceDataItem[] | QtyDataItem[]>(
//   //   selectedTab === "Price" ? PriceData : QtyData
//   // );
//   const xAxisRef = useRef<SVGGElement | null>(null);
//   const yAxisRef = useRef<SVGGElement | null>(null);
//   const chartGroupRef = useRef<SVGGElement | null>(null);
//   const legendRef = useRef<SVGGElement | null>(null);
//   const svgRef = useRef<SVGSVGElement | null>(null);

//   const handleTabChange = (tab: "Price" | "Quantity") => {
//     setSelectedTab(tab);
//     setData(tab === "Price" ? PriceData : QtyData);
//   };
//   // console.log("inside linechart1,"data)
//   // Automatically render the Price chart on mount
//   useEffect(() => {
//     setSelectedTab("Price");
//     setData(PriceData);
//   }, [PriceData]);

//   console.log("Pricedata12", PriceData)


//   const handleDownloadChart = async () => {
//     const container = document.getElementById("chart-container"); // Wrap the content in this div
//     if (!container) return;

//     // Temporarily hide the tabs and keep only the active tab label
//     const tabContainer = document.getElementById("tab1");
//     const activeTabLabel = document.getElementById("active-tab-label");

//     if (tabContainer) tabContainer.style.display = "none";
//     if (activeTabLabel) activeTabLabel.style.display = "block";

//     try {
//       const canvas = await html2canvas(container, {
//         backgroundColor: "#ffffff", // Set background to white
//         scale: 2, // Increase resolution
//       });

//       const image = canvas.toDataURL("image/jpeg", 1.0);
//       const link = document.createElement("a");
//       link.href = image;
//       link.download = "chart_with_active_tab.jpg";
//       link.click();
//     } catch (error) {
//       console.error("Failed to capture the chart", error);
//     } finally {
//       // Restore the tabs visibility after download
//       if (tabContainer) tabContainer.style.display = "flex";
//       if (activeTabLabel) activeTabLabel.style.display = "none";
//     }
//   };

//   useEffect(() => {
//     if (!data || data.length === 0) return;

//     const svg = d3.select(chartGroupRef.current);
//     svg.selectAll("*").remove(); // Clear existing lines and circles
//     // console.log("inside linechart1,", data)
//     const tooltip = d3
//       .select("body")
//       .append("div")
//       .attr("id", "tooltip")
//       .style("position", "absolute")
//       .style("background", "white")
//       .style("border", "1px solid #ccc")
//       .style("padding", "8px")
//       .style("border-radius", "4px")
//       .style("pointer-events", "none")
//       .style("opacity", "0")
//       .style("transition", "opacity 0.3s ease");



//     const xScale = d3
//       .scaleUtc()
//       .domain(
//         d3.extent(data, (d) =>
//           new Date(d.date || d.month || d.year || "1970-01-01")
//         ) as unknown as [Date, Date]
//       )
//       .range([0, WIDTH]);
//     //   const xScale = d3
//     // .scaleUtc()
//     // .domain(
//     //   selectedTab === "Price"
//     //     ? d3.extent(data as PriceDataItem[], (d) =>
//     //         new Date(d.date || `${d.year}-${d.month}-01` || "1970-01-01")
//     //       ) as [Date, Date]
//     //     : d3.extent(data as QtyDataItem[], (d) =>
//     //         new Date(d.date || `${d.year}-${d.month}-01` || "1970-01-01")
//     //       ) as [Date, Date]
//     // )
//     // .range([0, WIDTH]);

//     const yScale = d3
//       .scaleLinear()
//       .domain(
//         selectedTab === "Price"
//           ? [
//             d3.min(data as PriceDataItem[], (d) =>
//               Math.min(d.avg_min_price, d.avg_max_price, d.avg_modal_price)
//             )! - 10,
//             d3.max(data as PriceDataItem[], (d) =>
//               Math.max(d.avg_min_price, d.avg_max_price, d.avg_modal_price)
//             )!,
//           ]
//           : [
//             0,
//             d3.max(data as QtyDataItem[], (d) => d.total_quantity)! * 1.1,
//           ]
//       )
//       .range([HEIGHT, 0]);

//     const xAxis = d3
//       .axisBottom(xScale)
//       .ticks(10)
//       .tickFormat((d) => d3.timeFormat("%b, %Y")(new Date(d as Date)));

//     const yAxis = d3.axisLeft(yScale).ticks(5);

//     d3.select(xAxisRef.current).call(xAxis as any);
//     d3.select(yAxisRef.current).call(yAxis as any);

//     const color = d3.scaleOrdinal<string>(d3.schemeCategory10);

//     const lines = selectedTab === "Price"
//       ? [
//         { key: "avg_modal_price", label: "Modal Price" },
//         { key: "avg_min_price", label: "Min Price" },
//         { key: "avg_max_price", label: "Max Price" },
//       ]
//       : [{ key: "total_quantity", label: "Total Quantity" }];

//     lines.forEach((line) => {
//       const lineGenerator = d3
//         .line<PriceDataItem | QtyDataItem>()
//         .x((d) =>
//           xScale(
//             new Date(d.date || d.month || d.year || "1970-01-01")
//           )
//         )
//         .y((d) => yScale((d as any)[line.key]))
//         .curve(d3.curveMonotoneX);

//       svg
//         .append("path")
//         .datum(data)
//         .attr("class", `line-${line.key}`)
//         .attr("d", lineGenerator)
//         .attr("fill", "none")
//         .attr("stroke", () => color(line.key))
//         .attr("stroke-width", 2);

//       svg
//         .selectAll(`.circle-${line.key}`)
//         .data(data)
//         .join("circle")
//         .attr("class", `circle-${line.key}`)
//         .attr("cx", (d) =>
//           xScale(
//             new Date(d.date || d.month || d.year || "1970-01-01")
//           )
//         )
//         .attr("cy", (d) => yScale((d as any)[line.key]))
//         .attr("r", 4)
//         .attr("fill", () => color(line.key))
//         .on("mouseover", (event, d) => {
//           // tooltip
//           //   .style("opacity", "1")
//           //   .html(
//           //     `<strong>${line.label}:</strong> ${(d as any)[line.key]}<br><strong>Date:</strong> ${d.date || d.month || d.year
//           //     }`
//           //   );
//           tooltip
//             .style("opacity", "1")
//             .html(() => {
//               // Parse the date string and format it accordingly
//               let formattedDate = "";
//               let label = "";
//               if (d.date) {
//                 // Format for d.date (dd-mm-yy)
//                 const [year, month, day] = d.date.split("-");
//                 formattedDate = `${day}-${month}-${year.slice(-2)}`;
//                 label = "Date:";
//               } else if (d.month) {
//                 // Format for d.month (mm,yy)
//                 const [year, month] = d.month.split("-");
//                 formattedDate = `${month}/${year.slice(-2)}`;
//                 label = "Month:";
//               } else if (d.year) {
//                 // Format for d.year (yy)
//                 const [year] = d.year.split("-");
//                 formattedDate = `${year.slice(-2)}`;
//                 label = "Year:";
//               }

//               return `<strong>${line.label}:</strong> ${(d as any)[line.key]}<br><strong>${label}</strong> ${formattedDate}`;
//             });

//         })
//         .on("mousemove", (event) => {
//           tooltip
//             .style("top", `${event.pageY - 10}px`)
//             .style("left", `${event.pageX + 10}px`);
//         })
//         .on("mouseout", () => {
//           tooltip.style("opacity", "0");
//         });
//     });

//     const legend = d3.select(legendRef.current);
//     legend.selectAll("*").remove();

//     legend
//       .attr(
//         "transform",
//         `translate(${MARGINS.LEFT}, ${HEIGHT + MARGINS.TOP + 60 - 10})`
//       )
//       .selectAll(".legend-item")
//       .data(lines)
//       .join("g")
//       .attr("class", "legend-item")
//       .attr("transform", (_, i) => `translate(${i * 100}, 0)`)
//       .each(function (line) {
//         const g = d3.select(this);
//         g.append("rect")
//           .attr("width", 15)
//           .attr("height", 15)
//           .attr("fill", color(line.key));

//         g.append("text")
//           .attr("x", 20)
//           .attr("y", 12)
//           .style("font-size", "12px")
//           .style("alignment-baseline", "middle")
//           .text(line.label);
//       });

//     return () => {
//       tooltip.remove();
//     };
//   }, [data, selectedTab]);

//   function Loading() {
//     return <p>Loading...</p>;
//   }


//   return (
//     <div
//       id="chart-containers"
//       className="relative "
//       style={{
//         width: `${WIDTH + MARGINS.LEFT + MARGINS.RIGHT}px`,
//         height: `${HEIGHT + MARGINS.TOP + MARGINS.BOTTOM + 50}px`,

//       }}
//     >
//       <div id="chart-container" className="relative bg-white">
//         {/* <div style={{ display: "flex", alignItems: "center", position: "relative", gap: "15px" }}>
//        */}
//         <div
//           id="active-tab-label"
//           style={{
//             position: "absolute",
//             top: "10px",
//             left: "10px",
//             fontSize: "16px",
//             fontWeight: "bold",
//             color: "#1A375F",
//           }}
//         >
//           {selectedTab}
//         </div>
//         <div id="tab1" className="absolute pt-2 left-0 pl-2.5 flex  gap-4">

//           {/* Rest of the JSX remains the same */}
//           <div className="flex gap-2 bg-white pl-4"

//           >
//             <button
//               onClick={() => handleTabChange("Price")}
//               className={`px-2.5 py-1 align-middle text-sm border rounded cursor-pointer ${selectedTab === "Price"
//                 ? "bg-[#1A375F] text-white"
//                 : "bg-white text-[#1A375F]"
//                 } border-[#1A375F]`}
//             >
//               Price
//             </button>

//             <button
//               onClick={() => handleTabChange("Quantity")}
//               className={`px-2.5 py-1 align-middle text-sm border rounded cursor-pointer ${selectedTab === "Quantity"
//                 ? "bg-[#1A375F] text-white"
//                 : "bg-white text-[#1A375F]"
//                 } border-[#1A375F]`}
//             >
//               Quantity
//             </button>

//           </div>
//         </div>
//         {/* <div className="flex gap-1.5 items-center text-sm font-medium text-[#1A375F] pl-4 pr-4 pt-2"> */}
//         <div className="flex gap-1.5 items-center text-sm font-medium  text-[#1A375F] pt-12 pl-7">
//           {data && data.length > 0 ? (
//             <span>
//               <p>
//                 {data[0]?.commodity_name || ""}
//                 <span className="mx-2 text-sm text-gray-400">•</span>
//                 {data[0]?.state_name || "All India"}
//               </p>
//             </span>
//           ) : (
//             <p>No data available</p>
//           )}
//         </div>

//         <svg style={{
//           position: "absolute",
//           top: '200px',
//           // left: '200px',
//           width: '600px',
//           transform: "translate(25%, 25%)",
//           opacity: 0.05,
//           // zIndex: -1, // Ensure it's behind
//           pointerEvents: "none", // Prevent interference with interactions
//         }}
//         >
//           <g>
//             <CedaIcon
//               style={{ width: '600px', height: '100px' }}
//               width={600} // Adjust width as needed
//               height={100} // Adjust height as needed
//             />

//           </g>
//         </svg>

//         <Suspense fallback={<Loading />}>

//           <svg
//             ref={svgRef}
//             className="overflow-visible pt-2 pl-6 pr-[24px]"
//             width={WIDTH + MARGINS.LEFT + MARGINS.RIGHT + 20}
//             height={HEIGHT + MARGINS.TOP + MARGINS.BOTTOM + 50}
//           >

//             <g
//               ref={chartGroupRef}
//               transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`}
//             />
//             <g
//               ref={xAxisRef}
//               transform={`translate(${MARGINS.LEFT}, ${HEIGHT + MARGINS.TOP})`}
//             />
//             <g ref={yAxisRef} transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`} />
//             <g ref={legendRef} />
//           </svg>
//         </Suspense>
//       </div>
//       <div className="bg-gray-100 rounded-b-[32px] pt-[16px] px-[24px] pb-[16px] border-t border-t-[rgba(26,55,95,0.3)]"
//         style={{
//           marginTop: '73px',
//           width: '928px',
//         }}
//       >
//         <div className="flex gap-6">
//           <ChartButton
//             icon="https://cdn.builder.io/api/v1/image/assets/TEMP/11765651394374b6b9612a55c2b357118ffccaf24c9930bc589282fa25505338?placeholderIfAbsent=true&apiKey=5b3d0929746d4ec3b24a0cb1c5bb8afc"
//             text="Download chart"
//             onClick={handleDownloadChart}
//           />
//           <ChartButton
//             icon="https://cdn.builder.io/api/v1/image/assets/TEMP/fdc24a00e9f1688797bcaa3a71dabf14ed5176c1612528d9a886f3eb432a31a6?placeholderIfAbsent=true&apiKey=5b3d0929746d4ec3b24a0cb1c5bb8afc"
//             text="Share chart"
//           />

//         </div>
//       </div>

//     </div>
//   );
// };

// export default LineChart;
