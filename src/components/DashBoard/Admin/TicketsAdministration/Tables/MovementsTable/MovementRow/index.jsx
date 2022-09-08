import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { Badge, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import ActionConfirmationModal from './ActionConfirmationModal'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const MovementRow = ({ AccountInfo, UsersInfo, Movement, state, reloadData, couldLiquidate }) => {

    const { t } = useTranslation();

    var momentDate = moment(Movement.createdAt);

    const [ShowModal, setShowModal] = useState(false)
    const [Action, setAction] = useState("approve")

    const [ClientAccountInfo, SetClientAccountInfo] = useState({ fetching: true, valid: false, value: {} })

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
                return {
                    bg: "success",
                    text: "Approved"
                }
            case 3://Denied
                return {
                    bg: "danger",
                    text: "Denied"
                }
            case 4://Liquidated
                return {
                    bg: "primary",
                    text: "Liquidated"
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
                SetClientAccountInfo((prevState) => ({
                    ...prevState,
                    valid: true,
                    fetching: false,
                    value: UsersInfo.value[indexClientTransaction]
                }))
            } else {
                SetClientAccountInfo((prevState) => ({
                    ...prevState,
                    valid: false,
                    fetching: false,
                }))
            }
        }

        const accountInfoById = (accountId) => {
            let indexAccountTransaction = AccountInfo.value.findIndex((account) => account.id === accountId)
            if (indexAccountTransaction >= 0) {
                userInfoById(AccountInfo.value[indexAccountTransaction].clientId)
            } else {
                SetClientAccountInfo((prevState) => ({
                    ...prevState,
                    valid: false,
                    fetching: false,
                }))
            }

        }

        if (!AccountInfo.fetching && !UsersInfo.fetching) {
            accountInfoById(Movement.accountId)
        }
        //eslint-disable-next-line
    }, [Movement, state, AccountInfo, UsersInfo])

    return (
        <>
            <div className='mobileMovement'>
                <div className='d-flex py-1 align-items-center' >
                    <span className="h5 mb-0 me-1 me-md-2">{t("Movement")}&nbsp;#{Movement.id}</span>
                    <div className='me-auto px-1 px-md-2' style={{ borderLeft: "1px solid lightgray", borderRight: "1px solid lightgray" }}>
                        <span className="d-none d-md-inline">{t("Client")}:&nbsp;</span>
                        {
                            ClientAccountInfo.fetching ?
                                <Spinner animation="border" size="sm" />
                                :
                                ClientAccountInfo.valid ?
                                    ClientAccountInfo.value.alias
                                    :
                                    t("Undefined Client")
                        }
                    </div>
                    {
                        !!((Movement.stateId === 1 && Movement.motive !== "FIXED_DEPOSIT_CREATE") || couldLiquidate(Movement)) &&
                        <div className="h-100 d-flex align-items-center justify-content-around Actions">
                            {couldLiquidate(Movement) ?
                                <div className="iconContainer green me-1">
                                    <FontAwesomeIcon className="icon" icon={faCheckCircle} onClick={() => { launchModalConfirmation("liquidate") }} />
                                </div>
                                :
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

                <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
                    <span >
                        {t("Concept")}:&nbsp;
                        {t(Movement.motive + (Movement.motive === "REPAYMENT" ? Movement.fundName ? "_" + Movement.fundName : "_" + Movement.fixedDepositId : ""), { fund: Movement.fundName, fixedDeposit: Movement.fixedDepositId })}
                    </span>
                </div >

                <div className='d-flex justify-content-between' style={{ borderBottom: "1px solid 1px solid rgb(240,240,240)" }}>
                    <span >
                        {t("Amount")}:&nbsp;
                        <FormattedNumber value={Movement.amount} prefix="$" fixedDecimals={2} />
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
                !!(Movement.stateId === 1 || couldLiquidate(Movement)) &&
                <ActionConfirmationModal reloadData={reloadData} movement={Movement} setShowModal={setShowModal} action={Action} show={ShowModal} />
            }
        </>
    )
}
export default MovementRow

