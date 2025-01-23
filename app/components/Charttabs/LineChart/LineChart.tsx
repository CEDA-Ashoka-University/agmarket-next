import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import CedaIcon from "../../../assets/icons/CedaIcon"

const MARGINS = { LEFT: 40, RIGHT: 30, TOP: 20, BOTTOM: 30 };
const WIDTH = 800;
const HEIGHT = 300;

interface LineChartProps {
  data: any[]; // Generalized to accept both PriceDataItem and QtyDataItem
  selectedTab: "Price" | "Quantity";
}

const LineChart: React.FC<LineChartProps> = ({ data, selectedTab }) => {
  const xAxisRef = useRef<SVGGElement | null>(null);
  const yAxisRef = useRef<SVGGElement | null>(null);
  const chartGroupRef = useRef<SVGGElement | null>(null);

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(chartGroupRef.current);
    svg.selectAll("*").remove();

    const xScale = d3
      .scaleUtc()
      .domain(
        d3.extent(data, (d: any) => new Date(d.date)) as [Date, Date]
      )
      .range([0, WIDTH]);

    const yScale = d3
      .scaleLinear()
      .domain(
        selectedTab === "Price"
          ? [
              d3.min(data, (d: any) =>
                Math.min(d.avg_min_price, d.avg_modal_price, d.avg_max_price)
              )! - 10,
              d3.max(data, (d: any) =>
                Math.max(d.avg_min_price, d.avg_modal_price, d.avg_max_price)
              )!,
            ]
          : [0, d3.max(data, (d: any) => d.total_quantity)! * 1.1]
      )
      .range([HEIGHT, 0]);

    const xAxis = d3.axisBottom(xScale).ticks(10).tickFormat(d3.timeFormat("%b %d, %Y") as any);
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
        .line<any>()
        .x((d) => xScale(new Date(d.date)))
        .y((d) => yScale(d[line.key]))
        .curve(d3.curveMonotoneX);

      svg
        .append("path")
        .datum(data)
        .attr("d", lineGenerator)
        .attr("fill", "none")
        .attr("stroke", () => color(line.key))
        .attr("stroke-width", 2);
    });
  }, [data, selectedTab]);

  return (
    <>
    <svg
      width={WIDTH + MARGINS.LEFT + MARGINS.RIGHT}
      height={HEIGHT + MARGINS.TOP + MARGINS.BOTTOM}
    >

      <g ref={chartGroupRef} transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`} />
      <g ref={xAxisRef} transform={`translate(${MARGINS.LEFT}, ${HEIGHT + MARGINS.TOP})`} />
      <g ref={yAxisRef} transform={`translate(${MARGINS.LEFT}, ${MARGINS.TOP})`} />
    </svg>
          </>
  );
};

export default LineChart;
