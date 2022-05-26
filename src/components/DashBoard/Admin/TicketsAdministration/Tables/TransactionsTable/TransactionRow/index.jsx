import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

import moment from 'moment';
import ActionConfirmationModal from './ActionConfirmationModal'

const TransactionRow = ({ UsersInfo, FundInfo, Transaction, state, reloadData }) => {
    const { t } = useTranslation();

    var momentDate = moment(Transaction.createdAt);

    const [ShowModal, setShowModal] = useState(false)
    const [Action, setAction] = useState("approve")

    const [UserTicketInfo, SetUserTicketInfo] = useState({ fetching: true, valid: false, value: {} })
    const [FundTicketInfo, SetFundTicketInfo] = useState({ fetching: true, valid: false, value: {} })

    const launchModalConfirmation = (action) => {
        setAction(action)
        setShowModal(true)
    }



    useEffect(() => {
        const userInfoById = (clientId) => {
            let indexClientTransaction = UsersInfo.value.findIndex((client) => client.id === clientId)
            if (indexClientTransaction >= 0) {
                SetUserTicketInfo((prevState) => ({
                    ...prevState,
                    valid: true,
                    fetching: false,
                    value: UsersInfo.value[indexClientTransaction]
                }))
            } else {
                SetUserTicketInfo((prevState) => ({
                    ...prevState,
                    valid: false,
                    fetching: false,
                }))
            }
        }

        const fundInfoById = (fundId) => {
            let indexFundTransaction = FundInfo.value.findIndex((fund) => fund.id === fundId)
            if (indexFundTransaction >= 0) {
                SetFundTicketInfo((prevState) => ({
                    ...prevState,
                    valid: true,
                    fetching: false,
                    value: FundInfo.value[indexFundTransaction]
                }))
            } else {
                SetFundTicketInfo((prevState) => ({
                    ...prevState,
                    valid: false,
                    fetching: false,
                }))
            }

        }

        if (!FundInfo.fetching) {
            fundInfoById(Transaction.fundId)
        }
        if (!UsersInfo.fetching) {
            userInfoById(Transaction.clientId)
        }
        //eslint-disable-next-line
    }, [Transaction, UsersInfo, FundInfo])

    return (
        <>
            <tr className="transactionRow">
                <td>
                    <span className='text-nowrap'>

                        {
                            UserTicketInfo.fetching ?
                                <Spinner animation="border" size="sm" />
                                :
                                UserTicketInfo.valid ?
                                    UserTicketInfo.value.alias
                                    :
                                    t("Undefined Client")
                        }
                    </span>
                </td>
                <td>{Math.sign(Transaction.shares) === -1 ? t("Sale") : t("Purchase")}</td>
                <td>
                    <span className='text-nowrap'>
                        {
                            FundTicketInfo.fetching ?
                                <Spinner animation="border" size="sm" />
                                :
                                FundTicketInfo.valid ?
                                    FundTicketInfo.value.name
                                    :
                                    t("Undefined Fund")
                        }
                    </span>
                </td>
                <td>{Transaction.shares}</td>
                <td>${Transaction.sharePrice}</td>
                <td>
                    <span className='text-nowrap'>
                        {momentDate.format('MMMM Do YYYY, h:mm:ss a')}
                    </span>
                </td>
                <td>{Transaction.id}</td>
                {
                    Transaction.stateId === 1 ?
                        <td className="Actions verticalCenter" >
                            <div className="h-100 d-flex align-items-center justify-content-around">
                                <div className="iconContainer green">
                                    <FontAwesomeIcon className="icon" icon={faCheckCircle} onClick={() => { launchModalConfirmation("approve") }} />
                                </div>
                                <div className="iconContainer red">
                                    <FontAwesomeIcon className="icon" icon={faTimesCircle} onClick={() => { launchModalConfirmation("deny") }} />
                                </div>
                            </div>
                        </td>
                        :
                        null
                }
            </tr>
            {
                Transaction.stateId === 1 ?
                    <ActionConfirmationModal reloadData={reloadData} transaction={Transaction} setShowModal={setShowModal} action={Action} show={ShowModal} />
                    :
                    null}
        </>
    )
}
export default TransactionRow

