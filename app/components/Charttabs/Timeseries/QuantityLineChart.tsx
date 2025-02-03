// import { useEffect, useRef } from "react";
// import * as d3 from "d3";
// // import { ChartButton } from "./ChartButton";
// import html2canvas from "html2canvas";
// import CedaIcon from "@/app/assets/icons/CedaIcon";
// import { Suspense } from "react";

// const MARGINS = {
//   LEFT: 40,
//   RIGHT: 30,
//   TOP: 20,
//   BOTTOM: 40, // Increased to 80 for legend space
// };
// const WIDTH = 800;
// const HEIGHT = 300;

// interface QtyDataItem {
//   date: string;
//   total_quantity: number;
//   commodity_name: string;
//   month?: string;
//   year?: string;
//   state_name?: string;
// }

// interface QuantityLineChartProps {
//     QtyData: QtyDataItem[];
// }

// const QuantityLineChart: React.FC<QuantityLineChartProps> = ({ QtyData }) => {
//   const xAxisRef = useRef<SVGGElement | null>(null);
//   const yAxisRef = useRef<SVGGElement | null>(null);
//   const chartGroupRef = useRef<SVGGElement | null>(null);
//   const legendRef = useRef<SVGGElement | null>(null);
//   const svgRef = useRef<SVGSVGElement | null>(null);



//   useEffect(() => {
//     if (!QtyData || QtyData.length === 0) return;

//     const svg = d3.select(chartGroupRef.current);
//     svg.selectAll("*").remove();

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
//         d3.extent(QtyData, (d) => new Date(d.date || d.month || d.year || "1970-01-01")) as [Date, Date]
//       )
//       .range([0, WIDTH]);

//     const yScale = d3
//       .scaleLinear()
//       .domain([0,d3.max(QtyData, (d) => d.total_quantity)! * 1.1])
//       .range([HEIGHT, 0]);

//     console.log("yaxis",QtyData,yScale)

//     const xAxis = d3
//       .axisBottom(xScale)
//       .ticks(10)
//       .tickFormat((d) => d3.timeFormat("%b, %Y")(new Date(d as Date)));

//     // const yAxis = d3.axisLeft(yScale).ticks(5);

//     const yAxis = d3
//   .axisLeft(yScale)
//   .ticks(5) // Control the number of ticks
//   .tickFormat(d3.format(".3s"));
//     console.log("yaxis",QtyData,yScale,yAxis)

//     d3.select(xAxisRef.current).call(xAxis as any);
//     d3.select(yAxisRef.current).call(yAxis as any);
//     const color = d3.scaleOrdinal<string>(d3.schemeCategory10);
//     const lines = [{ key: "total_quantity", label: "Total Quantity" }];

//     lines.forEach((line)=>{
//     const lineGenerator = d3
//       .line<QtyDataItem>()
//       .x((d) => xScale(new Date(d.date || d.month || d.year || "1970-01-01")))
//       .y((d) => yScale(d.total_quantity))
//       .curve(d3.curveMonotoneX);

//     svg
//       .append("path")
//       .datum(QtyData)
//       .attr("class", "line-total-quantity")
//       .attr("d", lineGenerator)
//       .attr("fill", "none")
//       .attr("stroke", "#1A375F")
//       .attr("stroke-width", 2);

//     svg
//       .selectAll(".circle-total-quantity")
//       .data(QtyData)
//       .join("circle")
//       .attr("class", "circle-total-quantity")
//       .attr("cx", (d) => xScale(new Date(d.date || d.month || d.year || "1970-01-01")))
//       .attr("cy", (d) => yScale(d.total_quantity))
//       .attr("r", 4)
//       .attr("fill", "#1A375F")
//       .on("mouseover", (event, d) => {
//         tooltip
//         .style("opacity", "1")
//         .html(() => {
//           // Parse the date string and format it accordingly
//           let formattedDate = "";
//           let label = "";
//           if (d.date) {
//             // Format for d.date (dd-mm-yy)
//             const [year, month, day] = d.date.split("-");
//             formattedDate = `${day}-${month}-${year.slice(-2)}`;
//             label= "Date:";
//           } else if (d.month) {
//             // Format for d.month (mm,yy)
//             const [year, month] = d.month.split("-");
//             formattedDate = `${month}/${year.slice(-2)}`;
//             label= "Month:";
//           } else if (d.year) {
//             // Format for d.year (yy)
//             const [year] = d.year.split("-");
//             formattedDate = `${year}`;
//             label= "Year:";
//           }
//           return `<strong>${line.label}:</strong> ${(d as any)[line.key]} Tonne<br><strong>${label}</strong> ${formattedDate}`;
//         });
//       })
//       .on("mousemove", (event) => {
//         tooltip
//           .style("top", `${event.pageY - 10}px`)
//           .style("left", `${event.pageX + 10}px`);
//       })
//       .on("mouseout", () => {
//         tooltip.style("opacity", "0");
//       });
//     });

