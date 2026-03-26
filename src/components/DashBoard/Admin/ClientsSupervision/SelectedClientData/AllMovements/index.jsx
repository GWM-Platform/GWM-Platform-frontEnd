import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Accordion, Button, ButtonGroup, Col, Form, OverlayTrigger, Row, Table, ToggleButton, Tooltip } from 'react-bootstrap'
import Decimal from 'decimal.js';
import moment from 'moment';
import CurrencyInput from '@osdiab/react-currency-input-field';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';

import { DashBoardContext } from 'context/DashBoardContext';
import NoMovements from 'components/DashBoard/GeneralUse/NoMovements';
import Loading from 'components/DashBoard/GeneralUse/Loading';
import PaginationController from 'components/DashBoard/GeneralUse/PaginationController';
import { MotiveMultiSelect } from 'components/DashBoard/GeneralUse/FilterOptions';
import { StatesSelector } from 'components/DashBoard/Admin/TicketsAdministration/StateSelector';
import MovementsTable from 'components/DashBoard/Admin/TicketsAdministration/Tables/MovementsTable';
import { customFetch } from 'utils/customFetch';
import { decimalSeparator, groupSeparator, unMaskNumber } from 'components/DashBoard/Admin/TicketsAdministration';
import GridIcon from 'components/DashBoard/Admin/APL/icons/GridIcon';
import TableIcon from 'components/DashBoard/Admin/APL/icons/TableIcon';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const defaultFilters = {
    moves: 25,
    filterMotives: [],
    filterStates: [],
    fromAmount: "",
    toAmount: "",
    fromDate: "",
    toDate: "",
}

