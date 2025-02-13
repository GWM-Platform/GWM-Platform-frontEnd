import { formatValue } from "@osdiab/react-currency-input-field"
import Decimal from "decimal.js"

const unMaskNumber = ({
    groupSeparator = process.env.REACT_APP_GROUPSEPARATOR ?? '.',
    decimalSeparator = process.env.REACT_APP_DECIMALSEPARATOR ?? ',',
    value = '',
    prefix = '$',
    suffix = '%'
}) => value
    // .replaceAll(groupSeparator, '')//Remove the digit group separator */
    .replaceAll(decimalSeparator, '.')//Replace the decimal separator with dot
    .replaceAll(' ', '') //Remove spaces
    .replaceAll(prefix, '') //Remove prefix
    .replaceAll(suffix, '') //Remove suffix


const maskNumber = ({
    groupSeparator = process.env.REACT_APP_GROUPSEPARATOR ?? '.',
    decimalSeparator = process.env.REACT_APP_DECIMALSEPARATOR ?? ',',
    value = '',
    prefix = "",
    suffix = ""
}) => {
    try {
       return formatValue({
            value: Decimal(value).toString(),
            // significantDecimals > 2 ? decimal.replace(/\.?0+$/, "") : Decimal(decimal).toFixed(2),
            groupSeparator,
            decimalSeparator,
            prefix: prefix,
            suffix: suffix
        })
    } catch (e){
        console.log(e)
        return value
    }
}

export { unMaskNumber,
    maskNumber }