//     const legend = d3.select(legendRef.current);
//     legend.selectAll("*").remove();

//     legend
//       .attr(
//         "transform",
//         `translate(${MARGINS.LEFT}, ${HEIGHT + MARGINS.TOP + 60-10})`
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
//   }, [QtyData]);

//   return (
//     <div
//       id="chart-container"
//       className="relative"
//       style={{
//         width: `${WIDTH + MARGINS.LEFT + MARGINS.RIGHT}px`,
//         height: `${HEIGHT + MARGINS.TOP + MARGINS.BOTTOM + 50+80}px`,
//         paddingLeft: '30px',
//         paddingTop: '10px'
//       }}
//     >
//       <div className="flex justify-end">
//         {/* <ChartButton icon="download" onClick={handleDownloadChart} /> */}
//       </div>
//       <svg style={{
//       position: "absolute",
//       top: '100px',
//       // left: '200px',
//       width:'600px',
//       transform: "translate(25%, 25%)",
//       opacity: 0.05,
//       // zIndex: -1, // Ensure it's behind
//       pointerEvents: "none", // Prevent interference with interactions
//     }}
//   >
//     <g>
//       <CedaIcon
//         style={{width:'600px', height:'100px'}}
//         width={600} // Adjust width as needed
//         height={100} // Adjust height as needed
//       />

//             </g>
//           </svg>
//       <Suspense fallback={<p>Loading...</p>}>
//         <svg
//           ref={svgRef}
//           width={WIDTH + MARGINS.LEFT + MARGINS.RIGHT}
//           height={HEIGHT + MARGINS.TOP + MARGINS.BOTTOM+100}
//         >
//           <g
//             ref={chartGroupRef}
//             transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`}
//           />
//           <g
//             ref={xAxisRef}
//             transform={`translate(${MARGINS.LEFT}, ${HEIGHT + MARGINS.TOP})`}
//           />
//           <g ref={yAxisRef} transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`} />
//           <g ref={legendRef} />
//         </svg>
//       </Suspense>
//     </div>
//   );
// };

// export default QuantityLineChart;


// import { useEffect, useRef } from "react";
// import * as d3 from "d3";

// import CedaIcon from "@/app/assets/icons/CedaIcon";
// import { Suspense } from "react";

// const MARGINS = {
//   LEFT: 40,
//   RIGHT: 30,
//   TOP: 20,
//   BOTTOM: 40, // Increased to 80 for legend space
// };
// const WIDTH = 800;
// const HEIGHT = 300;

// interface QtyDataItem {
//   date: string;
//   total_quantity: number;
//   commodity_name: string;
//   month?: string;
//   year?: string;
//   state_name?: string;
// }

// interface QuantityLineChartProps {
//   QtyData: QtyDataItem[];
// }

// const QuantityLineChart: React.FC<QuantityLineChartProps> = ({ QtyData }) => {
//   const xAxisRef = useRef<SVGGElement | null>(null);
//   const yAxisRef = useRef<SVGGElement | null>(null);
//   const chartGroupRef = useRef<SVGGElement | null>(null);
//   const legendRef = useRef<SVGGElement | null>(null);
//   const svgRef = useRef<SVGSVGElement | null>(null);



//   useEffect(() => {
//     if (!QtyData || QtyData.length === 0) return;

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
//         d3.extent(QtyData,
//           (d) => new Date(d.date || d.month || d.year || "1970-01-01")
//         ) as [Date, Date]
//       )
//       .range([0, WIDTH]);

//     const yScale = d3
//       .scaleLinear()
//       .domain([0, d3.max(QtyData, (d) => d.total_quantity)! * 1.1])
//       .range([HEIGHT, 0]);

