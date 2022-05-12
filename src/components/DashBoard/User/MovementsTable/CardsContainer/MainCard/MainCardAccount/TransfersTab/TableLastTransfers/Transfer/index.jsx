import React, { useContext,useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import 'moment/locale/es'
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import ActionConfirmationModal from './ActionConfirmationModal'

const Transfer = ({ content, actions,getTransfers }) => {
  moment.locale(localStorage.getItem('language'))
  var momentDate = moment(content.createdAt);
  const { t } = useTranslation();
  const { getMoveStateById, ClientSelected } = useContext(DashBoardContext)
  const clientId = ClientSelected?.id

  const [ShowModal, setShowModal] = useState(false)
  const [Action, setAction] = useState("approve")

  const launchModalConfirmation = (action) => {
    setAction(action)
    setShowModal(true)
  }

  const incomingTransfer=()=>content.receiverId === clientId
  return (
    <tr>
      <td className="tableId">{content.id}</td>
      <td className="tableDate">{momentDate.format('DD/MM/YYYY, h:mm a')}</td>
      <td className={`tableConcept ${content.stateId === 3 ? 'text-red' : 'text-green'}`}>{t(getMoveStateById(content.stateId).name)}</td>
      <td className="tableConcept">{t("Transfer")}{" "}{t( incomingTransfer() ? "received from" : "sent to")}{" "}{t("account with the alias")}{" \""}{incomingTransfer() ? content.senderAlias : content.senderAlias}{"\""}</td>
      <td className={`tableAmount ${content.receiverId === clientId ? 'text-green' : 'text-red'}`}><span>{content.receiverId === clientId ? '+' : '-'}</span><span >$</span>{Math.abs(content.amount)}</td>
      {
        actions &&
        <td className="Actions verticalCenter" >{
          content.stateId === 1 &&
          <div className="h-100 d-flex align-items-center justify-content-around">
            <div className="iconContainer green">
              <FontAwesomeIcon className="icon" icon={faCheckCircle} onClick={() => launchModalConfirmation("approve") } />
            </div>
            <div className="iconContainer red">
              <FontAwesomeIcon className="icon" icon={faTimesCircle} onClick={() =>  launchModalConfirmation("deny") } />
            </div>
          </div>}
        </td>

      }
      {
        content.stateId === 1 ?
          <ActionConfirmationModal incomingTransfer={incomingTransfer()} reloadData={getTransfers} movement={content} setShowModal={setShowModal} action={Action} show={ShowModal} />
          :
          null
      }
    </tr >

  )
}
export default Transfer
