import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Decimal from 'decimal.js';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const FundRow = ({ Fund }) => {
    Decimal.set({ precision: 100 })

    return (
        <tr className="AccountRow">
            <td >{Fund.fund.name}</td>
            <td >{Fund.shares}</td>
            <td >{Fund.fund.sharePrice}</td>

            <td>
                <FormattedNumber prefix='$' fixedDecimals={2} value={Decimal(Fund.fund.sharePrice).times(Fund.shares)} />
            </td>
        </tr>
    )
}
export default FundRow

