import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import './index.css'
import { useTranslation } from 'react-i18next';
import { DashBoardContext } from 'context/DashBoardContext';
const Movement = ({ content }) => {
  var momentDate = moment(content.createdAt);

  const { getMoveStateById, ClientSelected } = useContext(DashBoardContext)
  const clientId = ClientSelected?.id

  const { t } = useTranslation()

  const incomingTransfer = () => content.receiverId === clientId

  return (
    <div className='mobileMovement'>
      <div className='d-flex justify-content-between'>
        <span>{" "}{t(incomingTransfer() ? "Received from" : "Sent to")}{" "}{t("account with the alias")} <span className="text-nowrap"> {" \""}{incomingTransfer() ? content.senderAlias : content.senderAlias}{"\""}</span></span>
        <span className="text-nowrap" >{momentDate.format('D MMM')}</span>

      </div>
      <div className='d-flex justify-content-between'>

        <span className={`${content.stateId === 3 ? 'text-red' : 'text-green'}`}>{t(getMoveStateById(content.stateId).name)}</span>
        <span className={`${Math.sign(content.amount) === 1 ? 'text-green' : 'text-red'}`}>{Math.sign(content.amount) === 1 ? '+' : '-'}${Math.abs(content.amount)}</span>
      </div>
    </div>

  )
}
export default Movement
