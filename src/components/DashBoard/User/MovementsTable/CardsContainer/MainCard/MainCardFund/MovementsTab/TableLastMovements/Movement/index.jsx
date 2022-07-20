import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';
import Decimal from 'decimal.js';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const Movement = ({ content }) => {
  var momentDate = moment(content.createdAt);
  const { t } = useTranslation();
  const { getMoveStateById } = useContext(DashBoardContext)

  const decimalSharesAbs = new Decimal(content.shares).abs()
  const decimalPrice = new Decimal(content.sharePrice)
  const amount = new Decimal(decimalSharesAbs.times(decimalPrice))

  return (
    <tr>
      <td className="tableId">{content.id}</td>
      <td className="tableDate">{momentDate.format('DD/MM/YYYY, h:mm a')}</td>
      <td className={`tableConcept ${content.stateId === 3 ? 'text-red' : 'text-green'}`}>{t(getMoveStateById(content.stateId).name)}</td>
      <td className={`tableConcept ${Math.sign(content.shares) === 1 ? 'text-green' : 'text-red'}`}><span>{Math.sign(content.shares) === 1 ? t('Purchase of') : t('Sale of')}{" "}</span><span ></span>{Math.abs(content.shares)} {t(Math.abs(content.shares) === 1 ? "share" : "shares")}</td>
      <td className="tableDescription d-none d-sm-table-cell ">
        <FormattedNumber prefix="$" value={content.sharePrice} fixedDecimals={2} />
      </td>
      <td className={`tableAmount ${Math.sign(content.shares) === 1 ? 'text-green' : 'text-red'}`}>
        {Math.sign(content.shares) === 1 ? '+' : '-'}
        <FormattedNumber prefix="$" value={amount.toFixed(2).toString()} fixedDecimals={2} />
      </td>
    </tr>
  )
}
export default Movement
