// import { useEffect, useRef } from "react";
// import * as d3 from "d3";
// import CedaIcon from "@/app/assets/icons/CedaIcon";

// const MARGINS = {
//   LEFT: 40,
//   RIGHT: 30,
//   TOP: 20,
//   BOTTOM: 60,
// };
// const HEIGHT = 300; // Chart height
// const WIDTH = 800; // Chart width

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

// interface PriceLineChartProps {
//   PriceData: PriceDataItem[];
// }

// const PriceLineChart: React.FC<PriceLineChartProps> = ({ PriceData }) => {
//   const xAxisRef = useRef<SVGGElement | null>(null);
//   const yAxisRef = useRef<SVGGElement | null>(null);
//   const chartGroupRef = useRef<SVGGElement | null>(null);
//   const legendRef = useRef<SVGGElement | null>(null);

//   useEffect(() => {
//     if (!PriceData || PriceData.length === 0) return;

//     const svg = d3.select(chartGroupRef.current);
//     svg.selectAll("*").remove();

//     const tooltip = d3
//       .select("body")
//       .append("div")
//       .attr("id", "tooltip")
//       .style("position", "absolute")
//       .style("top","0px")
//       .style("left","0px")
//       .style("background", "white")
//       // .style("border", "1px solid #ccc")
//       // .style("padding", "8px")
//       .style("border-radius", "4px")
//       .style("box-shadow","0 4px 40px #0003")
//       .style("pointer-events", "none")
//       .style("opacity", "0")
//       .style("transition", "opacity 0.3s ease");

//       // position: absolute;
//       // pointer-events: none;
//       // top: 0px;
//       // left: 0px;
//       // border-radius: 4px;
//       // box-shadow: 0 4px 40px #0003;
//       // pointer-events: none;
//       // overflow: hidden;
//       // display: none;
//       // min-width: 150px;
//       // max-width: 200px;


//     const xScale = d3
//       .scaleUtc()
//       .domain(
//         d3.extent(PriceData, (d) =>
//           new Date(d.date || d.month || d.year || "1970-01-01")
//         ) as unknown as [Date, Date]
//       )
//       .range([0, WIDTH]);

//     const yScale = d3
//       .scaleLinear()
//       .domain([
//         d3.min(PriceData, (d) =>
//           Math.min(d.avg_min_price, d.avg_max_price, d.avg_modal_price)
//         )! - 10,
//         d3.max(PriceData, (d) =>
//           Math.max(d.avg_min_price, d.avg_max_price, d.avg_modal_price)
//         )!,
//       ])
//       .range([HEIGHT, 0]);

//     const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat((d) => d3.timeFormat("%b, %Y")(new Date(d as Date)));
//     const yAxis = d3.axisLeft(yScale).ticks(5);

//     d3.select(xAxisRef.current).call(xAxis as any);
//     d3.select(yAxisRef.current).call(yAxis as any);

//     const color = d3.scaleOrdinal<string>(d3.schemeCategory10);

//     const groupedData = d3.group(PriceData, (d) => d.commodity_name);
//     groupedData.forEach((commodityData, commodityName) => {
//       console.log(`Commodity Name: ${commodityName}`);
//       console.log('Commodity Data:', commodityData);

//     });


//     const lines = [
//       { key: "avg_modal_price", label: "Modal Price" },
//       { key: "avg_min_price", label: "Min Price" },
//       { key: "avg_max_price", label: "Max Price" },
//     ];




//     lines.forEach((line) => {
//       const lineGenerator = d3
//         .line<PriceDataItem>()
//         .x((d) =>
//           xScale(new Date(d.date || d.month || d.year || "1970-01-01"))
//         )
//         .y((d) => yScale((d as any)[line.key]))
//         .curve(d3.curveMonotoneX);

//       svg
//         .append("path")
//         .datum(PriceData)
//         .attr("d", lineGenerator)
//         .attr("fill", "none")
//         .attr("stroke", () => color(line.key))
//         .attr("stroke-width", 2);
//     });

//     // Add data points for all lines
//     PriceData.forEach((d) => {
//       lines.forEach((line) => {
//         svg
//           .append("circle")
//           .attr("class", "data-point")
//           .attr("cx", xScale(new Date(d.date || d.month || d.year || "1970-01-01")))
//           .attr("cy", yScale((d as any)[line.key]))
//           .attr("r", 4)
//           .attr("fill", color(line.key))
//           .on("mouseover", (event) => {
//             const formattedDate = d.date
//               ? d.date.split("-").reverse().join("-")
//               : d.month
//               ? `${d.month.split("-")[1]}-${d.month.split("-")[0]}`
//               : d.year || "";

//             tooltip
//               .style("opacity", "1")
//               .html(
//                 `<div class="font-bold text-sm mb-2 bg-gray-400"">${formattedDate}</div>
//      <div class="text-xs p-1"><strong>Modal Price:</strong> ${d.avg_modal_price} ₹/Quintal</div>
//      <div class="text-xs p-1"><strong>Min Price:</strong> ${d.avg_min_price} ₹/Quintal</div>
//      <div class="text-xs p-1"><strong>Max Price:</strong> ${d.avg_max_price} ₹/Quintal</div>`
//   );
//           })
//           .on("mousemove", (event) => {
//             const tooltipWidth = 200; // Approximate tooltip width
//             const tooltipHeight = 100; // Approximate tooltip height
//             const chartContainer = document.getElementById("chart-container");

//             if (!chartContainer) return;

//             const containerRect = chartContainer.getBoundingClientRect();
//             const pageX = event.pageX;
//             const pageY = event.pageY;

//             // Default tooltip position
//             let tooltipX = pageX + 10; // Right of cursor
//             let tooltipY = pageY - 10; // Above cursor

//             // Adjust if tooltip overflows the right edge
//             if (tooltipX + tooltipWidth > containerRect.right) {
//               tooltipX = pageX - tooltipWidth - 10; // Move to the left of the cursor
//             }

//             // Adjust if tooltip overflows the left edge
//             if (tooltipX < containerRect.left) {
//               tooltipX = containerRect.left + 10; // Stay inside the left edge
//             }

//             // Adjust if tooltip overflows the bottom edge
//             if (tooltipY + tooltipHeight > containerRect.bottom) {
//               tooltipY = pageY - tooltipHeight - 50; // Move above the cursor
//             }

//             // Adjust if tooltip overflows the top edge
//             if (tooltipY < containerRect.top) {
//               tooltipY = pageY + 10; // Move below the cursor
//             }

