import React, { useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const Movement = ({ Movement }) => {
  var momentDate = moment(Movement.createdAt);
  const { t } = useTranslation();
  const { getMoveStateById } = useContext(DashBoardContext)


  const [showClick, setShowClick] = useState(false)
  const [showHover, setShowHover] = useState(false)
  return (
    <tr>
      <td className="tableId">
        {Movement.id}
      </td>
      <td className="text-center">
        {
          !!(Movement?.userEmail) ?
          <OverlayTrigger
            show={showClick || showHover}
            placement="right"
            delay={{ show: 250, hide: 400 }}
            popperConfig={{
              modifiers: [
                {
                  name: 'offset',
                  options: {
                    offset: [0, 0],
                  },
                },
              ],
            }}
            overlay={
              <Tooltip className="mailTooltip" id="more-units-tooltip">
                {!!(Movement.userEmail) &&
                  <div>
                    {t('Operation performed by')}:<br />
                    <span className="text-nowrap">{Movement?.userEmail}</span>
                  </div>
                }
              </Tooltip>
            }
          >
            <span>
              <button
                onBlur={() => setShowClick(false)}
                onClick={() => setShowClick(prevState => !prevState)}
                onMouseEnter={() => setShowHover(true)}
                onMouseLeave={() => setShowHover(false)}
                type="button" className="noStyle"  ><FontAwesomeIcon icon={faInfoCircle} /></button>
            </span>
          </OverlayTrigger>
          :
          <>-</>
        }
      </td>
      <td className="tableDate">
        {momentDate.format('L')}
      </td>
      <td className={`tableConcept ${Movement.stateId === 3 ? 'text-red' : 'text-green'}`}>{t(getMoveStateById(Movement.stateId).name)}</td>
      <td className="tableConcept">
        {t(Movement.motive + (Movement.motive === "REPAYMENT" ? Movement.fundName ? "_" + Movement.fundName : "_" + Movement.fixedDepositId : ""), { fund: Movement.fundName, fixedDeposit: Movement.fixedDepositId })}
      </td>
      <td className={`tableAmount ${Math.sign(Movement.amount) === 1 ? 'text-green' : 'text-red'}`}>
        <span>{Math.sign(Movement.amount) === 1 ? '+' : '-'}</span>
        <FormattedNumber value={Math.abs(Movement.amount)} prefix="U$D " fixedDecimals={2} />
      </td>
      <td className={`tableAmount `}>
        {
          Movement.partialBalance ?
            <FormattedNumber value={Math.abs(Movement.partialBalance)} prefix="U$D " fixedDecimals={2} />
            :
            <>-</>
        }
      </td>
    </tr>
  )
}
export default Movement
