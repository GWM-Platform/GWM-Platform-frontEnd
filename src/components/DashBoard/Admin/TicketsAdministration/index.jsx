import React, { useEffect, useMemo, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, ButtonGroup, Col, Form, Row, ToggleButton } from 'react-bootstrap'
import StateSelector from './StateSelector'
import Message from './Message'
import Tables from './Tables'
import './index.css'
import ClientSelector from './ClientSelector';
import { useTranslation } from 'react-i18next';
import TableIcon from '../APL/icons/TableIcon';
import GridIcon from '../APL/icons/GridIcon';
import { TableView } from './TableView';
import { PrintButton, PrintDefaultWrapper, usePrintDefaults } from 'utils/usePrint';
import SingleSelectById from './SingleSelectById';
import CurrencyInput from '@osdiab/react-currency-input-field';
import { faFileExcel } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { exportToExcel } from 'utils/exportToExcel';
import { faCompress, faExpand } from '@fortawesome/free-solid-svg-icons';

const TicketsAdministration = () => {

    const messageVariants = [
        {
            message: "loading",
            needSpinner: true
        }, {
            message: "couldn't fetch states, try again later",
            needSpinner: false
        }, {
            message: "there are no states, ask for the administrator to create them",
            needSpinner: false
        }, {
            message: "couldn't fetch sell/purchase tickets, try again later",
            needSpinner: false
        }, {
            message: "There are no sell/purchase tickets in the state selected",
            needSpinner: false
        }
        , {
            message: "couldn't fetch account movements tickets, try again later",
            needSpinner: false
        }, {
            message: "There are no account movements tickets in the state selected",
            needSpinner: false
        }
    ]

    const [TransactionStates, setTransactionStates] = useState({
        selected: "",
        fetching: true,
        fetched: false,
        values: []
    })

    useEffect(() => {
        const token = sessionStorage.getItem('access_token')

        const transactionsStates = async () => {
            var url = `${process.env.REACT_APP_APIURL}/states`;
            setTransactionStates({
                ...TransactionStates,
                ...{
                    selected: 0,
                    fetching: true,
                    fetched: false,
                    valid: false,
                    values: []
                }
            })
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                const data = await response.json()
                setTransactionStates({
                    ...TransactionStates,
                    ...{
                        selected: data[0].id,
                        fetching: false,
                        fetched: true,
                        valid: true,
                        values: [...data, { id: 99, name: "Reverted transfers" }]
                    }
                })
            } else {
                setTransactionStates({
                    ...TransactionStates,
                    ...{
                        fetching: false,
                        fetched: true,
                        valid: false,
                    }
                })
                switch (response.status) {
                    case 500:
                        break;
                    default:
                        console.error(response.status)
                }
            }
        }
        transactionsStates()
        // eslint-disable-next-line
    }, [])

    const handleChange = (event) => {
        setTransactionStates({
            ...TransactionStates,
            ...{
                selected: event.target.value,
            }
        })
    }
    const { t } = useTranslation();

    const [client, setClient] = useState("")
    const [tableView, setTableView] = useState(false)
    const [collapse, setCollapse] = useState(false)

    const { handlePrint, getPageMargins, componentRef, title, aditionalStyles } = usePrintDefaults(
        {
            aditionalStyles: `@media print { 
                .historyContent{ padding: 0!important; page-break-before: avoid; }
                .filters, #table-container{ page-break-inside: avoid; page-break-before: avoid; margin-top: 1rem; }
                .movementsMainCardAccount{ overflow: visible!important; }
                .tabs-container,.hideInfoButton, .accordion, button, td[data-column-name="actions"], th[data-column-name="actions"],td[data-column-name="ticket"], th[data-column-name="ticket"],#filters,.btn-group,*[data-icon="sort"]{ display: none!important; }
                td, td * , th , th * {
                    font-size: 12px;
                    width: auto;
                }
                td, th{
                    padding: .25rem .25rem!important;
                }

                .tableDescription {
                    text-wrap: normal
                }
                .tableConcept, .tableDate, .tableAmount, .tableDescription  {
                    width: auto;
                    max-width: unset
                }
                .printContainer {
                    max-width: unset!important
                }
                #table-container,section-row,.printContainer div{
                    height: auto!important;
                    width: 100%;
                    overflow: visible!important;
                }
                * [data-column-name="concept"]{
                    max-width: 20ch;
                    white-space: balance;
                }
                table {
                    width: 100%
                }
            }
            `,
            title: `Tickets`,
            bodyClass: "ProveedoresObra"
        }
    )


    const FilterOptionsDefaultState = {
        fromDate: "",
        toDate: "",
        filterMotive: "",
        fromAmount: "",
        toAmount: ""
    }

    const [FilterOptions, setFilterOptions] = useState(FilterOptionsDefaultState)
    const handleChangeFilterOptions = (e) => (setFilterOptions(prevState => ({ ...prevState, [e.target.id]: e.target.value })))
    const options = useMemo(() => [
        { value: 'DEPOSIT', label: t('DEPOSIT') },
        { value: 'WITHDRAWAL', label: t('WITHDRAWAL') },
        { value: 'STAKE_BUY', label: t('STAKE_BUY_') },
        { value: 'STAKE_SELL', label: t('STAKE_SELL_') },
        { value: 'REPAYMENT', label: t('REPAYMENT') },
        { value: 'FIXED_DEPOSIT_CREATE', label: t('FIXED_DEPOSIT_CREATE_') },
        { value: 'FIXED_DEPOSIT_CLOSE', label: t('FIXED_DEPOSIT_CLOSE_') },
        { value: 'TRANSFER_SEND', label: t('TRANSFER_SEND') },
        { value: 'TRANSFER_RECEIVE', label: t('TRANSFER_RECEIVE') },
        { value: 'BID_OFFER', label: t('BID_OFFER_') },
        { value: 'SHARE_TRANSFER_SEND', label: t('SHARE_TRANSFER_SEND') },
        { value: 'SHARE_TRANSFER_RECEIVE', label: t('SHARE_TRANSFER_RECEIVE') },
        { value: 'PROFIT_DEPOSIT', label: t('PROFIT_DEPOSIT') },
        { value: 'PENALTY_WITHDRAWAL', label: t('PENALTY_WITHDRAWAL') }
    ], [t])

    return (
        <PrintDefaultWrapper className={`TicketsAdministration ${collapse ? "container" : "container-fluid"}`} aditionalStyles={aditionalStyles} ref={componentRef} getPageMargins={getPageMargins} title={title} >
            <Row id="section-row" className={`pb-2 ${tableView ? "flex-nowrap h-100 flex-column" : ""}`}>
                {
                    TransactionStates.fetching ?
                        <Message selected={0} messageVariants={messageVariants} />
                        :
                        !TransactionStates.valid ?
                            <Message selected={1} messageVariants={messageVariants} />
                            :
                            TransactionStates.values.length === 0 ?
                                <Message selected={2} messageVariants={messageVariants} />
                                :
                                <>
                                    <Row className="pb-2 px-0 mx-0">
                                        <Col xs="12">
                                            <div className="header d-flex align-items-center">
                                                <h1 className="title fw-normal me-auto">{t("Tickets administration")}</h1>
                                                {
                                                    tableView && <PrintButton className="me-2" variant="info" handlePrint={handlePrint} />
                                                }
                                                {
                                                    tableView &&
                                                    <Button className="me-2 print-button no-style" variant="info" onClick={() => exportToExcel(
                                                        {
                                                            filename: "Tickets",
                                                            sheetName: "Tickets",
                                                            dataTableName: "unified-tickets-table"
                                                            // excludedColumns: ["actions"],
                                                            // plainNumberColumns: ["unit_floor", "unit_unitNumber", "unit_typology"]
                                                        }
                                                    )} >
                                                        <FontAwesomeIcon icon={faFileExcel} />
                                                    </Button>
                                                }
                                                <ButtonGroup className='me-2'>
                                                    <ToggleButton
                                                        type="radio"
                                                        style={{ lineHeight: "1em", display: "flex" }}
                                                        variant="outline-primary"
                                                        name="radio"
                                                        value={true}
                                                        checked={collapse}
                                                        active={collapse}
                                                        onClick={(e) => setCollapse(true)}
                                                        title={t("Collapse")}
                                                    >
                                                        <FontAwesomeIcon color={collapse ? "#FFFFFF" : "#082044"} icon={faCompress} />
                                                    </ToggleButton>
                                                    <ToggleButton
                                                        style={{ lineHeight: "1em", display: "flex" }}
                                                        type="radio"
                                                        variant="outline-primary"
                                                        name="radio"
                                                        value={false}
                                                        checked={!collapse}
                                                        active={!collapse}
                                                        onClick={(e) => setCollapse(false)}
                                                        title={t("Expand")}
                                                    >
                                                        <FontAwesomeIcon color={collapse ? "#082044" : "#FFFFFF"} icon={faExpand} />
                                                    </ToggleButton>

                                                </ButtonGroup>
                                                <ButtonGroup>
                                                    <ToggleButton
                                                        style={{ lineHeight: "1em", display: "flex" }}
                                                        type="radio"
                                                        variant="outline-primary"
                                                        name="radio"
                                                        value={false}
                                                        checked={!tableView}
                                                        active={!tableView}
                                                        onClick={(e) => setTableView(false)}
                                                        title={t("Grid View")}
                                                    >
                                                        <GridIcon active={!tableView} style={{ height: "1em", width: "1em", display: "block" }} />
                                                    </ToggleButton>
                                                    <ToggleButton
                                                        type="radio"
                                                        style={{ lineHeight: "1em", display: "flex" }}
                                                        variant="outline-primary"
                                                        name="radio"
                                                        value={true}
                                                        checked={tableView}
                                                        active={tableView}
                                                        onClick={(e) => setTableView(true)}
                                                        title={t("Table View")}
                                                    >
                                                        <TableIcon active={tableView} style={{ height: "1em", width: "1em", display: "block" }} />
                                                    </ToggleButton>
                                                </ButtonGroup>

                                            </div>
                                        </Col>
                                    </Row>
                                    <Row className="pb-2 px-0 mx-0" id="filters">
                                        <Col md={tableView ? "4" : "6"}>
                                            <StateSelector handleChange={handleChange} TransactionStates={TransactionStates} />
                                        </Col>
                                        <Col md={tableView ? "4" : "6"}>
                                            <ClientSelector client={client} setClient={setClient} />
                                        </Col>
                                        {
                                            tableView &&
                                            <>
                                                <Col md="4">
                                                    <Form.Group className="mt-2 mb-2">
                                                        <Form.Label>{t("Concept")}</Form.Label>
                                                        <SingleSelectById isClearable placeholder={t('Concept')} handleChange={handleChangeFilterOptions} FormData={FilterOptions} id='filterMotive' options={options} />
                                                    </Form.Group>
                                                </Col>
                                                <Col md="3">
                                                    <Form.Group className="mb-2">
                                                        <Form.Label>{t("from_amount")}</Form.Label>
                                                        <CurrencyInput
                                                            name="currencyInput"
                                                            decimalsLimit={2}
                                                            decimalSeparator={decimalSeparator}
                                                            groupSeparator={groupSeparator}
                                                            onValueChange={(value, name, a) => { handleChangeFilterOptions({ target: { id: "fromAmount", value: value } }) }}
                                                            id="fromAmount"
                                                            placeholder={t('from_amount')}
                                                            className="form-control"
                                                            value={FilterOptions.fromAmount}
                                                        />
                                                    </Form.Group>
                                                </Col>

                                                <Col md="3">
                                                    <Form.Group className="mb-2">
                                                        <Form.Label>{t("to_amount")}</Form.Label>
                                                        <CurrencyInput
                                                            name="currencyInput"
                                                            decimalsLimit={2}
                                                            decimalSeparator={decimalSeparator}
                                                            groupSeparator={groupSeparator}
                                                            onValueChange={(value, name, a) => { handleChangeFilterOptions({ target: { id: "toAmount", value: value } }) }}
                                                            id="toAmount"
                                                            placeholder={t('to_amount')}
                                                            className="form-control"
                                                            value={FilterOptions.toAmount}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md="3">
                                                    <Form.Group className="mb-2">
                                                        <Form.Label>{t("from_date")}</Form.Label>
                                                        <Form.Control
                                                            placeholder={t('from_date')}
                                                            id="fromDate"
                                                            type="date"
                                                            required
                                                            value={FilterOptions.fromDate}
                                                            onChange={handleChangeFilterOptions}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col md="3">
                                                    <Form.Group className="mb-2">
                                                        <Form.Label>{t("to_date")}</Form.Label>
                                                        <Form.Control
                                                            placeholder={t('to_date')}
                                                            id="toDate"
                                                            type="date"
                                                            required
                                                            value={FilterOptions.toDate}
                                                            onChange={handleChangeFilterOptions}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </>
                                        }
                                    </Row>
                                    {
                                        tableView ?
                                            <TableView state={TransactionStates.selected} client={client.value} FilterOptions={FilterOptions} />
                                            :
                                            <Tables state={TransactionStates.selected} messageVariants={messageVariants} client={client} />
                                    }
                                </>
                }
            </Row>
        </PrintDefaultWrapper>
    )
}
export default TicketsAdministration


export const decimalSeparator = process.env.REACT_APP_DECIMALSEPARATOR ?? '.'
export const groupSeparator = process.env.REACT_APP_GROUPSEPARATOR ?? ','
export const unMaskNumber = ({
    decimalSymbol = decimalSeparator,
    thoushandSeparatorSymbol = groupSeparator,
    value = '',
    prefix = '$',
    suffix = '%'
}) => (value ? (value + "") : "").replaceAll(decimalSymbol, '.').replaceAll(' ', '').replaceAll(prefix, '').replaceAll(suffix, '')