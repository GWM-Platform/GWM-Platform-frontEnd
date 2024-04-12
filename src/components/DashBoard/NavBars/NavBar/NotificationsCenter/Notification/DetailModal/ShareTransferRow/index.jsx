import React, { useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { DashBoardContext } from 'context/DashBoardContext';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const ShareTransferRow = ({ content }) => {
  var momentDate = moment(content.createdAt);
  const { t } = useTranslation();
  const { getMoveStateById, AccountSelected, sharesDecimalPlaces } = useContext(DashBoardContext)


  const [showClick, setShowClick] = useState(false)
  const [showHover, setShowHover] = useState(false)



  const denialMotive = content?.notes?.find(note => note.noteType === "DENIAL_MOTIVE")


  const incomingTransfer = () => content.receiverId === AccountSelected?.id
  const isTransfer = content.receiverId || content.senderId
  const transferNote = content?.notes?.find(note => note.noteType === "TRANSFER_MOTIVE")

  return (
    <div className='mobileMovement'>
      <div className='d-flex py-1 align-items-center flex-wrap'>
        <span className='h5 mb-0 me-1 me-md-2'>
          {t("Share transfer")} #{content.id}
        </span>
        <Badge className='ms-auto' bg="success">{t(getMoveStateById(content.stateId).name)}</Badge>
        {
          (content.reverted && transferNote?.text !== "Transferencia revertida") &&
          <Badge className='ms-1 ms-md-2' bg="danger">{t("Reverted")}</Badge>
        }
      </div>
      <div className='w-100 d-flex' style={{ borderBottom: "1px solid lightgray" }} />
      <span >
        {
          isTransfer ?
            <>
              {t("Concept")}: {t(
                incomingTransfer() ?
                  "Transfer from {{transferSender}}"
                  :
                  "Transfer to {{transferReceiver}}",
                {
                  transferReceiver: content.receiverAlias,
                  transferSender: content.senderAlias
                }
              )}{(content?.reverted && transferNote?.text === "Transferencia revertida") ? <>, {t("reversion")}</> : ""}
            </>
            :
            <>
              <span>{Math.sign(content.shares) === 1 ? t('Purchase of') : t('Sale of')}</span>
            </>
        }
      </span>

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

      <div>
        {t("Amount")}:&nbsp;
        {isTransfer ? (incomingTransfer() ? '+' : '-') : (Math.sign(content.shares) === 1 ? '+' : '-')}
        <FormattedNumber className="text-nowrap" value={Math.abs(content.shares)} fixedDecimals={sharesDecimalPlaces } />&nbsp;
        {t(Math.abs(content.shares) === 1 ? "share" : "shares")}, <FormattedNumber className="text-nowrap" value={content.sharePrice} prefix="U$D " fixedDecimals={2} />
        {t(" each")}
        <span>
          &nbsp;(
          {isTransfer ? (incomingTransfer() ? '+' : '-') : (Math.sign(content.shares) === 1 ? '+' : '-')}
          <FormattedNumber value={(Math.abs(content.shares) * content.sharePrice)} prefix="U$D " fixedDecimals={2} />
          )
        </span>
      </div >
      <br />
      <div className='w-100 d-flex' style={{ borderBottom: "1px solid lightgray" }} />
      <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
        <span >
          <span className="d-inline d-md-none">{t("Date")}</span>
          <span className="d-none d-md-inline">{t("Created at")}</span>:&nbsp;
          {momentDate.format('L')}
        </span>
      </div >
    </div >
  )


}
export default ShareTransferRow
