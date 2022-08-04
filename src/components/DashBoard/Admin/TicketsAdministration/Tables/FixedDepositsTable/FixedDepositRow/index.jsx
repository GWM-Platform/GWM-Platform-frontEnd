import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import ActionConfirmationModal from './ActionConfirmationModal'
import { Badge, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { DashBoardContext } from 'context/DashBoardContext';
import moment from 'moment';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const FixedDepositRow = ({ AccountInfo, UsersInfo, Movement, state, reloadData }) => {
    const { t } = useTranslation();
    const { toLogin } = useContext(DashBoardContext);


    const [ShowModal, setShowModal] = useState(false)
    const [Action, setAction] = useState("approve")

    const [UserTicketInfo, SetUserTicketInfo] = useState({ fetching: true, valid: false, value: {} })

    const launchModalConfirmation = (action) => {
        setAction(action)
        setShowModal(true)
    }

    const status = () => {
        switch (Movement.stateId) {
            case 1://pending
                return {
                    bg: "info",
                    text: "Pending"
                }
            case 2://Approved
                if (Movement.closed) {
                    if (closedAtTheEnd()) {
                        return {
                            bg: "success",
                            text: "Closed (Term completed)"
                        }
                    } else {
                        return {
                            bg: "success",
                            text: "Closed (Out of term)"
                        }
                    }
                } else {
                    return {
                        bg: "primary",
                        text: "Ongoing"
                    }
                }
            case 3://Denied
                return {
                    bg: "danger",
                    text: "Denied"
                }
            default:
                return {
                    bg: "danger",
                    text: "Denied"
                }
        }
    }

    const [ProfitAtTheEnd, setProfitAtTheEnd] = useState({ fetching: false, fetched: false, valid: false, value: 0 })
    const [ActualProfit, setActualProfit] = useState({ fetching: false, fetched: false, valid: false, value: 0 })
    const [RefundedProfit, setRefundedProfit] = useState({ fetching: false, fetched: false, valid: false, value: 0 })

    const getAnualRate = () => Movement.interestRate ?? 0

    const ellapsedDays = () => {
        switch (Movement.stateId) {

            case 1://pending
                return 0
            case 2://Approved
                if (Movement.closed) {
                    if (closedAtTheEnd()) {
                        return Movement.duration
                    } else {
                        return Math.abs(moment(Movement?.updatedAt).startOf("day").diff(moment(Movement.startDate).startOf("day"), "days"))
                    }
                } else {
                    return Math.abs(moment(Movement?.startDate).startOf("day").diff(moment().startOf("day"), "days"))
                }
            case 3://Denied
                return 0
            default:
                return 0
        }
    }

    const calculateActualProfit = (signal) => {
        if (Movement.initialAmount) {
            axios.post(`/fixed-deposits/profit`,
                {
                    duration: ellapsedDays(),
                    initialAmount: Movement?.initialAmount,
                    interestRate: getAnualRate()
                }, { signal: signal }).then(function (response) {
                    if (response.status < 300 && response.status >= 200) {
                        setActualProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: response.data || Movement.initialAmount } }))
                    } else {
                        switch (response.status) {
                            case 401:
                                toLogin();
                                break;
                            default:
                                setActualProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: Movement.initialAmount } }))
                                break
                        }
                    }
                }).catch((err) => {
                    if (err.message !== "canceled") {
                        setActualProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: Movement.initialAmount } }))
                    }
                });
        }
    }

    const calculateProfitAtTheEnd = (signal) => {
        if (Movement.initialAmount) {
            axios.post(`/fixed-deposits/profit`,
                {
                    duration: Movement?.duration,
                    initialAmount: Movement?.initialAmount,
                    interestRate: getAnualRate()
                }, { signal: signal }).then(function (response) {
                    if (response.status < 300 && response.status >= 200) {
                        setProfitAtTheEnd((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: response.data || Movement.initialAmount } }))
                    } else {
                        switch (response.status) {
                            case 401:
                                toLogin();
                                break;
                            default:
                                setProfitAtTheEnd((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: Movement.initialAmount } }))
                                break
                        }
                    }
                }).catch((err) => {
                    if (err.message !== "canceled") {
                        setProfitAtTheEnd((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: Movement.initialAmount } }))
                    }
                });
        }
    }

    const calculateRefundedProfit = (signal) => {
        if (Movement.initialAmount) {
            axios.post(`/fixed-deposits/profit`,
                {
                    duration: ellapsedDays(),
                    initialAmount: Movement?.initialAmount,
                    interestRate: getAnualRate()
                }, { signal: signal }).then(function (response) {
                    if (response.status < 300 && response.status >= 200) {
                        setRefundedProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: response.data || Movement.initialAmount } }))
                    } else {
                        switch (response.status) {
                            case 401:
                                toLogin();
                                break;
                            default:
                                setRefundedProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: Movement.initialAmount } }))
                                break
                        }
                    }
                }).catch((err) => {
                    if (err.message !== "canceled") {
                        setRefundedProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: Movement.initialAmount } }))
                    }
                });
        }
    }

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

    const closedAtTheEnd = () => moment(Movement.endDate).isBefore(moment(Movement.updatedAt))

    const validState = (states = []) => states.includes(status().text)

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        if (validState(["Pending", "Ongoing", "Denied", "Closed (Out of term)"])) calculateProfitAtTheEnd(signal)
        if (validState(["Ongoing"])) calculateActualProfit(signal)
        if (validState(["Closed (Out of term)", "Closed (Term completed)"])) calculateRefundedProfit(signal)
        userInfoById(Movement.clientId)
        return () => {
            controller.abort();
        };
        //eslint-disable-next-line
    }, [])

    return (
        <>
            <div className='mobileMovement'>
                <div className='d-flex py-1 align-items-center' >
                    <span className="h4 mb-0 me-1 me-md-2">{t("Time deposit")}&nbsp;#{Movement.id}</span>
                    <div className='me-auto px-1 px-md-2' style={{borderLeft:"1px solid lightgray",borderRight:"1px solid lightgray"}}>
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
                        !!(Movement.stateId === 2 && !Movement.closed) &&
                        <div className="h-100 d-flex align-items-center justify-content-around Actions">
                            <div className="iconContainer red me-1">
                                <FontAwesomeIcon className="icon" icon={faTimesCircle} onClick={() => { launchModalConfirmation("close") }} />
                            </div>
                        </div>
                    }
                    {
                        !!(Movement.stateId === 1) &&
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

                <div className='d-flex justify-content-between'>
                    <span >{t("Investment initial amount")}:&nbsp;<FormattedNumber value={Movement.initialAmount} prefix="$" fixedDecimals={2} /></span>
                </div >
                {
                    !!(validState(["Ongoing"])) &&
                    <div className='d-flex justify-content-between'>
                        <span >{t("Investment current amount")}:&nbsp;
                            {ActualProfit.fetching ?
                                <Spinner animation="border" size="sm" />
                                :
                                <FormattedNumber value={ActualProfit.value} prefix="$" fixedDecimals={2} />}
                        </span>
                    </div >
                }
                {
                    !!(validState(["Pending", "Ongoing", "Denied", "Closed (Out of term)"])) &&
                    <div className='d-flex justify-content-between' >
                        <span >{t("Investment upon closing within the agreed term")}:&nbsp;
                            {ProfitAtTheEnd.fetching ?
                                <Spinner animation="border" size="sm" />
                                :
                                <FormattedNumber value={ProfitAtTheEnd.value} prefix="$" fixedDecimals={2} />}
                        </span>
                    </div >
                }
                {!!(validState(["Closed (Out of term)", "Closed (Term completed)"])) &&
                    <div className='d-flex justify-content-between' >
                        <span >{t("Refund on close")}:&nbsp;
                            {RefundedProfit.fetching ?
                                <Spinner animation="border" size="sm" />
                                :
                                <FormattedNumber value={RefundedProfit.value} prefix="$" fixedDecimals={2} />}
                        </span>
                    </div >
                }
                <div className='w-100 d-flex' style={{ borderBottom: "1px solid lightgray" }} />
                <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
                    <span >{t("Duration (Agreed)")}:&nbsp;
                        {Movement.duration}&nbsp;{t("days")}
                    </span>
                </div >

                {!!(validState(["Closed (Term completed)", "Closed (Out of term)", "Ongoing"])) &&
                    <div className='d-flex justify-content-between'>
                        <span >{t("Time deposit Start date")}:&nbsp;
                            {moment(Movement.startDate).format('L')}
                        </span>
                    </div >}

                {!!(validState(["Closed (Term completed)", "Closed (Out of term)", "Ongoing"])) &&
                    <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
                        <span >{t("End date (Agreed)")}:&nbsp;
                            {moment(Movement.endDate).format('L')}
                        </span>
                    </div >}

                {!!(validState(["Closed (Term completed)", "Closed (Out of term)", "Ongoing"])) &&
                    <div className='d-flex justify-content-between'>
                        <span >{t("Elapsed")}:&nbsp;
                            {ellapsedDays()}&nbsp;{t("days")}
                        </span>
                    </div >}

                {!!(validState(["Closed (Term completed)", "Closed (Out of term)"])) &&
                    <div className='d-flex justify-content-between'>
                        <span >{t("Close date")}:&nbsp;
                            {moment(Movement.updatedAt).format('L')}
                        </span>
                    </div >}

                <div className='w-100 d-flex' style={{ borderBottom: "1px solid lightgray" }} />
                <div className='d-flex justify-content-between'>
                    <span >{t("Anual rate")}:&nbsp;
                        <FormattedNumber value={getAnualRate()} suffix="%" fixedDecimals={2} />
                    </span>
                </div >



            </div >
            {
                Movement.stateId === 1 || (Movement.stateId === 2 && !Movement.closed) ?
                    <ActionConfirmationModal reloadData={reloadData} movement={Movement} setShowModal={setShowModal} action={Action} show={ShowModal} />
                    :
                    null}
        </>
    )
}
export default FixedDepositRow

