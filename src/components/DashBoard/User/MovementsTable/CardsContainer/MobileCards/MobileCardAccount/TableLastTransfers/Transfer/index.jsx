import React, { useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { DashBoardContext } from 'context/DashBoardContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faFilePdf, faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import ActionConfirmationModal from 'components/DashBoard/User/MovementsTable/GeneralUse/TransferConfirmation'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import ReactPDF from '@react-pdf/renderer';
import TransferReceipt from 'Receipts/TransferReceipt';
import { Spinner } from 'react-bootstrap';

const Transfer = ({ content, getTransfers }) => {

  const { getMoveStateById, Accounts, AccountSelected, hasPermission } = useContext(DashBoardContext)
  const { t } = useTranslation()

  var momentDate = moment(content.createdAt);
  const [ShowModal, setShowModal] = useState(false)
  const [Action, setAction] = useState("approve")

  const launchModalConfirmation = (action) => {
    setAction(action)
    setShowModal(true)
  }

  const incomingTransfer = () => content.receiverId === Accounts[0]?.id

  const [GeneratingPDF, setGeneratingPDF] = useState(false)

  const renderAndDownloadPDF = async () => {
    setGeneratingPDF(true)
    const blob = await ReactPDF.pdf(<TransferReceipt Transfer={{
      ...content, ...{
        state: t(getMoveStateById(content.stateId).name),
        accountAlias: AccountSelected.alias,
        incomingTransfer: incomingTransfer(),
        AccountId: AccountSelected.id
      }
    }} />).toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${AccountSelected.alias} - ${t("Transfer")} #${content.id}.pdf`)
    // 3. Append to html page
    document.body.appendChild(link)
    // 4. Force download
    link.click()
    // 5. Clean up and remove the link
    link.parentNode.removeChild(link)
    setGeneratingPDF(false)
  }

  return (
    <div className='mobileMovement'>
      <div className='d-flex justify-content-between'>
        <span>{" "}{t(incomingTransfer() ? "Received from" : "Sent to")}{" "}{t("account with the alias")} <span className="text-nowrap"> {" \""}{incomingTransfer() ? content.senderAlias : content.receiverAlias}{"\""}</span></span>
        <span className="text-nowrap" >{momentDate.format('L')}</span>

      </div>

      <button disabled={GeneratingPDF} className="noStyle px-0" style={{ cursor: "pointer" }} onClick={() => renderAndDownloadPDF()}>
        <span>
          {t("Receipt")}&nbsp;
        </span>
        {
          GeneratingPDF ?
            <Spinner animation="border" size="sm" />
            :

            <FontAwesomeIcon icon={faFilePdf} />

        }
      </button>

      <div className='d-flex justify-content-between'>

        <span className={`${content.stateId === 3 ? 'text-red' : 'text-green'}`}>{t(getMoveStateById(content.stateId).name)}</span>
        <span className={`${Math.sign(content.amount) === 1 ? 'text-green' : 'text-red'}`}>{Math.sign(content.amount) === 1 ? '+' : '-'}
          <FormattedNumber value={Math.abs(content.amount)} prefix="U$D " fixedDecimals={2} />
        </span>
      </div>
      {
        !!(content.stateId === 1 && incomingTransfer()) &&
        <div className="h-100 d-flex align-items-center justify-content-around">
          {
            hasPermission("TRANSFER_APPROVE") &&
            <div className="iconContainer green" onClick={() => launchModalConfirmation("approve")}>
              <FontAwesomeIcon className="icon" icon={faCheckCircle} /> {t("Approve")}
            </div>
          }
          {
            hasPermission("TRANSFER_DENY") &&
            <div className="iconContainer red" onClick={() => launchModalConfirmation("deny")} >
              <FontAwesomeIcon className="icon" icon={faTimesCircle} /> {t("Deny")}
            </div>
          }
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