//             tooltip
//               .style("top", `${tooltipY}px`)
//               .style("left", `${tooltipX}px`)
//               .style("opacity", "1"); // Ensure tooltip is visible
//           })
//           .on("mouseout", () => {
//             tooltip.style("opacity", "0"); // Hide tooltip on mouseout
//           });

//       });
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
//       .attr("transform", (_, i) => `translate(${i * 120}, 0)`)
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
//   }, [PriceData]);

//   return (
//     <div 
//       className="overflow-visible pt-2 pl-6 pr-[24px]"
//       style={{
//         width: `${WIDTH + MARGINS.LEFT + MARGINS.RIGHT + 20}px`,
//         height: `${HEIGHT + MARGINS.TOP + MARGINS.BOTTOM + 50+60}px`,
//       }}
//     >
//       <svg
//         style={{
//           position: "absolute",
//           top: "100px",
//           width: "600px",
//           transform: "translate(25%, 25%)",
//           opacity: 0.05,
//           pointerEvents: "none",
//         }}
//       >
//         <g>
//           <CedaIcon
//             style={{ width: "600px", height: "100px" }}
//             width={600}
//             height={100}
//           />
//         </g>
//       </svg>
//       <svg 
//         className="pt-[10px]"
//         width={WIDTH + MARGINS.LEFT + MARGINS.RIGHT}
//         height={HEIGHT + MARGINS.TOP + MARGINS.BOTTOM + 100}
//       >
//         <g id="chart-container"
//           ref={chartGroupRef}
//           transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`}
//         />
//         <g
//           ref={xAxisRef}
//           transform={`translate(${MARGINS.LEFT}, ${HEIGHT + MARGINS.TOP})`}
//         />
//         <g ref={yAxisRef} transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`} />
//         <g ref={legendRef} />
//       </svg>
//     </div>
//   );
// };

// export default PriceLineChart;


// Keep the with add and remove option and multiple legends clickable

// import { useEffect, useRef } from "react";
// import * as d3 from "d3";
// import CedaIcon from "@/app/assets/icons/CedaIcon";
// import  EyeIcon  from '@/app/assets/icons/EyeIcon';
// import ReactDOM from "react-dom";


// const MARGINS = {
//   LEFT: 40,
//   RIGHT: 30,
//   TOP: 20,
//   BOTTOM: 60,
// };
// const HEIGHT = 300; // Chart height
// // const WIDTH = 800; // Chart width
// const WIDTH = 650; // Chart width

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

// interface PriceLineChartProps {
//   PriceData: PriceDataItem[];
//   onRemoveCommodity: (commodityName: string) => void;

// }

// const removeDuplicates = (data: PriceDataItem[]) => {
//   const seen = new Set<string>();
//   return data.filter((item) => {
//     const key = `${item.date}-${item.commodity_name}`;
//     if (seen.has(key)) {
//       return false;
//     }
//     seen.add(key);
//     return true;
//   });
// };


// const PriceLineChart: React.FC<PriceLineChartProps> = ({ PriceData, onRemoveCommodity }) => {
//   const xAxisRef = useRef<SVGGElement | null>(null);
//   const yAxisRef = useRef<SVGGElement | null>(null);
//   const chartGroupRef = useRef<SVGGElement | null>(null);
//   const legendRef = useRef<HTMLDivElement | null>(null);

//   const getUniqueCommodities = () => {
//     return Array.from(new Set(PriceData.map((item) => item.commodity_name)));
//   };

//   useEffect(() => {
//     if (!PriceData || PriceData.length === 0) return;

//     const svg = d3.select(chartGroupRef.current);
//     svg.selectAll("*").remove();

//     const tooltip = d3
//       .select("body")
//       .append("div")
//       .attr("id", "tooltip")
//       .style("position", "absolute")
//       .style("top", "0px")
//       .style("left", "0px")
//       .style("background", "white")
//       .style("border-radius", "4px")
//       .style("box-shadow", "0 4px 40px #0003")
//       .style("pointer-events", "none")
//       .style("opacity", "0")
//       .style("transition", "opacity 0.3s ease");

//     const xScale = d3
//       .scaleUtc()
//       .domain(
//         d3.extent(PriceData, (d) =>
//           new Date(d.date || d.month || d.year || "1970-01-01")
//         ) as unknown as [Date, Date]
//       )
//       .range([0, WIDTH]);

//     const yScale = d3
//       .scaleLinear()
//       .domain([
//         d3.min(PriceData, (d) =>
//           Math.min(d.avg_min_price, d.avg_max_price, d.avg_modal_price)
//         )! - 10,
//         d3.max(PriceData, (d) =>
//           Math.max(d.avg_min_price, d.avg_max_price, d.avg_modal_price)
//         )!,
//       ])
//       .range([HEIGHT, 0]);

//     const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat((d) => d3.timeFormat("%b, %Y")(new Date(d as Date)));
//     const yAxis = d3.axisLeft(yScale).ticks(5);

//     d3.select(xAxisRef.current).call(xAxis as any);
//     d3.select(yAxisRef.current).call(yAxis as any);

//     // const color = d3.scaleOrdinal<string>(d3.schemeCategory10);
//     // color palette
// const color = d3
// .scaleOrdinal<string>()
// .range([
//   "#e41a1c",
//   "#377eb8",
//   "#4daf4a",
//   "#984ea3",
//   "#ff7f00",
//   "#a65628",
//   "#db5858",
//   "#f781bf",
//   "#db8658",
// ]);


//     const groupedData = d3.group(PriceData, (d) => d.commodity_name);

//     const lines = [
//       { key: "avg_modal_price", label: "Modal Price" },
//       { key: "avg_min_price", label: "Min Price" },
//       { key: "avg_max_price", label: "Max Price" },
//     ];

//     groupedData.forEach((commodityData, commodityName) => {
//       lines.forEach((line) => {
//         const lineGenerator = d3
//           .line<PriceDataItem>()
//           .x((d) =>
//             xScale(new Date(d.date || d.month || d.year || "1970-01-01"))
//           )
//           .y((d) => yScale((d as any)[line.key]));

