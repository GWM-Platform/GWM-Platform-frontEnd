import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { DashBoardContext } from 'context/DashBoardContext';

const Movement = ({ content }) => {
  var momentDate = moment(content.createdAt);
  const { t } = useTranslation();
  const { getMoveStateById } = useContext(DashBoardContext)

  return (
    <div className='mobileMovement'>
    <div className='d-flex justify-content-between'>
      <span >{Math.sign(content.shares) === 1 ? t('Purchase of') : t('Sale of')}{" "}{Math.abs(content.shares)} {t(Math.abs(content.shares)===1 ? "share":"shares")}, ${content.sharePrice} {t(" each")}</span>
      <span className="text-nowrap" >{momentDate.format('D MMM')}</span>

    </div>
    <div className='d-flex justify-content-between'>

      <span className={`${content.stateId === 3 ? 'text-red' : 'text-green'}`}>{t(getMoveStateById(content.stateId).name)}</span>
      <span className={`${Math.sign(content.shares) === 1 ? 'text-green' : 'text-red'}`}>{Math.sign(content.shares) === 1 ? '+' : '-'}${(Math.abs(content.shares) * content.sharePrice).toFixed(2)}</span>
    </div >
  </div >
  )


}
export default Movement
