import { useEffect, useRef } from "react";
import * as d3 from "d3";
import CedaIcon from "@/app/assets/icons/CedaIcon";

const MARGINS = {
  LEFT: 40,
  RIGHT: 30,
  TOP: 20,
  BOTTOM: 60,
};
const HEIGHT = 300; // Chart height
const WIDTH = 800; // Chart width

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
}

interface PriceLineChartProps {
  PriceData: PriceDataItem[];
}

const PriceLineChart: React.FC<PriceLineChartProps> = ({ PriceData }) => {
  const xAxisRef = useRef<SVGGElement | null>(null);
  const yAxisRef = useRef<SVGGElement | null>(null);
  const chartGroupRef = useRef<SVGGElement | null>(null);
  const legendRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (!PriceData || PriceData.length === 0) return;
  
    const svg = d3.select(chartGroupRef.current);
    svg.selectAll("*").remove();
  
    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("top","0px")
      .style("left","0px")
      .style("background", "white")
      // .style("border", "1px solid #ccc")
      // .style("padding", "8px")
      .style("border-radius", "4px")
      .style("box-shadow","0 4px 40px #0003")
      .style("pointer-events", "none")
      .style("opacity", "0")
      .style("transition", "opacity 0.3s ease");
  
      // position: absolute;
      // pointer-events: none;
      // top: 0px;
      // left: 0px;
      // border-radius: 4px;
      // box-shadow: 0 4px 40px #0003;
      // pointer-events: none;
      // overflow: hidden;
      // display: none;
      // min-width: 150px;
      // max-width: 200px;


    const xScale = d3
      .scaleUtc()
      .domain(
        d3.extent(PriceData, (d) =>
          new Date(d.date || d.month || d.year || "1970-01-01")
        ) as unknown as [Date, Date]
      )
      .range([0, WIDTH]);
  
    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(PriceData, (d) =>
          Math.min(d.avg_min_price, d.avg_max_price, d.avg_modal_price)
        )! - 10,
        d3.max(PriceData, (d) =>
          Math.max(d.avg_min_price, d.avg_max_price, d.avg_modal_price)
        )!,
      ])
      .range([HEIGHT, 0]);
  
    const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat((d) => d3.timeFormat("%b, %Y")(new Date(d as Date)));
    const yAxis = d3.axisLeft(yScale).ticks(5);
  
    d3.select(xAxisRef.current).call(xAxis as any);
    d3.select(yAxisRef.current).call(yAxis as any);
  
    const color = d3.scaleOrdinal<string>(d3.schemeCategory10);

    const groupedData = d3.group(PriceData, (d) => d.commodity_name);
    groupedData.forEach((commodityData, commodityName) => {
      console.log(`Commodity Name: ${commodityName}`);
      console.log('Commodity Data:', commodityData);

    });

  
    const lines = [
      { key: "avg_modal_price", label: "Modal Price" },
      { key: "avg_min_price", label: "Min Price" },
      { key: "avg_max_price", label: "Max Price" },
    ];
    



    lines.forEach((line) => {
      const lineGenerator = d3
        .line<PriceDataItem>()
        .x((d) =>
          xScale(new Date(d.date || d.month || d.year || "1970-01-01"))
        )
        .y((d) => yScale((d as any)[line.key]))
        .curve(d3.curveMonotoneX);
  
      svg
        .append("path")
        .datum(PriceData)
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", () => color(line.key))
        .attr("stroke-width", 2);
    });
  
    // Add data points for all lines
    PriceData.forEach((d) => {
      lines.forEach((line) => {
        svg
          .append("circle")
          .attr("class", "data-point")
          .attr("cx", xScale(new Date(d.date || d.month || d.year || "1970-01-01")))
          .attr("cy", yScale((d as any)[line.key]))
          .attr("r", 4)
          .attr("fill", color(line.key))
          .on("mouseover", (event) => {
            const formattedDate = d.date
              ? d.date.split("-").reverse().join("-")
              : d.month
              ? `${d.month.split("-")[1]}-${d.month.split("-")[0]}`
              : d.year || "";
  
            tooltip
              .style("opacity", "1")
              .html(
                `<div class="font-bold text-sm mb-2 bg-gray-400"">${formattedDate}</div>
     <div class="text-xs p-1"><strong>Modal Price:</strong> ${d.avg_modal_price} ₹/Quintal</div>
     <div class="text-xs p-1"><strong>Min Price:</strong> ${d.avg_min_price} ₹/Quintal</div>
     <div class="text-xs p-1"><strong>Max Price:</strong> ${d.avg_max_price} ₹/Quintal</div>`
  );
          })
          .on("mousemove", (event) => {
            const tooltipWidth = 200; // Approximate tooltip width
            const tooltipHeight = 100; // Approximate tooltip height
            const chartContainer = document.getElementById("chart-container");
          
            if (!chartContainer) return;
          
            const containerRect = chartContainer.getBoundingClientRect();
            const pageX = event.pageX;
            const pageY = event.pageY;
          
            // Default tooltip position
            let tooltipX = pageX + 10; // Right of cursor
            let tooltipY = pageY - 10; // Above cursor
          
            // Adjust if tooltip overflows the right edge
            if (tooltipX + tooltipWidth > containerRect.right) {
              tooltipX = pageX - tooltipWidth - 10; // Move to the left of the cursor
            }
          
            // Adjust if tooltip overflows the left edge
            if (tooltipX < containerRect.left) {
              tooltipX = containerRect.left + 10; // Stay inside the left edge
            }
          
            // Adjust if tooltip overflows the bottom edge
            if (tooltipY + tooltipHeight > containerRect.bottom) {
              tooltipY = pageY - tooltipHeight - 50; // Move above the cursor
            }
          
            // Adjust if tooltip overflows the top edge
            if (tooltipY < containerRect.top) {
              tooltipY = pageY + 10; // Move below the cursor
            }
          
            tooltip
              .style("top", `${tooltipY}px`)
              .style("left", `${tooltipX}px`)
              .style("opacity", "1"); // Ensure tooltip is visible
          })
          .on("mouseout", () => {
            tooltip.style("opacity", "0"); // Hide tooltip on mouseout
          });
          
      });
    });
  
    const legend = d3.select(legendRef.current);
    legend.selectAll("*").remove();
  
    legend
      .attr(
        "transform",
        `translate(${MARGINS.LEFT}, ${HEIGHT + MARGINS.TOP + 60 - 10})`
      )
      .selectAll(".legend-item")
      .data(lines)
      .join("g")
      .attr("class", "legend-item")
      .attr("transform", (_, i) => `translate(${i * 120}, 0)`)
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
  }, [PriceData]);

  return (
    <div 
      className="overflow-visible pt-2 pl-6 pr-[24px]"
      style={{
        width: `${WIDTH + MARGINS.LEFT + MARGINS.RIGHT + 20}px`,
        height: `${HEIGHT + MARGINS.TOP + MARGINS.BOTTOM + 50+60}px`,
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
            width={600}
            height={100}
          />
        </g>
      </svg>
      <svg 
        className="pt-[10px]"
        width={WIDTH + MARGINS.LEFT + MARGINS.RIGHT}
        height={HEIGHT + MARGINS.TOP + MARGINS.BOTTOM + 100}
      >
        <g id="chart-container"
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

export default PriceLineChart;


// Keep the with add and remove option and multiple legends clickable

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

//     const color = d3.scaleOrdinal<string>(d3.schemeCategory10);

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
//                 ? `${d.month.split("-")[1]}-${d.month.split("-")[0]}`
//                 : d.year || "";

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

//     // Add legend to the div (not inside the SVG)
//     // const legend = d3.select(legendRef.current);
//     // legend.selectAll("*").remove();

//     // legend
//     //   .selectAll(".legend-item")
//     //   .data(
//     //     Array.from(groupedData.keys()).flatMap((commodityName) =>
//     //       lines.map((line) => ({
//     //         commodityName,
//     //         lineLabel: line.label,
//     //         lineKey: `${line.label.replace(" ", "-").toLowerCase()}-${commodityName}`,
//     //       }))
//     //     )
//     //   )
//     //   .join("div")
//     //   .attr("class", "legend-item")
//     //   .style("display", "flex")
//     //   .style("align-items", "center")
//     //   .style("margin-bottom", "10px")
//     //   .each(function ({ commodityName, lineLabel, lineKey }) {
//     //     const div = d3.select(this);

//     //     // Add rectangle (colored square)
//     //     div.append("div")
//     //       .style("width", "15px")
//     //       .style("height", "15px")
//     //       .style("background-color", color(lineLabel + commodityName))
//     //       .style("margin-right", "10px")
//     //       .style("cursor", "pointer")
//     //       .on("click", () => {
//     //                     const isHidden = svg.selectAll(`.line-${lineKey}`).style("display") === "none";
//     //                     svg.selectAll(`.line-${lineKey}`).style("display", isHidden ? "block" : "none");
//     //                     svg.selectAll(`.point-${lineKey}`).style("display", isHidden ? "block" : "none");
//     //                   });;

//     //     // Add text
//     //     div.append("span")
//     //       .style("font-size", "12px")
//     //       .text(`${lineLabel} - ${commodityName}`);

//     //     // Add remove button
//     //     div.append("button")
//     //       .text("x")
//     //       .style("margin-left", "10px")
//     //       .style("cursor", "pointer")
//     //       .style("background", "none")
//     //       .style("border", "none")
//     //       .style("color", "red")
//     //       .style("font-size", "14px")
//     //       .on("click", () => {
//     //         onRemoveCommodity(commodityName);
//     //       });
//     //   });

//     const legend = d3.select(legendRef.current);
// legend.selectAll("*").remove();

// legend
//   .selectAll(".legend-item")
//   .data(Array.from(groupedData.keys())) // Iterate over commodity names
//   .join("div")
//   .attr("class", "legend-item")
//   .style("display", "flex")
//   .style("flex-direction", "column")
//   .style("margin-bottom", "20px")
//   .each(function (commodityName) {
//     const div = d3.select(this);

//     // Add commodity name and remove button in a horizontal row
//     const header = div.append("div")
//       .style("display", "flex")
//       .style("align-items", "center")
//       .style("margin-bottom", "5px");

//     header.append("span")
//       .text(commodityName)
//       .style("font-weight", "bold")
//       .style("font-size", "14px");

//     header.append("button")
//       .text("x")
//       .style("margin-left", "10px")
//       .style("cursor", "pointer")
//       .style("background", "none")
//       .style("border", "none")
//       .style("color", "red")
//       .style("font-size", "14px")
//       .on("click", () => {
//         lines.forEach((line) => {
//           const lineKey = `${line.label.replace(" ", "-").toLowerCase()}-${commodityName}`;
//           svg.selectAll(`.line-${lineKey}`).remove();
//           svg.selectAll(`.point-${lineKey}`).remove();
//         });
//         onRemoveCommodity(commodityName);
//       });

//     // Add rectangles with labels (stacked vertically)
//     lines.forEach((line) => {
//       const lineKey = `${line.label.replace(" ", "-").toLowerCase()}-${commodityName}`;
//       const row = div.append("div")
//         .style("display", "flex")
//         .style("align-items", "center")
//         .style("margin-top", "5px");

//       // Add rectangle
//       row.append("div")
//         .style("width", "15px")
//         .style("height", "15px")
//         .style("background-color", color(line.label + commodityName))
//         .style("margin-right", "10px")
//         .style("cursor", "pointer")
//         .on("click", () => {
//           const isHidden = svg.selectAll(`.line-${lineKey}`).style("display") === "none";
//           svg.selectAll(`.line-${lineKey}`).style("display", isHidden ? "block" : "none");
//           svg.selectAll(`.point-${lineKey}`).style("display", isHidden ? "block" : "none");
//         })
//         .append("title") // Tooltip for rectangle
//         .text(`${line.label} (${commodityName})`);

//       // Add label text (min, max, modal)
//       row.append("span")
//         .text(line.label)
//         .style("font-size", "12px");
//     });
//   });

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
//           maxHeight: `${HEIGHT}px`,
//         }}
//       />
//     </>
//   );
// };

// export default PriceLineChart;
