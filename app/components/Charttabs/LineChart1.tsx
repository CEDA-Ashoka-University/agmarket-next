// import { useEffect, useRef, useState } from "react";
// import * as d3 from "d3";

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
// }

// interface QtyDataItem {
//   date: string;
//   total_quantity: number;
//   commodity_name: string;
//   month?: string;
// }

// interface LineChartProps {
//   PriceData: PriceDataItem[];
//   QtyData: QtyDataItem[];
// }

// const LineChart1: React.FC<LineChartProps> = ({ PriceData, QtyData }) => {
//   const [selectedTab, setSelectedTab] = useState<"Price" | "Quantity">("Price");
//   const [data, setData] = useState<PriceDataItem[] | QtyDataItem[]>(PriceData||[]);
//   const xAxisRef = useRef<SVGGElement | null>(null);
//   const yAxisRef = useRef<SVGGElement | null>(null);
//   const chartGroupRef = useRef<SVGGElement | null>(null);
//   const legendRef = useRef<SVGGElement | null>(null);

//   const handleTabChange = (tab: "Price" | "Quantity") => {
//     setSelectedTab(tab);
//     setData(tab === "Price" ? PriceData : QtyData);
//   };

//   useEffect(() => {
//     if (!data || data.length === 0) return;

//     const svg = d3.select(chartGroupRef.current);
//     svg.selectAll("*").remove(); // Clear existing lines and circles

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
//           new Date((d as PriceDataItem).date || (d as QtyDataItem).month || "1970-01-01")
//         ) as [Date, Date]
//       )
//       .range([0, WIDTH]);

//     const yScale = d3
//       .scaleLinear()
//       .domain(
//         selectedTab === "Price"
//           ? [
//               d3.min(data as PriceDataItem[], (d) =>
//                 Math.min(d.avg_min_price, d.avg_max_price, d.avg_modal_price)
//               )! - 10,
//               d3.max(data as PriceDataItem[], (d) =>
//                 Math.max(d.avg_min_price, d.avg_max_price, d.avg_modal_price)
//               )!,
//             ]
//           : [
//               0,
//               d3.max(data as QtyDataItem[], (d) => d.total_quantity)! * 1.1,
//             ]
//       )
//       .range([HEIGHT, 0]);

//     const xAxis = d3
//       .axisBottom(xScale)
//       .ticks(5)
//       .tickFormat((d) => d3.timeFormat("%b %d")(new Date(d as Date)));

//     const yAxis = d3.axisLeft(yScale).ticks(5);

//     d3.select(xAxisRef.current).call(xAxis as any);
//     d3.select(yAxisRef.current).call(yAxis as any);

//     const color = d3.scaleOrdinal<string>(d3.schemeCategory10);

//     const lines = selectedTab === "Price"
//       ? [
//           { key: "avg_modal_price", label: "Modal Price" },
//           { key: "avg_min_price", label: "Min Price" },
//           { key: "avg_max_price", label: "Max Price" },
//         ]
//       : [{ key: "total_quantity", label: "Total Quantity" }];

//     lines.forEach((line) => {
//       const lineGenerator = d3
//         .line<PriceDataItem | QtyDataItem>()
//         .x((d) =>
//           xScale(
//             new Date((d as PriceDataItem).date || (d as QtyDataItem).month || "1970-01-01")
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

//       // Add data points
//       svg
//         .selectAll(`.circle-${line.key}`)
//         .data(data)
//         .join("circle")
//         .attr("class", `circle-${line.key}`)
//         .attr("cx", (d) =>
//           xScale(
//             new Date((d as PriceDataItem).date || (d as QtyDataItem).month || "1970-01-01")
//           )
//         )
//         .attr("cy", (d) => yScale((d as any)[line.key]))
//         .attr("r", 4)
//         .attr("fill", () => color(line.key))
//         .on("mouseover", (event, d) => {
//           tooltip
//             .style("opacity", "1")
//             .html(
//               `<strong>${line.label}:</strong> ${(d as any)[line.key]}<br><strong>Date:</strong> ${
//                 (d as PriceDataItem).date || (d as QtyDataItem).month
//               }`
//             );
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
//     legend.selectAll("*").remove(); // Clear previous legends

