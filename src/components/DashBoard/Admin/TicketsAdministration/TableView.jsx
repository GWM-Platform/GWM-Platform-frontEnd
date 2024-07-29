import React, { useContext, useEffect, useMemo, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Table } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMovements, selectAllMovements } from 'Slices/DashboardUtilities/movementsSlice';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { DashBoardContext } from 'context/DashBoardContext';
import moment from 'moment';
import NoMovements from 'components/DashBoard/GeneralUse/NoMovements';
import Loading from 'components/DashBoard/GeneralUse/Loading';
import { unMaskNumber } from '.';

export const TableView = ({ state, client, FilterOptions }) => {

    const movementsStatus = useSelector(state => state.movements.status)
    const movements = useSelector(selectAllMovements)

    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchMovements({
            ...FilterOptions,
            state,
            client,
            ...FilterOptions.fromAmount ? { fromAmount: unMaskNumber({ value: FilterOptions.fromAmount }) } : {},
            ...FilterOptions.toAmount ? { toAmount: unMaskNumber({ value: FilterOptions.toAmount }) } : {},
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client, dispatch, state, FilterOptions])

    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const sortData = (field) => {
        if (sortField === field && sortDirection === 'desc') {
            setSortField(null);
            setSortDirection('asc');
        }
        else {
            let direction = 'asc';
            if (sortField === field && sortDirection === 'asc') {
                direction = 'desc';
            }
            setSortField(field);
            setSortDirection(direction);
        }
    };
    const { t } = useTranslation()
    const { getMoveStateById } = useContext(DashBoardContext)

    // multilevel sort
    const sortedMovements = useMemo(() => (
        [...movements?.movements || []].map(movement => {
            const transferNote = movement?.notes?.find(note => note.noteType === "TRANSFER_MOTIVE")
            const partialLiquidate = movement?.notes?.find(note => note.noteType === "PARTIAL_LIQUIDATE_MOTIVE")
            const fundLiquidate = movement?.notes?.find(note => note.noteType === "FUND_LIQUIDATE")
            return ({
                ...movement, concept:
                    `${(!movement?.transferReceiver && !movement?.transferSender)
                        ? (
                            fundLiquidate ?
                                `${t("Fund liquidation")} ${movement.fundName}`
                                :
                                t(movement.motive + (movement.motive === "REPAYMENT" ? movement.fundName ? "_FUND" : "_FIXED_DEPOSIT" : ""), { fund: movement.fundName, fixedDeposit: movement.fixedDepositId })
                        )
                        : ""
                    }${movement?.transferReceiver ? `${t("Transfer to {{transferReceiver}}", { transferReceiver: movement?.transferReceiver })}` : ""
                    }${movement?.transferSender ? `${t("Transfer from {{transferSender}}", { transferSender: movement?.transferSender })}` : ""
                    }${(movement?.transfer?.reverted && transferNote?.text === "Transferencia revertida") ? `, ${t("reversion")}` : ""
                    }${!!(partialLiquidate) ? ` (${t("Partial liquidation")})` : ""}`


            })
        })
            .sort((a, b) => {
                if (sortField) {
                    const aValue = (sortField === "approvedBy" ? a[sortField][0] : a[sortField]) || ""
                    const bValue = (sortField === "approvedBy" ? b[sortField][0] : b[sortField]) || ""
                    if (aValue === "") return bValue === "" ? 1 : (sortDirection === 'asc' ? 1 : -1)
                    if (bValue === "") return aValue === "" ? -1 : (sortDirection === 'asc' ? -1 : +1)
                    if (sortField === "createdAt") {
                        return sortDirection === 'asc' ? new Date(aValue) - new Date(bValue) : new Date(bValue) - new Date(aValue);
                    } if (sortField === "approvedBy") {
                        return sortDirection === 'asc' ? (aValue).localeCompare(bValue) : (bValue).localeCompare(aValue);
                    } else if (typeof aValue === 'string') {
                        return sortDirection === 'asc' ? (aValue).localeCompare(bValue) : (bValue).localeCompare(aValue);
                    } else {
                        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
                    }
                }
                return 0;
            })
    ), [movements?.movements, sortDirection, sortField, t])
    // sort multiples
    return (
        <Row id="table-container" className={`flex-grow-1 w-100 ${(movementsStatus === "loading" || sortedMovements.length === 0) ? "overflow-hidden" : ""}`} style={{ flexShrink: 1 }}>
            <Col xs="12" className="h-100">
                <div className={(movementsStatus === "loading" || sortedMovements.length === 0) ? "h-100" : ""} style={{ overflow: "auto" }}>
                    {
                        movementsStatus === "loading" ? <Loading className="h-100" /> :
                            (
                                (sortedMovements.length === 0) ?
                                    <NoMovements className="h-100" />
                                    :
                                    <Table id="unified-table" striped bordered hover className="mb-auto m-0 p-0" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
                                        <thead style={{ position: "sticky", top: 0, background: "white" }}>
                                            <tr>
                                                <th className="tableHeader" onClick={() => sortData('createdAt')} style={{ cursor: "pointer" }}>
                                                    <span className='d-flex'>
                                                        <span>
                                                            {t("Date")}
                                                        </span>
                                                        <FontAwesomeIcon className="ms-auto" icon={sortField === "createdAt" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                                    </span>
                                                </th>
                                                <th className="tableHeader" onClick={() => sortData('client')} style={{ cursor: "pointer" }}>
                                                    <span className='d-flex'>
                                                        <span>
                                                            {t("Client")}
                                                        </span>
                                                        <FontAwesomeIcon className="ms-auto" icon={sortField === "client" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                                    </span>
                                                </th>
                                                <th className="tableHeader" onClick={() => sortData('userName')} style={{ cursor: "pointer" }}>
                                                    <span className='d-flex'>
                                                        <span>
                                                            {t("User")}
                                                        </span>
                                                        <FontAwesomeIcon className="ms-auto" icon={sortField === "userName" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                                    </span>
                                                </th>
                                                <th className="tableHeader" onClick={() => sortData('stateId')} style={{ cursor: "pointer" }}>
                                                    <span className='d-flex'>
                                                        <span>
                                                            {t("Status")}
                                                        </span>
                                                        <FontAwesomeIcon className="ms-auto" icon={sortField === "stateId" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                                    </span>
                                                </th>
                                                <th className="tableHeader" onClick={() => sortData('approvedBy')} style={{ cursor: "pointer" }}>
                                                    <span className='d-flex'>
                                                        <span>
                                                            {t("Approved by")}
                                                        </span>
                                                        <FontAwesomeIcon className="ms-auto" icon={sortField === "approvedBy" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                                    </span>
                                                </th>
                                                <th className="tableHeader" onClick={() => sortData('fundName')} style={{ cursor: "pointer" }}>
                                                    <span className='d-flex'>
                                                        <span>
                                                            {t("Fund")}
                                                        </span>
                                                        <FontAwesomeIcon className="ms-auto" icon={sortField === "fundName" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                                    </span>
                                                </th>
                                                <th data-column-name="concept" className="tableHeader" onClick={() => sortData('concept')} style={{ cursor: "pointer" }}>
                                                    <span className='d-flex'>
                                                        <span>
                                                            {t("Concept")}
                                                        </span>
                                                        <FontAwesomeIcon className="ms-auto" icon={sortField === "concept" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                                    </span>
                                                </th>
                                                <th className="tableHeader" onClick={() => sortData('amount')} style={{ cursor: "pointer" }}>
                                                    <span className='d-flex'>
                                                        <span>
                                                            {t("Amount")}
                                                        </span>
                                                        <FontAwesomeIcon className="ms-auto" icon={sortField === "amount" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                                    </span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                sortedMovements?.map(movement => {
                                                    const transferNote = movement?.notes?.find(note => note.noteType === "TRANSFER_MOTIVE")
                                                    // const clientNote = movement?.notes?.find(note => note.noteType === "CLIENT_NOTE")
                                                    // const denialMotive = movement?.notes?.find(note => note.noteType === "DENIAL_MOTIVE")
                                                    // const adminNote = movement?.notes?.find(note => note.noteType === "ADMIN_NOTE")
                                                    // const partialLiquidate = movement?.notes?.find(note => note.noteType === "PARTIAL_LIQUIDATE_MOTIVE")
                                                    return (
                                                        <tr key={movement.id}>
                                                            <td className="tableDate">
                                                                {moment(movement.createdAt).format('L')}
                                                            </td>
                                                            <td className="tableDate">
                                                                {movement.client ? movement.client : "-"}
                                                            </td>
                                                            <td className="tableDate">
                                                                {movement.userName ? movement.userName : "-"}
                                                            </td>
                                                            <td className={`tableConcept ${movement.stateId === 3 ? 'text-red' : 'text-green'}`}>
                                                                {t(getMoveStateById(movement.stateId).name)}
                                                                {(movement?.transfer?.reverted && transferNote?.text !== "Transferencia revertida") ? <>, {t("reverted")}</> : ""}
                                                            </td>
                                                            <td className="tableDate">
                                                                {movement.approvedBy.length > 0 ? movement.approvedBy.join(", ") : "-"}
                                                            </td>
                                                            <td className="tableDate">
                                                                {movement.fundName ? movement.fundName : "-"}
                                                            </td>
                                                            <td data-column-name="concept" className="tableDate">
                                                                {movement.concept}
                                                            </td>
                                                            <td className="tableDate"><FormattedNumber value={movement.amount} prefix="U$D " fixedDecimals={2} /></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>
                                    </Table>
                            )
                    }
                </div>
            </Col>
        </Row>
    )
}