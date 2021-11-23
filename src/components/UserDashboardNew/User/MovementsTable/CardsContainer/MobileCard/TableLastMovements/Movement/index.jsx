import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';

const Movement = ({ content }) => {
  var momentDate = moment(content.date);

  return (
    <>
      <tr>
        <td className="tableDate">{momentDate.format('MMMM Do YYYY, h:mm:ss a')}</td>
        <td className="tableDescription d-none d-sm-table-cell ">${content.sharePrice}</td>
      </tr>
      <tr className="d-table-row d-sm-none descriptionRowMobile">
        <td className={`tableAmount ${Math.sign(content.shares) === 1 ? 'text-green' : 'text-red'}`}><span>{Math.sign(content.shares) === 1 ? '+' : '-'}</span><span ></span>{Math.abs(content.shares)} FeeParts</td>
        <td className={`tableAmount ${Math.sign(content.shares) === 1 ? 'text-green' : 'text-red'}`}><span>{Math.sign(content.shares) === 1 ? '+' : '-'}</span><span >$</span>{Math.abs(content.shares) * content.sharePrice}</td>      </tr>
    </>

  )
}
export default Movement
