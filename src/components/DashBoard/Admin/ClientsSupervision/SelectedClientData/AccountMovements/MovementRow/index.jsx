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

  const transferNote = Movement?.notes?.find(note => note.noteType === "TRANSFER_MOTIVE")
  const clientNote = Movement?.notes?.find(note => note.noteType === "CLIENT_NOTE")
  const denialMotive = Movement?.notes?.find(note => note.noteType === "DENIAL_MOTIVE")
  const adminNote = Movement?.notes?.find(note => note.noteType === "ADMIN_NOTE")

  return (
    <tr>
      <td className="tableId text-nowrap">
        {Movement.id}
        {
          (!!(Movement?.userEmail) || !!(Movement?.userName) || !!(transferNote) || !!(clientNote) || !!(denialMotive) || !!(adminNote)) &&
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
                {!!(Movement.userEmail || Movement.userName) &&
                  <div>
                    {t('Operation performed by')}:<br />
                    <span className="text-nowrap">{Movement?.userName || Movement.userEmail}</span>
                  </div>
                }
                {!!(transferNote) &&
                  <div>
                    {t('Transfer note')}:<br />
                    <span className="text-nowrap">"{transferNote.text}"</span>
                  </div>
                }
                {!!(clientNote) &&
                  <div>
                    {t('Personal note')}:<br />
                    <span className="text-nowrap">"{clientNote.text}"</span>
                  </div>
                }
                {!!(denialMotive) &&
                  <div>
                    {t('Denial motive')}:<br />
                    <span className="text-nowrap">"{denialMotive.text}"</span>
                  </div>
                }
                {!!(adminNote) &&
                  <div>
                    {t('Admin note')}:<br />
                    <span className="text-nowrap">"{adminNote.text}"</span>
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
        }
      </td>
      <td className="tableDate">
        {momentDate.format('L')}
      </td>
      <td className={`tableConcept ${Movement.stateId === 3 ? 'text-red' : 'text-green'}`}>
        {t(getMoveStateById(Movement.stateId).name)}
        {(Movement?.transfer?.reverted && transferNote?.text !== "Transferencia revertida") ? <>, {t("reverted")}</> : ""}
      </td>
      <td className="tableConcept">
        {
          (!Movement?.transferReceiver && !Movement?.transferSender) &&
          t(Movement.motive + (Movement.motive === "REPAYMENT" ? Movement.fundName ? "_" + Movement.fundName : "_" + Movement.fixedDepositId : ""), { fund: Movement.fundName, fixedDeposit: Movement.fixedDepositId })
        }
        {Movement?.transferReceiver && <>{t("Transfer to {{transferReceiver}}", { transferReceiver: Movement?.transferReceiver })}</>}
        {Movement?.transferSender && <>{t("Transfer from {{transferSender}}", { transferSender: Movement?.transferSender })}</>}
        {(Movement?.transfer?.reverted && transferNote?.text === "Transferencia revertida") ? <>, {t("reversion")}</> : ""}
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