//     legend
//       .attr(
//         "transform",
//         `translate(${MARGINS.LEFT}, ${HEIGHT + MARGINS.TOP + 60})`
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

//   return (
//     <div
//       id="chart-container"
//       style={{ position: "relative", width: `${WIDTH}px` }}
//     >
// <div
//   style={{
//     display: "flex",
//     gap: "8px",
//     padding: "5px",
//     background: "#fff",
//   }}
// >
//   <button
//     onClick={() => handleTabChange("Price")}
//     style={{
//       padding: "5px 10px",
//       background: selectedTab === "Price" ? "#1A375F" : "#FFF",
//       color: selectedTab === "Price" ? "#FFF" : "#1A375F",
//       border: "1px solid #1A375F",
//       borderRadius: "5px",
//       cursor: "pointer",
//       fontSize: "12px",
//     }}
//   >
//     Price
//   </button>
//   <button
//     onClick={() => handleTabChange("Quantity")}
//     style={{
//       padding: "5px 10px",
//       background: selectedTab === "Quantity" ? "#1A375F" : "#FFF",
//       color: selectedTab === "Quantity" ? "#FFF" : "#1A375F",
//       border: "1px solid #1A375F",
//       borderRadius: "5px",
//       cursor: "pointer",
//       fontSize: "12px",
//     }}
//   >
//     Quantity
//   </button>
// </div>
// <div className="flex gap-1.5 items-center text-sm font-medium text-[#1A375F] pl-4 pr-4 pt-2">
//   <span >   
//     <p>{data[0]?.commodity_name||""} 
//     <span className="mx-2 text-sm text-gray-400">•</span> 
//        {data[0]?.state_name||"All India"} </p>
//   </span>
// </div>

// <svg
//   style={{
//     overflow: "visible",
//   }}
//   width={WIDTH + MARGINS.LEFT + MARGINS.RIGHT}
//   height={HEIGHT + MARGINS.TOP + MARGINS.BOTTOM + 50}
// >
//   <g
//     ref={chartGroupRef}
//     transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`}
//   />
//   <g
//     ref={xAxisRef}
//     transform={`translate(${MARGINS.LEFT}, ${HEIGHT + MARGINS.TOP})`}
//   />
//   <g ref={yAxisRef} transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`} />
//   <g ref={legendRef} />
// </svg>
//     </div>
//   );
// };

// export default LineChart1;


// import { useEffect, useRef, useState } from "react";
// import * as d3 from "d3";

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
// }

// interface QtyDataItem {
//   date: string;
//   total_quantity: number;
//   commodity_name: string;
//   month?: string;
// }

// interface LineChartProps {
//   PriceData: PriceDataItem[];
//   QtyData: QtyDataItem[];
// }

// const LineChart1: React.FC<LineChartProps> = ({ PriceData, QtyData }) => {
//   const [selectedTab, setSelectedTab] = useState<"Price" | "Quantity">("Price");
//   const [data, setData] = useState<PriceDataItem[] | QtyDataItem[]>(PriceData || []);
//   const xAxisRef = useRef<SVGGElement | null>(null);
//   const yAxisRef = useRef<SVGGElement | null>(null);
//   const chartGroupRef = useRef<SVGGElement | null>(null);
//   const legendRef = useRef<SVGGElement | null>(null);

//   const handleTabChange = (tab: "Price" | "Quantity") => {
//     setSelectedTab(tab);
//     setData(tab === "Price" ? PriceData : QtyData);
//   };

//   useEffect(() => {
//     if (!data || data.length === 0) return;