//     // console.log("yaxis",QtyData,yScale)

//     const xAxis = d3
//       .axisBottom(xScale)
//       .ticks(10)
//       .tickFormat((d) => d3.timeFormat("%b, %Y")(new Date(d as Date)));

//     // const yAxis = d3.axisLeft(yScale).ticks(5);

//     const yAxis = d3
//       .axisLeft(yScale)
//       .ticks(5) // Control the number of ticks
//       .tickFormat(d3.format(".3s"));
//     console.log("yaxis", QtyData, yScale, yAxis)

//     d3.select(xAxisRef.current).call(xAxis as any);
//     d3.select(yAxisRef.current).call(yAxis as any);
//     const color = d3.scaleOrdinal<string>(d3.schemeCategory10);
//     const lines = [{ key: "total_quantity", label: "Total Quantity" }];

//     lines.forEach((line) => {
//       const lineGenerator = d3
//         .line<QtyDataItem>()
//         .x((d) => xScale(new Date(d.date || d.month || d.year || "1970-01-01")))
//         .y((d) => yScale(d.total_quantity))
//         .curve(d3.curveMonotoneX);

//       svg
//         .append("path")
//         .datum(QtyData)
//         .attr("class", "line-total-quantity")
//         .attr("d", lineGenerator)
//         .attr("fill", "none")
//         .attr("stroke", "#1A375F")
//         .attr("stroke-width", 2);

//     });

//     QtyData.forEach((d) => {
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
//                 ? `${d.month.split("-")[1]}-${d.month.split("-")[0]}`
//                 : d.year || "";

//             tooltip
//               .style("opacity", "1")
//               .html(
//                 `<div class="font-bold text-sm mb-2 bg-gray-400">${formattedDate}</div>
//                  <div class="text-xs p-1"><strong>Total Quantity:</strong> ${d.total_quantity} Tonne</div>`
//               );
//           })
//           .on("mousemove", (event) => {
//             const tooltipWidth = 200; // Approximate tooltip width
//             const tooltipHeight = 100; // Approximate tooltip height
//             const chartContainer = document.getElementById("chart-container");
            
//             if (!chartContainer) return;
          
//             const containerRect = chartContainer.getBoundingClientRect();
//             const pageX = event.pageX;
//             const pageY = event.pageY;
          
//             let tooltipX = pageX + 10; // Default position: to the right of the cursor
//             let tooltipY = pageY - 10; // Default position: above the cursor
          
//             // Adjust if the tooltip overflows the right edge
//             if (pageX + tooltipWidth > containerRect.right) {
//               tooltipX = pageX - tooltipWidth - 40; // Position to the left of the cursor
//             }
          
//             // Adjust if the tooltip overflows the bottom edge
//             if (pageY + tooltipHeight > containerRect.bottom) {
//               tooltipY = pageY - tooltipHeight - 10; // Position above the cursor
//             }
          
//             // Adjust if the tooltip overflows the top edge
//             if (tooltipY < containerRect.top) {
//               tooltipY = pageY + 10; // Position below the cursor
//             }
          
//             tooltip
//               .style("top", `${tooltipY}px`)
//               .style("left", `${tooltipX}px`);
//           })
          
//           .on("mouseout", () => {
//             tooltip.style("opacity", "0");
//           });
//       });
//     });
    
// const legend = d3.select(legendRef.current);
// legend.selectAll("*").remove();

// legend
//   .attr(
//     "transform",
//     `translate(${MARGINS.LEFT}, ${HEIGHT + MARGINS.TOP + 60 - 10})`
//   )
//   .selectAll(".legend-item")
//   .data(lines)
//   .join("g")
//   .attr("class", "legend-item")
//   .attr("transform", (_, i) => `translate(${i * 100}, 0)`)
//   .each(function (line) {
//     const g = d3.select(this);
//     g.append("rect")
//       .attr("width", 15)
//       .attr("height", 15)
//       .attr("fill", color(line.key));

//     g.append("text")
//       .attr("x", 20)
//       .attr("y", 12)
//       .style("font-size", "12px")
//       .style("alignment-baseline", "middle")
//       .text(line.label);
//   });


// return () => {
//   tooltip.remove();
// };
//   }, [QtyData]);

