import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from "react-i18next";
import Decimal from 'decimal.js';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';
import { ApprovedByUsers } from 'components/DashBoard/Admin/TicketsAdministration/Tables/TransactionsTable/TransactionRow';

const TransactionRow = ({ transaction, AccountId }) => {

  const { getMoveStateById, sharesDecimalPlaces } = useContext(DashBoardContext)

  Decimal.set({ precision: 100 })


  var momentDate = moment(transaction.createdAt);
  const { t } = useTranslation();

  const decimalSharesAbs = new Decimal(transaction.shares).abs()
  const decimalPrice = new Decimal(transaction.sharePrice)
  const amount = new Decimal(decimalSharesAbs.times(decimalPrice))

  const denialMotive = transaction?.notes?.find(note => note.noteType === "DENIAL_MOTIVE")
  const adminNote = transaction?.notes?.find(note => note.noteType === "ADMIN_NOTE")
  const incomingTransfer = () => transaction.receiverId === AccountId
  const isTransfer = transaction.receiverId || transaction.senderId
  const transferNote = transaction?.notes?.find(note => note.noteType === "TRANSFER_MOTIVE")

  return (
    <tr>
      <td className="tableId text-nowrap">
        {transaction.id}
        <ApprovedByUsers
          approvedBy={transaction?.approvedBy || []}
          aditionalLines={[
            ...!!(transaction?.userName || transaction?.userEmail) ?
              [`${t('Performed by')}: ${transaction?.userName || transaction?.userEmail}`] : [],
            ...!!(transferNote) ?
              [`${t('Transfer note')}${transferNote.userName ? ` (${transferNote.userName})` : ""}: "${transferNote.text}"`] : [],
            ...!!(denialMotive) ?
              [`${t('Denial motive')}${denialMotive.userName ? ` (${denialMotive.userName})` : ""}: "${denialMotive.text}"`] : [],
            ...!!(adminNote) ?
              [`${t('Admin note')}${adminNote.userName ? ` (${adminNote.userName})` : ""}: "${adminNote.text}"`] : [],
          ]}
        />
      </td>
      <td className="tableDate">{momentDate.format('L')}</td>
      <td className={`tableConcept ${transaction.stateId === 3 ? 'text-red' : 'text-green'}`}>
        {t(getMoveStateById(transaction.stateId).name)}
        {(transaction?.reverted && transferNote?.text !== "Transferencia revertida") ? <>, {t("reverted")}</> : ""}
      </td>
      <td className={`tableConcept ${isTransfer ? (incomingTransfer() ? 'text-green' : 'text-red') : (Math.sign(transaction.shares) === 1 ? 'text-green' : 'text-red')}`}>

        {
          isTransfer ?
            t(
              incomingTransfer() ?
                "Transfer from {{transferSender}}"
                :
                "Transfer to {{transferReceiver}}",
              {
                transferReceiver: transaction.receiverAlias,
                transferSender: transaction.senderAlias
              }
            )
            :
            <>
              <span>{Math.sign(transaction.shares) === 1 ? t('Purchase') : t('Sale')}</span>

            </>
        }
        ,&nbsp;
        <FormattedNumber value={Math.abs(transaction.shares)} fixedDecimals={sharesDecimalPlaces} />&nbsp;
        {t(Math.abs(transaction.shares) === 1 ? "share" : "shares")}
        {(transaction?.reverted && transferNote?.text === "Transferencia revertida") ? <>, {t("reversion")}</> : ""}
      </td>
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
