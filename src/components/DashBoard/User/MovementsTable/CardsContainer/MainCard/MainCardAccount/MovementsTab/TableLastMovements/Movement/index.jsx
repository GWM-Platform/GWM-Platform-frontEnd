import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import 'moment/locale/es'
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';

const Movement = ({ content }) => {
  moment.locale(localStorage.getItem('language'))
  var momentDate = moment(content.createdAt);
  const { t } = useTranslation();
  const { getMoveStateById } = useContext(DashBoardContext)

  return (
    <tr>
      <td className="tableId">{content.id}</td>
      <td className="tableDate">{momentDate.format('DD/MM/YYYY, h:mm a')}</td>
      <td className={`tableConcept ${content.stateId === 3 ? 'text-red' : 'text-green'}`}>{t(getMoveStateById(content.stateId).name)}</td>
      <td className="tableConcept">{t(content.motive)}</td>
      <td className={`tableAmount ${Math.sign(content.amount) === 1 ? 'text-green' : 'text-red'}`}><span>{Math.sign(content.amount) === 1 ? '+' : '-'}</span><span >$</span>{Math.abs(content.amount)}</td>
    </tr>
  )
}
export default Movement
