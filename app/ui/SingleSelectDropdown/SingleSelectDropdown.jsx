/* eslint-disable react/prop-types */
import { Select } from "antd";
import "./SingleSelectDropdown.css";

function SingleSelectDropdown({ label, value, options, onChange }) {
  const selectOptions = options.map((opt) => {
    return {
      label: opt,
      value: opt,
    };
  });


  return (
    <div className="singleSelectDropdownContainer">
      <h1 className={value ? "active" : null}>{label}</h1>
      <Select
        status="error"
        style={{ width: "100%" }}
        options={selectOptions}
        value={value}
        placeholder={`Select ${label}`}
        // onClear={() => handleSelect(columnName, null)}
        onChange={(item) => onChange(item, label)}
        disabled={selectOptions.length === 0}
      />
    </div>
  );
}

export default SingleSelectDropdown;
