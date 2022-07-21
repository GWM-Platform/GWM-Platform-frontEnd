import React, { useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { DashBoardContext } from 'context/DashBoardContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import ActionConfirmationModal from 'components/DashBoard/User/MovementsTable/GeneralUse/TransferConfirmation'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const Transfer = ({ content, getTransfers }) => {

  const { getMoveStateById, Accounts } = useContext(DashBoardContext)
  const { t } = useTranslation()

  var momentDate = moment(content.createdAt);
  const [ShowModal, setShowModal] = useState(false)
  const [Action, setAction] = useState("approve")

  const launchModalConfirmation = (action) => {
    setAction(action)
    setShowModal(true)
  }

  const incomingTransfer = () => content.receiverId === Accounts[0]?.id

  return (
    <div className='mobileMovement'>
      <div className='d-flex justify-content-between'>
        <span>{" "}{t(incomingTransfer() ? "Received from" : "Sent to")}{" "}{t("account with the alias")} <span className="text-nowrap"> {" \""}{incomingTransfer() ? content.senderAlias : content.receiverAlias}{"\""}</span></span>
        <span className="text-nowrap" >{momentDate.format('D MMM')}</span>

      </div>
      <div className='d-flex justify-content-between'>

        <span className={`${content.stateId === 3 ? 'text-red' : 'text-green'}`}>{t(getMoveStateById(content.stateId).name)}</span>
        <span className={`${Math.sign(content.amount) === 1 ? 'text-green' : 'text-red'}`}>{Math.sign(content.amount) === 1 ? '+' : '-'}
          <FormattedNumber value={Math.abs(content.amount)} prefix="$" fixedDecimals={2} />
        </span>
      </div>
      {
        !!(content.stateId === 1 && incomingTransfer()) &&
        <div className="h-100 d-flex align-items-center justify-content-around">
          <div className="iconContainer green" onClick={() => launchModalConfirmation("approve")}>
            <FontAwesomeIcon className="icon" icon={faCheckCircle} /> {t("Approve")}
          </div>
          <div className="iconContainer red" onClick={() => launchModalConfirmation("deny")} >
            <FontAwesomeIcon className="icon" icon={faTimesCircle} /> {t("Deny")}
          </div>
        </div>
      }
      {
        !!(content.stateId === 1 && incomingTransfer()) &&
        <ActionConfirmationModal incomingTransfer={incomingTransfer()} reloadData={getTransfers} movement={content} setShowModal={setShowModal} action={Action} show={ShowModal} />
      }
    </div>

  )
}
export default Transfer
