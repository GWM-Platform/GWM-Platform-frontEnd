import React, { useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import './index.css'
import { useTranslation } from 'react-i18next';
import { DashBoardContext } from 'context/DashBoardContext';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faFilePdf } from '@fortawesome/free-regular-svg-icons';
import ReactPDF from '@react-pdf/renderer';
import MovementReceipt from 'Receipts/MovementReceipt';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import MovementConfirmation from 'components/DashBoard/User/MovementsTable/GeneralUse/MovementConfirmation';
const Movement = ({ content, reloadData }) => {
  var momentDate = moment(content.createdAt);
  const { getMoveStateById, AccountSelected, couldSign } = useContext(DashBoardContext)

  const { t } = useTranslation()

  const [GeneratingPDF, setGeneratingPDF] = useState(false)

  const renderAndDownloadPDF = async () => {
    setGeneratingPDF(true)
    const blob = await ReactPDF.pdf(<MovementReceipt Movement={{
      ...content, ...{
        state: t(getMoveStateById(content.stateId).name),
        accountAlias: AccountSelected.alias
      }
    }} />).toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${AccountSelected.alias} - ${t("Movement")} #${content.id}.pdf`)
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

  const [ShowModal, setShowModal] = useState(false)
  const [Action, setAction] = useState("approve")

  const launchModalConfirmation = (action) => {
    setAction(action)
    setShowModal(true)
  }

  return (
    <div className='mobileMovement'>
      <div className='d-flex justify-content-between'>
        <span>
          {t(content.motive + (content.motive === "REPAYMENT" ? content.fundName ? "_" + content.fundName : "_" + content.fixedDepositId : ""), { fund: content.fundName, fixedDeposit: content.fixedDepositId })}
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
        !!(content?.userEmail) &&
        <OverlayTrigger
          show={showClick || showHover}
          placement="auto"
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
              <div>
                {t('Operation performed by')}:<br />
                <span className="text-nowrap">{content?.userEmail}</span>
              </div>
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
        <span className={`${content.stateId === 3 ? 'text-red' : 'text-green'}`}>{t(getMoveStateById(content.stateId).name)}</span>
        <span className={`${Math.sign(content.amount) === 1 ? 'text-green' : 'text-red'}`}>
          {Math.sign(content.amount) === 1 ? '+' : '-'}
          <FormattedNumber value={Math.abs(content.amount)} prefix="$" fixedDecimals={2} />
        </span>
      </div>
      {
        !!(content.partialBalance) &&
        <div className='d-flex justify-content-between' style={{ borderTop: "1px solid rgb(200,200,200)" }}>
          <span className={`${content.stateId === 3 ? 'text-red' : 'text-green'}`}>{t("Balance")}</span>
          <span className={`${Math.sign(content.amount) === 1 ? 'text-green' : 'text-red'}`}>
            <FormattedNumber value={Math.abs(content.partialBalance)} prefix="$" fixedDecimals={2} />
          </span>
        </div>
      }
      {
        !!(content.stateId === 5 && couldSign(content))  &&
        <div className="h-100 d-flex align-items-center justify-content-around">

          <div className={`iconContainer green ${!couldSign(content) ? "not-allowed" : ""}`}>
            <FontAwesomeIcon className="icon" icon={faCheckCircle} onClick={() => { if (couldSign(content)) { launchModalConfirmation("approve") } }} />
          </div>

          <div className={`iconContainer red ${!couldSign(content) ? "not-allowed" : ""}`}>
            <FontAwesomeIcon className="icon" icon={faTimesCircle} onClick={() => { if (couldSign(content)) { launchModalConfirmation("deny") } }} />
          </div>

        </div>
      }
      {
        !!(content.stateId === 5 && couldSign(content)) &&
        <MovementConfirmation reloadData={reloadData} movement={content} setShowModal={setShowModal} action={Action} show={ShowModal} />
      }
    </div>

  )
}
export default Movement
