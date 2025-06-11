import React, { useContext } from "react";
import { formatValue } from "@osdiab/react-currency-input-field";
import Decimal from "decimal.js";
import { DashBoardContext } from "context/DashBoardContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";


export const FormattedNumberFinal = ({ style, className, value = 0, prefix = "", suffix = "", fixedDecimals = 0, hidden, styledSybol = false, rounding = "ROUND_HALF_UP" }) => {
    Decimal.set({ precision: 100 })
    Decimal.set({ rounding: Decimal?.[rounding] })

    const groupSeparator = process.env.REACT_APP_GROUPSEPARATOR ?? ','
    const decimalSeparator = process.env.REACT_APP_DECIMALSEPARATOR ?? '.'

    // const decimal = Decimal(value).toFixed(fixedDecimals)
    // const significantDecimals = (decimal.split('.')[1] || '').replace(/0+$/, '').length
    const FormattedValue = () => formatValue({
        value: Decimal(value).toFixed(fixedDecimals),
        // significantDecimals > 2 ? decimal.replace(/\.?0+$/, "") : Decimal(decimal).toFixed(2),
        groupSeparator,
        decimalSeparator,
        prefix: prefix,
        suffix: suffix
    })

    return (
        <span style={style} className={`${className} ${styledSybol ? Decimal(value).lt(0) ? 'text-red' : 'text-green' : ""} `}>
            {
                hidden ?
                    FormattedValue().replace(/./g, "*")
                    :
                    FormattedValue()
            }
        </span>
    );
}


export const FormattedNumber = ({ value, prefix, fixedDecimals, className, style, showButton = false,
    suffix = "", hidden, styledSybol = false, rounding = "ROUND_HALF_UP"

}) => {

    const { Hide, setHide } = useContext(DashBoardContext)

    return (
        <div className="d-inline-flex align-items-center justify-content-between">
            <div style={{ marginRight: "0.25em" }} >
                <div className="containerHideInfo">
                    <FormattedNumberFinal
                        suffix={suffix} styledSybol={styledSybol} rounding={rounding}
                        hidden style={style} className={`info ${Hide ? "shown" : "hidden"} ${className}`} value={value} prefix={prefix} fixedDecimals={fixedDecimals} />
                    <FormattedNumberFinal
                        suffix={suffix} hidden={hidden} styledSybol={styledSybol} rounding={rounding}
                        style={style} className={`info ${Hide ? "hidden" : "shown"} ${className}`} value={value} prefix={prefix} fixedDecimals={fixedDecimals} />
                    <FormattedNumberFinal
                        suffix={suffix} hidden={hidden} styledSybol={styledSybol} rounding={rounding}
                        style={style} className={`info placeholder`} value={value} prefix={prefix} fixedDecimals={fixedDecimals} />
                </div>
            </div>
            {showButton &&
                <div className="hideInfoButton d-flex align-items-center">
                    <FontAwesomeIcon
                        size='xs'
                        className={`icon ${Hide ? "hidden" : "shown"}`}
                        onClick={() => { setHide(!Hide) }}
                        icon={faEye}
                    />
                    <FontAwesomeIcon
                        size='xs'
                        className={`icon ${!Hide ? "hidden" : "shown"}`}
                        onClick={() => { setHide(!Hide) }}
                        icon={faEyeSlash}
                    />
                    <FontAwesomeIcon
                        size='xs'
                        className="icon placeholder"
                        icon={faEyeSlash}
                    />
                </div>}
        </div>
    )
}

export default FormattedNumber

