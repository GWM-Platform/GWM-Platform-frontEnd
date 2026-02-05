import React, { useEffect, useMemo, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Table } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import Decimal from 'decimal.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimesCircle, faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import Loading from 'components/DashBoard/GeneralUse/Loading';
import NoMovements from 'components/DashBoard/GeneralUse/NoMovements';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import PaginationController from 'components/DashBoard/GeneralUse/PaginationController';
import { customFetch } from 'utils/customFetch';
import ActionConfirmationModal from '../MovementsTable/MovementRow/ActionConfirmationModal';

const DoubleSignatureTable = () => {
    const { t } = useTranslation();
    const token = sessionStorage.getItem('access_token')

    const [tickets, setTickets] = useState({
        fetching: true,
        fetched: false,
        valid: false,
        values: [],
        total: 0
    })

    const [pagination, setPagination] = useState({
        skip: 0,
        take: 10
    })

    const fetchPendingDoubleCheck = async () => {
        setTickets((prevState) => ({
            ...prevState,
            fetching: true,
            fetched: false,
            valid: false
        }))

        const url = `${process.env.REACT_APP_APIURL}/tickets-administration/double-check?` + new URLSearchParams({
            skip: pagination.skip,
            take: pagination.take
        })

        try {
            const response = await customFetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                const data = await response.json()
                setTickets({
                    fetching: false,
                    fetched: true,
                    valid: true,
                    values: data.tickets || [],
                    total: data.total || 0
                })
            } else {
                setTickets((prevState) => ({
                    ...prevState,
                    fetching: false,
                    fetched: true,
                    valid: false
                }))
            }
        } catch (error) {
            console.error(error)
            setTickets((prevState) => ({
                ...prevState,
                fetching: false,
                fetched: true,
                valid: false
            }))
        }
    }

    useEffect(() => {
        fetchPendingDoubleCheck()
        // eslint-disable-next-line
    }, [pagination.skip, pagination.take])

    const getMotiveLabel = (ticket) => {
        if (!ticket?.motive) return "-"
        return t(ticket.motive, {
            fund: ticket.fundName,
            fixedDeposit: ticket.fixedDepositId
        })
    }

    const rows = useMemo(() => {
        return (tickets.values || []).map((ticket) => {
            const amount = ticket.amount ? new Decimal(ticket.amount).abs() : null
            const client =
                ticket.clientAlias ||
                ticket.senderAlias ||
                ticket.receiverAlias ||
                "-"
            const type = getMotiveLabel(ticket)
            const createdAt = ticket.createdAt ? moment(ticket.createdAt).format('L') : "-"

            return {
                ...ticket,
                amount,
                client,
                type,
                createdAt
            }
        })
    }, [tickets.values, t])

    return (
        <Col xs="12" className="mt-2">
            {
                tickets.fetching ? (
                    <Loading movements={pagination.take} />
                ) : !tickets.valid ? (
                    <div className="w-100 text-center text-danger my-4">{t("couldn't fetch tickets, try again later")}</div>
                ) : rows.length === 0 ? (
                    <NoMovements movements={pagination.take} />
                ) : (
                    <>
                        <div style={{ overflowX: "auto" }}>
                            <Table striped bordered hover className="TicketsTable">
                                <thead>
                                    <tr>
                                        <th className="Type">{t("Type")}</th>
                                        <th className="id">{t("Ticket #")}</th>
                                        <th className="Name">{t("Client")}</th>
                                        <th className="Shares">{t("Amount")}</th>
                                        <th>{t("Date")}</th>
                                        <th className="Actions">{t("Actions")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        rows.map((row) => (
                                            <DoubleSignatureRow key={row.id} row={row} reloadData={fetchPendingDoubleCheck} />
                                        ))
                                    }
                                </tbody>
                            </Table>
                        </div>
                        <PaginationController PaginationData={pagination} setPaginationData={setPagination} total={tickets.total} />
                    </>
                )
            }
        </Col>
    )
}

const DoubleSignatureRow = ({ row, reloadData }) => {
    const { t } = useTranslation()
    const [showApproveModal, setShowApproveModal] = useState(false)
    const [showDenyModal, setShowDenyModal] = useState(false)

    return (
        <>
            <tr>
                <td className="Type">{row.type}</td>
                <td className="id">{row.id}</td>
                <td className="Name">{row.client}</td>
                <td className="Shares">
                    {
                        row.amount !== null && row.amount !== undefined ?
                            <FormattedNumber value={row.amount} prefix="U$D " fixedDecimals={2} />
                            :
                            "-"
                    }
                </td>
                <td>{row.createdAt}</td>
                <td className="Actions">
                    <div className="d-flex">
                        <div className="iconContainer green">
                            <button className="noStyle" type="button" onClick={() => setShowApproveModal(true)} title={t("Approve")} aria-label={t("Approve")}>
                                <FontAwesomeIcon className="icon" icon={faCheckCircle} />
                            </button>
                        </div>
                        <div className="iconContainer red ms-2">
                            <button className="noStyle" type="button" onClick={() => setShowDenyModal(true)} title={t("Deny")} aria-label={t("Deny")}>
                                <FontAwesomeIcon className="icon" icon={faTimesCircle} />
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
            <ActionConfirmationModal
                movement={{ id: row.id, amount: row.amount }}
                setShowModal={setShowApproveModal}
                action="approve"
                show={showApproveModal}
                reloadData={reloadData}
            />
            <ActionConfirmationModal
                movement={{ id: row.id, amount: row.amount }}
                setShowModal={setShowDenyModal}
                action="deny"
                show={showDenyModal}
                reloadData={reloadData}
            />
        </>
    )
}

export default DoubleSignatureTable
