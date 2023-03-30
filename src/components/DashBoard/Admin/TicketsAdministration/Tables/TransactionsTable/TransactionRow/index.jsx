import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { Badge, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

import moment from 'moment';
import ActionConfirmationModal from './ActionConfirmationModal'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import Decimal from 'decimal.js';

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

    const status = () => {
        switch (Transaction.stateId) {
            case 1://pending
                return {
                    bg: "info",
                    text: "Pending"
                }
            case 2://Approved
                return {
                    bg: "success",
                    text: "Approved"
                }
            case 3://Denied
                return {
                    bg: "danger",
                    text: "Denied"
                }
            case 5://Client pending
                return {
                    bg: "warning",
                    text: "Client pending"
                }
            default:
                return {
                    bg: "danger",
                    text: "Denied"
                }
        }
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

    const decimalSharesAbs = new Decimal(Transaction.shares).abs()
    const decimalPrice = new Decimal(Transaction.sharePrice)
    const amount = new Decimal(decimalSharesAbs.times(decimalPrice))

    return (
        <>
            <div className='mobileMovement'>
                <div className='d-flex py-1 align-items-center' >
                    <span className="h5 mb-0 me-1 me-md-2">{t("Transaction")}&nbsp;#{Transaction.id}</span>
                    <div className='me-auto px-1 px-md-2' style={{ borderLeft: "1px solid lightgray", borderRight: "1px solid lightgray" }}>
                        <span className="d-none d-md-inline">{t("Client")}:&nbsp;</span>
                        {
                            UserTicketInfo.fetching ?
                                <Spinner animation="border" size="sm" />
                                :
                                UserTicketInfo.valid ?
                                    UserTicketInfo.value.alias
                                    :
                                    t("Undefined Client")
                        }
                    </div>
                    {
                        !!(Transaction.stateId === 1) &&
                        <div className="h-100 d-flex align-items-center justify-content-around Actions">
                            <div className="iconContainer green me-1">
                                <FontAwesomeIcon className="icon" icon={faCheckCircle} onClick={() => { launchModalConfirmation("approve") }} />
                            </div>
                            <div className="iconContainer red me-1">
                                <FontAwesomeIcon className="icon" icon={faTimesCircle} onClick={() => { launchModalConfirmation("deny") }} />
                            </div>
                        </div>
                    }
                    <Badge className='ms-1 ms-md-2' bg={status()?.bg}>{t(status().text)}</Badge>
                </div >

                <div className='w-100 d-flex' style={{ borderBottom: "1px solid lightgray" }} />

                <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
                    <span >
                        {t("Concept")}:&nbsp;
                        {

                            FundTicketInfo.fetching ?
                                <Spinner animation="border" size="sm" />
                                :
                                t(Math.sign(Transaction.shares) === -1 ? "STAKE_SELL" : "STAKE_BUY",
                                    {
                                        fund: FundTicketInfo.valid ?
                                            FundTicketInfo.value.name
                                            :
                                            t("Undefined Fund")
                                    }
                                )
                        }
                    </span>
                </div >

                <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
                    <span >
                        {t("Shares")}:&nbsp;
                        <FormattedNumber value={Transaction.shares} fixedDecimals={2} />

                    </span>
                </div >



                <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
                    <span >
                        <span className="d-inline d-md-none">{t("Price")}</span>
                        <span className="d-none d-md-inline">{t("Share Price")}</span>:&nbsp;
                        <FormattedNumber value={Transaction.sharePrice} prefix="$" fixedDecimals={2} />
                    </span>
                </div >

                <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
                    <span >
                        {t("Amount")}:&nbsp;
                        <FormattedNumber preffix="$" value={amount} fixedDecimals={2} />

                    </span>
                </div >

                <div className='w-100 d-flex' style={{ borderBottom: "1px solid lightgray" }} />

                <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
                    <span >
                        <span className="d-inline d-md-none">{t("Date")}</span>
                        <span className="d-none d-md-inline">{t("Created at")}</span>:&nbsp;
                        {momentDate.format('L')}
                    </span>
                </div >



            </div >
            {
                Transaction.stateId === 1 ?
                    <ActionConfirmationModal reloadData={reloadData} transaction={Transaction} setShowModal={setShowModal} action={Action} show={ShowModal} />
                    :
                    null}
        </>
    )
}
export default TransactionRow

