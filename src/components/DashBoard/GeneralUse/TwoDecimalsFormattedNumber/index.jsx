import React from "react";
import { formatValue } from "@osdiab/react-currency-input-field";
import Decimal from "decimal.js";


const TwoDecimalsFormattedNumber = ({ style, className, value = 0, prefix = "", fixedDecimals = 0 }) => {

    return (
        <span style={style} className={className}>
            {
                formatValue({
                    value: new Decimal(value).toFixed(fixedDecimals),
                    groupSeparator: '.',
                    decimalSeparator: ',',
                    prefix: '',
                })
            }
        </span>
    );
}

export default TwoDecimalsFormattedNumber