// return (
//   <div
//     id="chart-container"
//     className="relative"
//     style={{
//       width: `${WIDTH + MARGINS.LEFT + MARGINS.RIGHT}px`,
//       height: `${HEIGHT + MARGINS.TOP + MARGINS.BOTTOM + 50 + 80}px`,
//       paddingLeft: '30px',
//       paddingTop: '10px'
//     }}
//   >
//     <div className="flex justify-end">
//       {/* <ChartButton icon="download" onClick={handleDownloadChart} /> */}
//     </div>
//     <svg style={{
//       position: "absolute",
//       top: '100px',
//       // left: '200px',
//       width: '600px',
//       transform: "translate(25%, 25%)",
//       opacity: 0.05,
//       // zIndex: -1, // Ensure it's behind
//       pointerEvents: "none", // Prevent interference with interactions
//     }}
//     >
//       <g>
//         <CedaIcon
//           style={{ width: '600px', height: '100px' }}
//           width={600} // Adjust width as needed
//           height={100} // Adjust height as needed
//         />

//       </g>
//     </svg>
//     <Suspense fallback={<p>Loading...</p>}>
//       <svg
//         ref={svgRef}
//         width={WIDTH + MARGINS.LEFT + MARGINS.RIGHT}
//         height={HEIGHT + MARGINS.TOP + MARGINS.BOTTOM + 100}
//       >
//         <g
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
//     </Suspense>
//   </div>
// );
// };

// export default QuantityLineChart;
// import { useEffect, useRef, useState } from "react";
// import * as d3 from "d3";
// import ReactDOM from "react-dom";
// import CedaIcon from "@/app/assets/icons/CedaIcon";
// import  EyeIcon  from '@/app/assets/icons/EyeIcon';
// import { Suspense } from "react";
// import { Slider } from "antd"; //

// const MARGINS = {
//   LEFT: 60,
//   RIGHT: 30,
//   TOP: 20,
//   BOTTOM: 40, // Increased to 80 for legend space
// };
// const WIDTH = 650;
// const HEIGHT = 300;

// interface QtyDataItem {
//   date: string;
//   total_quantity: number;
//   commodity_name: string;
//   month?: string;
//   year?: string;
//   state_name?: string;
// }

// interface QuantityLineChartProps {
//   QtyData: QtyDataItem[];
//   onRemoveCommodity: (commodityName: string) => void;
// }

// const QuantityLineChart: React.FC<QuantityLineChartProps> = ({ QtyData, onRemoveCommodity }) => {
//   const [data, setData] = useState(QtyData); // State to manage data updates
//   const xAxisRef = useRef<SVGGElement | null>(null);
//   const yAxisRef = useRef<SVGGElement | null>(null);
//   const chartGroupRef = useRef<SVGGElement | null>(null);
//   const legendRef = useRef<HTMLDivElement | null>(null);


//   // Convert dates to Date objects
//   const parseDate = (d: QtyDataItem) => 
//   new Date(d.date || d.month || d.year || "1970-01-01").getTime();

//   // Compute min/max dates
//   const minDate = d3.min(QtyData, parseDate) || new Date("1970-01-01").getTime();
//   const maxDate = d3.max(QtyData, parseDate) || new Date().getTime();

//   const [dateRange, setDateRange] = useState<[number, number]>([minDate, maxDate]);
//   const [clientRendered, setClientRendered] = useState(false);


//   const filteredData = QtyData.filter(d => {
//     const date = parseDate(d);
//     return date >= dateRange[0] && date <= dateRange[1];
//   });

//   // Fu

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
//         d3.extent(filteredData, (d) => new Date(d.date || d.month || d.year || "1970-01-01")) as [Date, Date]
//       )
//       .range([0, WIDTH]);

//     const yScale = d3
//       .scaleLinear()
//       .domain([0, d3.max(filteredData, (d) => d.total_quantity)! * 1.1])
//       .range([HEIGHT, 0]);

//     const minDatefilter = d3.min(filteredData, parseDate) || new Date("1970-01-01").getTime();
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

//     const yAxis = d3
//       .axisLeft(yScale)
//       .ticks(5)
//       .tickFormat(d3.format(".3s"));

//     d3.select(xAxisRef.current).call(xAxis as any);
//     d3.select(yAxisRef.current).call(yAxis as any);

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

    
//     const lines = [{ key: "total_quantity", label: "Total Quantity" }];

//     const groupedData = d3.group(filteredData, (d) => d.commodity_name);