//         svg
//           .append("path")
//           .datum(commodityData)
//           .attr("d", lineGenerator)
//           .attr("fill", "none")
//           .attr("stroke", color(line.label + commodityName))
//           .attr("stroke-width", 2)
//           .attr("class", `line-${line.label.replace(" ", "-").toLowerCase()}-${commodityName}`)
//           .style("display", "block");
//         // Add points for each line
//         commodityData.forEach((d) => {
//           svg
//             .append("circle")
//             .attr("class", `point-${line.label.replace(" ", "-").toLowerCase()}-${commodityName}`)
//             .attr("cx", xScale(new Date(d.date || d.month || d.year || "1970-01-01")))
//             .attr("cy", yScale((d as any)[line.key]))
//             .attr("r", 4)
//             .attr("fill", color(line.label + commodityName))
//             .style("display", "block")
//             .on("mouseover", (event) => {
//               const formattedDate = d.date
//                 ? d.date.split("-").reverse().join("-")
//                 : d.month
//                   ? `${d.month.split("-")[1]}-${d.month.split("-")[0]}`
//                   : d.year || "";

//               tooltip
//                 .style("opacity", "1")
//                 .html(
//                   `<div class="font-bold text-sm mb-2 bg-gray-400"">${formattedDate}/${commodityName}</div>
//                   <div class="text-xs p-1"><strong>Modal Price:</strong> ${d.avg_modal_price} ₹/Quintal</div>
//                   <div class="text-xs p-1"><strong>Min Price:</strong> ${d.avg_min_price} ₹/Quintal</div>
//                   <div class="text-xs p-1"><strong>Max Price:</strong> ${d.avg_max_price} ₹/Quintal</div>`
//                 );
//             })
//             .on("mousemove", (event) => {
//               const tooltipWidth = 200;
//               const tooltipHeight = 100;
//               const chartContainer = document.getElementById("chart-container");

//               if (!chartContainer) return;

//               const containerRect = chartContainer.getBoundingClientRect();
//               const pageX = event.pageX;
//               const pageY = event.pageY;

//               let tooltipX = pageX + 10;
//               let tooltipY = pageY - 10;

//               if (tooltipX + tooltipWidth > containerRect.right) {
//                 tooltipX = pageX - tooltipWidth - 10;
//               }

//               if (tooltipX < containerRect.left) {
//                 tooltipX = containerRect.left + 10;
//               }

//               if (tooltipY + tooltipHeight > containerRect.bottom) {
//                 tooltipY = pageY - tooltipHeight - 50;
//               }

//               if (tooltipY < containerRect.top) {
//                 tooltipY = pageY + 10;
//               }

//               tooltip
//                 .style("top", `${tooltipY}px`)
//                 .style("left", `${tooltipX}px`)
//                 .style("opacity", "1");
//             })
//             .on("mouseout", () => {
//               tooltip.style("opacity", "0");
//             });
//         });
//       });
//     });


//       const legend = d3.select(legendRef.current);
//       legend.selectAll("*").remove();

//       legend
//         .selectAll(".legend-item")
//         .data(Array.from(groupedData.keys())) // Iterate over commodity names
//         .join("div")
//         .attr("class", "legend-item")
//         .style("display", "flex")
//         .style("flex-direction", "column")
//         .style("margin-bottom", "20px")
//         .style("margin", "5px")
//         .each(function (commodityName) {
//           const div = d3.select(this);

//           // Add commodity name and remove button
//           const header = div.append("div")
//             .style("display", "flex")
//             .style("align-items", "center")
//             .style("margin-bottom", "5px");

//           header.append("span")
//             .text(commodityName)
//             .style("font-weight", "bold")
//             .style("font-size", "14px");

//           header.append("button")
//             .text("x")
//             .style("margin-left", "100px")
//             .style("cursor", "pointer")
//             .style("background", "none")
//             .style("border", "none")
//             .style("color", "grey")
//             .style("font-size", "14px")
//             .on("click", () => {
//               lines.forEach((line) => {
//                 const lineKey = `${line.label.replace(" ", "-").toLowerCase()}-${commodityName}`;
//                 svg.selectAll(`.line-${lineKey}`).remove();
//                 svg.selectAll(`.point-${lineKey}`).remove();
//               });
//               onRemoveCommodity(commodityName);
//             });

//           // Add rectangles with labels and eye icons
//           lines.forEach((line) => {
//             const lineKey = `${line.label.replace(" ", "-").toLowerCase()}-${commodityName}`;
//             const row = div.append("div")
//               .style("display", "flex")
//               .style("align-items", "center")
//               .style("margin-top", "5px");

//             // Add rectangle
//             row.append("div")
//               .style("width", "15px")
//               .style("height", "15px")
//               .style("background-color", color(line.label + commodityName))
//               .style("margin-right", "10px");

//             // Add Eye Icon
//             const eyeContainer = row.append("div")
//   .style("margin-right", "10px")
//   .style("cursor", "pointer");

// const node = eyeContainer.node(); // Store the node reference

// if (node) {
//   ReactDOM.render(
//     <EyeIcon
//       onClick={() => {
//         const isHidden = svg.selectAll(`.line-${lineKey}`).style("display") === "none";
//         svg.selectAll(`.line-${lineKey}`).style("display", isHidden ? "block" : "none");
//         svg.selectAll(`.point-${lineKey}`).style("display", isHidden ? "block" : "none");

//         node.style.color = isHidden ? "grey" : "black";
//       }}
//     />,
//     node
//   );
// }

//             // Add label text (min, max, modal)
//             row.append("span")
//               .text(line.label)
//               .style("font-size", "12px");
//           });
//         });

//   }, [PriceData]);

//   return (
//     <>
//       <div
//         className="overflow-visible pt-2 pl-6 pr-[24px]"
//         style={{
//           width: `${WIDTH + MARGINS.LEFT + MARGINS.RIGHT + 130}px`,
//           height: `${HEIGHT + MARGINS.TOP + MARGINS.BOTTOM + 50 + 60}px`,
//           display: "flex",
//           flexDirection: "row",
//           paddingTop: "50px",
//         }}
//       >
//         <svg
//           style={{
//             position: "absolute",
//             top: "100px",
//             width: "600px",
//             transform: "translate(25%, 25%)",
//             opacity: 0.05,
//             pointerEvents: "none",
//           }}
//         >
//           <g>
//             <CedaIcon
//               style={{ width: "600px", height: "100px" }}
//               width={600} // Adjust width as needed
//               height={100} // Adjust height as needed
//             />
//           </g>
//         </svg>
//         <svg
//           width={WIDTH + MARGINS.LEFT + MARGINS.RIGHT}
//           height={HEIGHT + MARGINS.TOP + MARGINS.BOTTOM}
//         >
//           <g
//             id="chart-container"
//             ref={chartGroupRef}
//             transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`}
//           />
//           <g
//             ref={xAxisRef}
//             transform={`translate(${MARGINS.LEFT}, ${HEIGHT + MARGINS.TOP})`}
//           />
//           <g ref={yAxisRef} transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`} />
//         </svg>
//       </div>
//       <div
//         ref={legendRef}
//         style={{
//           position: "absolute",
//           top: `${MARGINS.TOP + 80}px`,
//           left: `${WIDTH + MARGINS.LEFT + MARGINS.RIGHT + 30}px`,
//           overflowY: "auto",
//           maxHeight: "200px",
//           border: "solid 2px #c0c7d1",
//           minWidth: "150px",
//           borderRadius: "6px"


