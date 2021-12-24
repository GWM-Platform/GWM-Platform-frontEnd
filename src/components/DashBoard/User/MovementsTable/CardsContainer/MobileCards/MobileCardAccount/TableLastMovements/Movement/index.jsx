import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';

const Movement = ({ content }) => {
  var momentDate = moment(content.date);

  return (
    <>
      <tr>
        <td className="tableDate">{momentDate.format('MMMM DD YYYY')}</td>
        <td className="tableDescription d-sm-table-cell ">${content.balance}</td>
      </tr>
    </>

  )
}
export default Movement