const AllMovements = ({ Client }) => {
    const { t } = useTranslation();
    const { toLogin, TransactionStates, getMoveStateById } = useContext(DashBoardContext)

    const [Movements, setMovements] = useState({
        fetching: true,
        fetched: false,
        valid: false,
        values: {
            movements: [],
            total: 0,
        }
    })
    const [AccountInfo, setAccountInfo] = useState({ fetching: true, value: [] })
    const UsersInfo = useMemo(() => ({ fetching: false, value: [Client] }), [Client])

    const [Pagination, setPagination] = useState({
        skip: 0,
        take: defaultFilters.moves,
        filterStates: [],
        filterMotives: [],
        fromAmount: "",
        toAmount: "",
        fromDate: "",
        toDate: "",
    })

    const [filterOptions, setFilterOptions] = useState(defaultFilters)
    const [tableView, setTableView] = useState(false)

    useEffect(() => {
        if (TransactionStates?.values?.length > 0) {
            const allStatesExceptDenied = TransactionStates.values.map(state => state.id).filter(id => id !== 3)
            setFilterOptions(prevState => ({ ...prevState, filterStates: allStatesExceptDenied }))
            setPagination(prevState => ({ ...prevState, filterStates: allStatesExceptDenied }))
        }
    }, [TransactionStates?.values])

    const getAccounts = useCallback(async () => {
        setAccountInfo({ fetching: true, value: [] })
        const token = sessionStorage.getItem('access_token')
        const url = `${process.env.REACT_APP_APIURL}/accounts/?` + new URLSearchParams({
            client: Client.id,
        });
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
            setAccountInfo({ fetching: false, value: data })
        } else {
            if (response.status === 401) toLogin()
            setAccountInfo({ fetching: false, value: [] })
        }
    }, [Client.id, toLogin])

    const getMovements = useCallback(async () => {
        setMovements(prevState => ({
            ...prevState,
            fetching: true,
            fetched: false,
            valid: false,
        }))

        const token = sessionStorage.getItem('access_token')
        const params = {
            take: Pagination.take,
            skip: Pagination.skip,
            filterMotives: Pagination.filterMotives?.length > 0 ? Pagination.filterMotives : null,
            filterStates: Pagination.filterStates?.length > 0 ? Pagination.filterStates : null,
            ...(Pagination.fromAmount ? { fromAmount: unMaskNumber({ value: Pagination.fromAmount }) } : {}),
            ...(Pagination.toAmount ? { toAmount: unMaskNumber({ value: Pagination.toAmount }) } : {}),
            ...(Pagination.fromDate ? { fromDate: moment(Pagination.fromDate).format(moment.HTML5_FMT.DATE) } : {}),
            ...(Pagination.toDate ? { toDate: moment(Pagination.toDate).add(1, "day").format(moment.HTML5_FMT.DATE) } : {}),
        }

        const query = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                if (value === null || value === undefined || value === "") return acc
                acc[key] = Array.isArray(value) ? value.join(',') : value
                return acc
            }, {})
        )

        const url = `${process.env.REACT_APP_APIURL}/clients/${Client.id}/movements?${query.toString()}`

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
            setMovements({
                fetching: false,
                fetched: true,
                valid: true,
                values: data
            })
        } else {
            if (response.status === 401) toLogin()
            setMovements({
                fetching: false,
                fetched: true,
                valid: false,
                values: {
                    movements: [],
                    total: 0,
                }
            })
        }
    }, [Client.id, Pagination, toLogin])

    useEffect(() => {
        getAccounts()
    }, [getAccounts])

    useEffect(() => {
        getMovements()
    }, [getMovements])

    const handleChange = (event) => {
        setFilterOptions(prevState => ({
            ...prevState,
            [event.target.id]: event.target.value
        }))
    }

    const updateFilters = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            setPagination(prevState => ({
                ...prevState,
                skip: 0,
                take: filterOptions.moves,
                filterMotives: filterOptions.filterMotives,
                filterStates: filterOptions.filterStates,
                fromAmount: filterOptions.fromAmount,
                toAmount: filterOptions.toAmount,
                fromDate: filterOptions.fromDate,
                toDate: filterOptions.toDate,
            }))
        }
    }

    const resetFilters = () => {
        const allStatesExceptDenied = TransactionStates.values.map(state => state.id).filter(id => id !== 3)
        const nextFilters = {
            ...defaultFilters,
            filterStates: allStatesExceptDenied,
        }
        setFilterOptions(nextFilters)
        setPagination(prevState => ({
            ...prevState,
            skip: 0,
            take: nextFilters.moves,
            filterMotives: nextFilters.filterMotives,
            filterStates: nextFilters.filterStates,
            fromAmount: nextFilters.fromAmount,
            toAmount: nextFilters.toAmount,
            fromDate: nextFilters.fromDate,
            toDate: nextFilters.toDate,
        }))
    }

    return (
        <Accordion.Item eventKey="3">
            <Accordion.Header>{t("All movements")}</Accordion.Header>
            <Accordion.Body>
                <Row className="mb-3">
                    <Col xs="12" className="d-flex align-items-center">
                        <h1 className="title fw-normal mb-0 me-auto">{t("All movements")}</h1>
                        <ButtonGroup>
                            <ToggleButton
                                style={{ lineHeight: "1em", display: "flex" }}
                                type="radio"
                                variant="outline-primary"
                                name="all-movements-view"
                                value={false}
                                checked={!tableView}
                                active={!tableView}
                                onClick={() => setTableView(false)}
                                title={t("Grid View")}
                            >
                                <GridIcon active={!tableView} style={{ height: "1em", width: "1em", display: "block" }} />
                            </ToggleButton>
                            <ToggleButton
                                type="radio"
                                style={{ lineHeight: "1em", display: "flex" }}
                                variant="outline-primary"
                                name="all-movements-view"
                                value={true}
                                checked={tableView}
                                active={tableView}
                                onClick={() => setTableView(true)}
                                title={t("Table View")}
                            >
                                <TableIcon active={tableView} style={{ height: "1em", width: "1em", display: "block" }} />
                            </ToggleButton>
                        </ButtonGroup>
                    </Col>
                </Row>
                <Form onSubmit={updateFilters}>
                    <Row className="align-items-end mb-3">
                        <Col md="3">
                            <Form.Group className="mb-2">
                                <Form.Label className="capitalizeFirstLetter">{t("movements per page")}</Form.Label>
                                <Form.Control
                                    required
                                    id="moves"
                                    type="number"
                                    min="1"
                                    value={filterOptions.moves}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md="4">
                            <StatesSelector
                                className="mb-2"
                                FormData={filterOptions}
                                handleChange={handleChange}
                                TransactionStates={TransactionStates}
                            />
                        </Col>
                        <Col md="5">
                            <Form.Group className="mb-2">
                                <MotiveMultiSelect handleChange={handleChange} FormData={filterOptions} />
                            </Form.Group>
                        </Col>
                        <Col md="3">
                            <Form.Group className="mb-2">
                                <Form.Label>{t("from_amount")}</Form.Label>
                                <CurrencyInput
                                    decimalsLimit={2}
                                    decimalSeparator={decimalSeparator}
                                    groupSeparator={groupSeparator}
                                    onValueChange={(value) => handleChange({ target: { id: "fromAmount", value: value || "" } })}
                                    id="fromAmount"
                                    placeholder={t('from_amount')}
                                    className="form-control"
                                    value={filterOptions.fromAmount}
                                />
                            </Form.Group>
                        </Col>
                        <Col md="3">
                            <Form.Group className="mb-2">
                                <Form.Label>{t("to_amount")}</Form.Label>
                                <CurrencyInput
                                    decimalsLimit={2}
                                    decimalSeparator={decimalSeparator}
                                    groupSeparator={groupSeparator}
                                    onValueChange={(value) => handleChange({ target: { id: "toAmount", value: value || "" } })}
                                    id="toAmount"
                                    placeholder={t('to_amount')}
                                    className="form-control"
                                    value={filterOptions.toAmount}
                                />
                            </Form.Group>
                        </Col>
                        <Col md="3">
                            <Form.Group className="mb-2">
                                <Form.Label>{t("from_date")}</Form.Label>
                                <Form.Control
                                    id="fromDate"
                                    type="date"
                                    value={filterOptions.fromDate}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col md="3">
                            <Form.Group className="mb-2">
                                <Form.Label>{t("to_date")}</Form.Label>
                                <Form.Control
                                    id="toDate"
                                    type="date"
                                    value={filterOptions.toDate}
                                    onChange={handleChange}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs="auto" className="ms-auto">
                            <Button type="button" variant="outline-secondary" onClick={resetFilters}>
                                {t("Cancel")}
                            </Button>
                        </Col>
                        <Col xs="auto">
                            <Button type="submit" disabled={filterOptions.moves < 1} variant="outline-secondary">
                                {t("Update")}
                            </Button>
                        </Col>
                    </Row>
                </Form>

                {
                    Movements.fetching || AccountInfo.fetching ?
                        <Loading movements={Decimal(Pagination.take).toNumber()} />
                        :
                        !Movements.valid ?
                            <NoMovements movements={Decimal(Pagination.take).toNumber()} />
                            :
                            Movements.values.total === 0 ?
                                <NoMovements movements={Decimal(Pagination.take).toNumber()} />
                                :
                                <>
                                    {
                                        tableView ?
                                            <AllMovementsTableView
                                                movements={Movements.values.movements}
                                                getMoveStateById={getMoveStateById}
                                            />
                                            :
                                            <MovementsTable
                                                AccountInfo={AccountInfo}
                                                UsersInfo={UsersInfo}
                                                movements={Movements.values.movements}
                                                state={null}
                                                reloadData={getMovements}
                                                take={Pagination.take}
                                            />
                                    }
                                    <PaginationController
                                        PaginationData={Pagination}
                                        setPaginationData={setPagination}
                                        total={Movements.values.total}
                                    />
                                </>
                }
            </Accordion.Body>
        </Accordion.Item>
    )
}

