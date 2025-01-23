// import { useEffect, useRef } from "react";
// import * as d3 from "d3";
// interface PriceDataItem {
//     date: string;
//     avg_modal_price: number;
//     avg_min_price: number;
//     avg_max_price: number;
//     moving_average?: number;
//     commodity_name: string;
//     month?: string;
//     year?: string;
//     state_name?: string;
//   }
// interface PriceLineChartProps {
//   PriceData: PriceDataItem[];
// }

// const PriceLineChart: React.FC<PriceLineChartProps> = ({ PriceData }) => {
//   const chartRef = useRef<SVGSVGElement | null>(null);

//   useEffect(() => {
//     // D3 logic for rendering Price chart
//   }, [PriceData]);

//   return (
//     <svg ref={chartRef} width={800} height={400}></svg>
//   );
// };

// export default PriceLineChart;

import { useEffect, useRef } from "react";
import * as d3 from "d3";
import CedaIcon from "@/app/assets/icons/CedaIcon";

const MARGINS = {
  LEFT: 40,
  RIGHT: 30,
  TOP: 20,
  BOTTOM: 60, // Increased to 80 for legend space
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
    .style("background", "white")
    .style("border", "1px solid #ccc")
    .style("padding", "8px")
    .style("border-radius", "4px")
    .style("pointer-events", "none")
    .style("opacity", "0")
    .style("transition", "opacity 0.3s ease");

    // const xScale = d3
    //   .scaleUtc()
    //   .domain(
    //     d3.extent(PriceData, (d) => new Date(d.date)) as [Date, Date]
    //   )
    //   .range([0, WIDTH]);
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
      
      const xAxis = d3
      .axisBottom(xScale)
      .ticks(10)
      .tickFormat((d) => d3.timeFormat("%b, %Y")(new Date(d as Date)));


    // const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.timeFormat("%b, %Y"));
    const yAxis = d3.axisLeft(yScale).ticks(5);

    d3.select(xAxisRef.current).call(xAxis as any);
    d3.select(yAxisRef.current).call(yAxis as any);

    const color = d3.scaleOrdinal<string>(d3.schemeCategory10);

    const lines = [
      { key: "avg_modal_price", label: "Modal Price" },
      { key: "avg_min_price", label: "Min Price" },
      { key: "avg_max_price", label: "Max Price" },
    ];

  

        lines.forEach((line) => {
            const lineGenerator = d3
              .line<PriceDataItem>()
              .x((d) =>
                xScale(
                  new Date(d.date || d.month || d.year || "1970-01-01")
                )
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

        svg
        .selectAll(`.circle-${line.key}`)
        .data(PriceData)
        .join("circle")
        .attr("class", `circle-${line.key}`)
        .attr("cx", (d) =>
          xScale(
            new Date(d.date || d.month || d.year || "1970-01-01")
          )
        )
        .attr("cy", (d) => yScale((d as any)[line.key]))
        .attr("r", 4)
        .attr("fill", () => color(line.key))
        .on("mouseover", (event, d) => {
          // tooltip
          //   .style("opacity", "1")
          //   .html(
          //     `<strong>${line.label}:</strong> ${(d as any)[line.key]}<br><strong>Date:</strong> ${d.date || d.month || d.year
          //     }`
          //   );
          tooltip
          .style("opacity", "1")
          .html(() => {
            // Parse the date string and format it accordingly
            let formattedDate = "";
            let label = "";
            if (d.date) {
              // Format for d.date (dd-mm-yy)
              const [year, month, day] = d.date.split("-");
              formattedDate = `${day}-${month}-${year.slice(-2)}`;
              label= "Date:";
            } else if (d.month) {
              // Format for d.month (mm,yy)
              const [year, month] = d.month.split("-");
              formattedDate = `${month}/${year.slice(-2)}`;
              label= "Month:";
            } else if (d.year) {
              // Format for d.year (yy)
              const [year] = d.year.split("-");
              formattedDate = `${year.slice(-2)}`;
              label= "Year:";
            }
        
            return `<strong>${line.label}:</strong> ${(d as any)[line.key]}<br><strong>${label}</strong> ${formattedDate}`;
          });
        
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
      `translate(${MARGINS.LEFT}, ${HEIGHT + MARGINS.TOP + 60-10})`
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
        width: `${WIDTH + MARGINS.LEFT + MARGINS.RIGHT+20}px`,
        height: `${HEIGHT + MARGINS.TOP + MARGINS.BOTTOM + 50}px`,
      }}
    >
      <svg style={{
      position: "absolute",
      top: '100px',
      // left: '200px',
      width:'600px',
      transform: "translate(25%, 25%)",
      opacity: 0.05,
      // zIndex: -1, // Ensure it's behind
      pointerEvents: "none", // Prevent interference with interactions
    }}
  >
    <g>
      <CedaIcon
        style={{width:'600px', height:'100px'}}
        width={600} // Adjust width as needed
        height={100} // Adjust height as needed
      />
    
            </g>
          </svg>
      <svg className="pt-[10px]" width={WIDTH + MARGINS.LEFT + MARGINS.RIGHT} height={HEIGHT + MARGINS.TOP + MARGINS.BOTTOM+100}>
        <g ref={chartGroupRef} transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`} />
        <g ref={xAxisRef} transform={`translate(${MARGINS.LEFT}, ${HEIGHT + MARGINS.TOP})`} />
        <g ref={yAxisRef} transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`} />
        <g ref={legendRef} />
      </svg>
    </div>
  );
};

export default PriceLineChart;
