import React from 'react';
import Select from 'react-select';
import { FormGroup, Label } from 'reactstrap';

const Dropdown = ({ label, options, value, onChange, isMulti = true }) => {
  return (
    <FormGroup>
      <Label for={label}>{label}</Label>
      <Select
        isMulti={isMulti}
        options={options}
        value={options.filter(option => value.includes(option.value))}
        onChange={(selected) => onChange(selected ? selected.map(option => option.value) : [])}
        closeMenuOnSelect={false}
        hideSelectedOptions={false}
      />
    </FormGroup>
  );
};

export default Dropdown;
