import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { useTranslation } from "react-i18next";

const Movement = ({ Movement }) => {
    moment.locale(localStorage.getItem('language'))
    var momentDate = moment(Movement.createdAt);
    const { t } = useTranslation();
    
    return (
        <tr className="AccountRow">
            <td className='tableDate'>{momentDate.format('MMMM Do YYYY, h:mm:ss a')}</td>
            <td className="tableConcept">{t(Movement.motive)}</td>
            <td className='tableAmount'>${Movement.amount}</td>
        </tr>
    )
}
export default Movement

