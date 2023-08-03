import React, { useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faFilePdf, faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import ActionConfirmationModal from 'components/DashBoard/User/MovementsTable/GeneralUse/ShareTransferConfirmation'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import ReactPDF from '@react-pdf/renderer';
import TransferReceipt from 'Receipts/TransferReceipt';
import { OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Decimal from 'decimal.js';

const Transfer = ({ content, actions, getTransfers }) => {

  var momentDate = moment(content.createdAt);
  const { t } = useTranslation();
  const { getMoveStateById, AccountSelected, hasPermission } = useContext(DashBoardContext)

  const [ShowModal, setShowModal] = useState(false)
  const [Action, setAction] = useState("approve")

  const launchModalConfirmation = (action) => {
    setAction(action)
    setShowModal(true)
  }

  const incomingTransfer = () => content.receiverId === AccountSelected?.id

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

  const transferNote = content?.notes?.find(note => note.noteType === "TRANSFER_MOTIVE")
  const decimalSharesAbs = new Decimal(content.shares).abs()
  const decimalPrice = new Decimal(content.sharePrice)
  const amount = new Decimal(decimalSharesAbs.times(decimalPrice))

  return (
    <tr>
      <td className="tableId text-nowrap">
        {content.id}
        {
          GeneratingPDF ?
            <Spinner animation="border" size="sm" />
            :
            <button className='noStyle py-0' style={{ cursor: "pointer" }} onClick={() => renderAndDownloadPDF()}>
              <FontAwesomeIcon icon={faFilePdf} />
            </button>
        }
        {
          !!(transferNote) &&
          <OverlayTrigger
            show={showClick || showHover}
            placement="right"
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
      </td>
      <td className="tableDate">{momentDate.format('L')}</td>
      <td className={`tableConcept ${content.stateId === 3 ? 'text-red' : 'text-green'}`}>
        {t(getMoveStateById(content.stateId).name)}
        {(content.reverted && transferNote?.text !== "Transferencia revertida") ? <>, {t("reverted")}</> : ""}
      </td>
      <td className="tableConcept">
        {
          t(
            incomingTransfer() ?
              "Transfer from {{transferSender}}"
              :
              "Transfer to {{transferReceiver}}",
            {
              transferReceiver: content.receiverAlias,
              transferSender: content.senderAlias
            }
          )
        }

        {(content.reverted && transferNote?.text === "Transferencia revertida") ? <>, {t("reversion")}</> : ""}
      </td>
      <td className="tableDescription d-none d-sm-table-cell text-nowrap">
        <FormattedNumber value={Math.abs(content.shares)} fixedDecimals={2} />&nbsp;
        {t(Math.abs(content.shares) === 1 ? "share" : "shares")}
        &nbsp;{t("_at")}&nbsp;
        <FormattedNumber prefix="U$D " value={content.sharePrice} fixedDecimals={2} />
      </td>
      <td className={`tableAmount ${incomingTransfer() ? 'text-green' : 'text-red'}`}>
        {incomingTransfer() ? '+' : '-'}
        <FormattedNumber prefix="U$D " value={amount.toString()} fixedDecimals={2} />
      </td>
      {
        !!(actions) &&
        <td className="Actions verticalCenter" >{
          !!(content.stateId === 5 && !incomingTransfer()) &&
          <div className="h-100 d-flex align-items-center justify-content-around">
            {
              <>
                {
                  hasPermission(`SHARE_TRANSFER_${content.fundId}`) &&
                  <div className="iconContainer green">
                    <FontAwesomeIcon className="icon" icon={faCheckCircle} onClick={() => launchModalConfirmation("approve")} />
                  </div>
                }
              </>
            }

            {
              hasPermission(`SHARE_TRANSFER_${content.fundId}`) &&
              <div className="iconContainer red">
                <FontAwesomeIcon className="icon" icon={faTimesCircle} onClick={() => launchModalConfirmation("deny")} />
              </div>
            }
          </div>}
        </td>

      }
      {
        !!(content.stateId === 5) &&
        <ActionConfirmationModal incomingTransfer={incomingTransfer()} reloadData={getTransfers} movement={content} setShowModal={setShowModal} action={Action} show={ShowModal} />
      }
    </tr >

  )
}
export default Transfer