//     const svg = d3.select(chartGroupRef.current);
//     svg.selectAll("*").remove(); // Clear existing lines and circles

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
//           new Date((d as PriceDataItem).date || (d as QtyDataItem).month || "1970-01-01")
//         ) as [Date, Date]
//       )
//       .range([0, WIDTH]);

//     const yScale = d3
//       .scaleLinear()
//       .domain(
//         selectedTab === "Price"
//           ? [
//               d3.min(data as PriceDataItem[], (d) =>
//                 Math.min(d.avg_min_price, d.avg_max_price, d.avg_modal_price)
//               )! - 10,
//               d3.max(data as PriceDataItem[], (d) =>
//                 Math.max(d.avg_min_price, d.avg_max_price, d.avg_modal_price)
//               )!,
//             ]
//           : [
//               0,
//               d3.max(data as QtyDataItem[], (d) => d.total_quantity)! * 1.1,
//             ]
//       )
//       .range([HEIGHT, 0]);

//     const xAxis = d3
//       .axisBottom(xScale)
//       .ticks(5)
//       .tickFormat((d) => d3.timeFormat("%b %d")(new Date(d as Date)));

//     const yAxis = d3.axisLeft(yScale).ticks(5);

//     d3.select(xAxisRef.current).call(xAxis as any);
//     d3.select(yAxisRef.current).call(yAxis as any);

//     const color = d3.scaleOrdinal<string>(d3.schemeCategory10);

//     const lines = selectedTab === "Price"
//       ? [
//           { key: "avg_modal_price", label: "Modal Price" },
//           { key: "avg_min_price", label: "Min Price" },
//           { key: "avg_max_price", label: "Max Price" },
//         ]
//       : [{ key: "total_quantity", label: "Total Quantity" }];

//     lines.forEach((line) => {
//       const lineGenerator = d3
//         .line<PriceDataItem | QtyDataItem>()
//         .x((d) =>
//           xScale(
//             new Date((d as PriceDataItem).date || (d as QtyDataItem).month || "1970-01-01")
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

//       // Add data points
//       svg
//         .selectAll(`.circle-${line.key}`)
//         .data(data)
//         .join("circle")
//         .attr("class", `circle-${line.key}`)
//         .attr("cx", (d) =>
//           xScale(
//             new Date((d as PriceDataItem).date || (d as QtyDataItem).month || "1970-01-01")
//           )
//         )
//         .attr("cy", (d) => yScale((d as any)[line.key]))
//         .attr("r", 4)
//         .attr("fill", () => color(line.key))
//         .on("mouseover", (event, d) => {
//           tooltip
//             .style("opacity", "1")
//             .html(
//               `<strong>${line.label}:</strong> ${(d as any)[line.key]}<br><strong>Date:</strong> ${
//                 (d as PriceDataItem).date || (d as QtyDataItem).month
//               }`
//             );
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
//     legend.selectAll("*").remove(); // Clear previous legends

//     legend
//       .attr(
//         "transform",
//         `translate(${MARGINS.LEFT}, ${HEIGHT + MARGINS.TOP + 60})`
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

//   return (
//     <div
//       id="chart-container"
//       style={{
//         position: "relative",
//         width: `${WIDTH + MARGINS.LEFT + MARGINS.RIGHT}px`,
//         height: `${HEIGHT + MARGINS.TOP + MARGINS.BOTTOM + 50}px`,
//       }}
//     >

