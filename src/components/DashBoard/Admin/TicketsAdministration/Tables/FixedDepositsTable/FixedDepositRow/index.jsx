import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faEdit, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import ActionConfirmationModal from './ActionConfirmationModal'
import { Badge, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { DashBoardContext } from 'context/DashBoardContext';
import moment from 'moment';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import EditModal from './EditModal';
import { userId } from 'utils/userId';

const FixedDepositRow = ({ UsersInfo, Movement, reloadData, users }) => {
    const { t } = useTranslation();
    const { toLogin } = useContext(DashBoardContext);

    const [ShowModal, setShowModal] = useState(false)
    const [Action, setAction] = useState("approve")

    const [ShowEditModal, setShowEditModal] = useState(false)

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

    const [ProfitAtTheEnd, setProfitAtTheEnd] = useState({ fetching: false, fetched: false, valid: false, value: 0 })
    const [ProfitEditedAtTheEnd, setProfitEditedAtTheEnd] = useState({ fetching: false, fetched: false, valid: false, value: 0 })
    const [ActualProfit, setActualProfit] = useState({ fetching: false, fetched: false, valid: false, value: 0 })
    const [RefundedProfit, setRefundedProfit] = useState({ fetching: false, fetched: false, valid: false, value: 0 })

    const getAnualRate = () => Movement.interestRate ?? 0

    const wasEdited = Movement.updatedById !== null
    const editedByCurrentUser = Movement.updatedById + "" === userId()

    const editor = users.find(user => user?.id === Movement?.updatedById)
    const editedInterestRate = Movement.newInterestRate !== 0 && Movement.newInterestRate !== null && Movement.newInterestRate !== getAnualRate()
    const editedDuration = Movement.newDuration !== 0 && Movement.newDuration !== null && Movement.newDuration !== Movement.duration

    const ellapsedDays = () => {
        switch (Movement.stateId) {
            case 1://pending
                return 0
            case 2://Approved
                if (Movement.closed) {
                    if (closedAtTheEnd()) {
                        return editedDuration ? Movement.newDuration : Movement?.duration
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
                    interestRate: editedInterestRate ? Movement.newInterestRate : getAnualRate()
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
                    duration: editedDuration ? Movement.newDuration : Movement?.duration,
                    initialAmount: Movement?.initialAmount,
                    interestRate: editedInterestRate ? Movement.newInterestRate : getAnualRate()
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

    const calculateProfitAtTheEndEdited = (signal) => {
        if (Movement.initialAmount) {
            axios.post(`/fixed-deposits/profit`,
                {
                    duration: editedDuration ? Movement.newDuration : Movement?.duration,
                    initialAmount: Movement?.initialAmount,
                    interestRate: editedInterestRate ? Movement.newInterestRate : getAnualRate()
                }, { signal: signal }).then(function (response) {
                    if (response.status < 300 && response.status >= 200) {
                        setProfitEditedAtTheEnd((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: response.data || Movement.initialAmount } }))
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
                        setProfitEditedAtTheEnd((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: Movement.initialAmount } }))
                    }
                });
        }
    }

    const userInfoById = (clientId) => {
        let indexClientTransaction = UsersInfo?.value?.findIndex((client) => client.id === clientId)
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
        if (validState(["Pending", "Ongoing", "Denied", "Closed (Out of term)"]) && wasEdited) calculateProfitAtTheEndEdited(signal)
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
                    <span className="h5 mb-0 me-1 me-md-2">{t("Time deposit")}&nbsp;#{Movement.id} {!!(wasEdited) && <>({t("Preferential *")})</>}</span>
                    <div className='px-1 px-md-2' style={{ borderLeft: "1px solid lightgray", borderRight: "1px solid lightgray" }}>
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
                        !!(wasEdited) &&
                        <div className='px-1 px-md-2' style={{ borderLeft: "1px solid lightgray", borderRight: "1px solid lightgray" }}>
                            <span className="d-none d-md-inline">{t("Edited by")}:&nbsp;</span>
                            {
                                editor === undefined ?
                                    <Spinner animation="border" size="sm" />
                                    :
                                    editor.email ?
                                        <strong>{editor.email}</strong>
                                        :
                                        t("Undefined Admin")
                            }
                        </div>
                    }

                    <div className='me-auto'></div>
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
                                <FontAwesomeIcon className="icon" icon={faEdit} onClick={() => { setShowEditModal(true) }} />
                            </div>
                            {
                                !!(!wasEdited || (wasEdited && !editedByCurrentUser)) &&
                                <>
                                    <div className="iconContainer green me-1">
                                        <FontAwesomeIcon className="icon" icon={faCheckCircle} onClick={() => { launchModalConfirmation("approve") }} />
                                    </div>
                                    <div className="iconContainer red me-1">
                                        <FontAwesomeIcon className="icon" icon={faTimesCircle} onClick={() => { launchModalConfirmation("deny") }} />
                                    </div>
                                </>
                            }
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

                        wasEdited ?
                        <div className='d-flex' >
                            <span className='me-2 pe-2' style={{ borderRight: "1px solid lightgray" }}>{t("Investment at maturity date")}:&nbsp;<strong>{t("Edited")}&nbsp;</strong>
                                {ProfitEditedAtTheEnd.fetching ?
                                    <Spinner animation="border" size="sm" />
                                    :
                                    <FormattedNumber value={ProfitEditedAtTheEnd.value} prefix="$" fixedDecimals={2} />}
                            </span>
                            <span ><strong>{t("Original")}:&nbsp;</strong>
                                {ProfitAtTheEnd.fetching ?
                                    <Spinner animation="border" size="sm" />
                                    :
                                    <FormattedNumber value={ProfitAtTheEnd.value} prefix="$" fixedDecimals={2} />}
                            </span>
                        </div >
                        :
                        <div className='d-flex justify-content-between' >
                            <span >{t("Investment at maturity date")}:&nbsp;
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
                <div className='d-flex' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
                    {
                        !!(wasEdited && editedDuration) ?
                            <>
                                <span className='me-2 pe-2' style={{ borderRight: "1px solid lightgray" }} >{t("Duration")}: <strong>{t("Edited")}&nbsp;</strong>
                                    {Movement.newDuration}&nbsp;{t("days")}
                                </span>
                                <span><strong>{t("Original")}:&nbsp;</strong>
                                    {Movement.duration}&nbsp;{t("days")}
                                </span>
                            </>
                            :
                            <span >{t("Duration")}:&nbsp;
                                {Movement.duration}&nbsp;{t("days")}
                            </span>
                    }
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
                <div className='d-flex'>
                    {
                        !!(wasEdited && editedInterestRate) ?

                            <>
                                <span className='me-2 pe-2' style={{ borderRight: "1px solid lightgray" }} >{t("Anual rate")}:&nbsp;<strong>{t("Edited")}&nbsp;</strong>
                                    <FormattedNumber value={Movement.newInterestRate} suffix="%" fixedDecimals={2} />
                                </span>
                                <span ><strong>{t("Original")}:&nbsp;</strong>
                                    <FormattedNumber value={getAnualRate()} suffix="%" fixedDecimals={2} />
                                </span>
                            </>
                            :
                            <span >{t("Anual rate")}:&nbsp;
                                <FormattedNumber value={getAnualRate()} suffix="%" fixedDecimals={2} />
                            </span>
                    }


                </div >



            </div >
            {
                Movement.stateId === 1 || (Movement.stateId === 2 && !Movement.closed) ?
                    <ActionConfirmationModal reloadData={reloadData} movement={Movement} setShowModal={setShowModal} action={Action} show={ShowModal} />
                    :
                    null
            }
            {
                Movement.stateId === 1 ?
                    <EditModal reloadData={reloadData} movement={Movement} setShowModal={setShowEditModal} show={ShowEditModal} />
                    :
                    null
            }
        </>
    )
}
export default FixedDepositRow