//         }}
//       />
//     </>
//   );
// };

// export default PriceLineChart;

// import { useEffect, useRef, useState } from "react";
// import * as d3 from "d3";
// import CedaIcon from "@/app/assets/icons/CedaIcon";
// import  EyeIcon  from '@/app/assets/icons/EyeIcon';
// import ReactDOM from "react-dom";
// import { Slider } from "antd"; // 


// const MARGINS = {
//   LEFT: 60,
//   RIGHT: 30,
//   TOP: 20,
//   BOTTOM: 60,
// };
// const HEIGHT = 300; // Chart height
// // const WIDTH = 800; // Chart width
// const WIDTH = 650; // Chart width

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

// interface PriceLineChartProps {
//   PriceData: PriceDataItem[];
//   onRemoveCommodity: (commodityName: string) => void;

// }

// const removeDuplicates = (data: PriceDataItem[]) => {
//   const seen = new Set<string>();
//   return data.filter((item) => {
//     const key = `${item.date}-${item.commodity_name}`;
//     if (seen.has(key)) {
//       return false;
//     }
//     seen.add(key);
//     return true;
//   });
// };


// const PriceLineChart: React.FC<PriceLineChartProps> = ({ PriceData, onRemoveCommodity }) => {
//   const xAxisRef = useRef<SVGGElement | null>(null);
//   const yAxisRef = useRef<SVGGElement | null>(null);
//   const chartGroupRef = useRef<SVGGElement | null>(null);
//   const legendRef = useRef<HTMLDivElement | null>(null);
//  // Initialize date range state
//   // Convert dates to Date objects
//   const parseDate = (d: PriceDataItem) => 
//     new Date(d.date || d.month || d.year || "1970-01-01").getTime();

//   // Compute min/max dates
//   const minDate = d3.min(PriceData, parseDate) || new Date("1970-01-01").getTime();
//   const maxDate = d3.max(PriceData, parseDate) || new Date().getTime();

//   const [dateRange, setDateRange] = useState<[number, number]>([minDate, maxDate]);
//   const [clientRendered, setClientRendered] = useState(false);

//   const rangeStyle = {
//     trackStyle: { backgroundColor: 'lightblue' }, // Color of the track between handles
//     railStyle: { backgroundColor: 'lightgray' }, // Color of the rail (background)
//     handleStyle: { backgroundColor: 'darkblue', borderColor: 'darkblue' }, // Color of the handles
//   };
//   const filteredData = PriceData.filter(d => {
//     const date = parseDate(d);
//     return date >= dateRange[0] && date <= dateRange[1];
//   });


//   console.log("fitleredDatacheck",filteredData)


//   // const getUniqueCommodities = () => {
//   //   return Array.from(new Set(filteredData.map((item) => item.commodity_name)));
//   // };

//   useEffect(() => {
//     if (!filteredData || filteredData.length === 0) return;
//     setClientRendered(true);
//     const svg = d3.select(chartGroupRef.current);
//     svg.selectAll("*").remove();

//     const tooltip = d3
//       .select("body")
//       .append("div")
//       .attr("id", "tooltip")
//       .style("position", "absolute")
//       .style("top", "0px")
//       .style("left", "0px")
//       .style("background", "white")
//       .style("border-radius", "4px")
//       .style("box-shadow", "0 4px 40px #0003")
//       .style("pointer-events", "none")
//       .style("opacity", "0")
//       .style("transition", "opacity 0.3s ease");



//     const xScale = d3
//       .scaleUtc()
//       .domain(
//         d3.extent(filteredData, (d) =>
//           new Date(d.date || d.month || d.year || "1970-01-01")
//         ) as unknown as [Date, Date]
//       )
//       .range([0, WIDTH]);
//     const yScale = d3
//       .scaleLinear()
//       .domain([
//         d3.min(filteredData, (d) =>
//           Math.min(d.avg_min_price, d.avg_max_price, d.avg_modal_price)
//         )! - 10,
//         d3.max(filteredData, (d) =>
//           Math.max(d.avg_min_price, d.avg_max_price, d.avg_modal_price)
//         )!,
//       ])
//       .range([HEIGHT, 0]);

//       const minDatefilter = d3.min(filteredData, parseDate) || new Date("1970-01-01").getTime();
//       const maxDatefilter = d3.max(filteredData, parseDate) || new Date().getTime();

//       const dateRangeInDays = (maxDatefilter - minDatefilter) / (1000 * 60 * 60 * 24);

//       console.log("dateRange, min ,max",dateRangeInDays,minDatefilter,maxDatefilter)
//       let tickFormat;
//       if (dateRangeInDays > 365 && dateRangeInDays< 762) {
//         tickFormat = d3.timeFormat("%b, %Y"); // Year format
//       } else if (dateRangeInDays > 90) {
//         tickFormat = d3.timeFormat("%b, %Y"); // Month, Year format
//       } else {
//         tickFormat = d3.timeFormat("%d %b"); // Day, Month format (weekly granularity)
//       }

//       const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat((d) => tickFormat(new Date(d as Date)));

//     // const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat((d) => d3.timeFormat("%b, %Y")(new Date(d as Date)));
//     const yAxis = d3.axisLeft(yScale).ticks(5);

//     d3.select(xAxisRef.current).call(xAxis as any);
//     d3.select(yAxisRef.current).call(yAxis as any);

//     // const color = d3.scaleOrdinal<string>(d3.schemeCategory10);
//     // color palette
//     const color = d3
//                     .scaleOrdinal<string>()
//                     .range([
//                       "#e41a1c",
//                       "#377eb8",
//                       "#4daf4a",
//                       "#984ea3",
//                       "#ff7f00",
//                       "#a65628",
//                       "#db5858",
//                       "#f781bf",
//                       "#db8658",
//                     ]);


//     const groupedData = d3.group(filteredData, (d) => d.commodity_name);

//     const lines = [
//       { key: "avg_modal_price", label: "Modal Price" },
//       { key: "avg_min_price", label: "Min Price" },
//       { key: "avg_max_price", label: "Max Price" },
//     ];

