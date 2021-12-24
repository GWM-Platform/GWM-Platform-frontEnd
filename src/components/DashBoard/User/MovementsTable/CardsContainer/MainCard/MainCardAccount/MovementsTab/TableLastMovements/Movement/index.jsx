import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';

const Movement = ({ content }) => {
  var momentDate = moment(content.createdAt);

  return (
      <tr>
        <td className="tableDate">{momentDate.format('MMMM Do YYYY, h:mm:ss a')}</td>
        <td className={`tableAmount ${Math.sign(content.amount) === 1 ? 'text-green' : 'text-red'}`}><span>{Math.sign(content.amount) === 1 ? '+' : '-'}</span><span >$</span>{Math.abs(content.amount)}</td>
      </tr>
  )
}
export default Movement
