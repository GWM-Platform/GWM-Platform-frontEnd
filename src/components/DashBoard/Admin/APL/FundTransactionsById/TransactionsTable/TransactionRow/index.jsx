import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import Decimal from 'decimal.js';

const TransactionRow = ({ transaction, user }) => {
  var momentDate = moment(transaction.createdAt);
  const { t } = useTranslation();
  const { getMoveStateById } = useContext(DashBoardContext)

  return (

    <tr>
      <td className="tableDate">{momentDate.format('DD/MM/YYYY, h:mm a')}</td>
      <td >{user.alias}</td>
      <td className={`tableConcept`}>
        <span>{Math.sign(transaction.shares) === 1 ? t('Sale of') : t('Purchase of')}{" "}</span>
        <FormattedNumber value={Math.abs(transaction.shares)} fixedDecimals={2} />&nbsp;
        {t(Math.abs(transaction.shares) === 1 ? "share" : "shares")}</td>

      <td className={`tableConcept ${transaction.stateId === 3 ? 'text-red' : 'text-green'}`}>
        {t(getMoveStateById(transaction.stateId).name)}
      </td>
      <td className="tableDescription d-none d-sm-table-cell ">
        <FormattedNumber value={Math.abs(transaction.sharePrice)} prefix="$" fixedDecimals={2} />&nbsp;
      </td>
      <td className={`tableAmount ${Math.sign(transaction.shares) === 1 ? 'text-red' : 'text-green'}`}>
        <span>{Math.sign(transaction.shares) === 1 ? '-' : '+'}</span>
        <FormattedNumber value={new Decimal(transaction.shares).times(transaction.sharePrice).abs()} prefix="$" fixedDecimals={2} />&nbsp;
      </td>
    </tr>
  )
}
export default TransactionRow
