import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from "react-i18next";
import Decimal from 'decimal.js';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';

const TransactionRow = ({ transaction }) => {

  const { getMoveStateById } = useContext(DashBoardContext)

  Decimal.set({ precision: 100 })

  var momentDate = moment(transaction.createdAt);
  const { t } = useTranslation();

  const decimalSharesAbs = new Decimal(transaction.shares).abs()
  const decimalPrice = new Decimal(transaction.sharePrice)
  const amount = new Decimal(decimalSharesAbs.times(decimalPrice))

  return (
    <tr>
      <td className="tableId">{transaction.id}</td>
      <td className="tableDate">{momentDate.format('L')}</td>
      <td className={`tableConcept ${transaction.stateId === 3 ? 'text-red' : 'text-green'}`}>{t(getMoveStateById(transaction.stateId).name)}</td>
      <td className={`tableConcept ${Math.sign(transaction.shares) === 1 ? 'text-green' : 'text-red'}`}>
        <span>{Math.sign(transaction.shares) === 1 ? t('Purchase of') : t('Sale of')}{" "}</span>
        <FormattedNumber value={Math.abs(transaction.shares)} fixedDecimals={2} />&nbsp;
        {t(Math.abs(transaction.shares) === 1 ? "share" : "shares")}</td>
      <td className="tableDescription d-none d-sm-table-cell ">
        <FormattedNumber prefix="$" value={transaction.sharePrice} fixedDecimals={2} />
      </td>
      <td className={`tableAmount ${Math.sign(transaction.shares) === 1 ? 'text-green' : 'text-red'}`}>
        {Math.sign(transaction.shares) === 1 ? '+' : '-'}
        <FormattedNumber prefix="$" value={amount.toString()} fixedDecimals={2} />
      </td>
    </tr>
  )
}
export default TransactionRow
