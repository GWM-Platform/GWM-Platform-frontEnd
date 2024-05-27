import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { ApprovedByUsers } from 'components/DashBoard/Admin/TicketsAdministration/Tables/TransactionsTable/TransactionRow';

const Movement = ({ Movement }) => {
  var momentDate = moment(Movement.createdAt);
  const { t } = useTranslation();
  const { getMoveStateById } = useContext(DashBoardContext)


  const transferNote = Movement?.notes?.find(note => note.noteType === "TRANSFER_MOTIVE")
  const clientNote = Movement?.notes?.find(note => note.noteType === "CLIENT_NOTE")
  const denialMotive = Movement?.notes?.find(note => note.noteType === "DENIAL_MOTIVE")
  const adminNote = Movement?.notes?.find(note => note.noteType === "ADMIN_NOTE")
  const partialLiquidate = Movement?.notes?.find(note => note.noteType === "PARTIAL_LIQUIDATE_MOTIVE")

  return (
    <tr>
      <td className="tableId text-nowrap">
        {Movement.id}
        <ApprovedByUsers
          approvedBy={Movement.approvedBy}
          aditionalLines={[
            ...!!(Movement?.userName || Movement?.userEmail) ?
              [`${t('Performed by')}: ${Movement?.userName || Movement?.userEmail}`] : [],
            ...!!(transferNote) ?
              [`${t('Transfer note')}${transferNote.userName ? ` (${transferNote.userName})` : ""}: "${transferNote.text}"`] : [],
            ...!!(clientNote) ?
              [`${t('Personal note')}${clientNote.userName ? ` (${clientNote.userName})` : ""}: "${clientNote.text}"`] : [],
            ...!!(denialMotive) ?
              [`${t('Denial motive')}${denialMotive.userName ? ` (${denialMotive.userName})` : ""}: "${denialMotive.text}"`] : [],
            ...!!(adminNote) ?
              [`${t('Admin note')}${adminNote.userName ? ` (${adminNote.userName})` : ""}: "${adminNote.text}"`] : [],
            ...!!(partialLiquidate) ?
              [`"${partialLiquidate.text}" (${partialLiquidate.userName})`] : []
          ]}
        />
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
        {!!(partialLiquidate) && <> ({t("Partial liquidation")})</>}
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
