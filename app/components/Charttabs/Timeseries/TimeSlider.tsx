import { Col, Row, Slider } from "antd";
import { SliderRangeProps } from "antd/lib/slider";
import dayjs, { Dayjs } from "dayjs";

type TimeSliderProps = {
  outerDateRange: { from: Dayjs; upto: Dayjs };
  innerDateRange: { from: Dayjs; upto: Dayjs };
  onChange: (innerDateRange: { from: Dayjs; upto: Dayjs }) => void;
};

const TimeSlider = ({
  outerDateRange,
  innerDateRange,
  onChange,
}: TimeSliderProps) => {
  const min = outerDateRange.from.valueOf();
  const max = outerDateRange.upto.valueOf();
  const current = dayjs().valueOf();
  const tickCount = 15;
  const tickInterval = Math.floor((max - min) / tickCount);
  const values: [number, number] = [
    innerDateRange.from.valueOf(),
    innerDateRange.upto.valueOf(),
  ];

  const formatter: NonNullable<SliderRangeProps["tooltip"]>["formatter"] = (
    value: string | number | undefined
  ) => `${value ? dayjs(value).format("MM/DD/YYYY HH:mm A") : ""}`;

  const fmt = (date: number) => {
    const d = dayjs(date);
    const { from, upto } = outerDateRange;
    const range = dayjs(upto).diff(dayjs(from)); // Calculate time difference in milliseconds

    // Pick an appropriate level of granularity for the date range we're viewing
    if (range < 1000 * 60 * 60 * 24) return d.format("hh:mm A"); // range is less than a day, show hours and minutes

    if (range < 1000 * 60 * 60 * 24 * 7) return d.format("M/D, HH:mm"); // range is less than a week, show day of the week

    if (range < 1000 * 60 * 60 * 24 * 30) return d.format("M/D"); // range is less than a month, show month / day

    if (range < 1000 * 60 * 60 * 24 * 365) return d.format("MMM D"); // range is less than a year, show month and day

    if (range < 1000 * 60 * 60 * 24 * 365 * 10) return d.format("MMM YYYY"); // range is more than a year, show year and month

    return d.format("YYYY"); // range is more than 10 years, show year
  };

  const marks: Record<number, { label: string; style?: React.CSSProperties }> =
    {
      [min]: { label: fmt(min) },
      [current]: {
        label: "Now",
        style: {
          color: "rgb(89, 147, 251)",
          transform: "translate(-50%, -36px)",
          fontWeight: "bold",
        },
      },
      [max]: { label: fmt(max) },
    };

  // Add ticks to marks and style differently if future date
  for (let i = min + tickInterval; i <= max; i += tickInterval) {
    const futureDate = i > current;
    marks[i] = {
      label: fmt(i),
      style: futureDate
        ? {
            color: "rgb(73, 163, 15)",
          }
        : {},
    };
  }

  // Calculate track styles based on the current date
  const getTrackStyle = () => {
    if (values[1] <= current) {
      // All within past/present
      return {
        backgroundColor: "#91caff",
      };
    } else if (values[0] >= current) {
      // All in future
      return {
        backgroundColor: "rgb(165, 222, 129)",
      };
    } else {
      // Split between past/present and future
      const pastWidthPercentage =
        ((current - values[0]) / (values[1] - values[0])) * 100;
      return {
        background: `linear-gradient(
            to right,
            #91caff 0%,
            #91caff ${pastWidthPercentage}%,
            rgb(165, 222, 129) ${pastWidthPercentage}%,
            rgb(165, 222, 129) 100%
          )`,
      };
    }
  };

  const getRailStyle = () => {
    return {
      backgroundColor: "rgb(204, 204, 204)",
    };
  };

  return (
    <div>
      <Row>
        <Col span={24}>
          <Slider
            range={{ draggableTrack: true }}
            min={min}
            max={max}
            marks={marks}
            value={values}
            styles={{
              track: getTrackStyle(),
              rail: getRailStyle(),
            }}
            onChange={(value: number[]) => {
              onChange({
                from: dayjs(value[0]),
                upto: dayjs(value[1]),
              });
            }}
            tooltip={{ formatter }}
          />
        </Col>
      </Row>
    </div>
  );
};

export default TimeSlider;
