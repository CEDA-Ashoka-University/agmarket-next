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


import { useEffect, useRef } from "react";
import * as d3 from "d3";
// import { ChartButton } from "./ChartButton";
// import html2canvas from "html2canvas";
import CedaIcon from "@/app/assets/icons/CedaIcon";
import { Suspense } from "react";

const MARGINS = {
  LEFT: 40,
  RIGHT: 30,
  TOP: 20,
  BOTTOM: 40, // Increased to 80 for legend space
};
const WIDTH = 800;
const HEIGHT = 300;

interface QtyDataItem {
  date: string;
  total_quantity: number;
  commodity_name: string;
  month?: string;
  year?: string;
  state_name?: string;
}

interface QuantityLineChartProps {
  QtyData: QtyDataItem[];
}

const QuantityLineChart: React.FC<QuantityLineChartProps> = ({ QtyData }) => {
  const xAxisRef = useRef<SVGGElement | null>(null);
  const yAxisRef = useRef<SVGGElement | null>(null);
  const chartGroupRef = useRef<SVGGElement | null>(null);
  const legendRef = useRef<SVGGElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);



  useEffect(() => {
    if (!QtyData || QtyData.length === 0) return;

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
        d3.extent(QtyData,
          (d) => new Date(d.date || d.month || d.year || "1970-01-01")
        ) as [Date, Date]
      )
      .range([0, WIDTH]);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(QtyData, (d) => d.total_quantity)! * 1.1])
      .range([HEIGHT, 0]);

    // console.log("yaxis",QtyData,yScale)

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(10)
      .tickFormat((d) => d3.timeFormat("%b, %Y")(new Date(d as Date)));

    // const yAxis = d3.axisLeft(yScale).ticks(5);

    const yAxis = d3
      .axisLeft(yScale)
      .ticks(5) // Control the number of ticks
      .tickFormat(d3.format(".3s"));
    console.log("yaxis", QtyData, yScale, yAxis)

    d3.select(xAxisRef.current).call(xAxis as any);
    d3.select(yAxisRef.current).call(yAxis as any);
    const color = d3.scaleOrdinal<string>(d3.schemeCategory10);
    const lines = [{ key: "total_quantity", label: "Total Quantity" }];

    lines.forEach((line) => {
      const lineGenerator = d3
        .line<QtyDataItem>()
        .x((d) => xScale(new Date(d.date || d.month || d.year || "1970-01-01")))
        .y((d) => yScale(d.total_quantity))
        .curve(d3.curveMonotoneX);

      svg
        .append("path")
        .datum(QtyData)
        .attr("class", "line-total-quantity")
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", "#1A375F")
        .attr("stroke-width", 2);

    });

    QtyData.forEach((d) => {
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
                `<div class="font-bold text-sm mb-2 bg-gray-400">${formattedDate}</div>
                 <div class="text-xs p-1"><strong>Total Quantity:</strong> ${d.total_quantity} Tonne</div>`
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
          
            let tooltipX = pageX + 10; // Default position: to the right of the cursor
            let tooltipY = pageY - 10; // Default position: above the cursor
          
            // Adjust if the tooltip overflows the right edge
            if (pageX + tooltipWidth > containerRect.right) {
              tooltipX = pageX - tooltipWidth - 40; // Position to the left of the cursor
            }
          
            // Adjust if the tooltip overflows the bottom edge
            if (pageY + tooltipHeight > containerRect.bottom) {
              tooltipY = pageY - tooltipHeight - 10; // Position above the cursor
            }
          
            // Adjust if the tooltip overflows the top edge
            if (tooltipY < containerRect.top) {
              tooltipY = pageY + 10; // Position below the cursor
            }
          
            tooltip
              .style("top", `${tooltipY}px`)
              .style("left", `${tooltipX}px`);
          })
          
          .on("mouseout", () => {
            tooltip.style("opacity", "0");
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
  }, [QtyData]);

return (
  <div
    id="chart-container"
    className="relative"
    style={{
      width: `${WIDTH + MARGINS.LEFT + MARGINS.RIGHT}px`,
      height: `${HEIGHT + MARGINS.TOP + MARGINS.BOTTOM + 50 + 80}px`,
      paddingLeft: '30px',
      paddingTop: '10px'
    }}
  >
    <div className="flex justify-end">
      {/* <ChartButton icon="download" onClick={handleDownloadChart} /> */}
    </div>
    <svg style={{
      position: "absolute",
      top: '100px',
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
          style={{ width: '600px', height: '100px' }}
          width={600} // Adjust width as needed
          height={100} // Adjust height as needed
        />

      </g>
    </svg>
    <Suspense fallback={<p>Loading...</p>}>
      <svg
        ref={svgRef}
        width={WIDTH + MARGINS.LEFT + MARGINS.RIGHT}
        height={HEIGHT + MARGINS.TOP + MARGINS.BOTTOM + 100}
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
    </Suspense>
  </div>
);
};

export default QuantityLineChart;
