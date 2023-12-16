// Importing necessary dependencies and components
import React, { useState } from "react";
import Select, {
  ActionMeta,
  MultiValue,
  InputActionMeta,
  StylesConfig,
} from "react-select";
import Avatar from "react-avatar";
import {
  FaCheckSquare,
  FaBookmark,
  FaExclamationCircle,
  FaArrowDown,
  FaArrowUp,
} from "react-icons/fa";
import {
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdKeyboardArrowDown,
  MdKeyboardDoubleArrowDown,
  MdArrowUpward,
} from "react-icons/md";

// Props interface definition
interface Props {
  options: any[];
  selectedOptions: any[];
  onChange?: (selectedOptions: Option[]) => void;
  isMulti?: boolean;
  customStyles?: any;
  includeIcon?: boolean;
  isClearable?: boolean;
  disabled?: boolean;
  customComponent?: any;
  hideDropdownIndicator?: boolean;
  displayOnlyImage?: boolean;
}

// Option interface definition
interface Option {
  value: string;
  label: string;
  avatar?: string;
  isFixed?: boolean;
  color?: string;
}

// CustomSelect component definition
const CustomSelect = ({
  options,
  onChange,
  selectedOptions,
  isMulti = false,
  customStyles,
  includeIcon = true,
  isClearable = false,
  disabled = false,
  customComponent,
  hideDropdownIndicator = false,
  displayOnlyImage = false,
}: Props) => {
  const handleSelectChange = (
    selectedOptions: MultiValue<Option>,
    actionMeta: ActionMeta<Option>
  ) => {
    if (onChange) {
      onChange(selectedOptions as Option[]);
    }
  };

  // Function to format the label of each option
  const formatOptionLabel = (value: Option) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      {value.label === "Story" ? (
        <FaCheckSquare fill="#4BADE8" size={20} />
      ) : null}
      {value.label === "Feature" ? (
        <FaBookmark fill="#65ba43" size={20} />
      ) : null}
      {value.label === "Bug" ? (
        <FaExclamationCircle fill="#e44d42" size={20} />
      ) : null}
      {value.label === "Highest" ? (
        <MdKeyboardDoubleArrowUp fill="#cd1316" size={20} />
      ) : null}
      {value.label === "High" ? (
        <MdKeyboardArrowUp fill="#e94949" size={20} />
      ) : null}
      {value.label === "Medium" ? (
        <MdArrowUpward fill="#e97f33" size={20} />
      ) : null}
      {value.label === "Low" ? (
        <MdKeyboardArrowDown fill="#2d8738" size={20} />
      ) : null}
      {value.label === "Lowest" ? (
        <MdKeyboardDoubleArrowDown fill="#57a55a" size={20} />
      ) : null}
      {includeIcon ? <Avatar size="30" round src={value.avatar} /> : null}
      <span style={{ marginLeft: "10px", background: "transparent" }}>
        {value.label}
      </span>
    </div>
  );

  // Rendering the Select component with customization
  return (
    <Select
      isDisabled={disabled}
      options={options}
      value={selectedOptions}
      onChange={handleSelectChange}
      formatOptionLabel={formatOptionLabel}
      isSearchable
      closeMenuOnSelect={true}
      isClearable={isClearable}
      styles={customStyles}
      className="custom-multi-select"
      isMulti={isMulti ? true : undefined}
      components={{
        IndicatorSeparator: () => null,
      }}
    />
  );
};

export default CustomSelect;
