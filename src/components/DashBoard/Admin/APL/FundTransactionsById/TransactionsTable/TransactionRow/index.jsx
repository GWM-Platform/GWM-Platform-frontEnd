import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import Decimal from 'decimal.js';

const TransactionRow = ({ transaction, user }) => {
  Decimal.set({ precision: 100 })

  var momentDate = moment(transaction.createdAt);
  const { t } = useTranslation();
  const { getMoveStateById,sharesDecimalPlaces } = useContext(DashBoardContext)

  const isTransfer = transaction.receiverId || transaction.senderId
  const transferNote = transaction?.notes?.find(note => note.noteType === "TRANSFER_MOTIVE")

  return (

    <tr>
      <td className="tableDate">{momentDate.format('L')}</td>
      <td className='text-nowrap'>
        {isTransfer ?
          t("From {{senderAlias}} to {{receiverAlias}}", {
            senderAlias: transaction.senderAlias,
            receiverAlias: transaction.receiverAlias
          })
          : user.alias
        }
      </td>
      <td className={`tableConcept`}>
        {
          isTransfer ?
            <>
              {t("Transfer of")}{" "}
              <FormattedNumber value={Math.abs(transaction.shares)} fixedDecimals={sharesDecimalPlaces} />&nbsp;
              {t(Math.abs(transaction.shares) === 1 ? "share" : "shares")}
            </>
            :
            <>
              <span>{Math.sign(transaction.shares) === 1 ? t('Sale of') : t('Purchase of')}{" "}</span>
              <FormattedNumber value={Math.abs(transaction.shares)} fixedDecimals={sharesDecimalPlaces} />&nbsp;
              {t(Math.abs(transaction.shares) === 1 ? "share" : "shares")}
            </>
        }
      </td>

      <td className={`tableConcept ${transaction.stateId === 3 ? 'text-red' : 'text-green'}`}>
        {t(getMoveStateById(transaction.stateId).name)}
        {(transaction?.reverted && transferNote?.text !== "Transferencia revertida") ? <>, {t("reverted")}</> : ""}
      </td>
      <td className="tableDescription d-none d-sm-table-cell text-nowrap ">
        <FormattedNumber value={Math.abs(transaction.sharePrice)} prefix="U$D " fixedDecimals={2} />&nbsp;
      </td>
      <td className={`tableAmount ${isTransfer ? "" : (Math.sign(transaction.shares) === 1 ? 'text-red' : 'text-green')}`}>
        {
          isTransfer ?
            <>
              (<FormattedNumber value={new Decimal(transaction.shares).times(transaction.sharePrice).abs()} prefix="U$D " fixedDecimals={2} />)
            </>
            :
            <>
              <span>{Math.sign(transaction.shares) === 1 ? '-' : '+'}</span>
              <FormattedNumber value={new Decimal(transaction.shares).times(transaction.sharePrice).abs()} prefix="U$D " fixedDecimals={2} />
            </>
        }
      </td>
    </tr>
  )
}
export default TransactionRow