//     groupedData.forEach((commodityData, commodityName) => {
//       lines.forEach((line) => {
//         const lineGenerator = d3
//           .line<QtyDataItem>()
//           .x((d) => xScale(new Date(d.date || d.month || d.year || "1970-01-01")))
//           .y((d) => yScale(d.total_quantity))
//           .curve(d3.curveMonotoneX);
//         svg
//           .append("path")
//           .datum(commodityData)
//           .attr("d", lineGenerator)
//           .attr("fill", "none")
//           .attr("stroke", color(line.label + commodityName))
//           .attr("stroke-width", 2)
//           .attr("class", `line-${line.label.replace(" ", "-").toLowerCase()}-${commodityName}`)
//           .style("display", "block");
        
//           svg.append("text")
//         .attr("transform", "rotate(-90)") // Rotate the text to be vertical
//         .attr("x", -HEIGHT / 2) // Position at the center vertically
//         .attr("y", -MARGINS.LEFT + 15) // Adjust position to avoid clipping
//         .attr("text-anchor", "middle") // Center the text
//         .style("font-family", "Inter, sans-serif") // Apply Inter font
//         .style("font-weight", "500") // Apply font weight 500
//         .style("font-size", "12px") // Apply font size 16px
//         .style("fill", "#1a375f") // Apply color fill
//         .text("Tonnes →");
        
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

//                   tooltip
//                   .style("opacity", "1")
//                   .html(
//                     `<div class="font-bold text-sm mb-2 bg-gray-400">${formattedDate}</div>
//                      <div class="text-xs p-1"><strong>Total Quantity:</strong> ${d.total_quantity} Tonne</div>`
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


    
//     const legend = d3.select(legendRef.current);
//     legend.selectAll("*").remove();
    
//     legend
//       .selectAll(".legend-item")
//       .data(Array.from(groupedData.keys())) // Iterate over commodity names
//       .join("div")
//       .attr("class", "legend-item")
//       .style("display", "flex")
//       .style("flex-direction", "column")
//       .style("margin-bottom", "20px")
//       .style("margin", "5px")
//       .each(function (commodityName) {
//         const div = d3.select(this);
    
//         // Add commodity name and remove button
//         const header = div.append("div")
//           .style("display", "flex")
//           .style("align-items", "center")
//           .style("margin-bottom", "5px");
    
//         header.append("span")
//           .text(commodityName)
//           .style("font-weight", "bold")
//           .style("font-size", "14px");
    
//         header.append("button")
//           .text("x")
//           .style("margin-left", "100px")
//           .style("cursor", "pointer")
//           .style("background", "none")
//           .style("border", "none")
//           .style("color", "grey")
//           .style("font-size", "14px")
//           .on("click", () => {
//             lines.forEach((line) => {
//               const lineKey = `${line.label.replace(" ", "-").toLowerCase()}-${commodityName}`;
//               svg.selectAll(`.line-${lineKey}`).remove();
//               svg.selectAll(`.point-${lineKey}`).remove();
//             });
//             onRemoveCommodity(commodityName);
//           });
    
//         // Add rectangles with labels and eye icons
//         lines.forEach((line) => {
//           const lineKey = `${line.label.replace(" ", "-").toLowerCase()}-${commodityName}`;
//           const row = div.append("div")
//             .style("display", "flex")
//             .style("align-items", "center")
//             .style("margin-top", "5px");
    
//           // Add rectangle
//           row.append("div")
//             .style("width", "15px")
//             .style("height", "15px")
//             .style("background-color", color(line.label + commodityName))
//             .style("margin-right", "10px")
//             .style("border-radius","5px");
    
//           // Add Eye Icon
//           const eyeContainer = row.append("div")
//           .style("margin-right", "10px")
//           .style("cursor", "pointer");

//           const node = eyeContainer.node(); // Store the node reference

//           if (node) {
//           ReactDOM.render(
//             <EyeIcon
//               onClick={() => {
//                 const isHidden = svg.selectAll(`.line-${lineKey}`).style("display") === "none";
//                 svg.selectAll(`.line-${lineKey}`).style("display", isHidden ? "block" : "none");
//                 svg.selectAll(`.point-${lineKey}`).style("display", isHidden ? "block" : "none");

