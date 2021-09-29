import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';

const Movement = ({ content, decimals, symbol }) => {
  var momentDate = moment(content.date);

  return (
    <>
      <tr>
        <td className="tableDate">{momentDate.format("MMM DD, YYYY")}</td>
        <td className="tableDescription d-none d-sm-table-cell ">{content.description}</td>
        <td className={`tableAmount ${Math.sign(content.amount) === 1 ? 'text-green' : 'text-red'}`}><span>{Math.sign(content.amount) === 1 ? '' : '-'}</span><span >{symbol}</span>{(Math.abs(parseFloat(content.amount))).toFixed(decimals===0 ? 2 : decimals)}</td>
      </tr>
      <tr className="d-table-row d-sm-none descriptionRowMobile">
        <td className="descriptionMobile" colSpan="2" >{content.description}</td>
      </tr>
    </>

  )
}
export default Movement