//     groupedData.forEach((commodityData, commodityName) => {
//       lines.forEach((line) => {
//         const lineGenerator = d3
//           .line<PriceDataItem>()
//           .x((d) =>
//             xScale(new Date(d.date || d.month || d.year || "1970-01-01"))
//           )
//           .y((d) => yScale((d as any)[line.key]));

//         svg
//           .append("path")
//           .datum(commodityData)
//           .attr("d", lineGenerator)
//           .attr("fill", "none")
//           .attr("stroke", color(line.label + commodityName))
//           .attr("stroke-width", 2)
//           .attr("class", `line-${line.label.replace(" ", "-").toLowerCase()}-${commodityName}`)
//           .style("display", "block");

//         svg.append("text")
//         .attr("transform", "rotate(-90)") // Rotate the text to be vertical
//         .attr("x", -HEIGHT / 2) // Position at the center vertically
//         .attr("y", -MARGINS.LEFT + 15) // Adjust position to avoid clipping
//         .attr("text-anchor", "middle") // Center the text
//         .style("font-family", "Inter, sans-serif") // Apply Inter font
//         .style("font-weight", "500") // Apply font weight 500
//         .style("font-size", "12px") // Apply font size 16px
//         .style("fill", "#1a375f") // Apply color fill
//         .text("₹/Quintal →");

//         svg.append("text")
//         .attr("class", "font-inter font-medium text-[12px] fill-[#1a375f]") // Add your Tailwind-like classes
//         .attr("text-anchor", "middle") // Center the text horizontally
//         .attr("x", WIDTH / 2) // Center the text on the X-axis
//         .attr("y", HEIGHT + MARGINS.BOTTOM) // Position below the chart
//         .text("Time Period →"); // Set the title text


//         commodityData.forEach((d) => {
//           svg
//             .append("circle")
//             .attr("class", `point-${line.label.replace(" ", "-").toLowerCase()}-${commodityName}`)
//             .attr("cx", xScale(new Date(d.date || d.month || d.year || "1970-01-01")))
//             .attr("cy", yScale((d as any)[line.key]))
//             .attr("r", 4)
//             .attr("fill", color(line.label + commodityName))
//             .style("display", "block")
//             .on("mouseover", (event) => {
//               const formattedDate = d.date
//                 ? d.date.split("-").reverse().join("-")
//                 : d.month
//                   ? `${d.month.split("-")[1]}-${d.month.split("-")[0]}`
//                   : d.year || "";

//               tooltip
//                 .style("opacity", "1")
//                 .html(
//                   `<div class="font-bold text-sm mb-2 bg-gray-400"">${formattedDate}/${commodityName}</div>
//                   <div class="text-xs p-1"><strong>Modal Price:</strong> ${d.avg_modal_price} ₹/Quintal</div>
//                   <div class="text-xs p-1"><strong>Min Price:</strong> ${d.avg_min_price} ₹/Quintal</div>
//                   <div class="text-xs p-1"><strong>Max Price:</strong> ${d.avg_max_price} ₹/Quintal</div>`
//                 );
//             })
//             .on("mousemove", (event) => {
//               const tooltipWidth = 200;
//               const tooltipHeight = 100;
//               const chartContainer = document.getElementById("chart-container");

//               if (!chartContainer) return;

//               const containerRect = chartContainer.getBoundingClientRect();
//               const pageX = event.pageX;
//               const pageY = event.pageY;

//               let tooltipX = pageX + 10;
//               let tooltipY = pageY - 10;

//               if (tooltipX + tooltipWidth > containerRect.right) {
//                 tooltipX = pageX - tooltipWidth - 10;
//               }

//               if (tooltipX < containerRect.left) {
//                 tooltipX = containerRect.left + 10;
//               }

//               if (tooltipY + tooltipHeight > containerRect.bottom) {
//                 tooltipY = pageY - tooltipHeight - 50;
//               }

//               if (tooltipY < containerRect.top) {
//                 tooltipY = pageY + 10;
//               }

//               tooltip
//                 .style("top", `${tooltipY}px`)
//                 .style("left", `${tooltipX}px`)
//                 .style("opacity", "1");
//             })
//             .on("mouseout", () => {
//               tooltip.style("opacity", "0");
//             });
//         });
//       });
//     });


//       const legend = d3.select(legendRef.current);
//       legend.selectAll("*").remove();

//       legend
//         .selectAll(".legend-item")
//         .data(Array.from(groupedData.keys())) // Iterate over commodity names
//         .join("div")
//         .attr("class", "legend-item")
//         .style("display", "flex")
//         .style("flex-direction", "column")
//         .style("margin-bottom", "20px")
//         .style("margin", "5px")
//         .each(function (commodityName) {
//           const div = d3.select(this);

//           // Add commodity name and remove button
//           const header = div.append("div")
//             .style("display", "flex")
//             .style("align-items", "center")
//             .style("margin-bottom", "5px");

//           header.append("span")
//             .text(commodityName)
//             .style("font-weight", "bold")
//             .style("font-size", "14px");

//           header.append("button")
//             .text("x")
//             .style("margin-left", "100px")
//             .style("cursor", "pointer")
//             .style("background", "none")
//             .style("border", "none")
//             .style("color", "grey")
//             .style("font-size", "14px")
//             .on("click", () => {
//               lines.forEach((line) => {
//                 const lineKey = `${line.label.replace(" ", "-").toLowerCase()}-${commodityName}`;
//                 svg.selectAll(`.line-${lineKey}`).remove();
//                 svg.selectAll(`.point-${lineKey}`).remove();
//               });
//               onRemoveCommodity(commodityName);
//             });

//           // Add rectangles with labels and eye icons
//           lines.forEach((line) => {
//             const lineKey = `${line.label.replace(" ", "-").toLowerCase()}-${commodityName}`;
//             const row = div.append("div")
//               .style("display", "flex")
//               .style("align-items", "center")
//               .style("margin-top", "5px");

//             // Add rectangle
//             row.append("div")
//               .style("width", "15px")
//               .style("height", "15px")
//               .style("background-color", color(line.label + commodityName))
//               .style("margin-right", "10px")
//               .style("border-radius","5px");

//             // Add Eye Icon
//             const eyeContainer = row.append("div")
//   .style("margin-right", "10px")
//   .style("cursor", "pointer");

// const node = eyeContainer.node(); // Store the node reference

// if (node) {
//   ReactDOM.render(
//     <EyeIcon
//       onClick={() => {
//         const isHidden = svg.selectAll(`.line-${lineKey}`).style("display") === "none";
//         svg.selectAll(`.line-${lineKey}`).style("display", isHidden ? "block" : "none");
//         svg.selectAll(`.point-${lineKey}`).style("display", isHidden ? "block" : "none");

