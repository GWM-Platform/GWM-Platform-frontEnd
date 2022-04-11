import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import 'moment/locale/es'
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';

const Movement = ({ content }) => {
  moment.locale(localStorage.getItem('language'))
  var momentDate = moment(content.createdAt);
  const { t } = useTranslation();
  const {getMoveStateById}=useContext(DashBoardContext)

  return (
    <tr>
      <td className="tableDate">{momentDate.format('DD/MM/YYYY, h:mm a')}</td>
      <td className={`tableConcept ${ content.stateId===3 ? 'text-red' : 'text-green'}`}>{t(getMoveStateById(content.stateId).name)}</td>
      <td className={`tableConcept ${Math.sign(content.shares) === 1 ? 'text-green' : 'text-red'}`}><span>{Math.sign(content.shares) === 1 ? t('Purchase of') : t('Sale of')}{" "}</span><span ></span>{Math.abs(content.shares)} {t("shares")}</td>
      <td className="tableDescription d-none d-sm-table-cell ">${content.sharePrice}</td>
      <td className={`tableAmount ${Math.sign(content.shares) === 1 ? 'text-green' : 'text-red'}`}><span>{Math.sign(content.shares) === 1 ? '+' : '-'}</span><span >$</span>{(Math.abs(content.shares) * content.sharePrice).toFixed(2)}</td>
    </tr>
  )
}
export default Movement
