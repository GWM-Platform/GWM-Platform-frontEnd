import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { Spinner } from 'react-bootstrap'

import moment from 'moment';
import ActionConfirmationModal from './ActionConfirmationModal'

const MovementRow = ({ Movement, state, reloadData }) => {

    var momentDate = moment(Movement.createdAt);

    const [ShowModal, setShowModal] = useState(false)
    const [Action, setAction] = useState("approve")

    const [AccountTicketInfo, SetAccountTicketInfo] = useState({ fetching: true, value: {} })
    const [ClientAccountInfo, SetClientAccountInfo] = useState({ fetching: true, value: {} })

    const launchModalConfirmation = (action) => {
        setAction(action)
        setShowModal(true)
    }

    useEffect(() => {
        const getAccountData = async () => {
            var url = `${process.env.REACT_APP_APIURL}/accounts/${Movement.accountId}`;
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
                SetAccountTicketInfo({ ...AccountTicketInfo, ...{ fetching: false, value: data } })
                getAccountClientData(data)
            } else {
                switch (response.status) {
                    default:
                        console.log(response)
                }
            }
        }
        const getAccountClientData = async (AccountTicketInfoFetched) => {
            var url = `${process.env.REACT_APP_APIURL}/clients/${AccountTicketInfoFetched.clientId}`;
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
                SetClientAccountInfo({ ...ClientAccountInfo, ...{ fetching: false, value: data } })
            } else {
                switch (response.status) {
                    default:
                        console.log(response)
                }
            }
        }



        const token = sessionStorage.getItem('access_token')
        getAccountData();
        //eslint-disable-next-line
    }, [Movement,state])
    return (
        <>
            <tr className="transactionRow">
                <td>{Movement.id}</td>
                <td>
                    {
                        ClientAccountInfo.fetching ?
                            <Spinner animation="border" size="sm" />
                            :
                            ClientAccountInfo.value.alias
                    }
                </td>
                <td>${Movement.amount}</td>
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
                <ActionConfirmationModal reloadData={reloadData} movement={Movement} setShowModal={setShowModal} action={Action} show={ShowModal} />
                :
                null}
        </>
    )
}
export default MovementRow

