import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from "react-i18next";
import Decimal from 'decimal.js';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

const TransactionRow = ({ transaction }) => {

  const { getMoveStateById } = useContext(DashBoardContext)

  Decimal.set({ precision: 100 })

  const [showClick, setShowClick] = useState(false)
  const [showHover, setShowHover] = useState(false)

  var momentDate = moment(transaction.createdAt);
  const { t } = useTranslation();

  const decimalSharesAbs = new Decimal(transaction.shares).abs()
  const decimalPrice = new Decimal(transaction.sharePrice)
  const amount = new Decimal(decimalSharesAbs.times(decimalPrice))

  const denialMotive = transaction?.notes?.find(note => note.noteType === "DENIAL_MOTIVE")
  const adminNote = transaction?.notes?.find(note => note.noteType === "ADMIN_NOTE")

  return (
    <tr>
      <td className="tableId text-nowrap">
        {transaction.id}
        {
          (!!(transaction?.userEmail) || !!(transaction?.userName) || !!(denialMotive) || !!(adminNote)) &&
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
                {!!(transaction.userEmail || transaction.userName) &&
                  <div>
                    {t('Operation performed by')}:<br />
                    <span className="text-nowrap">{transaction?.userName || transaction.userEmail}</span>
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
      <td className="tableDate">{momentDate.format('L')}</td>
      <td className={`tableConcept ${transaction.stateId === 3 ? 'text-red' : 'text-green'}`}>{t(getMoveStateById(transaction.stateId).name)}</td>
      <td className={`tableConcept ${Math.sign(transaction.shares) === 1 ? 'text-green' : 'text-red'}`}>
        <span>{Math.sign(transaction.shares) === 1 ? t('Purchase of') : t('Sale of')}{" "}</span>
        <FormattedNumber value={Math.abs(transaction.shares)} fixedDecimals={2} />&nbsp;
        {t(Math.abs(transaction.shares) === 1 ? "share" : "shares")}</td>
      <td className="tableDescription d-none d-sm-table-cell ">
        <FormattedNumber prefix="U$D " value={transaction.sharePrice} fixedDecimals={2} />
      </td>
      <td className={`tableAmount ${Math.sign(transaction.shares) === 1 ? 'text-green' : 'text-red'}`}>
        {Math.sign(transaction.shares) === 1 ? '+' : '-'}
        <FormattedNumber prefix="U$D " value={amount.toString()} fixedDecimals={2} />
      </td>
    </tr>
  )
}
export default TransactionRow
