import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from "react-i18next";
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const Movement = ({ Movement }) => {
    var momentDate = moment(Movement.createdAt);
    const { t } = useTranslation();

    return (
        <tr className="AccountRow">
            <td className='tableDate'>{momentDate.format('L')}</td>
            <td className="tableConcept">{t(Movement.motive + (Movement.motive === "REPAYMENT" ? Movement.fundName ? "_" + Movement.fundName : "_" + Movement.fixedDepositId : ""), { fund: Movement.fundName, fixedDeposit: Movement.fixedDepositId })}</td>
            <td className='tableAmount'>
                <FormattedNumber className="emphasis" value={Movement.amount} prefix="$" fixedDecimals={2} />
            </td>
        </tr>
    )
}
export default Movement