//                 node.style.color = isHidden ? "grey" : "black";
//               }}
//             />,
//             node
//           );
//           }
//                     // Add label text (min, max, modal)
//                     row.append("span")
//                       .text(line.label)
//                       .style("font-size", "12px");
//                   });
//                 });
              
//           }, [filteredData, dateRange]);

//   return (
//     <>
//     <div
//       className="overflow-visible pt-2 pl-6 pr-[24px]"
//       style={{
//         width: `${WIDTH + MARGINS.LEFT + MARGINS.RIGHT + 130}px`,
//         height: `${HEIGHT + MARGINS.TOP + MARGINS.BOTTOM + 50 + 10}px`,
//         display: "flex",
//         flexDirection: "row",
//         paddingTop: "50px",
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
//             width={600} // Adjust width as needed
//             height={100} // Adjust height as needed
//           />
//         </g>
//       </svg>
//       <svg
//         width={WIDTH + MARGINS.LEFT + MARGINS.RIGHT}
//         height={HEIGHT + MARGINS.TOP + MARGINS.BOTTOM}
//       >
//         <g
//           id="chart-container"
//           ref={chartGroupRef}
//           transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`}
//         />
//         <g
//           ref={xAxisRef}
//           transform={`translate(${MARGINS.LEFT}, ${HEIGHT + MARGINS.TOP})`}
//         />
//         <g ref={yAxisRef} transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`} />
//       </svg>
//     </div>
//     <div
//       ref={legendRef}
//       style={{
//         position: "absolute",
//         top: `${MARGINS.TOP + 80}px`,
//         left: `${WIDTH + MARGINS.LEFT + MARGINS.RIGHT - 10}px`,
//         overflowY: "auto",
//         maxHeight: "200px",
//         border: "solid 2px #c0c7d1",
//         minWidth: "150px",
//         borderRadius: "6px"


//       }}
//     />
//      <div style={{ display: "flex", flexDirection: "column",padding:"5px", width:"700px", marginLeft:"30px" }}>
   
//    < Slider
//       range
     
//       min={minDate}
//       max={maxDate}
//       step={24 * 60 * 60 * 1000}
//       value={dateRange}
//       onChange={(value) => setDateRange(value as [number, number])} 
//       tooltip={{
//         formatter: (val) =>
//           val !== undefined ? new Date(val).toLocaleDateString() : "", // Handle undefined case
//       }}
     
//     />
//     {/* Avoid hydration errors by rendering only on the client */}
//     {clientRendered && (
//       <div className='text-sm' style={{ display: "flex", justifyContent: "space-between", marginTop: "5px"}}>
//         <span>{new Date(dateRange[0]).toLocaleDateString()}</span>
//         <span>{new Date(dateRange[1]).toLocaleDateString()}</span>
//       </div>
//     )}
//     </div>
//   </>
//   );
// };

// export default QuantityLineChart;


import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import ReactDOM from "react-dom";
import CedaIcon from "@/app/assets/icons/CedaIcon";
import  EyeIcon  from '@/app/assets/icons/EyeIcon';
import { Suspense } from "react";
import { Slider } from "antd"; //

const MARGINS = {
  LEFT: 60,
  RIGHT: 30,
  TOP: 20,
  BOTTOM: 40, // Increased to 80 for legend space
};
const WIDTH = 650;
const HEIGHT = 300;

interface QtyDataItem {
  date: string;
  total_quantity: number;
  commodity_name: string;
  month?: string;
  year?: string;
  state_name?: string;
  district_name?: string;  // Add district support
  state_id?: number;   
}

interface QuantityLineChartProps {
  QtyData: QtyDataItem[];
  // onRemoveCommodity: (commodityName: string) => void;
  onRemoveCommodity: (commodityName: string, state: string, district: string) => void;
  
}

