import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Decimal from 'decimal.js';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const FundRow = ({ Fund }) => {
    Decimal.set({ precision: 100 })

    return (
        <tr className="ClientRow">
            <td >{Fund.fund.name}</td>
            <td >
                <FormattedNumber prefix='' fixedDecimals={2} value={Decimal(Fund.shares).toString()} />
            </td>
            <td >
                <FormattedNumber prefix="U$D " fixedDecimals={2} value={Decimal(Fund.fund.sharePrice).toString()} />
            </td>

            <td>
                <FormattedNumber prefix="U$D " fixedDecimals={2} value={Decimal(Fund.fund.sharePrice).times(Fund.shares)} />
            </td>
        </tr>
    )
}
export default FundRow

