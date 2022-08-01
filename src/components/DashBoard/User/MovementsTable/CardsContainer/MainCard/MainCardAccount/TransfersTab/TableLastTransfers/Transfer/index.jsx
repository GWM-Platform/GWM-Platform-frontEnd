import React, { useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faFilePdf, faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import ActionConfirmationModal from 'components/DashBoard/User/MovementsTable/GeneralUse/TransferConfirmation'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import ReactPDF from '@react-pdf/renderer';
import TransferReceipt from 'Receipts/TransferReceipt';
import { Spinner } from 'react-bootstrap';

const Transfer = ({ content, actions, getTransfers }) => {
  var momentDate = moment(content.createdAt);
  const { t } = useTranslation();
  const { getMoveStateById, Accounts, AccountSelected } = useContext(DashBoardContext)

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
    <tr>
      <td className="tableId">{content.id}</td>
      <td className="text-center">
        {
          GeneratingPDF ?
            <Spinner animation="border" size="sm" />
            :
            <button className='noStyle py-0' style={{ cursor: "pointer" }} onClick={() => renderAndDownloadPDF()}>
              <FontAwesomeIcon icon={faFilePdf} />
            </button>
        }
      </td>
      <td className="tableDate">{momentDate.format('L')}</td>
      <td className={`tableConcept ${content.stateId === 3 ? 'text-red' : 'text-green'}`}>{t(getMoveStateById(content.stateId).name)}</td>
      <td className="tableConcept">{t(incomingTransfer() ? "Received from account" : "Sent to account")}{t("")}{" \""}{incomingTransfer() ? content.senderAlias : content.receiverAlias}{"\""}</td>
      <td className={`tableAmount ${content.receiverId === Accounts[0]?.id ? 'text-green' : 'text-red'}`}>
        <span>{content.receiverId === Accounts[0]?.id ? '+' : '-'}</span>
        <FormattedNumber value={Math.abs(content.amount)} prefix="$" fixedDecimals={2} />
      </td>
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