export default AllMovements

const AllMovementsTableView = ({ movements, getMoveStateById }) => {
    const { t } = useTranslation()
    const [sortField, setSortField] = useState(null)
    const [sortDirection, setSortDirection] = useState('asc')

    const sortData = (field) => {
        if (sortField === field && sortDirection === 'desc') {
            setSortField(null)
            setSortDirection('asc')
            return
        }

        const direction = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc'
        setSortField(field)
        setSortDirection(direction)
    }

    const sortedMovements = useMemo(() => (
        [...movements].map(movement => {
            const transferNote = movement?.notes?.find(note => note.noteType === "TRANSFER_MOTIVE")
            const partialLiquidate = movement?.notes?.find(note => note.noteType === "PARTIAL_LIQUIDATE_MOTIVE")
            const fundLiquidate = movement?.notes?.find(note => note.noteType === "FUND_LIQUIDATE")
            const isPerformanceMovement = movement.motive === "PENALTY_WITHDRAWAL" || movement.motive === "PROFIT_DEPOSIT"
            const noteFromAdmin = isPerformanceMovement && movement?.notes?.find(note => note.noteType === "CLIENT_NOTE")

            return {
                ...movement,
                client: movement.client || '-',
                isPerformanceMovement,
                concept:
                    `${(!movement?.transferReceiver && !movement?.transferSender)
                        ? (
                            fundLiquidate ?
                                `${t("Fund liquidation")} ${movement.fundName}`
                                :
                                isPerformanceMovement ? `${t(movement.motive)} (${noteFromAdmin ? `${noteFromAdmin?.text}, ` : ""}${t(movement.motive === "PENALTY_WITHDRAWAL" ? "penalty" : "bonification")})`
                                    :
                                    t(movement.motive + (movement.motive === "REPAYMENT" ? movement.fundName ? "_FUND" : "_FIXED_DEPOSIT" : ""), { fund: movement.fundName, fixedDeposit: movement.fixedDepositId })
                        )
                        : ""
                    }${movement?.transferReceiver ? `${t("Transfer to {{transferReceiver}}", { transferReceiver: movement?.transferReceiver })}` : ""
                    }${movement?.transferSender ? `${t("Transfer from {{transferSender}}", { transferSender: movement?.transferSender })}` : ""
                    }${(movement?.transfer?.reverted && transferNote?.text === "Transferencia revertida") ? `, ${t("reversion")}` : ""
                    }${!!partialLiquidate ? ` (${t("Partial liquidation")})` : ""}`
            }
        }).sort((a, b) => {
            if (!sortField) return 0

            const aValue = (sortField === "approvedBy" ? a[sortField]?.[0] : a[sortField]) || ""
            const bValue = (sortField === "approvedBy" ? b[sortField]?.[0] : b[sortField]) || ""

            if (aValue === "") return bValue === "" ? 1 : (sortDirection === 'asc' ? 1 : -1)
            if (bValue === "") return aValue === "" ? -1 : (sortDirection === 'asc' ? -1 : 1)
            if (sortField === "createdAt") {
                return sortDirection === 'asc' ? new Date(aValue) - new Date(bValue) : new Date(bValue) - new Date(aValue)
            }
            if (sortField === "approvedBy") {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
            }
            if (typeof aValue === 'string') {
                return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
            }
            return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
        })
    ), [movements, sortDirection, sortField, t])

    return (
        <div style={{ overflowX: "auto", overflowY: "hidden" }}>
            <Table data-table-name="client-all-movements-table" striped bordered hover className="mb-auto m-0 p-0" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
                <thead style={{ position: "sticky", top: 0, background: "white" }}>
                    <tr>
                        <SortableHeader field="createdAt" sortField={sortField} sortDirection={sortDirection} sortData={sortData} label={t("Date")} />
                        <SortableHeader field="client" sortField={sortField} sortDirection={sortDirection} sortData={sortData} label={t("Client")} />
                        <SortableHeader field="userName" sortField={sortField} sortDirection={sortDirection} sortData={sortData} label={t("User")} />
                        <SortableHeader field="stateId" sortField={sortField} sortDirection={sortDirection} sortData={sortData} label={t("Status")} />
                        <SortableHeader field="approvedBy" sortField={sortField} sortDirection={sortDirection} sortData={sortData} label={t("Approved by")} />
                        <SortableHeader field="fundName" sortField={sortField} sortDirection={sortDirection} sortData={sortData} label={t("Fund")} />
                        <SortableHeader field="concept" sortField={sortField} sortDirection={sortDirection} sortData={sortData} label={t("Concept")} columnName="concept" />
                        <SortableHeader field="amount" sortField={sortField} sortDirection={sortDirection} sortData={sortData} label={t("Amount")} />
                    </tr>
                </thead>
                <tbody>
                    {sortedMovements.map(movement => (
                        <AllMovementsTableRow
                            key={movement.id}
                            movement={movement}
                            getMoveStateById={getMoveStateById}
                        />
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

const SortableHeader = ({ field, sortField, sortDirection, sortData, label, columnName }) => (
    <th
        {...(columnName ? { 'data-column-name': columnName } : {})}
        className="tableHeader"
        onClick={() => sortData(field)}
        style={{ cursor: "pointer" }}
    >
        <span className='d-flex'>
            <span>{label}</span>
            <FontAwesomeIcon className="ms-auto" icon={sortField === field ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
        </span>
    </th>
)

const AllMovementsTableRow = ({ movement, getMoveStateById }) => {
    const { t } = useTranslation()
    const [showClick, setShowClick] = useState(false)
    const [showHover, setShowHover] = useState(false)

    const transferNote = movement?.notes?.find(note => note.noteType === "TRANSFER_MOTIVE")
    const clientNote = movement?.notes?.find(note => note.noteType === "CLIENT_NOTE")
    const denialMotive = movement?.notes?.find(note => note.noteType === "DENIAL_MOTIVE")
    const adminNote = movement?.notes?.find(note => note.noteType === "ADMIN_NOTE")
    const partialLiquidate = movement?.notes?.find(note => note.noteType === "PARTIAL_LIQUIDATE_MOTIVE")
    const fundLiquidate = movement?.notes?.find(note => note.noteType === "FUND_LIQUIDATE")
    const liquidateMotive = movement?.notes?.find(note => note.noteType === "MOVEMENT_LIQUIDATE_MOTIVE")

    return (
        <tr>
            <td className="tableDate">{moment(movement.createdAt).format('L')}</td>
            <td className="tableDate">{movement.client || "-"}</td>
            <td className="tableDate">{movement.userName || "-"}</td>
            <td className={`tableConcept ${movement.stateId === 3 ? 'text-red' : 'text-green'}`}>
                {t(getMoveStateById(movement.stateId).name)}
                {(movement?.transfer?.reverted && transferNote?.text !== "Transferencia revertida") ? <>, {t("reverted")}</> : ""}
            </td>
            <td className="tableDate">{movement?.approvedBy?.length > 0 ? movement.approvedBy.join(", ") : "-"}</td>
            <td className="tableDate">{movement.fundName || "-"}</td>
            <td data-column-name="concept" className="tableDate">
                {movement.concept}
                {!!(transferNote || clientNote || denialMotive || fundLiquidate || partialLiquidate || liquidateMotive) && (
                    <OverlayTrigger
                        show={showClick || showHover}
                        placement="right"
                        delay={{ show: 250, hide: 400 }}
                        popperConfig={{
                            modifiers: [{ name: 'offset', options: { offset: [0, 0] } }],
                        }}
                        overlay={
                            <Tooltip className="mailTooltip" id={`movement-info-${movement.id}`}>
                                {!!transferNote && <div>{t('Transfer note')}:<br /><span className="text-nowrap">"{transferNote?.text}"</span></div>}
                                {!!adminNote && <div>{t('Admin note')}:<br /><span className="text-nowrap">"{adminNote?.text}"</span></div>}
                                {!!clientNote && <div>{t(movement.isPerformanceMovement ? 'Client note' : 'Personal note')}:<br /><span className="text-nowrap">"{clientNote?.text}"</span></div>}
                                {!!denialMotive && <div>{t('Denial motive')}:<br /><span className="text-nowrap">"{denialMotive?.text}"</span></div>}
                                {!!partialLiquidate && <div><span className="text-nowrap">"{partialLiquidate.text}"</span></div>}
                                {!!fundLiquidate && <div><span className="text-nowrap">"{fundLiquidate.text}"</span></div>}
                                {!!liquidateMotive && <div><span className="text-nowrap">"{liquidateMotive.text}"</span></div>}
                            </Tooltip>
                        }
                    >
                        <span>
                            <button
                                onBlur={() => setShowClick(false)}
                                onClick={() => setShowClick(prevState => !prevState)}
                                onMouseEnter={() => setShowHover(true)}
                                onMouseLeave={() => setShowHover(false)}
                                type="button"
                                className="noStyle pe-0 ps-1 ms-1"
                            >
                                <FontAwesomeIcon fontSize="12px" color="gray" icon={faInfoCircle} />
                            </button>
                        </span>
                    </OverlayTrigger>
                )}
            </td>
            <td className="tableDate"><FormattedNumber value={movement.amount} prefix="U$D " fixedDecimals={2} /></td>
        </tr>
    )
}