// <div style={{ display: "flex", alignItems: "center", position: "relative", gap:"15px" }}>  
//       {/* Rest of the JSX remains the same */}
//       <div
//         style={{
//           display: "flex",
//           gap: "8px",
//           padding: "5px",
//           background: "#fff",
//           paddingLeft:"5px"
//         }}
//       >
//         <button
//           onClick={() => handleTabChange("Price")}
//           style={{
//             padding: "5px 10px",
//             background: selectedTab === "Price" ? "#1A375F" : "#FFF",
//             color: selectedTab === "Price" ? "#FFF" : "#1A375F",
//             border: "1px solid #1A375F",
//             borderRadius: "5px",
//             cursor: "pointer",
//             fontSize: "12px",
//           }}
//         >
//           Price
//         </button>
//         <button
//           onClick={() => handleTabChange("Quantity")}
//           style={{
//             padding: "5px 10px",
//             background: selectedTab === "Quantity" ? "#1A375F" : "#FFF",
//             color: selectedTab === "Quantity" ? "#FFF" : "#1A375F",
//             border: "1px solid #1A375F",
//             borderRadius: "5px",
//             cursor: "pointer",
//             fontSize: "12px",
//           }}
//         >
//           Quantity
//         </button>
//       </div>
//       </div>
//       <div className="flex gap-1.5 items-center text-sm font-medium text-[#1A375F] pl-4 pr-4 pt-2">
//         <span >   
//           <p>{data[0]?.commodity_name||""} 
//           <span className="mx-2 text-sm text-gray-400">•</span> 
//              {data[0]?.state_name||"All India"} </p>
//         </span>
//       </div>

//       <svg
//         style={{
//           overflow: "visible",
//         }}
//         width={WIDTH + MARGINS.LEFT + MARGINS.RIGHT}
//         height={HEIGHT + MARGINS.TOP + MARGINS.BOTTOM + 50}
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


//     </div>
//   );
// };

// export default LineChart1;


import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const MARGINS = {
  LEFT: 40,
  RIGHT: 30,
  TOP: 20,
  BOTTOM: 30,
};
const WIDTH = 800;
const HEIGHT = 300;

interface PriceDataItem {
  date: string;
  avg_modal_price: number;
  avg_min_price: number;
  avg_max_price: number;
  moving_average?: number;
  commodity_name: string;
  month?: string;
}

interface QtyDataItem {
  date: string;
  total_quantity: number;
  commodity_name: string;
  month?: string;
}

interface LineChartProps {
  PriceData: PriceDataItem[];
  QtyData: QtyDataItem[];
}

// const LineChart1: React.FC<LineChartProps> = ({ PriceData, QtyData }) => {
//   const [selectedTab, setSelectedTab] = useState<"Price" | "Quantity">("Price");
//   const [data, setData] = useState<PriceDataItem[] | QtyDataItem[]>(PriceData || []);
//   const xAxisRef = useRef<SVGGElement | null>(null);
//   const yAxisRef = useRef<SVGGElement | null>(null);
//   const chartGroupRef = useRef<SVGGElement | null>(null);
//   const legendRef = useRef<SVGGElement | null>(null);

//   const handleTabChange = (tab: "Price" | "Quantity") => {
//     setSelectedTab(tab);
//     setData(tab === "Price" ? PriceData : QtyData);
//   };

//   useEffect(() => {
//     if (!data || data.length === 0) return;

//     const svg = d3.select(chartGroupRef.current);
//     svg.selectAll("*").remove(); // Clear existing lines and circles

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
//           new Date((d as PriceDataItem).date || (d as QtyDataItem).month || "1970-01-01")
//         ) as [Date, Date]
//       )
//       .range([0, WIDTH]);

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
//       .ticks(5)
//       .tickFormat((d) => d3.timeFormat("%b %d")(new Date(d as Date)));

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
//             new Date((d as PriceDataItem).date || (d as QtyDataItem).month || "1970-01-01")
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

//       // Add data points
//       svg
//         .selectAll(`.circle-${line.key}`)
//         .data(data)
//         .join("circle")
//         .attr("class", `circle-${line.key}`)
//         .attr("cx", (d) =>
//           xScale(
//             new Date((d as PriceDataItem).date || (d as QtyDataItem).month || "1970-01-01")
//           )
//         )
//         .attr("cy", (d) => yScale((d as any)[line.key]))
//         .attr("r", 4)
//         .attr("fill", () => color(line.key))
//         .on("mouseover", (event, d) => {
//           tooltip
//             .style("opacity", "1")
//             .html(
//               `<strong>${line.label}:</strong> ${(d as any)[line.key]}<br><strong>Date:</strong> ${(d as PriceDataItem).date || (d as QtyDataItem).month
//               }`
//             );
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
//     legend.selectAll("*").remove(); // Clear previous legends

