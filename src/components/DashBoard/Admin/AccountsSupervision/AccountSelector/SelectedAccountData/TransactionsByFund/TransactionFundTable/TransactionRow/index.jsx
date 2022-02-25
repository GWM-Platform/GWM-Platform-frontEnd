import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import 'moment/locale/es'
import { useTranslation } from "react-i18next";

const TransactionRow = ({ transaction }) => {
  moment.locale(localStorage.getItem('language'))
  var momentDate = moment(transaction.createdAt);
  const { t } = useTranslation();

  return (
    <tr>
      <td className="tableDate">{momentDate.format('DD/MM/YYYY, h:mm a')}</td>
      <td className={`tableConcept ${Math.sign(transaction.shares) === 1 ? 'text-green' : 'text-red'}`}><span>{Math.sign(transaction.shares) === 1 ? t('Purchase of') : t('Sale of')}{" "}</span><span ></span>{Math.abs(transaction.shares)} {t("FeeParts")}</td>
      <td className="tableDescription d-none d-sm-table-cell ">${transaction.sharePrice}</td>
      <td className={`tableAmount ${Math.sign(transaction.shares) === 1 ? 'text-green' : 'text-red'}`}><span>{Math.sign(transaction.shares) === 1 ? '+' : '-'}</span><span >$</span>{(Math.abs(transaction.shares) * transaction.sharePrice).toFixed(2)}</td>
    </tr>
  )
}
export default TransactionRow
