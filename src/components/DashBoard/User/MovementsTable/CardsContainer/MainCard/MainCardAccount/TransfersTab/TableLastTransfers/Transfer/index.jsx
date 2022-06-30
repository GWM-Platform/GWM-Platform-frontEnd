import React, { useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import ActionConfirmationModal from 'components/DashBoard/User/MovementsTable/GeneralUse/TransferConfirmation'

const Transfer = ({ content, actions, getTransfers }) => {
  var momentDate = moment(content.createdAt);
  const { t } = useTranslation();
  const { getMoveStateById, Accounts } = useContext(DashBoardContext)

  const [ShowModal, setShowModal] = useState(false)
  const [Action, setAction] = useState("approve")

  const launchModalConfirmation = (action) => {
    setAction(action)
    setShowModal(true)
  }

  const incomingTransfer = () => content.receiverId === Accounts[0]?.id

  return (
    <tr>
      <td className="tableId">{content.id}</td>
      <td className="tableDate">{momentDate.format('DD/MM/YYYY, h:mm a')}</td>
      <td className={`tableConcept ${content.stateId === 3 ? 'text-red' : 'text-green'}`}>{t(getMoveStateById(content.stateId).name)}</td>
      <td className="tableConcept">{t("Transfer")}{" "}{t(incomingTransfer() ? "received from account" : "sent to account")}{t("")}{" \""}{incomingTransfer() ? content.senderAlias : content.receiverAlias}{"\""}</td>
      <td className={`tableAmount ${content.receiverId === Accounts[0]?.id ? 'text-green' : 'text-red'}`}><span>{content.receiverId === Accounts[0]?.id ? '+' : '-'}</span><span >$</span>{Math.abs(content.amount)}</td>
      {
        !!actions &&
        <td className="Actions verticalCenter" >{
          !!(content.stateId === 1 && incomingTransfer()) &&
          <div className="h-100 d-flex align-items-center justify-content-around">
            <div className="iconContainer green">
              <FontAwesomeIcon className="icon" icon={faCheckCircle} onClick={() => launchModalConfirmation("approve")} />
            </div>
            <div className="iconContainer red">
              <FontAwesomeIcon className="icon" icon={faTimesCircle} onClick={() => launchModalConfirmation("deny")} />
            </div>
          </div>}
        </td>

      }
      {
        !!(content.stateId === 1 && incomingTransfer()) &&
          <ActionConfirmationModal incomingTransfer={incomingTransfer()} reloadData={getTransfers} movement={content} setShowModal={setShowModal} action={Action} show={ShowModal} />
      }
    </tr >

  )
}
export default Transfer
