

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import styles from "./LineChart.module.css";

const MARGINS = {
  LEFT: 40,
  RIGHT: 30,
  TOP: 20,
  BOTTOM: 30,
};
const WIDTH = 880;
const HEIGHT = 367;

interface PriceDataItem {
  date: string;
  avg_modal_price: number;
  avg_min_price: number;
  avg_max_price: number;
  moving_average?: number;
  commodity_name: string;
  month?: string;
}

interface LineChartProps {
  PriceData: PriceDataItem[];
}

const LineChart1: React.FC<LineChartProps> = ({ PriceData }) => {
  const [data, setData] = useState<PriceDataItem[]>(PriceData || []);
  const xAxisRef = useRef<SVGGElement | null>(null);
  const yAxisRef = useRef<SVGGElement | null>(null);
  const chartGroupRef = useRef<SVGGElement | null>(null);
  const legendRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    setData(PriceData);
  }, [PriceData]);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(chartGroupRef.current);

    const xScale = d3
      .scaleUtc()
      .domain(d3.extent(data, (d) => new Date(d.date || d.month)) as [Date, Date])
      .range([0, WIDTH]);

    const yScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) =>
          Math.min(
            d.avg_min_price,
            d.avg_max_price,
            d.moving_average || 0,
            d.avg_modal_price
          )
        )! - 10, // Buffer below the min value
        d3.max(data, (d) =>
          Math.max(
            d.avg_min_price,
            d.avg_max_price,
            d.moving_average || 0,
            d.avg_modal_price
          )
        )!,
      ])
      .range([HEIGHT, 0]);

    const xAxis = d3
      .axisBottom(xScale)
      .ticks(5)
      .tickFormat(
        d3.timeFormat("%b %d") as (d: Date | { valueOf(): number }) => string
      );
    const yAxis = d3.axisLeft(yScale).ticks(5);

    d3.select(xAxisRef.current).call(xAxis as any);
    d3.select(yAxisRef.current).call(yAxis as any);

    d3.select(yAxisRef.current)
    .selectAll('.tick text') // Target tick labels
    .style('font-size', '12px')
    .style('font-family', 'Inter, sans-serif')
    .style('font-weight', 400)
    .style('fill', 'rgba(26, 55, 95, 0.8)');

    const color = d3.scaleOrdinal<string>(d3.schemeCategory10);

    const lines = [
      { key: "avg_modal_price", label: "Modal Price" },
      { key: "avg_min_price", label: "Min Price" },
      { key: "avg_max_price", label: "Max Price" },
      { key: "moving_average", label: "Moving Average" },
    ];

    lines.forEach((line) => {
      const lineGenerator = d3
        .line<PriceDataItem>()
        .x((d) => xScale(new Date(d.date || d.month || "")))
        .y((d) => yScale(d[line.key as keyof PriceDataItem] as number))
        .curve(d3.curveMonotoneX);

      svg
        .selectAll(`.line-${line.key}`)
        .data([data]) // Pass the entire dataset
        .join("path")
        .attr("class", `line-${line.key}`)
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", () => color(line.key))
        .attr("stroke-width", 2);
    });
    // Add data points
    lines.forEach((line) => {
      svg
        .selectAll(`.dot-${line.key}`)
        .data(data)
        .join("circle")
        .attr("class", `dot-${line.key}`)
        .attr("cx", (d) => xScale(new Date(d.date || d.month || "")))
        .attr("cy", (d) => yScale(d[line.key as keyof PriceDataItem] as number))
        .attr("r", 4)
        .attr("fill", () => color(line.key))
        .attr("stroke", "white")
        .attr("stroke-width", 1);
    });

  //   var Tooltip = d3.select("#chart-container")
  //   .append("div")
  //   .style("opacity", 0)
  //   .attr("class", "tooltip")
  //   .style("background-color", "white")
  //   .style("border", "solid")
  //   .style("border-width", "2px")
  //   .style("border-radius", "5px")
  //   .style("padding", "5px")

  //     // Three function that change the tooltip when user hover / move / leave a cell
  // var mouseover = function(d) {
  //   Tooltip
  //     .style("opacity", 1)
  //   d3.select(this)
  //     .style("stroke", "black")
  //     .style("opacity", 1)
  // }
  // var mousemove = function(d) {
  //   Tooltip
  //     .html("The exact value of<br>this cell is: " + d.value)
  //     .style("left", (d3.pointer(this)[0]) + "px")
  //     .style("top", (d3.pointer(this)[1]) + "px")
  // }
  // var mouseleave = function(d) {
  //   Tooltip
  //     .style("opacity", 0)
  //   d3.select(this)
  //     .style("stroke", "none")
  //     .style("opacity", 0.8)
  // }
    // Add tooltip
    const tooltip = d3
      .select("#chart-container")
      .append("div")
      .style("position", "absolute")
      .style("background", "white")
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("border-radius", "4px")
      .style("pointer-events", "none")
      .style("opacity", 0);

    svg
      .selectAll("circle")
      .on("mouseover", (event, d) => {
        tooltip
          .style("opacity", 1)
          .html(
            `<strong>Date:</strong> ${d3.timeFormat("%b %d, %Y")(new Date(d.date))}<br/>
           <strong>Value:</strong> ${d.avg_modal_price || d.avg_min_price || d.avg_max_price}`
          )
          // .style("left", `${event.pageX}px`)
          // .style("top", `${event.pageY}px`);
    // .style("left", (d3.pointer(this)[0]) + "px")
    // .style("top", (d3.pointer(this)[1]) + "px")
    // .style("top", (event.pageY)+"px")
    // .style("left",(event.pageX)+"px")
    .style("top", d3.select(this).attr("cy") + "px")
        .style("left", d3.select(this).attr("cx") + "px");


      })
      .on("mouseout", () => {
        tooltip.style("opacity", 0);
      })
      .on("mousemove", (event) => {
        tooltip
          // .style("left", `${event.pageX }px`)
          // .style("top", `${event.pageY }px`);
    // .style("left", (d3.pointer(this)[0]) + "px")
    // .style("top", (d3.pointer(this)[1]) + "px")
    // .style("top", (event.pageY)+"px")
    // .style("left",(event.pageX)+"px")
    .style("top", d3.select(this).attr("cy") + "px")
        .style("left", d3.select(this).attr("cx") + "px");
      });




    // Legend
    const legend = d3.select(legendRef.current);
    legend.selectAll("*").remove(); // Clear previous legend

    legend
      .attr("transform", `translate(${MARGINS.LEFT}, ${HEIGHT + MARGINS.TOP + 60})`) // Move to bottom-left
      .selectAll(".legend-item")
      .data(lines)
      .join("g")
      .attr("class", "legend-item")
      .attr("transform", (_, i) => `translate(${i * 100}, 0)`) // Horizontal spacing between legend items
      .each(function (line) {
        const g = d3.select(this);
        g.append("rect")
          .attr("x", 0)
          .attr("y", 0)
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
  }, [data]);


  return (
    <div id="chart-container" className={styles.chartContainer}>
      <svg className={styles.svgLineChart}
        width={WIDTH + MARGINS.LEFT + MARGINS.RIGHT}
        height={HEIGHT + MARGINS.TOP + MARGINS.BOTTOM+50} // Extra space for legend
      >
        <g className={styles.axislabel}
          ref={chartGroupRef}
          transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`}
        />
        <g
          ref={xAxisRef}
          transform={`translate(${MARGINS.LEFT}, ${HEIGHT + MARGINS.TOP})`}
        />
        <g
          ref={yAxisRef}
          transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`}
        />
        <g
          ref={legendRef}
          transform={`translate(${MARGINS.LEFT + WIDTH - 150}, ${HEIGHT + MARGINS.TOP + 20
            })`}
        />
      </svg>
    </div>
  );
};

export default LineChart1;
