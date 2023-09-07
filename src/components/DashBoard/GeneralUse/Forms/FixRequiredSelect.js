import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const noop = () => {
  // no operation (do nothing real quick)
};

class FixRequiredSelect extends React.Component {
  state = {
    value: this.props.value || "",
  };

  selectRef = null;
  setSelectRef = (ref) => {
    this.selectRef = ref;
  };

  onChange = (value, actionMeta) => {
    this.props.onChange(value, actionMeta);
    this.setState({ value });
  };

  getValue = () => {
    if (this.props.value !== undefined) return this.props.value;
    return this.state.value || "";
  };

  render() {
    const { SelectComponent, required, ...props } = this.props;
    const { isDisabled } = this.props;
    const enableRequired = !isDisabled;

    const dropdownIndicatorStyles = (base, state) => {
      let changes = {
        backgroundImage:
          "url('data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill=%27none%27 stroke=%27%23343a40%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%272%27 d=%27m2 5 6 6 6-6%27/%3e%3c/svg%3e')",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right .75rem center",
        backgroundSize: "16px 12px",
      };

      return Object.assign(base, changes);
    };

    const controlStyles = (base, state) => {
      let changes = props.invalid
        ? {
          borderColor: "red",
          boxShadow: "0 0 0 0.25rem transparent",
          transition:
            "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
          "&:hover": {
            borderColor: "red",
            boxShadow: "0 0 0 0.25rem rgb(220 53 69 / 0%)",
          },
          "&:focus-within": {
            borderColor: "red",
            boxShadow: "0 0 0 0.25rem rgb(220 53 69 / 25%)",
          },
        }
        : props.valid
          ? {
            borderColor: "#198754",
            boxShadow: "0 0 0 0.25rem transparent",
            "&:hover": {
              borderColor: "#198754",
              boxShadow: "0 0 0 0.25rem rgb(220 53 69 / 0%)",
            },
            "&:focus-within": {
              borderColor: "#198754",
              boxShadow: "0 0 0 0.25rem rgb(25 135 84 / 25%)",
            },
          }
          : {
            transition:
              "border-color .15s ease-in-out,box-shadow .15s ease-in-out",
            "&:focus-within": {
              borderColor: "#86b7fe",
              boxShadow: "0 0 0 0.25rem rgb(13 110 253 / 25%)",
            },
          };

      return Object.assign(base, changes);
    };

    const dropdownValueContainer = (base, state) => {
      let changes = props.invalid
        ? {
          borderColor: "#dc3545",
          paddingRight: "calc(1.5em + .75rem)",
          backgroundImage:
            'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 12 12%27 width=%2712%27 height=%2712%27 fill=%27none%27 stroke=%27%23dc3545%27%3e%3ccircle cx=%276%27 cy=%276%27 r=%274.5%27/%3e%3cpath stroke-linejoin=%27round%27 d=%27M5.8 3.6h.4L6 6.5z%27/%3e%3ccircle cx=%276%27 cy=%278.2%27 r=%27.6%27 fill=%27%23dc3545%27 stroke=%27none%27/%3e%3c/svg%3e")',
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right center",
          backgroundSize: "calc(.75em + .375rem) calc(.75em + .375rem)",
        }
        : props.valid
          ? {
            borderColor: "#198754",
            paddingRight: "calc(1.5em + .75rem)",
            backgroundImage:
              'url("data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 8 8%27%3e%3cpath fill=%27%23198754%27 d=%27M2.3 6.73.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z%27/%3e%3c/svg%3e")',
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right center",
            backgroundSize: "calc(.75em + .375rem) calc(.75em + .375rem)",
          }
          : {};

      return Object.assign(base, changes);
    };

    return (
      <>
        <SelectComponent
          isClearable={props.isClearable}
          styles={{
            dropdownIndicator: dropdownIndicatorStyles,
            control: controlStyles,
            valueContainer: dropdownValueContainer,
          }}
          components={{
            IndicatorSeparator: () => null,
            ClearIndicator:  ({ innerRef, innerProps })  => <div ref={innerRef} {...innerProps} className="d-flex p-2"><FontAwesomeIcon fontSize={12} color="#343a40" icon={faTimes} /></div>
          }}
          {...props}
          ref={this.setSelectRef}
          onChange={this.onChange}
        />
        {enableRequired && (
          <input
            tabIndex={-1}
            autoComplete="off"
            style={{
              display: "none",
              height: 0,
              position: "absolute",
            }}
            value={this.getValue()}
            onChange={noop}
            onFocus={() => this.selectRef.focus()}
            required={required}
          />
        )}
      </>
    );
  }
}

FixRequiredSelect.defaultProps = {
  onChange: noop,
};

FixRequiredSelect.protoTypes = {
  // react-select component class (e.g. Select, Creatable, Async)
  selectComponent: PropTypes.func.isRequired,
  onChange: PropTypes.func,
  required: PropTypes.bool,
};

export default FixRequiredSelect;
