import React from "react";
import { formatValue } from "@osdiab/react-currency-input-field";
import Decimal from "decimal.js";


const FormattedNumber = ({ style, className, value = 0, prefix = "", suffix = "", fixedDecimals = 0, hidden }) => {
    Decimal.set({ precision: 100 })

    const groupSeparator = process.env.REACT_APP_GROUPSEPARATOR ?? ','
    const decimalSeparator = process.env.REACT_APP_DECIMALSEPARATOR ?? '.'

    const decimal = Decimal(value).toFixed(fixedDecimals)
    const significantDecimals = (decimal.split('.')[1] || '').replace(/0+$/, '').length
    const FormattedValue = () => formatValue({
        value: significantDecimals > 2 ? decimal.replace(/\.?0+$/, "") : Decimal(decimal).toFixed(2),
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