const unMaskNumber = ({
    groupSeparator = process.env.REACT_APP_GROUPSEPARATOR ?? '.',
    decimalSeparator = process.env.REACT_APP_DECIMALSEPARATOR ?? ',',
    value = '',
    prefix = '$',
    suffix = '%'
}) => value
    .replaceAll(groupSeparator, '')//Remove the digit group separator */
    .replaceAll(decimalSeparator, '.')//Replace the decimal separator with dot
    .replaceAll(' ', '') //Remove spaces
    .replaceAll(prefix, '') //Remove prefix
    .replaceAll(suffix, '') //Remove suffix

export { unMaskNumber }