import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Badge, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { DashBoardContext } from 'context/DashBoardContext';
import moment from 'moment';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { getAnualRate, getDuration, wasEdited } from 'utils/fixedDeposit';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import ActionConfirmationModal from 'components/DashBoard/Admin/TicketsAdministration/Tables/FixedDepositsTable/FixedDepositRow/ActionConfirmationModal'
import { ApprovedByUsers } from 'components/DashBoard/Admin/TicketsAdministration/Tables/TransactionsTable/TransactionRow';

const FixedDepositRow = ({ Movement, reloadData }) => {
    const { t } = useTranslation();
    const { toLogin } = useContext(DashBoardContext);

    const [ShowModal, setShowModal] = useState(false)
    const [Action, setAction] = useState("approve")


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
            case 5://Client pending
                return {
                    bg: "warning",
                    text: "Client pending"
                }
            case 6://Client pending
                return {
                    bg: "warning",
                    text: "Admin sign pending"
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

    const ellapsedDays = () => {
        switch (Movement.stateId) {
            case 1://pending
                return 0
            case 2://Approved
                if (Movement.closed) {
                    if (closedAtTheEnd()) {
                        return getDuration(Movement)
                    } else {
                        return (Math.floor(new Date(Movement?.updatedAt).getTime() / 1000 / 60 / 60 / 24) -
                            Math.floor(new Date(Movement?.startDate).getTime() / 1000 / 60 / 60 / 24)) ?? 0
                    }
                } else {
                    return (Math.floor(new Date().getTime() / 1000 / 60 / 60 / 24) -
                        Math.floor(new Date(Movement?.startDate).getTime() / 1000 / 60 / 60 / 24)) ?? 0
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
                    interestRate: getAnualRate(Movement)
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
                    duration: getDuration(Movement),
                    initialAmount: Movement?.initialAmount,
                    interestRate: getAnualRate(Movement)
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
                    interestRate: getAnualRate(Movement)
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


    const closedAtTheEnd = () => moment(Movement.endDate).isBefore(moment(Movement.updatedAt))

    const validState = (states = []) => states.includes(status().text)

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        if (validState(["Pending", "Ongoing", "Denied", "Closed (Out of term)"])) calculateProfitAtTheEnd(signal)
        if (validState(["Ongoing"])) calculateActualProfit(signal)
        if (validState(["Closed (Out of term)", "Closed (Term completed)"])) calculateRefundedProfit(signal)
        return () => {
            controller.abort();
        };
        //eslint-disable-next-line
    }, [])

    const transferNote = Movement?.notes?.find(note => note.noteType === "TRANSFER_MOTIVE")
    const clientNote = Movement?.notes?.find(note => note.noteType === "CLIENT_NOTE")
    const denialMotive = Movement?.notes?.find(note => note.noteType === "DENIAL_MOTIVE")
    const adminNote = Movement?.notes?.find(note => note.noteType === "ADMIN_NOTE")

    return (
        <>
            <div className='mobileMovement'>
                <div className='d-flex py-1 align-items-center flex-wrap flex-wrap' >
                    <span className="h5 mb-0 me-1">{t("Time deposit")}&nbsp;#{Movement.id}</span>
                    {
                        wasEdited(Movement) &&
                        <span className="h5 mb-0 me-1 me-md-2">({t("Personalized  *")})</span>}
                    <Badge className='ms-auto' bg={status()?.bg}>{t(status().text)}</Badge>
                    {
                        !!(Movement.stateId === 2 && !Movement.closed) &&
                        <div className="h-100 d-flex align-items-center justify-content-around Actions ms-2">
                            <div className="iconContainer red me-1">
                                <FontAwesomeIcon className="icon" icon={faTimesCircle} onClick={() => { launchModalConfirmation("close") }} />
                            </div>
                        </div>
                    }
                    <ApprovedByUsers
                        approvedBy={Movement.approvedBy}
                        aditionalLines={[
                            ...!!(Movement?.userName || Movement?.userEmail) ?
                                [`${t('Performed by')}: ${Movement?.userName || Movement?.userEmail}`] : [],
                            ...!!(transferNote) ?
                                [`${t('Transfer note')}${transferNote.userName ? ` (${transferNote.userName})` : ""}: "${transferNote.text}"`] : [],
                            ...!!(clientNote) ?
                                [`${t('Personal note')}${clientNote.userName ? ` (${clientNote.userName})` : ""}: "${clientNote.text}"`] : [],
                            ...!!(denialMotive) ?
                                [`${t('Denial motive')}${denialMotive.userName ? ` (${denialMotive.userName})` : ""}: "${denialMotive.text}"`] : [],
                            ...!!(adminNote) ?
                                [`${t('Admin note')}${adminNote.userName ? ` (${adminNote.userName})` : ""}: "${adminNote.text}"`] : []
                        ]}
                    />
                </div >
                <div className='w-100 d-flex' style={{ borderBottom: "1px solid lightgray" }} />

                <div className='d-flex justify-content-between'>
                    <span >{t("Investment initial amount")}:&nbsp;<FormattedNumber value={Movement.initialAmount} prefix="U$D " fixedDecimals={2} /></span>
                </div >
                {
                    !!(validState(["Ongoing"])) &&
                    <div className='d-flex justify-content-between'>
                        <span >{t("Investment current amount")}:&nbsp;
                            {ActualProfit.fetching ?
                                <Spinner animation="border" size="sm" />
                                :
                                <FormattedNumber value={ActualProfit.value} prefix="U$D " fixedDecimals={2} />}
                        </span>
                    </div >
                }
                {
                    !!(validState(["Pending", "Ongoing", "Denied", "Closed (Out of term)"])) &&
                    <div className='d-flex justify-content-between' >
                        <span >{t("Investment at maturity date")}:&nbsp;
                            {ProfitAtTheEnd.fetching ?
                                <Spinner animation="border" size="sm" />
                                :
                                <FormattedNumber value={ProfitAtTheEnd.value} prefix="U$D " fixedDecimals={2} />}
                        </span>
                    </div >
                }
                {!!(validState(["Closed (Out of term)", "Closed (Term completed)"])) &&
                    <div className='d-flex justify-content-between' >
                        <span >{t("Refund on close")}:&nbsp;
                            {RefundedProfit.fetching ?
                                <Spinner animation="border" size="sm" />
                                :
                                <FormattedNumber value={RefundedProfit.value} prefix="U$D " fixedDecimals={2} />}
                        </span>
                    </div >
                }
                <div className='w-100 d-flex' style={{ borderBottom: "1px solid lightgray" }} />
                <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
                    <span >{t("Duration (Agreed)")}:&nbsp;
                        {getDuration(Movement)}&nbsp;{t("days")}
                        {(wasEdited(Movement)) && " *"}
                    </span>
                </div >

                {!!(validState(["Closed (Term completed)", "Closed (Out of term)", "Ongoing"])) &&
                    <div className='d-flex justify-content-between'>
                        <span >{t("Establishment date")}:&nbsp;
                            {moment(Movement.startDate).format('L')}
                        </span>
                    </div >}

                {!!(validState(["Closed (Term completed)", "Closed (Out of term)", "Ongoing"])) &&
                    <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
                        <span >{t("Maturity date")}:&nbsp;
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
                        <FormattedNumber className={`bolder`} value={getAnualRate(Movement)} suffix="%" fixedDecimals={2} />
                        {wasEdited(Movement) && " *"}
                    </span>
                </div >


            </div >
            {
                Movement.stateId === 1 || Movement.stateId === 6 || (Movement.stateId === 2 && !Movement.closed) ?
                    <ActionConfirmationModal reloadData={reloadData} movement={Movement} setShowModal={setShowModal} action={Action} show={ShowModal} />
                    :
                    null
            }
        </>
    )
}
export default FixedDepositRow

