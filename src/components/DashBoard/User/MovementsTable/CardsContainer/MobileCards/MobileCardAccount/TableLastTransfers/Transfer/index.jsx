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
import { OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

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

  const [showClick, setShowClick] = useState(false)
  const [showHover, setShowHover] = useState(false)

  const state = (getMoveStateById(content.stateId).name === "Denegado" && !incomingTransfer()) ? "Cancelled" : getMoveStateById(content.stateId).name
  const transferNote = content?.notes?.find(note => note.noteType === "TRANSFER_MOTIVE")

  return (
    <div className='mobileMovement'>
      <div className='d-flex justify-content-between'>
        <span>
          {" "}{t(incomingTransfer() ? "Received from" : "Sent to")}{" "}{t("account with the alias")}
          <span className="text-nowrap">{" \""}{incomingTransfer() ? content.senderAlias : content.receiverAlias}{"\""}</span>
          {(content.reverted && transferNote?.text === "Transferencia revertida") ? <>, {t("reversion")}</> : ""}
        </span>
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

      {
        !!(transferNote) &&
        <OverlayTrigger
          show={showClick || showHover}
          placement="bottom"
          delay={{ show: 250, hide: 400 }}
          popperConfig={{
            modifiers: [
              {
                name: 'offset',
                options: {
                  offset: [0, 0],
                },
              },
            ],
          }}
          overlay={
            <Tooltip className="mailTooltip" id="more-units-tooltip">
              {!!(transferNote) &&
                <div>
                  {t('Transfer note')}:<br />
                  <span className="text-nowrap">"{transferNote.text}"</span>
                </div>
              }
            </Tooltip>
          }
        >
          <span>
            <button
              onBlur={() => setShowClick(false)}
              onClick={() => setShowClick(prevState => !prevState)}
              onMouseEnter={() => setShowHover(true)}
              onMouseLeave={() => setShowHover(false)}
              type="button" className="noStyle"  ><FontAwesomeIcon icon={faInfoCircle} /></button>
          </span>
        </OverlayTrigger>
      }

      <div className='d-flex justify-content-between'>

        <span className={`${content.stateId === 3 ? 'text-red' : 'text-green'}`}>
          {t(state)}
          {(content.reverted && transferNote?.text !== "Transferencia revertida") ? <>, {t("reverted")}</> : ""}
        </span>
        <span className={`${incomingTransfer() ? 'text-green' : 'text-red'}`}>
          {incomingTransfer() ? '+' : '-'}
          <FormattedNumber value={Math.abs(content.amount)} prefix="U$D " fixedDecimals={2} />
        </span>
      </div>
      {
        !!(content.stateId === 1) &&
        <div className="h-100 d-flex align-items-center justify-content-around">
          {
            (hasPermission("TRANSFER_APPROVE") && incomingTransfer()) &&
            <div className="iconContainer green" onClick={() => launchModalConfirmation("approve")}>
              <FontAwesomeIcon className="icon" icon={faCheckCircle} /> {t("Approve")}
            </div>
          }
          {
            hasPermission("TRANSFER_DENY") &&
            <div className="iconContainer red" onClick={() => launchModalConfirmation("deny")} >
              <FontAwesomeIcon className="icon" icon={faTimesCircle} />
              &nbsp;{
                incomingTransfer() ?
                  t("Deny")
                  :
                  t("Cancel")
              }
            </div>
          }
        </div>
      }
      {
        !!(content.stateId === 1) &&
        <ActionConfirmationModal incomingTransfer={incomingTransfer()} reloadData={getTransfers} movement={content} setShowModal={setShowModal} action={Action} show={ShowModal} />
      }
    </div>

  )
}
export default Transfer
