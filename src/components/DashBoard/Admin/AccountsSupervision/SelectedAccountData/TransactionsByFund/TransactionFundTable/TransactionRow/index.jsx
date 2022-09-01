import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from "react-i18next";
import Decimal from 'decimal.js';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const TransactionRow = ({ transaction }) => {
  Decimal.set({ precision: 100 })

  var momentDate = moment(transaction.createdAt);
  const { t } = useTranslation();

  return (
    <tr>
      <td className="tableDate">{momentDate.format('L')}</td>
      <td className={`tableConcept ${Math.sign(transaction.shares) === 1 ? 'text-green' : 'text-red'}`}><span>{Math.sign(transaction.shares) === 1 ? t('Purchase of') : t('Sale of')}&nbsp;</span><span ></span>
        <FormattedNumber prefix='' fixedDecimals={2} value={Math.abs(transaction.shares)} />
        &nbsp;{t("shares")}</td>
      <td className="tableDescription d-none d-sm-table-cell ">
        <FormattedNumber prefix='$' fixedDecimals={2} value={Decimal(transaction.shares).abs().times(transaction.sharePrice).toFixed(2)} />
      </td>
      <td className={`tableAmount ${Math.sign(transaction.shares) === 1 ? 'text-green' : 'text-red'}`}><span>{Math.sign(transaction.shares) === 1 ? '+' : '-'}</span>
        <FormattedNumber prefix='$' fixedDecimals={2} value={Decimal(transaction.shares).abs().times(transaction.sharePrice).toFixed(2)} />
      </td>
    </tr>
  )
}
export default TransactionRow
