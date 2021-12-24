import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { Spinner } from 'react-bootstrap'

import moment from 'moment';
import ActionConfirmationModal from './ActionConfirmationModal'

const TransactionRow = ({ Transaction, state, reloadTransactions }) => {

    var momentDate = moment(Transaction.createdAt);

    const [ShowModal, setShowModal] = useState(false)
    const [Action, setAction] = useState("approve")

    const [UserTicketInfo, SetUserTicketInfo] = useState({ fetching: true, value: {} })
    const [FundTicketInfo, SetFundTicketInfo] = useState({ fetching: true, value: {} })

    const launchModalConfirmation = (action) => {
        setAction(action)
        setShowModal(true)
    }

    useEffect(() => {
        const getUserData = async () => {
            var url = `${process.env.REACT_APP_APIURL}/clients/${Transaction.clientId}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                const data = await response.json()
                SetUserTicketInfo({ ...UserTicketInfo, ...{ fetching: false, value: data } })
            } else {
                switch (response.status) {
                    default:
                        console.log(response)
                }
            }
        }

        const getFundData = async () => {
            var url = `${process.env.REACT_APP_APIURL}/funds/${Transaction.fundId}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                const data = await response.json()
                SetFundTicketInfo({ ...FundTicketInfo, ...{ fetching: false, value: data } })
            } else {
                switch (response.status) {
                    default:
                        console.log(response)
                }
            }
        }
        const token = sessionStorage.getItem('access_token')
        getFundData();
        getUserData();
        //eslint-disable-next-line
    }, [Transaction])

    return (
        <>
            <tr className="transactionRow">
                <td>{Transaction.id}</td>
                <td>
                    {
                        UserTicketInfo.fetching ?
                            <Spinner animation="border" size="sm" />
                            :
                            UserTicketInfo.value.alias
                    }
                </td>
                <td>
                    {
                        FundTicketInfo.fetching ?
                            <Spinner animation="border" size="sm" />
                            : FundTicketInfo.value.name
                    }
                </td>
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
            {state === 1 || state === "1" ?
                <ActionConfirmationModal reloadTransactions={reloadTransactions} transaction={Transaction} setShowModal={setShowModal} action={Action} show={ShowModal} />
                :
                null}
        </>
    )
}
export default TransactionRow