//     legend
//       .attr(
//         "transform",
//         `translate(${MARGINS.LEFT}, ${HEIGHT + MARGINS.TOP + 60})`
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

const LineChart1: React.FC<LineChartProps> = ({ PriceData, QtyData }) => {
  const [selectedTab, setSelectedTab] = useState<"Price" | "Quantity">("Price");
  const [data, setData] = useState<PriceDataItem[] | QtyDataItem[]>(PriceData || []);
  const xAxisRef = useRef<SVGGElement | null>(null);
  const yAxisRef = useRef<SVGGElement | null>(null);
  const chartGroupRef = useRef<SVGGElement | null>(null);
  const legendRef = useRef<SVGGElement | null>(null);

  const handleTabChange = (tab: "Price" | "Quantity") => {
    setSelectedTab(tab);
    setData(tab === "Price" ? PriceData : QtyData);
  };

  // Automatically render the Price chart on mount
  useEffect(() => {
    setSelectedTab("Price");
    setData(PriceData);
  }, [PriceData]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(chartGroupRef.current);
    svg.selectAll("*").remove(); // Clear existing lines and circles

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("background", "white")
      .style("border", "1px solid #ccc")
      .style("padding", "8px")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", "0")
      .style("transition", "opacity 0.3s ease");

    const xScale = d3
      .scaleUtc()
      .domain(
        d3.extent(data, (d) =>
          new Date((d as PriceDataItem).date || (d as QtyDataItem).month || "1970-01-01")
        ) as [Date, Date]
      )
      .range([0, WIDTH]);

    const yScale = d3
      .scaleLinear()
      .domain(
        selectedTab === "Price"
          ? [
            d3.min(data as PriceDataItem[], (d) =>
              Math.min(d.avg_min_price, d.avg_max_price, d.avg_modal_price)
            )! - 10,
            d3.max(data as PriceDataItem[], (d) =>
              Math.max(d.avg_min_price, d.avg_max_price, d.avg_modal_price)
            )!,
          ]
          : [
            0,
            d3.max(data as QtyDataItem[], (d) => d.total_quantity)! * 1.1,
          ]
      )
      .range([HEIGHT, 0]);

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(5)
      .tickFormat((d) => d3.timeFormat("%b %d")(new Date(d as Date)));

    const yAxis = d3.axisLeft(yScale).ticks(5);

    d3.select(xAxisRef.current).call(xAxis as any);
    d3.select(yAxisRef.current).call(yAxis as any);

    const color = d3.scaleOrdinal<string>(d3.schemeCategory10);

    const lines = selectedTab === "Price"
      ? [
        { key: "avg_modal_price", label: "Modal Price" },
        { key: "avg_min_price", label: "Min Price" },
        { key: "avg_max_price", label: "Max Price" },
      ]
      : [{ key: "total_quantity", label: "Total Quantity" }];

    lines.forEach((line) => {
      const lineGenerator = d3
        .line<PriceDataItem | QtyDataItem>()
        .x((d) =>
          xScale(
            new Date((d as PriceDataItem).date || (d as QtyDataItem).month || "1970-01-01")
          )
        )
        .y((d) => yScale((d as any)[line.key]))
        .curve(d3.curveMonotoneX);

      svg
        .append("path")
        .datum(data)
        .attr("class", `line-${line.key}`)
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", () => color(line.key))
        .attr("stroke-width", 2);

      svg
        .selectAll(`.circle-${line.key}`)
        .data(data)
        .join("circle")
        .attr("class", `circle-${line.key}`)
        .attr("cx", (d) =>
          xScale(
            new Date((d as PriceDataItem).date || (d as QtyDataItem).month || "1970-01-01")
          )
        )
        .attr("cy", (d) => yScale((d as any)[line.key]))
        .attr("r", 4)
        .attr("fill", () => color(line.key))
        .on("mouseover", (event, d) => {
          tooltip
            .style("opacity", "1")
            .html(
              `<strong>${line.label}:</strong> ${(d as any)[line.key]}<br><strong>Date:</strong> ${(d as PriceDataItem).date || (d as QtyDataItem).month
              }`
            );
        })
        .on("mousemove", (event) => {
          tooltip
            .style("top", `${event.pageY - 10}px`)
            .style("left", `${event.pageX + 10}px`);
        })
        .on("mouseout", () => {
          tooltip.style("opacity", "0");
        });
    });

    const legend = d3.select(legendRef.current);
    legend.selectAll("*").remove();

    legend
      .attr(
        "transform",
        `translate(${MARGINS.LEFT}, ${HEIGHT + MARGINS.TOP + 60})`
      )
      .selectAll(".legend-item")
      .data(lines)
      .join("g")
      .attr("class", "legend-item")
      .attr("transform", (_, i) => `translate(${i * 100}, 0)`)
      .each(function (line) {
        const g = d3.select(this);
        g.append("rect")
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", color(line.key));

        g.append("text")
          .attr("x", 20)
          .attr("y", 12)
          .style("font-size", "12px")
          .style("alignment-baseline", "middle")
          .text(line.label);
      });

    return () => {
      tooltip.remove();
    };
  }, [data, selectedTab]);


  return (
    <div
    id="chart-container"
    className="relative "
    style={{
      width: `${WIDTH + MARGINS.LEFT + MARGINS.RIGHT}px`,
      height: `${HEIGHT + MARGINS.TOP + MARGINS.BOTTOM + 50}px`,
    }}
  >

      {/* <div style={{ display: "flex", alignItems: "center", position: "relative", gap: "15px" }}>
       */}
       <div id="tab1" className="absolute pt-2 left-0 pl-2.5 flex  gap-4">

        {/* Rest of the JSX remains the same */}
        <div className="flex gap-2 bg-white pl-4"

        >
          <button
            onClick={() => handleTabChange("Price")}
            className={`px-2.5 py-1 text-sm border rounded cursor-pointer ${selectedTab === "Price"
              ? "bg-[#1A375F] text-white"
              : "bg-white text-[#1A375F]"
              } border-[#1A375F]`}
          >
            Price
          </button>

          <button
            onClick={() => handleTabChange("Quantity")}
            className={`px-2.5 py-1 text-sm border rounded cursor-pointer ${selectedTab === "Quantity"
              ? "bg-[#1A375F] text-white"
              : "bg-white text-[#1A375F]"
              } border-[#1A375F]`}
          >
            Quantity
          </button>

        </div>
      </div>
      {/* <div className="flex gap-1.5 items-center text-sm font-medium text-[#1A375F] pl-4 pr-4 pt-2"> */}
      <div className="flex gap-1.5 items-center text-sm font-medium  text-[#1A375F] pt-12 pl-7">
        {data && data.length > 0 ? (
          <span>
            <p>
              {data[0]?.commodity_name || ""}
              <span className="mx-2 text-sm text-gray-400">•</span>
              {data[0]?.state_name || "All India"}
            </p>
          </span>
        ) : (
          <p>No data available</p>
        )}
      </div>

      <svg
        className="overflow-visible p-7"
        width={WIDTH + MARGINS.LEFT + MARGINS.RIGHT}
        height={HEIGHT + MARGINS.TOP + MARGINS.BOTTOM + 50}
      >

        <g
          ref={chartGroupRef}
          transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`}
        />
        <g
          ref={xAxisRef}
          transform={`translate(${MARGINS.LEFT}, ${HEIGHT + MARGINS.TOP})`}
        />
        <g ref={yAxisRef} transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`} />
        <g ref={legendRef} />
      </svg>


    </div>
  );
};

export default LineChart1;
