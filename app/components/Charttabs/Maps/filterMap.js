import { useState } from "react";
import TopoJsonMap from "./TopoJsonMap";

const MapWithFilter = ({ mapData }) => {
  const [selectedMonth, setSelectedMonth] = useState(mapData[0]?.month || "");
  const [stateCode, setStateCode] = useState("0");

  // Filter data based on the selected month
  const filteredMapData = {
    data: mapData.filter((d) => d.month === selectedMonth),
  };
  console.log("filtermap",mapData)

  return (
    <div>
      <label htmlFor="month">Select Month: </label>
      <select
        id="month"
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
      >
        {[...new Set(mapData.map((d) => d.month))].map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>

      <TopoJsonMap filteredMapData={filteredMapData} stateCode={stateCode} />

      <label htmlFor="state">Select State: </label>
      <select
        id="state"
        value={stateCode}
        onChange={(e) => setStateCode(e.target.value)}
      >
        <option value="0">National</option>
        {[...new Set(mapData.map((d) => d.state_id))].map((stateId) => (
          <option key={stateId} value={stateId}>
            {mapData.find((d) => d.state_id === stateId)?.state_name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default MapWithFilter;
