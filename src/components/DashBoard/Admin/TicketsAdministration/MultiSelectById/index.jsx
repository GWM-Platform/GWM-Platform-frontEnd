import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { useIsInsideElement } from "hooks/useIsInsideElement";
import React, { useEffect, useState } from "react";
import { useCallback } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import Select, { components } from 'react-select';
import capitalize from "utils/capitalize";

const MultiSelectById = ({
    // valuePaddingTop = "calc(1.625rem - 4px)",
    popover = false, placeholder = "", menuPosition = "fixed", className = "basicSelector",
    label = "", id = "", options = [], FormData = {}, handleChange,
    validated = false, required = false, disabled, isLoading, isClearable = false,
    useDeletableProp = false, onDelete = false }) => {
    const [searchInputValue, setSearchInputValue] = useState("");
    const handleInputChange = (newValue) => {
        setSearchInputValue(newValue);
        return newValue;
    };
    const value = FormData[id]

    const getOptionByValue = (optionValue = "", optionsArray = options) => {
        for (const option of optionsArray) {
            if (JSON.stringify(optionValue) === JSON.stringify(option?.value)) {
                return option;
            }
            if (option?.options) {
                const foundOption = getOptionByValue(optionValue, option?.options);
                if (foundOption) {
                    return foundOption;
                }
            }
        }
        return null;
    }
    const getOptionsByValue = (optionValues) =>
        optionValues?.length > 0 ?
            optionValues.map(optionValue => getOptionByValue(optionValue)).sort((a, b) => a?.label?.localeCompare(b?.label))
            :
            null

    const parsedChange = (selectedOptions) => {
        handleChange({ target: { value: selectedOptions.map(selectedOption => selectedOption.value), id } })
    }
    const MultiValue = ({ children, getValue, ...props }) => {
        let maxToShow = 2;
        var length = getValue().length;
        let shouldBadgeShow = length > maxToShow;
        let displayLength = length - maxToShow;
        console.log(props)
        // sumar group al title
        // botones shortcuts seleccion
        return (
            searchInputValue === "" &&
            ((props.index < maxToShow) ?
                <components.MultiValue {...props} >

                    <span title={`${props.data.label}${props.data.group ? ` - ${props.data.group}` : ""}`}>
                        {props.data.label}{props.data.group ? ` - ${props.data.group}` : ""}
                    </span>
                </components.MultiValue>
                :
                (props.index === maxToShow &&
                    <components.MultiValue {...props} className="minWidth-unset">
                        <OverlayTrigger
                            placement="bottom"
                            overlay={
                                <Tooltip id="tooltip" className="text-align-start">
                                    {
                                        getValue()
                                            .slice(maxToShow, length)
                                            .map(option =>
                                                <React.Fragment key={`${option.label}-${option.value}`}>
                                                    {option.label}{option.group ? ` - ${option.group}` : ""}<br />
                                                </React.Fragment>
                                            )}
                                </Tooltip>
                            }
                        >
                            <span>
                                {shouldBadgeShow &&
                                    `+ ${displayLength} item${getValue().slice(maxToShow, length)?.length !== 1 ? "s" : ""}`}
                            </span>
                        </OverlayTrigger>

                    </components.MultiValue >))
        );
    };

    const Option = ({ children, data, isSelected, isFocused, isDisabled, ...props }) => {
        return (
            <div className={`formatedOption withDelete ${isDisabled ? "disabled" : ""} ${isSelected ? "selected" : ""} ${isFocused ? "focused" : ""}`}>
                <components.Option {...props} className="select__option customFormatedOptionLabel overflow-auto">
                    <input style={{
                        alignSelf: "baseline"
                        // , height: "1.35em"
                    }} className="me-2" readOnly type="checkbox" checked={isSelected} />
                    <span title={children} >
                        {data.depth >= 0 ? <div className="d-inline-block" style={{ opacity: 0.8, fontWeight: 100 }}>{("  ".repeat(data.depth) + "▸ ")}</div> : ""}
                    </span>
                    <span style={{
                        fontWeight: 400,
                        whiteSpace: "initial",
                        textAlign: "left",
                        display: "inline"
                    }}>
                        {children}
                    </span>
                </components.Option>
                {
                    onDelete && (
                        (!useDeletableProp || data.deletable) &&
                        <button type="button" onClick={() => onDelete(data.value)} disabled={isDisabled} className='customFormatedOptionButton'>
                            <FontAwesomeIcon icon={faTrashCan} />
                        </button>
                    )
                }
            </div>
        );
    };

    const MultiValueRemove = ({ ...props }) => {
        return (
            null
        );
    };

    // const { insideElement: insideModal, elementId } = useIsInsideElement({ classNameSearch: 'modal-content' })
    const Group = ({ children, ...props }) => {
        const maxOptions = props.selectProps?.maxOptions || 0;
        const additionalOptions = Array.isArray(children) ? children.length - maxOptions : 0;

        return (
            <components.Group {...props}>
                {Array.isArray(children)
                    ? children.slice(0, maxOptions) /* Options */
                    : children /* NoOptionsLabel */
                }
                {additionalOptions > 0 && (
                    <div className="px-3 pt-1 text-center fw-normal" style={{ color: "#4b4b4f" }} >{`Escriba para buscar (${children.length} opciones)`}</div>
                )}
            </components.Group>
        );
    };

    const MenuList = useCallback(({ children, ...props }) => {
        const maxOptions = props.selectProps?.maxOptions || 0;
        const additionalOptions = Array.isArray(children) ? children.length - maxOptions : 0;

        return (
            <components.MenuList {...props}>
                {Array.isArray(children)
                    ? children.slice(0, maxOptions) /* Options */
                    : children /* NoOptionsLabel */
                }
                {additionalOptions > 0 && (
                    <div className="px-3 pt-1 text-center fw-normal" style={{ color: "#4b4b4f" }} >{`Escriba para buscar (${children.length} opciones)`}</div>
                )}
            </components.MenuList>
        );
    }, [])

    const GroupHeading = useCallback(
        ({ children, ...props }) => {
            const groupOptions = props?.data?.options || [];

            const selectedChilds = groupOptions.filter(option => value.includes(option.value));
            const allChildSelected = selectedChilds.length === groupOptions.length

            const handleClick = () => {
                const newValue = allChildSelected
                    ? value.filter(value => !groupOptions.some(groupOption => groupOption.value === value))
                    : [...value, ...groupOptions.filter(groupOption => !value.includes(groupOption.value)).map(groupOption => groupOption.value)];

                handleChange({
                    target: {
                        id,
                        value: newValue
                    }
                });
            };

            return (
                <components.GroupHeading {...props}>
                    {
                        groupOptions.length > 0 ?
                            <>
                                <span className="link-style fw-normal" onClick={handleClick} title={allChildSelected ? "Deseleccionar todas" : "Seleccionar todas"}>
                                    {capitalize(children)}
                                </span>,&nbsp;
                                {groupOptions.length} opcion{groupOptions.length > 1 ? "es" : ""} ({
                                    selectedChilds.length === 0 ?
                                        "ninguna seleccionada"
                                        :
                                        allChildSelected ?
                                            " todas seleccionadas"
                                            :
                                            `${selectedChilds.length} seleccionada${selectedChilds.length > 1 ? "s" : ""}`
                                })
                            </>
                            :
                            children

                    }
                </components.GroupHeading>
            );
        },
        [handleChange, id, value],
    )


    return (
        <>
            <style>
                {
                    (value?.length === 0 && searchInputValue === "") &&
                    // show label but +right MultiValue width
                    `
                        .react-select-input-floating.${id}${value?.length > 1 ? ":not(:focus-within)" : ""}::after{
                            content: "${label}" !important;
                        }
                `}
            </style>
            <Select
                onInputChange={handleInputChange}
                // id={elementId}
                // menuPortalTarget={insideModal ? document.body : null}
                isClearable={isClearable}
                menuPosition={menuPosition}
                required={required}
                hideSelectedOptions={false}
                className={`basic-single-floating  ${getOptionsByValue(value)?.length > 0 ? "forced-pointer-events" : ""} ${className} ${disabled ? "disabled" : ""}`}
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
                value={getOptionsByValue(value)}
                isMulti
                closeMenuOnSelect={false}
                components={{
                    MultiValue, MultiValueRemove, Option, Group, MenuList, GroupHeading
                }}
                maxOptions={50}
                styles={{
                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        // height: "calc(3.5rem + 2px)",
                        fontWeight: "400!important"
                    }),
                    valueContainer: (baseStyles, state) => ({
                        ...baseStyles,
                        // paddingTop: "calc( 1.625rem - 4px )"
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
                    input: () => `react-select-input-floating ${id}`,
                    control: () => `${!!(validated && required) ? "validated " : ""} ${(getOptionsByValue(value) !== null) ? "hasValue " : ""}`,
                    multiValue: () => ("multi-value"),
                    menuPortal: () => `${/*insideModal ? "for-modal" : ""*/""}${popover ? "for-popover " : ""}`
                }}

            />
        </>

    );
}

export default MultiSelectById