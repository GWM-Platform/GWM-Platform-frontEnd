import React, { useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { DashBoardContext } from 'context/DashBoardContext';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';
import ReactPDF from '@react-pdf/renderer';
import TransactionReceipt from 'Receipts/TransactionReceipt';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import ShareTransferReceipt from 'Receipts/ShareTransferReceipt';

const Movement = ({ content, fundName = "" }) => {

  const denialMotive = content?.notes?.find(note => note.noteType === "DENIAL_MOTIVE")
  const incomingTransfer = () => content.receiverId === AccountSelected?.id
  const isTransfer = content.receiverId || content.senderId
  const transferNote = content?.notes?.find(note => note.noteType === "TRANSFER_MOTIVE")

  var momentDate = moment(content.createdAt);
  const { t } = useTranslation();
  const { getMoveStateById, AccountSelected, sharesDecimalPlaces } = useContext(DashBoardContext)

  const [GeneratingPDF, setGeneratingPDF] = useState(false)

  const renderAndDownloadPDF = async () => {
    setGeneratingPDF(true)
    const blob = await ReactPDF.pdf(
      isTransfer ?
        <ShareTransferReceipt Transfer={{
          ...content, ...{
            state: t(getMoveStateById(content.stateId).name),
            accountAlias: AccountSelected.alias,
            incomingTransfer: incomingTransfer(),
            AccountId: AccountSelected.id,
            fundName: fundName
          }
        }} />
        :
        <TransactionReceipt Transaction={{
          ...content, ...{
            state: t(getMoveStateById(content.stateId).name),
            accountAlias: AccountSelected.alias,
            fundName: fundName
          }
        }} />).toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${AccountSelected.alias} - ${t(isTransfer ? "Share transfer" : "Transaction")} #${content.id}.pdf`)
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


  return (
    <div className='mobileMovement'>
      <div className='d-flex justify-content-between'>
        <span >
          {
            isTransfer ?
              <>
                {t(
                  incomingTransfer() ?
                    "Transfer from {{transferSender}}"
                    :
                    "Transfer to {{transferReceiver}}",
                  {
                    transferReceiver: content.receiverAlias,
                    transferSender: content.senderAlias
                  }
                )}{(content?.reverted && transferNote?.text === "Transferencia revertida") ? <>, {t("reversion")}</> : ""},
              </>
              :
              <>
                <span>{Math.sign(content.shares) === 1 ? t('Purchase of') : t('Sale of')}</span>
              </>
          }
          &nbsp;
          <FormattedNumber className="text-nowrap" value={Math.abs(content.shares)} fixedDecimals={sharesDecimalPlaces} />&nbsp;
          {t(Math.abs(content.shares) === 1 ? "share" : "shares")}, <FormattedNumber className="text-nowrap" style={{ fontWeight: "bolder" }} value={content.sharePrice} prefix="U$D " fixedDecimals={2} />
          {t(" each")}
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
        !!(content?.userEmail || content?.userName || !!(denialMotive) || !!(transferNote)) &&
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
              {!!(content.userEmail || content?.userName) &&
                <div>
                  {t('Operation performed by')}:<br />
                  <span className="text-nowrap">{content?.userName || content?.userEmail}</span>
                </div>
              }
              {!!(denialMotive) &&
                <div>
                  {t('Denial motive')}:<br />
                  <span className="text-nowrap">"{denialMotive.text}"</span>
                </div>
              }
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
              type="button" className="noStyle pe-0 ps-1"  ><FontAwesomeIcon icon={faInfoCircle} /></button>
          </span>
        </OverlayTrigger>
      }

      <div className='d-flex justify-content-between'>

        <span className={`${content.stateId === 3 ? 'text-red' : 'text-green'}`}>{t(getMoveStateById(content.stateId).name)}</span>
        <span className={isTransfer ? (incomingTransfer() ? 'text-green' : 'text-red') : (Math.sign(content.shares) === 1 ? 'text-green' : 'text-red')}>

          <FormattedNumber style={{ fontWeight: "bolder" }} value={(Math.abs(content.shares) * content.sharePrice)} prefix={`${isTransfer ? (incomingTransfer() ? '+' : '-') : (Math.sign(content.shares) === 1 ? '+' : '-')}U$D `} fixedDecimals={2} />
        </span>
      </div >
    </div >
  )


}
export default Movement
