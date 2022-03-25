import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import 'moment/locale/es'
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';

const TransactionRow = ({ transaction,user }) => {
  moment.locale(localStorage.getItem('language'))
  var momentDate = moment(transaction.createdAt);
  const { t } = useTranslation();
  const { getMoveStateById } = useContext(DashBoardContext)
  
  return (

    <tr>
      <td className="tableDate">{momentDate.format('DD/MM/YYYY, h:mm a')}</td>
      <td >{user.alias}</td>
      <td className={`tableConcept ${Math.sign(transaction.shares) === 1 ? 'text-red' : 'text-green'}`}>
        <span>{Math.sign(transaction.shares) === 1 ? t('Sale of') : t('Purchase of')}{" "}</span>
        {Math.abs(transaction.shares)} {t("feeParts")}
      </td>
      <td className={`tableConcept ${transaction.stateId === 3 ? 'text-red' : 'text-green'}`}>
        {t(getMoveStateById(transaction.stateId).name)}
      </td>
      <td className="tableDescription d-none d-sm-table-cell ">
        ${transaction.sharePrice}
      </td>
      <td className={`tableAmount ${Math.sign(transaction.shares) === 1 ? 'text-green' : 'text-red'}`}>
        <span>{Math.sign(transaction.shares) === 1 ? '-' : '+'}</span>
        <span >$</span>
        {(Math.abs(transaction.shares) * transaction.sharePrice).toFixed(2)}
      </td>
    </tr>
  )
}
export default TransactionRow
