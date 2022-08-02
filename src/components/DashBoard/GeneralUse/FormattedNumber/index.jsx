import React from "react";
import { formatValue } from "@osdiab/react-currency-input-field";
import Decimal from "decimal.js";


const FormattedNumber = ({ style, className, value = 0, prefix = "", suffix = "", fixedDecimals = 0, hidden }) => {
    Decimal.set({ precision: 100 })

    const FormattedValue = () => formatValue({
        value: new Decimal(value).toFixed(fixedDecimals),
        groupSeparator: '.',
        decimalSeparator: ',',
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