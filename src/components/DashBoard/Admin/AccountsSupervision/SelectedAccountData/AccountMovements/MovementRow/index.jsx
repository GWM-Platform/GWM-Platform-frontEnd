import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from "react-i18next";
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { DashBoardContext } from 'context/DashBoardContext';

const Movement = ({ Movement }) => {
    var momentDate = moment(Movement.createdAt);
    const { getMoveStateById } = useContext(DashBoardContext)

    const { t } = useTranslation();

    return (
        <tr className="AccountRow">
            <td className="tableId">{Movement.id}</td>
            <td className="tableDate">
                {momentDate.format('L')}
            </td>
            <td className={`tableConcept ${Movement.stateId === 3 ? 'text-red' : 'text-green'}`}>{t(getMoveStateById(Movement.stateId).name)}</td>
            <td className="tableConcept">
                {t(Movement.motive + (Movement.motive === "REPAYMENT" ? Movement.fundName ? "_" + Movement.fundName : "_" + Movement.fixedDepositId : ""), { fund: Movement.fundName, fixedDeposit: Movement.fixedDepositId })}
            </td>
            <td className={`tableAmount ${Math.sign(Movement.amount) === 1 ? 'text-green' : 'text-red'}`}>
                <span>{Math.sign(Movement.amount) === 1 ? '+' : '-'}</span>
                <FormattedNumber value={Math.abs(Movement.amount)} prefix="$" fixedDecimals={2} />
            </td>
        </tr>
    )
}
export default Movement

