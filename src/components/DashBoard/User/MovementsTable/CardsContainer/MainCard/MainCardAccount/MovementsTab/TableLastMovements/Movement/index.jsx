import React, { useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilePdf } from '@fortawesome/free-regular-svg-icons';
import ReactPDF from '@react-pdf/renderer';
import MovementReceipt from 'Receipts/MovementReceipt';
import { Spinner } from 'react-bootstrap';

const Movement = ({ content }) => {
  var momentDate = moment(content.createdAt);
  const { t } = useTranslation();
  const { getMoveStateById, AccountSelected } = useContext(DashBoardContext)

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
      <td className="tableDate">
        {momentDate.format('L')}
      </td>
      <td className={`tableConcept ${content.stateId === 3 ? 'text-red' : 'text-green'}`}>{t(getMoveStateById(content.stateId).name)}</td>
      <td className="tableConcept">
        {t(content.motive + (content.motive === "REPAYMENT" ? content.fundName ? "_" + content.fundName : "_" + content.fixedDepositId : ""), { fund: content.fundName, fixedDeposit: content.fixedDepositId })}
      </td>
      <td className={`tableAmount ${Math.sign(content.amount) === 1 ? 'text-green' : 'text-red'}`}>
        <span>{Math.sign(content.amount) === 1 ? '+' : '-'}</span>
        <FormattedNumber value={Math.abs(content.amount)} prefix="$" fixedDecimals={2} />
      </td>

    </tr>
  )
}
export default Movement