//         node.style.color = isHidden ? "grey" : "black";
//       }}
//     />,
//     node
//   );
// }
//             // Add label text (min, max, modal)
//             row.append("span")
//               .text(line.label)
//               .style("font-size", "12px");
//           });
//         });

//   }, [filteredData, dateRange]);

//   return (
//     <>
//       <div
//         className="overflow-visible pt-2 pl-6 pr-[24px]"
//         style={{
//           width: `${WIDTH + MARGINS.LEFT + MARGINS.RIGHT + 130}px`,
//           height: `${HEIGHT + MARGINS.TOP + MARGINS.BOTTOM + 50 + 10}px`,
//           display: "flex",
//           flexDirection: "row",
//           paddingTop: "50px",
//         }}
//       >
//         <svg
//           style={{
//             position: "absolute",
//             top: "100px",
//             width: "600px",
//             transform: "translate(25%, 25%)",
//             opacity: 0.05,
//             pointerEvents: "none",
//           }}
//         >
//           <g>
//             <CedaIcon
//               style={{ width: "600px", height: "100px" }}
//               width={600} // Adjust width as needed
//               height={100} // Adjust height as needed
//             />
//           </g>
//         </svg>
//         <svg
//           width={WIDTH + MARGINS.LEFT + MARGINS.RIGHT}
//           height={HEIGHT + MARGINS.TOP + MARGINS.BOTTOM}
//         >
//           <g
//             id="chart-container"
//             ref={chartGroupRef}
//             transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`}
//           />
//           <g
//             ref={xAxisRef}
//             transform={`translate(${MARGINS.LEFT}, ${HEIGHT + MARGINS.TOP})`}
//           />
//           <g ref={yAxisRef} transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`} />
//         </svg>
//       </div>
//       <div
//         ref={legendRef}
//         style={{
//           position: "absolute",
//           top: `${MARGINS.TOP + 80}px`,
//           left: `${WIDTH + MARGINS.LEFT + MARGINS.RIGHT + 10}px`,
//           overflowY: "auto",
//           maxHeight: "200px",
//           border: "solid 2px #c0c7d1",
//           minWidth: "150px",
//           borderRadius: "6px"


//         }}
//       />
//        <div style={{ display: "flex", flexDirection: "column",padding:"5px", width:"700px", marginLeft:"30px" }}>

//      < Slider
//         range

//         min={minDate}
//         max={maxDate}
//         step={24 * 60 * 60 * 1000}
//         value={dateRange}
//         onChange={(value) => setDateRange(value as [number, number])} 
//         tooltip={{
//           formatter: (val) =>
//             val !== undefined ? new Date(val).toLocaleDateString() : "", // Handle undefined case
//         }}

//       />
//       {/* Avoid hydration errors by rendering only on the client */}
//       {clientRendered && (
//         <div className='text-sm' style={{ display: "flex", justifyContent: "space-between", marginTop: "5px"}}>
//           <span>{new Date(dateRange[0]).toLocaleDateString()}</span>
//           <span>{new Date(dateRange[1]).toLocaleDateString()}</span>
//         </div>
//       )}
//       </div>
//     </>
//   );
// };

// export default PriceLineChart;



import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import CedaIcon from "@/app/assets/icons/CedaIcon";
import EyeIcon from '@/app/assets/icons/EyeIcon';
import ReactDOM from "react-dom";
import { Slider } from "antd"; // 


const MARGINS = {
  LEFT: 60,
  RIGHT: 30,
  TOP: 20,
  BOTTOM: 60,
};
const HEIGHT = 300; // Chart height
// const WIDTH = 800; // Chart width
const WIDTH = 650; // Chart width

interface PriceDataItem {
  date: string;
  avg_modal_price: number;
  avg_min_price: number;
  avg_max_price: number;
  moving_average?: number;
  commodity_name: string;
  month?: string;
  year?: string;
  state_name?: string;
  district_name?: string;  // Add district support
  state_id?: number;       // Add state_id for "All India" cases
}

interface PriceLineChartProps {
  PriceData: PriceDataItem[];
  onRemoveCommodity: (commodityName: string, state: string, district: string) => void;
  // onRemoveCommodity: (commodity: string) => void;

}

