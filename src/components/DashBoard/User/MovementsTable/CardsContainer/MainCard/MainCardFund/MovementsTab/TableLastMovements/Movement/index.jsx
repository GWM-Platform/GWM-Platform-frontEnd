import React, { useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';
import Decimal from 'decimal.js';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import ReactPDF from '@react-pdf/renderer';
import TransactionReceipt from 'Receipts/TransactionReceipt';
import { OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const Movement = ({ content, fundName }) => {

  Decimal.set({ precision: 100 })

  var momentDate = moment(content.createdAt);
  const { t } = useTranslation();
  const { getMoveStateById, AccountSelected } = useContext(DashBoardContext)

  const decimalSharesAbs = new Decimal(content.shares).abs()
  const decimalPrice = new Decimal(content.sharePrice)
  const amount = new Decimal(decimalSharesAbs.times(decimalPrice))

  const [GeneratingPDF, setGeneratingPDF] = useState(false)

  const renderAndDownloadPDF = async () => {
    setGeneratingPDF(true)
    const blob = await ReactPDF.pdf(<TransactionReceipt Transaction={{
      ...content, ...{
        state: t(getMoveStateById(content.stateId).name),
        accountAlias: AccountSelected.alias,
        fundName: fundName
      }
    }} />).toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `${AccountSelected.alias} - ${t("Transaction")} #${content.id}.pdf`)
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

  const denialMotive = content?.notes?.find(note => note.noteType === "DENIAL_MOTIVE")

  return (
    <tr>
      <td className="tableId" style={{ whiteSpace: "nowrap" }}>
        {content.id}
        {
          !!(content?.userEmail || !!(denialMotive)) &&
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
                {!!(content.userEmail) &&
                  <div>
                    {t('Operation performed by')}:<br />
                    <span className="text-nowrap">{content?.userEmail}</span>
                  </div>
                }
                {!!(denialMotive) &&
                  <div>
                    {t('Denial motive')}:<br />
                    <span className="text-nowrap">"{denialMotive.text}"</span>
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
      </td>
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
      <td className={`tableConcept ${Math.sign(content.shares) === 1 ? 'text-green' : 'text-red'}`}>
        <span>{Math.sign(content.shares) === 1 ? t('Purchase of') : t('Sale of')}{" "}</span>
        <FormattedNumber value={Math.abs(content.shares)} fixedDecimals={2} />&nbsp;
        {t(Math.abs(content.shares) === 1 ? "share" : "shares")}</td>
      <td className="tableDescription d-none d-sm-table-cell ">
        <FormattedNumber prefix="U$D " value={content.sharePrice} fixedDecimals={2} />
      </td>
      <td className={`tableAmount ${Math.sign(content.shares) === 1 ? 'text-green' : 'text-red'}`}>
        {Math.sign(content.shares) === 1 ? '+' : '-'}
        <FormattedNumber prefix="U$D " value={amount.toString()} fixedDecimals={2} />
      </td>
    </tr>
  )
}
export default Movement
