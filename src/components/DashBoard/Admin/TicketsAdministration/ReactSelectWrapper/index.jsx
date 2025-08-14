import React from "react";
import Select from 'react-select';
import { components } from 'react-select';

const ReactSelectWrapper = ({
    backspaceRemovesValue = false, popover = false, menuPosition = "fixed", className = "", id = "", isClearable = false, isMulti = false, placeholder = "",
    options = [], FormData = {}, handleChange,
    validated = false, required = false, disabled, isLoading,
    getOptionLabel = false,
    getOptionValue = false,
    getOptionByValueProp = false, useDefaultGetOptionByValue = false,
    getOptionsByValueProp = false, useDefaultGetOptionsByValue = false,
}) => {
    const value = FormData[id] || []
    const getOptionByValueDefault = (optionValue) => options.find(option => optionValue === option?.value) || null

    const getOptionByValue = (useDefaultGetOptionByValue ? getOptionByValueDefault : getOptionByValueProp) || (() => value)

    const getOptionsByValueDefault = (optionValues) =>
        getOptionByValue ?
            optionValues?.length > 0 ?
                optionValues.map(optionValue => getOptionByValue(optionValue))
                :
                null
            :
            value
    const getOptionsByValue = (useDefaultGetOptionsByValue ? getOptionsByValueDefault : getOptionsByValueProp) || (() => value)


    const parsedChange = (selectedOption) => {
        console.log(
            selectedOption
        )
        handleChange({
            target: {
                value:
                    isMulti
                        ? selectedOption?.map(value => (getOptionValue ? getOptionValue(selectedOption) : selectedOption || "")) || []
                        : (getOptionValue ? getOptionValue(selectedOption) : selectedOption || "")
                , id
            }
        })
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
                {
                ...{
                    ...(getOptionValue ? { getOptionValue } : {}),
                    ...(getOptionLabel ? { getOptionLabel } : {})
                }
                }
                isMulti={isMulti}
                value={isMulti ? getOptionsByValue(value) : getOptionByValue(value)}
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
                    control: () => `${(((getOptionByValue ? getOptionByValue(value) : value) || []).length > 0 || !required) ? "hasValue " : ""}`,
                    menuPortal: () => `${popover ? "for-popover " : ""}`,
                    dropdownIndicator: () => "same-dropdown"
                }}
            />
        </div>

    );
}

export default ReactSelectWrapper