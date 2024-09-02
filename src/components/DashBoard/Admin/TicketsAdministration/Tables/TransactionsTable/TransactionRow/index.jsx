import React, { useState, useEffect, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { Badge, OverlayTrigger, Spinner, Tooltip } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

import moment from 'moment';
import ActionConfirmationModal from './ActionConfirmationModal'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import Decimal from 'decimal.js';
import { faCircleInfo, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Notes from '../../Notes';
import { DashBoardContext } from 'context/DashBoardContext';
import { useDispatch, useSelector } from 'react-redux';
import { fetchusers, selectAllusers } from 'Slices/DashboardUtilities/usersSlice';
import { selectUserEmail, selectUserId } from 'Slices/DashboardUtilities/userSlice';
import { selectFundById } from 'Slices/DashboardUtilities/fundsSlice';

const TransactionRow = ({ UsersInfo, FundInfo, Transaction, state, reloadData }) => {
    const { t } = useTranslation();
    const { sharesDecimalPlaces } = useContext(DashBoardContext)

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

    const [showClick, setShowClick] = useState(false)
    const [showHover, setShowHover] = useState(false)


    const transferNote = Transaction?.notes?.find(note => note.noteType === "TRANSFER_MOTIVE")
    const clientNote = Transaction?.notes?.find(note => note.noteType === "CLIENT_NOTE")
    const denialMotive = Transaction?.notes?.find(note => note.noteType === "DENIAL_MOTIVE")
    const adminNote = Transaction?.notes?.find(note => note.noteType === "ADMIN_NOTE")
    const isTransfer = Transaction.receiverId || Transaction.senderId

    const userEmail = useSelector(selectUserEmail)
    const userId = useSelector(selectUserId)
    const fund = useSelector(state => selectFundById(state, Transaction.fundId))

    return (
        <>
            <div className='mobileMovement'>
                <div className='d-flex py-1 align-items-center flex-wrap' >
                    <span className="h5 mb-0 me-1 me-md-2">{t("Transaction")}&nbsp;#{Transaction.id}</span>
                    <div className='me-auto px-1 px-md-2' style={{ borderLeft: "1px solid lightgray", borderRight: "1px solid lightgray" }}>
                        {
                            UserTicketInfo.value.alias &&
                            <>
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
                            </>
                        }
                        <ApprovedByUsers approvedBy={Transaction?.approvedBy} />
                    </div>
                    {
                        !!(Transaction.stateId === 1) &&
                        <div className={`h-100 d-flex align-items-center justify-content-around Actions ${fund?.disabled ? "disabled" : ""}`}>
                            <div className={`iconContainer green me-1 ${(userId ? (userId === Transaction.userId) : (userEmail ? (userEmail !== Transaction?.userEmail) : false)) ? "disabled" : ""}`}>
                                <FontAwesomeIcon className="icon" icon={faCheckCircle} onClick={() => { launchModalConfirmation("approve") }} />
                            </div>
                            <div className="iconContainer red me-1">
                                <FontAwesomeIcon className="icon" icon={faTimesCircle} onClick={() => { launchModalConfirmation("deny") }} />
                            </div>
                        </div>
                    }
                    {
                        !!(Transaction.stateId === 2 && !Transaction.reverted && moment().diff(moment(Transaction.createdAt), 'days') < 30) &&
                        <div className="h-100 d-flex align-items-center justify-content-around Actions">
                            <div className="iconContainer red me-1">
                                <FontAwesomeIcon className="icon" icon={faTimesCircle} onClick={() => { launchModalConfirmation("revert") }} />
                            </div>

                        </div>
                    }
                    {
                        (Transaction.reverted && transferNote?.text !== "Transferencia revertida") &&
                        <Badge className='ms-1 ms-md-2' bg="danger">{t("Reverted")}</Badge>
                    }
                    {
                        (Transaction.reverted && transferNote?.text === "Transferencia revertida") &&
                        <Badge className='ms-1 ms-md-2' bg="info">{t("Reversion")}</Badge>
                    }
                    <Badge className='ms-1 ms-md-2' bg={status()?.bg}>{t(status().text)}</Badge>
                    {fund?.disabled && <Badge bg="danger" className='ms-2'>{t("Fund disabled")}</Badge>}
                    {
                        !!(Transaction?.userEmail || Transaction?.userName) &&
                        <div>
                            <OverlayTrigger
                                show={showClick || showHover}
                                placement="auto"
                                delay={{ show: 250, hide: 400 }}
                                popperConfig={{
                                    modifiers: [
                                        {
                                            name: 'offset',
                                            options: {
                                                offset: [0, 0],
                                            },
                                        },
                                    ],
                                }}
                                overlay={
                                    <Tooltip className="mailTooltip" id="more-units-tooltip">
                                        {!!(Transaction.userEmail || Transaction?.userName) &&
                                            <div>
                                                {t('Operation performed by')}:<br />
                                                <span className="text-nowrap">{Transaction?.userName || Transaction?.userEmail}</span>
                                            </div>
                                        }
                                    </Tooltip>
                                }
                            >
                                <span>
                                    <button
                                        onBlur={() => setShowClick(false)}
                                        onClick={() => setShowClick(prevState => !prevState)}
                                        onMouseEnter={() => setShowHover(true)}
                                        onMouseLeave={() => setShowHover(false)}
                                        type="button" className="noStyle"  ><FontAwesomeIcon icon={faInfoCircle} /></button>
                                </span>
                            </OverlayTrigger>
                        </div>
                    }
                </div >

                <div className='w-100 d-flex' style={{ borderBottom: "1px solid lightgray" }} />

                <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
                    <span >
                        {t("Concept")}:&nbsp;
                        {
                            FundTicketInfo.fetching ?
                                <Spinner animation="border" size="sm" />
                                :
                                isTransfer ?
                                    t("Share transfer from {{senderAlias}} to {{receiverAlias}}",
                                        {
                                            senderAlias: Transaction.senderAlias,
                                            receiverAlias: Transaction.receiverAlias
                                        })
                                    :
                                    (t(Math.sign(Transaction.shares) === -1 ? "STAKE_SELL" : "STAKE_BUY",
                                        {
                                            fund: FundTicketInfo.valid ?
                                                FundTicketInfo.value.name
                                                :
                                                t("Undefined Fund")
                                        }
                                    ))
                        }
                    </span>
                </div >

                <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
                    <span >
                        {t("Shares")}:&nbsp;
                        <FormattedNumber value={Transaction.shares} fixedDecimals={sharesDecimalPlaces} />

                    </span>
                </div >



                <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
                    <span >
                        <span className="d-inline d-md-none">{t("Price")}</span>
                        <span className="d-none d-md-inline">{t("Share Price")}</span>:&nbsp;
                        <FormattedNumber value={Transaction.sharePrice} prefix="U$D " fixedDecimals={2} />
                    </span>
                </div >

                <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
                    <span >
                        {t("Amount")}:&nbsp;
                        <FormattedNumber prefix="U$D " value={amount} fixedDecimals={2} />

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
                <Notes transferNote={transferNote} clientNote={clientNote} denialMotive={denialMotive} adminNote={adminNote} />
            </div >
            {
                !!(Transaction.stateId === 1) || !!(Transaction.stateId === 2 && !Transaction.reverted && moment().diff(moment(Transaction.createdAt), 'days') < 30) ?
                    <ActionConfirmationModal reloadData={reloadData} transaction={Transaction} setShowModal={setShowModal} action={Action} show={ShowModal} />
                    :
                    null
            }
        </>
    )
}
export default TransactionRow


export const ApprovedByUsers = ({ approvedBy, label = "Approved by", aditionalLines = [] }) => {
    const { t } = useTranslation()
    const usersStatus = useSelector(state => state.users.status)
    const users = useSelector(selectAllusers)
    const dispatch = useDispatch()
    useEffect(() => {
        if (usersStatus === 'idle') {
            dispatch(fetchusers({ all: true }))
        }
    }, [dispatch, usersStatus])

    return (
        (approvedBy?.length > 0 || aditionalLines?.length > 0) &&
        <span style={{ display: "inline-flex" }}>
            &nbsp;
            <OverlayTrigger
                placement="auto"
                trigger={['hover', 'focus']}
                overlay={
                    <Tooltip className="approvedByTooltip" id="more-units-tooltip">
                        {
                            approvedBy.length > 0 &&
                            <>{t(label)}:&nbsp;
                                {approvedBy.length > 1 ? <br /> : <></>}
                                {
                                    approvedBy.map((user, index) => {
                                        const userFound = typeof user === 'number' ? users?.find(userFind => userFind.id === user) || "Nombre desconocido" : user
                                        return <React.Fragment key={index}>
                                            {
                                                typeof user === 'number' ? (userFound.firstName + " " + userFound.lastName) : user
                                            }
                                            <br />
                                        </React.Fragment>
                                    })
                                }
                            </>
                        }
                        {aditionalLines.map((line, index) => <React.Fragment key={index}>{line}<br /></React.Fragment>)}
                    </Tooltip>
                }
            >
                <button className="no-style btn" type="button" style={{ lineHeight: "1em" }}>
                    <FontAwesomeIcon icon={faCircleInfo} />
                </button>
            </OverlayTrigger>
        </span>
    )
}
