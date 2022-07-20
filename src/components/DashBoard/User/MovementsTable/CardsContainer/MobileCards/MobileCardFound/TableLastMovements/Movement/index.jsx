import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { DashBoardContext } from 'context/DashBoardContext';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const Movement = ({ content }) => {
  var momentDate = moment(content.createdAt);
  const { t } = useTranslation();
  const { getMoveStateById } = useContext(DashBoardContext)

  return (
    <div className='mobileMovement'>
      <div className='d-flex justify-content-between'>
        <span >{Math.sign(content.shares) === 1 ? t('Purchase of') : t('Sale of')}&nbsp;
          <FormattedNumber style={{ fontWeight: "bolder" }} value={Math.abs(content.shares)} prefix="" fixedDecimals={2} />&nbsp;   
          {t(Math.abs(content.shares) === 1 ? "share" : "shares")}, <FormattedNumber style={{ fontWeight: "bolder" }} value={content.sharePrice} prefix="$" fixedDecimals={2} />
          {t(" each")}</span>
        <span className="text-nowrap" >{momentDate.format('D MMM')}</span>

      </div>
      <div className='d-flex justify-content-between'>

        <span className={`${content.stateId === 3 ? 'text-red' : 'text-green'}`}>{t(getMoveStateById(content.stateId).name)}</span>
        <span className={`${Math.sign(content.shares) === 1 ? 'text-green' : 'text-red'}`}>{Math.sign(content.shares) === 1 ? '+' : '-'}
          <FormattedNumber style={{ fontWeight: "bolder" }} value={(Math.abs(content.shares) * content.sharePrice)} prefix="$" fixedDecimals={2} />
        </span>
      </div >
    </div >
  )


}
export default Movement
