import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import moment from 'moment';
import ActionConfirmationModal from './ActionConfirmationModal'

const TransactionRow = ({ Transaction, state, reloadTransactions }) => {

    var momentDate = moment(Transaction.createdAt);

    const [ShowModal, setShowModal] = useState(false)
    const [Action, setAction] = useState("approve")

    const launchModalConfirmation = (action) => {
        setAction(action)
        setShowModal(true)
    }
    return (
        <>
            <tr className="transactionRow">
                <td>{Transaction.id}</td>
                <th >{Transaction.clientId}</th>
                <td>{Transaction.fundId}</td>
                <td>{Transaction.shares}</td>
                <td>{Transaction.sharePrice}</td>
                <td>{momentDate.format('MMMM Do YYYY, h:mm:ss a')}</td>
                {
                    state === 1 || state === "1" ?
                        <td className="Actions verticalCenter" >
                            <div className="h-100 d-flex align-items-center justify-content-around">
                                <div className="iconContainer red">
                                    <FontAwesomeIcon className="icon" icon={faCheckCircle} onClick={() => { launchModalConfirmation("approve") }} />
                                </div>
                                <div className="iconContainer green">
                                    <FontAwesomeIcon className="icon" icon={faTimesCircle} onClick={() => { launchModalConfirmation("deny") }} />
                                </div>
                            </div>
                        </td>
                        :
                        null
                }
            </tr>
            <ActionConfirmationModal reloadTransactions={reloadTransactions} transaction={Transaction} setShowModal={setShowModal} action={Action} show={ShowModal} />
        </>
    )
}
export default TransactionRow