const removeDuplicates = (data: PriceDataItem[]) => {
  const seen = new Set<string>();
  return data.filter((item) => {
    const key = `${item.date}-${item.commodity_name}`;
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};


const PriceLineChart: React.FC<PriceLineChartProps> = ({ PriceData, onRemoveCommodity }) => {
  const xAxisRef = useRef<SVGGElement | null>(null);
  const yAxisRef = useRef<SVGGElement | null>(null);
  const chartGroupRef = useRef<SVGGElement | null>(null);
  const legendRef = useRef<HTMLDivElement | null>(null);
  // Initialize date range state
  // Convert dates to Date objects
  const parseDate = (d: PriceDataItem) =>
    new Date(d.date || d.month || d.year || "1970-01-01").getTime();

  // Compute min/max dates
  const minDate = d3.min(PriceData, parseDate) || new Date("1970-01-01").getTime();
  const maxDate = d3.max(PriceData, parseDate) || new Date().getTime();

  const [dateRange, setDateRange] = useState<[number, number]>([minDate, maxDate]);
  const [clientRendered, setClientRendered] = useState(false);

  const rangeStyle = {
    trackStyle: { backgroundColor: 'lightblue' }, // Color of the track between handles
    railStyle: { backgroundColor: 'lightgray' }, // Color of the rail (background)
    handleStyle: { backgroundColor: 'darkblue', borderColor: 'darkblue' }, // Color of the handles
  };
  const filteredData = PriceData.filter(d => {
    const date = parseDate(d);
    return date >= dateRange[0] && date <= dateRange[1];
  });


  console.log("fitleredDatacheck", filteredData)


  useEffect(() => {
    if (!filteredData || filteredData.length === 0) return;
    setClientRendered(true);
    const svg = d3.select(chartGroupRef.current);
    svg.selectAll("*").remove();

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("top", "0px")
      .style("left", "0px")
      .style("background", "white")
      .style("border-radius", "4px")
      .style("box-shadow", "0 4px 40px #0003")
      .style("pointer-events", "none")
      .style("opacity", "0")
      .style("transition", "opacity 0.3s ease");



    const xScale = d3
      .scaleUtc()
      .domain(
        d3.extent(filteredData, (d) =>
          new Date(d.date || d.month || d.year || "1970-01-01")
        ) as unknown as [Date, Date]
      )
      .range([0, WIDTH]);
    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(filteredData, (d) =>
          Math.min(d.avg_min_price, d.avg_max_price, d.avg_modal_price)
        )! - 10,
        d3.max(filteredData, (d) =>
          Math.max(d.avg_min_price, d.avg_max_price, d.avg_modal_price)
        )!,
      ])
      .range([HEIGHT, 0]);

    const minDatefilter = d3.min(filteredData, parseDate) || new Date("1970-01-01").getTime();
    const maxDatefilter = d3.max(filteredData, parseDate) || new Date().getTime();

    const dateRangeInDays = (maxDatefilter - minDatefilter) / (1000 * 60 * 60 * 24);

    console.log("dateRange, min ,max", dateRangeInDays, minDatefilter, maxDatefilter)
    let tickFormat;
    if (dateRangeInDays > 365 && dateRangeInDays < 762) {
      tickFormat = d3.timeFormat("%b, %Y"); // Year format
    } else if (dateRangeInDays > 90) {
      tickFormat = d3.timeFormat("%b, %Y"); // Month, Year format
    } else {
      tickFormat = d3.timeFormat("%d %b"); // Day, Month format (weekly granularity)
    }

    const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat((d) => tickFormat(new Date(d as Date)));

    // const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat((d) => d3.timeFormat("%b, %Y")(new Date(d as Date)));
    const yAxis = d3.axisLeft(yScale).ticks(5);

    d3.select(xAxisRef.current).call(xAxis as any);
    d3.select(yAxisRef.current).call(yAxis as any);


    const color = d3
      .scaleOrdinal<string>()
      .range([
        "#e41a1c",
        "#377eb8",
        "#4daf4a",
        "#984ea3",
        "#ff7f00",
        "#a65628",
        "#db5858",
        "#f781bf",
        "#db8658",
      ]);


   
    const groupedData = d3.group(filteredData, (d) => {
      // Separate edge cases
      const isAllIndia = d.state_id === 0;

      return `${d.commodity_name}-${isAllIndia ? "All India" : d.state_name || ""}-${d.district_name || ""}`;
    });

    const lines = [
      { key: "avg_modal_price", label: "Modal Price" },
      { key: "avg_min_price", label: "Min Price" },
      { key: "avg_max_price", label: "Max Price" },
    ];

    groupedData.forEach((commodityData, groupKey) => {
      const [commodity, state, district] = groupKey.split("-");

      lines.forEach((line) => {
        const lineGenerator = d3
          .line<PriceDataItem>()
          .x((d) => xScale(new Date(d.date || d.month || d.year || "1970-01-01")))
          .y((d) => yScale((d as any)[line.key]));

        svg.append("path")
          .datum(commodityData)
          .attr("d", lineGenerator)
          .attr("fill", "none")
          .attr("stroke", color(line.label + commodity + state + district))
          .attr("stroke-width", 2)
          .attr("class", `line-${line.label.replace(" ", "-").toLowerCase()}-${commodity}-${state}-${district}`)
          .style("display", "block");

        svg.append("text")
          .attr("transform", "rotate(-90)") // Rotate the text to be vertical
          .attr("x", -HEIGHT / 2) // Position at the center vertically
          .attr("y", -MARGINS.LEFT + 15) // Adjust position to avoid clipping
          .attr("text-anchor", "middle") // Center the text
          .style("font-family", "Inter, sans-serif") // Apply Inter font
          .style("font-weight", "500") // Apply font weight 500
          .style("font-size", "12px") // Apply font size 16px
          .style("fill", "#1a375f") // Apply color fill
          .text("₹/Quintal →");

        svg.append("text")
          .attr("class", "font-inter font-medium text-[12px] fill-[#1a375f]") // Add your Tailwind-like classes
          .attr("text-anchor", "middle") // Center the text horizontally
          .attr("x", WIDTH / 2) // Center the text on the X-axis
          .attr("y", HEIGHT + MARGINS.BOTTOM) // Position below the chart
          .text("Time Period →"); // Set the title text


        commodityData.forEach((d) => {
          svg
            .append("circle")
            .attr("class", `point-${line.label.replace(" ", "-").toLowerCase()}-${commodity}-${state}-${district}`)
            .attr("cx", xScale(new Date(d.date || d.month || d.year || "1970-01-01")))
            .attr("cy", yScale((d as any)[line.key]))
            .attr("r", 4)
            .attr("fill", color(line.label + commodity + state + district))
            .style("display", "block")
            .on("mouseover", (event) => {
              const formattedDate = d.date
                ? d.date.split("-").reverse().join("-")
                : d.month
                  ? `${d.month.split("-")[1]}-${d.month.split("-")[0]}`
                  : d.year || "";

              tooltip
                .style("opacity", "1")
                .html(
                  `<div class="font-bold text-sm mb-2 bg-gray-400"">${formattedDate}/${commodity}-${state} ${district === 'All' ? '' : district}</div>
                  <div class="text-xs p-1"><strong>Modal Price:</strong> ${d.avg_modal_price} ₹/Quintal</div>
                  <div class="text-xs p-1"><strong>Min Price:</strong> ${d.avg_min_price} ₹/Quintal</div>
                  <div class="text-xs p-1"><strong>Max Price:</strong> ${d.avg_max_price} ₹/Quintal</div>`
                );
            })
            .on("mousemove", (event) => {
              const tooltipWidth = 200;
              const tooltipHeight = 100;
              const chartContainer = document.getElementById("chart-container");

              if (!chartContainer) return;

              const containerRect = chartContainer.getBoundingClientRect();
              const pageX = event.pageX;
              const pageY = event.pageY;

              let tooltipX = pageX + 10;
              let tooltipY = pageY - 10;

              if (tooltipX + tooltipWidth > containerRect.right) {
                tooltipX = pageX - tooltipWidth - 10;
              }

              if (tooltipX < containerRect.left) {
                tooltipX = containerRect.left + 10;
              }

              if (tooltipY + tooltipHeight > containerRect.bottom) {
                tooltipY = pageY - tooltipHeight - 50;
              }

              if (tooltipY < containerRect.top) {
                tooltipY = pageY + 10;
              }

              tooltip
                .style("top", `${tooltipY}px`)
                .style("left", `${tooltipX}px`)
                .style("opacity", "1");
            })
            .on("mouseout", () => {
              tooltip.style("opacity", "0");
            });
        });
      });
    });


    const legend = d3.select(legendRef.current);
    legend.selectAll("*").remove();

    legend
      .selectAll(".legend-item")
      .data(Array.from(groupedData.keys())) // Iterate over commodity names
      .join("div")
      .attr("class", "legend-item")
      .style("display", "flex")
      .style("flex-direction", "column")
      .style("margin-bottom", "20px")
      .style("margin", "5px")
      .style("width", "150px") // Set a fixed width for the legend item
      .style("word-wrap", "break-word") // Allow text wrapping
      .style("overflow-wrap", "break-word")
      
      .each(function (groupKey) {
        const [commodity, state, district] = groupKey.split("-");
        const div = d3.select(this);

        // Add commodity name and remove button
        const header = div.append("div")
          .style("display", "flex")
          // .style("align-items", "center")
          // .style("margin-bottom", "5px");
          .style("align-items", "flex-start") // Align items at the top
          .style("position", "relative") // Needed for button positioning
          .style("width", "100%");

        header.append("span")
          // .text(`${commodity} (${state} ${district})`)
          .text(`${commodity} (${state} ${district === 'All' ? '' : district})`)
          .style("font-weight", "bold")
          .style("font-size", "12px")
          // .style("white-space", "nowrap")  // Prevents text wrapping
          .style("word-wrap", "break-word") // Allow text to wrap
      // .style("overflow-wrap", "break-word")
         .style("max-width", "120px"); // Limit width so text wraps properly
          // .style("overflow", "hidden")     // Hides overflow text
          // .style("text-overflow", "ellipsis"); // Adds "..." if text overflows

        header.append("button")
          .text("x")
          .style("cursor", "pointer")
          .style("background", "none")
          .style("border", "none")
          .style("color", "grey")
          .style("position", "absolute")   // Position the button absolutely
          .style("right", "5px") // Keep button aligned
          // .style("right", "0")
          .style("padding-right", "2px")         // Align it to the right side of the parent container
          // .style("top", "50%")             // Optionally center vertically within the container
          // .style("transform", "translateY(-50%)")// Center vertically more accurately
          .style("font-size", "12px")
          .on("click", () => {

            onRemoveCommodity(commodity, state, district);
          });
    

        // Add rectangles with labels and eye icons
        lines.forEach((line) => {
          const lineKey = `${line.label.replace(" ", "-").toLowerCase()}-${commodity}-${state}-${district}`;
          const row = div.append("div")
            .style("display", "flex")
            .style("align-items", "center")
            .style("margin-top", "5px");

          // Add rectangle
          row.append("div")
            .style("width", "15px")
            .style("height", "15px")
            .style("background-color", color(line.label + commodity + state + district))
            .style("margin-right", "10px")
            .style("border-radius", "5px");

          // Add Eye Icon
          const eyeContainer = row.append("div")
            .style("margin-right", "10px")
            .style("cursor", "pointer");

          const node = eyeContainer.node(); // Store the node reference


          function escapeSelector(selector: string): string  {
            return selector.replace(/([.#\[\],?\\^$|()*+~\-])/g, '\\$1');
          }
          if (node) {
            // Define the escapeSelector function outside the render
           
          
            // Use ReactDOM.render properly
            ReactDOM.render(
              <EyeIcon
                onClick={() => {
                  const escapedLineKey = escapeSelector(lineKey);  // Use the escape function here
                  console.log("linekey", escapedLineKey);
          
                  const isHidden = svg.selectAll(`.line-${escapedLineKey}`).style("display") === "none";
                  svg.selectAll(`.line-${escapedLineKey}`).style("display", isHidden ? "block" : "none");
                  svg.selectAll(`.point-${escapedLineKey}`).style("display", isHidden ? "block" : "none");
          
                  node.style.color = isHidden ? "grey" : "black";
                }}
              />,
              node // The node to render into
            );
          }
          
          // Add label text (min, max, modal)
          row.append("span")
            .text(line.label)
            .style("font-size", "12px");
        });
      });

  }, [filteredData, dateRange]);

  return (
    <>
      <div
        className="overflow-visible pt-2 pl-6 pr-[24px]"
        style={{
          width: `${WIDTH + MARGINS.LEFT + MARGINS.RIGHT + 130}px`,
          height: `${HEIGHT + MARGINS.TOP + MARGINS.BOTTOM + 50 + 10}px`,
          display: "flex",
          flexDirection: "row",
          paddingTop: "50px",
        }}
      >
        <svg
          style={{
            position: "absolute",
            top: "100px",
            width: "600px",
            transform: "translate(25%, 25%)",
            opacity: 0.05,
            pointerEvents: "none",
          }}
        >
          <g>
            <CedaIcon
              style={{ width: "600px", height: "100px" }}
              width={600} // Adjust width as needed
              height={100} // Adjust height as needed
            />
          </g>
        </svg>
        <svg
          width={WIDTH + MARGINS.LEFT + MARGINS.RIGHT}
          height={HEIGHT + MARGINS.TOP + MARGINS.BOTTOM}
        >
          <g
            id="chart-container"
            ref={chartGroupRef}
            transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`}
          />
          <g
            ref={xAxisRef}
            transform={`translate(${MARGINS.LEFT}, ${HEIGHT + MARGINS.TOP})`}
          />
          <g ref={yAxisRef} transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`} />
        </svg>
      </div>
      <div
        ref={legendRef}
        style={{
          position: "absolute",
          top: `${MARGINS.TOP + 80}px`,
          left: `${WIDTH + MARGINS.LEFT + MARGINS.RIGHT + 10}px`,
          overflowY: "auto",
          maxHeight: "200px",
          border: "solid 2px #c0c7d1",
          minWidth: "150px",
          borderRadius: "6px"


        }}
      />
      <div style={{ display: "flex", flexDirection: "column", padding: "5px", width: "700px", marginLeft: "30px" }}>

        < Slider
          range

          min={minDate}
          max={maxDate}
          step={24 * 60 * 60 * 1000}
          value={dateRange}
          onChange={(value) => setDateRange(value as [number, number])}
          tooltip={{
            formatter: (val) =>
              val !== undefined ? new Date(val).toLocaleDateString() : "", // Handle undefined case
          }}

        />
        {/* Avoid hydration errors by rendering only on the client */}
        {clientRendered && (
          <div className='text-sm' style={{ display: "flex", justifyContent: "space-between", marginTop: "5px" }}>
            <span>{new Date(dateRange[0]).toLocaleDateString()}</span>
            <span>{new Date(dateRange[1]).toLocaleDateString()}</span>
          </div>
        )}
      </div>
    </>
  );
};

export default PriceLineChart;
