import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import 'moment/locale/es'

const Movement = ({ content }) => {
  moment.locale(localStorage.getItem('language') === 'gb' ? "en" : "es")
  var momentDate = moment(content.createdAt);

  return (
    <tr>
      <td className="tableDate">{momentDate.format('DD/MM/YYYY, h:mm a')}</td>
      <td className={`tableAmount ${Math.sign(content.amount) === 1 ? 'text-green' : 'text-red'}`}><span>{Math.sign(content.amount) === 1 ? '+' : '-'}</span><span >$</span>{Math.abs(content.amount)}</td>
    </tr>
  )
}
export default Movement
