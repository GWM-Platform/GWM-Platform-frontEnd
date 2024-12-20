import React, { useMemo } from "react";
import Select from 'react-select';
import { components } from 'react-select';

const SingleSelectById = ({ backspaceRemovesValue = false, popover = false, menuPosition = "fixed", className = "", id = "", options: optionsDefault = [], validated = false, required = false, FormData = {}, handleChange, disabled, isLoading, isClearable = false, placeholder = "", getOptionLabel = false }) => {
    const value = FormData[id]
    const getOptionByValue = (optionValue) => options.find(option => optionValue === option?.value) || null


    const options = useMemo(() => optionsDefault.sort((a, b) => {
        if (value === a.value) {
            return -1;
        } else if (value === b.value) {
            return 1;
        } else {
            return a.label.localeCompare(b.label);
        }
    }), [optionsDefault, value])

    const parsedChange = (selectedOption) => {
        handleChange({ target: { value: selectedOption?.value || "", id } })
    }

    const Option = ({ children, ...props }) => (
        <components.Option title={children} {...props}>
            <div title={children} style={{ fontWeight: "400" }}>
                {children}
            </div>
        </components.Option>
    );

    return (
        <div className="h-100" title={getOptionByValue(value)?.label || placeholder || ""}>
            <Select
                {...(getOptionLabel ? { getOptionLabel } : {})}
                backspaceRemovesValue={backspaceRemovesValue}
                isClearable={isClearable}
                menuPosition={menuPosition}
                required={required}
                className={`basic-single ${className} ${disabled ? "disabled" : ""}`}
                classNamePrefix="select"
                isDisabled={disabled}
                openMenuOnClick={false}
                isSearchable
                isLoading={isLoading}
                alwaysDisplayPlaceholder
                noOptionsMessage={() => "No hay resultados"}
                placeholder={placeholder}
                name={id}
                options={options}
                onChange={parsedChange}
                value={getOptionByValue(value)}
                components={{ Option }}
                styles={{
                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        fontWeight: "400!important",
                        height: "100%"
                    }),
                    input: (baseStyles, state) => ({
                        ...baseStyles,
                        fontWeight: "400!important"
                    }),
                    placeholder: (baseStyles, state) => ({
                        ...baseStyles,
                        fontWeight: "400!important"
                    }),
                    singleValue: (baseStyles, state) => ({
                        ...baseStyles,
                        fontWeight: "400!important"
                    }),
                    option: (baseStyles, state) => ({
                        ...baseStyles,
                        fontWeight: "400!important"
                    })
                }}
                classNames={{
                    input: () => `react-select-input ${id}`,
                    control: () => `${(getOptionByValue(value) !== null || !required) ? "hasValue " : ""}`,
                    menuPortal: () => `${popover ? "for-popover " : ""}`,
                    dropdownIndicator: () => "same-dropdown"
                }}
            />
        </div>

    );
}

export default SingleSelectById