const QuantityLineChart: React.FC<QuantityLineChartProps> = ({ QtyData, onRemoveCommodity }) => {
  const [data, setData] = useState(QtyData); // State to manage data updates
  const xAxisRef = useRef<SVGGElement | null>(null);
  const yAxisRef = useRef<SVGGElement | null>(null);
  const chartGroupRef = useRef<SVGGElement | null>(null);
  const legendRef = useRef<HTMLDivElement | null>(null);


  // Convert dates to Date objects
  const parseDate = (d: QtyDataItem) => 
  new Date(d.date || d.month || d.year || "1970-01-01").getTime();

  // Compute min/max dates
  const minDate = d3.min(QtyData, parseDate) || new Date("1970-01-01").getTime();
  const maxDate = d3.max(QtyData, parseDate) || new Date().getTime();

  const [dateRange, setDateRange] = useState<[number, number]>([minDate, maxDate]);
  const [clientRendered, setClientRendered] = useState(false);


  const filteredData = QtyData.filter(d => {
    const date = parseDate(d);
    return date >= dateRange[0] && date <= dateRange[1];
  });

  console.log("filtereddataatqtyqty",filteredData)

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
        d3.extent(filteredData, (d) => new Date(d.date || d.month || d.year || "1970-01-01")) as [Date, Date]
      )
      .range([0, WIDTH]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(filteredData, (d) => d.total_quantity)! * 1.1])
      .range([HEIGHT, 0]);

    const minDatefilter = d3.min(filteredData, parseDate) || new Date("1970-01-01").getTime();
      const maxDatefilter = d3.max(filteredData, parseDate) || new Date().getTime();

      const dateRangeInDays = (maxDatefilter - minDatefilter) / (1000 * 60 * 60 * 24);

      console.log("dateRange, min ,max",dateRangeInDays,minDatefilter,maxDatefilter)
      let tickFormat;
      if (dateRangeInDays > 365 && dateRangeInDays< 762) {
        tickFormat = d3.timeFormat("%b, %Y"); // Year format
      } else if (dateRangeInDays > 90) {
        tickFormat = d3.timeFormat("%b, %Y"); // Month, Year format
      } else {
        tickFormat = d3.timeFormat("%d %b"); // Day, Month format (weekly granularity)
      }
      
      const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat((d) => tickFormat(new Date(d as Date)));

    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5)
      .tickFormat(d3.format(".3s"));

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

    
    const lines = [{ key: "total_quantity", label: "Total Quantity" }];

    // const groupedData = d3.group(filteredData, (d) => d.commodity_name);
     // const groupedData = d3.group(filteredData, (d) => d.commodity_name);
     const groupedData = d3.group(filteredData, (d) => {
      // Separate edge cases
      const isAllIndia = d.state_id === 0; 
    
      return `${d.commodity_name}-${isAllIndia ? "All India" : d.state_name || ""}-${d.district_name || ""}`;
    });
    groupedData.forEach((commodityData, groupKey) => {
      const [commodity, state, district] = groupKey.split("-");  
      lines.forEach((line) => {
        const lineGenerator = d3
          .line<QtyDataItem>()
          .x((d) => xScale(new Date(d.date || d.month || d.year || "1970-01-01")))
          .y((d) => yScale((d as any)[line.key]));
          // .curve(d3.curveMonotoneX);
        svg
          .append("path")
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
        .text("Tonnes →");
        
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
            // .attr("fill", color(line.label + commodity))
            .attr("fill",color(line.label + commodity + state + district))
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
                    `<div class="font-bold text-sm mb-2 bg-gray-400">${formattedDate}/${commodity}-${state} ${district === 'All' ? '' : district}</div>
                     <div class="text-xs p-1"><strong>Total Quantity:</strong> ${d.total_quantity} Tonne</div>`
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
        .style("font-size", "12px")       // Align it to the right side of the parent container
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
            .style("border-radius","5px");
    
          // Add Eye Icon
          const eyeContainer = row.append("div")
          .style("margin-right", "10px")
          .style("cursor", "pointer");

          const node = eyeContainer.node(); // Store the node reference
          console.log("linekey",lineKey)


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
        left: `${WIDTH + MARGINS.LEFT + MARGINS.RIGHT - 10}px`,
        overflowY: "auto",
        maxHeight: "200px",
        border: "solid 2px #c0c7d1",
        minWidth: "150px",
        borderRadius: "6px"


      }}
    />
     <div style={{ display: "flex", flexDirection: "column",padding:"5px", width:"700px", marginLeft:"30px",paddingBottom:"25px" }}>
   
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
      <div className='text-sm' style={{ display: "flex", justifyContent: "space-between", marginTop: "5px"}}>
        <span>{new Date(dateRange[0]).toLocaleDateString()}</span>
        <span>{new Date(dateRange[1]).toLocaleDateString()}</span>
      </div>
    )}
    </div>
  </>
  );
};

export default QuantityLineChart;
