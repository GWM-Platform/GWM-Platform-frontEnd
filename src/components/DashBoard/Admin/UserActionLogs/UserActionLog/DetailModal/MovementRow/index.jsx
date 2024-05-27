import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Badge, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { ApprovedByUsers } from 'components/DashBoard/Admin/TicketsAdministration/Tables/TransactionsTable/TransactionRow';

const MovementRow = ({ Accounts, Clients, Movement }) => {

    const { t } = useTranslation();

    var momentDate = moment(Movement.createdAt);

    const [ClientAccountInfo, SetClientAccountInfo] = useState({ fetching: true, valid: false, value: {} })

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
            let indexClientTransaction = Clients.findIndex((client) => client.id === clientId)
            if (indexClientTransaction >= 0) {
                SetClientAccountInfo((prevState) => ({
                    ...prevState,
                    valid: true,
                    fetching: false,
                    value: Clients[indexClientTransaction]
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
            let indexAccountTransaction = Accounts.findIndex((account) => account.id === accountId)
            if (indexAccountTransaction >= 0) {
                userInfoById(Accounts[indexAccountTransaction].clientId)
            } else {
                SetClientAccountInfo((prevState) => ({
                    ...prevState,
                    valid: false,
                    fetching: false,
                }))
            }

        }

        accountInfoById(Movement.accountId)

        //eslint-disable-next-line
    }, [Movement, Accounts, Clients])


    return (
        <>
            <div className='mobileMovement'>
                <div className='d-flex py-1 align-items-center flex-wrap' >
                    <span className="h5 mb-0 me-1 me-md-2">
                        {t("Movement")}&nbsp;#{Movement.id}
                    </span>
                    <div className='px-1 px-md-1' style={{ borderLeft: "1px solid lightgray", borderRight: "1px solid lightgray" }}>
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
                    <ApprovedByUsers approvedBy={Movement.approvedBy} aditionalLines={[...!!(Movement?.userName || Movement?.userEmail) ? [`${t('Performed by')}: ${Movement?.userName || Movement?.userEmail}`] : []]} />
                    <Badge className='ms-auto' bg={status()?.bg}>{t(status().text)}</Badge>
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
                        <FormattedNumber value={Movement.amount} prefix="U$D " fixedDecimals={2} />
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
        </>
    )
}
export default MovementRow

