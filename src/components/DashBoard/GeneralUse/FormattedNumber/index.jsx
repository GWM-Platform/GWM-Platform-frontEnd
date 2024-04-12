import React from "react";
import { formatValue } from "@osdiab/react-currency-input-field";
import Decimal from "decimal.js";


const FormattedNumber = ({ style, className, value = 0, prefix = "", suffix = "", fixedDecimals = 0, hidden }) => {
    Decimal.set({ precision: 100 })

    const groupSeparator = process.env.REACT_APP_GROUPSEPARATOR ?? ','
    const decimalSeparator = process.env.REACT_APP_DECIMALSEPARATOR ?? '.'

    const FormattedValue = () => formatValue({
        value: Decimal(value).toFixed(fixedDecimals).replace(/\.?0+$/, ""),
        groupSeparator,
        decimalSeparator,
        prefix: prefix,
        suffix: suffix
    })

    return (
        <span style={style} className={className}>
            {
                hidden ?
                    FormattedValue().replace(/./g, "*")
                    :
                    FormattedValue()
            }
        </span>
    );
}

export default FormattedNumber