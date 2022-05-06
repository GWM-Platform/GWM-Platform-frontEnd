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
  const { getMoveStateById, ClientSelected } = useContext(DashBoardContext)
  const clientId = ClientSelected?.id

  return (
    <tr>
      <td className="tableDate">{momentDate.format('DD/MM/YYYY, h:mm a')}</td>
      <td className={`tableConcept ${content.stateId === 3 ? 'text-red' : 'text-green'}`}>{t(getMoveStateById(content.stateId).name)}</td>
      <td className="tableConcept">{t("Transfer")}{" "}{t(content.receiverId === clientId ? "received from" : "sent to")}{" "}{t("account with id")}{" "}{content.receiverId === clientId ? content.senderId : content.senderId}</td>
      <td className={`tableAmount ${content.receiverId === clientId ? 'text-green' : 'text-red'}`}><span>{content.receiverId === clientId  ? '+' : '-'}</span><span >$</span>{Math.abs(content.amount)}</td>
    </tr>
  )
}
export default Movement
