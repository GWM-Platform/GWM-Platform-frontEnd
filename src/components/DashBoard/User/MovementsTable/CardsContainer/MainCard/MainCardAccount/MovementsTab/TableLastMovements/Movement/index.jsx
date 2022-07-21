import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const Movement = ({ content }) => {
  var momentDate = moment(content.createdAt);
  const { t } = useTranslation();
  const { getMoveStateById } = useContext(DashBoardContext)
  console.log(t(getMoveStateById(content.stateId).name, { fund: content.fundName }))
  return (
    <tr>
      <td className="tableId">{content.id}</td>
      <td className="tableDate">{momentDate.format('DD/MM/YYYY, h:mm a')}</td>
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
