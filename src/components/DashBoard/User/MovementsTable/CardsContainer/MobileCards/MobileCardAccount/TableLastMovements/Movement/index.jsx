import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import './index.css'
import { useTranslation } from 'react-i18next';
import { DashBoardContext } from 'context/DashBoardContext';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
const Movement = ({ content }) => {
  var momentDate = moment(content.createdAt);
  const { getMoveStateById } = useContext(DashBoardContext)

  const { t } = useTranslation()

  return (
    <div className='mobileMovement'>
      <div className='d-flex justify-content-between'>
        <span>{t(content.motive)}</span>
        <span className="text-nowrap" >{momentDate.format('D MMM')}</span>

      </div>
      <div className='d-flex justify-content-between'>

        <span className={`${content.stateId === 3 ? 'text-red' : 'text-green'}`}>{t(getMoveStateById(content.stateId).name)}</span>
        <span className={`${Math.sign(content.amount) === 1 ? 'text-green' : 'text-red'}`}>
          {Math.sign(content.amount) === 1 ? '+' : '-'}
          <FormattedNumber value={Math.abs(content.amount)} prefix="$" fixedDecimals={2} />
        </span>
      </div>
    </div>

  )
}
export default Movement
