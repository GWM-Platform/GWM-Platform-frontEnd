import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

const FundRow = ({ Fund }) => {
    return (
        <tr className="AccountRow">
            <td >{Fund.fund.name}</td>
            <td >{Fund.shares}</td>
            <td >{Fund.fund.sharePrice}</td>
            <td>{(Fund.fund.sharePrice*Fund.shares).toFixed(2)}</td>
        </tr>
    )
}
export default FundRow

