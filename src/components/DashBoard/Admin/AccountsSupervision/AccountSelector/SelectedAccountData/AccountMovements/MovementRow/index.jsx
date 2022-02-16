import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';

const Movement = ({ Movement }) => {   
    var momentDate = moment(Movement.createdAt);
    return (
        <tr className="AccountRow">
            <td >{momentDate.format('MMMM Do YYYY, h:mm:ss a')}</td>
            <td >${Movement.amount}</td>
        </tr>
    )
}
export default Movement

