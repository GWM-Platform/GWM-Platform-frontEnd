import { faInfoCircle, faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import FormattedNumber from "components/DashBoard/GeneralUse/FormattedNumber";
import Decimal from "decimal.js";
import React, { useEffect, useMemo, useState } from "react";
import { ButtonGroup, Col, Collapse, OverlayTrigger, Row, Spinner, Table, ToggleButton, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const GeneralInfo = ({ fullSettlement, setFullSettlement, clients }) => {
    const { t } = useTranslation()

    const [showFundClick, setShowFundClick] = useState(false)
    const [showFundHover, setShowFundHover] = useState(false)
    const [Accounts, SetAccounts] = useState({ fetching: true, accounts: [] })

    useEffect(() => {
        const getDebt = () => {
            setFullSettlement((prevState) => ({ ...prevState, fetching: true }))

            axios.get(`/clients/APL`, {
                signal: signal,
            }).then(function (response) {
                setFullSettlement((prevState) => (
                    {
                        ...prevState,
                        fetching: false,
                        debt: response?.data || {},
                    }))
            }).catch((err) => {
                if (err.message !== "canceled") {
                    setFullSettlement((prevState) => (
                        {
                            ...prevState,
                            fetching: false,
                            debt: {},
                        }))
                }
            });
        };

        const controller = new AbortController();
        const signal = controller.signal;
        getDebt(signal)

        return () => {
            controller.abort();
        };
        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        const getAccounts = () => {
            SetAccounts((prevState) => ({ ...prevState, fetching: true }))

            axios.get(`/accounts`, {
                signal: signal,
                params: {
                    all: true
                }
            }).then(function (response) {
                SetAccounts((prevState) => (
                    {
                        ...prevState,
                        fetching: false,
                        accounts: response?.data || [],
                    }))
            }).catch((err) => {
                if (err.message !== "canceled") {
                    SetAccounts((prevState) => (
                        {
                            ...prevState,
                            fetching: false,
                            accounts: [],
                        }))
                }
            });
        };

        const controller = new AbortController();
        const signal = controller.signal;
        getAccounts(signal)

        return () => {
            controller.abort();
        };
        //eslint-disable-next-line
    }, [])

    const clientLoans = useMemo(() => (
        Accounts.accounts
            .filter(account => account.balance < 0)
            .reduce((previousValue, currentValue) => Decimal(previousValue).plus(Decimal(currentValue.balance).abs()), Decimal(0))
            .toFixed(2)
    ), [Accounts])

    const fundTotalDebt = () => {
        return Object.keys(fullSettlement.debt.transactions).map(transaction => fullSettlement?.debt?.transactions?.[transaction]?.amount).reduce(
            (acumulator, operation) =>
                acumulator + operation
            , 0)
    }

    const fixedDepositAtClose = () => {
        return (fullSettlement?.debt?.fixedDeposits?.graphicData?.reduce((acumulator, monthlyData) => Decimal(acumulator).plus(monthlyData.debt).toNumber(), 0))
    }

    const [open, setOpen] = useState(false);

    const [tableView, setTableView] = useState(true)

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

    const sortedAccounts = useMemo(() => (
        [...Accounts.accounts].filter(account => account.balance > 0).map(account => {
            const client = clients.find(client => client.id === account.clientId)
            return ({ ...account, client, clientCompleteName: `${client.firstName} ${client.lastName}` })
        }).sort((a, b) => {
            if (sortField && a[sortField] && b[sortField]) {
                if (typeof a[sortField] === 'string') {
                    return sortDirection === 'asc' ? a[sortField].localeCompare(b[sortField]) : b[sortField].localeCompare(a[sortField]);
                } else {
                    return sortDirection === 'asc' ? a[sortField] - b[sortField] : b[sortField] - a[sortField];
                }
            }
            return 0;
        })
    ), [Accounts.accounts, clients, sortDirection, sortField])
    const total = useMemo(() => [...Accounts.accounts || []].reduce((accum, account)=> (accum.add(account.balance)),Decimal(0)), [Accounts.accounts])

    return (
        <div className="general-info box-shadow">
            <h1 className="mt-0">
                {t("APL")}
            </h1>
            <Row>
                <Col className="mb-2" xs="12">
                    <div style={{ borderBottom: "1px solid lightgrey" }} />
                </Col>
                <h2 className="mb-2">
                    {t("CASH")}
                </h2>
                <Col xs="12">
                    <h6 className="mb-0">
                        {t("Total debt")} ({t("Fixed deposits")} + {t("Current_accounts")} - {t("Loans to clients")})
                    </h6>
                    <h4 className="mt-0">
                        {
                            (fullSettlement.fetching || Accounts.fetching) ?
                                <Spinner animation="border" size="sm" />
                                :
                                <FormattedNumber value={fullSettlement?.debt?.totalDebt + Decimal(clientLoans).toNumber()} prefix="U$D " fixedDecimals={2} />
                        }
                    </h4>
                </Col>
                <Col xs="auto">
                    <h6 className="mb-0">
                        {t("Fixed deposit debt as of today")}
                    </h6>
                    <h4 className="mt-0 mb-0">
                        {
                            fullSettlement.fetching ?
                                <Spinner animation="border" size="sm" />
                                :
                                <FormattedNumber value={fullSettlement?.debt?.fixedDeposits?.todaysDebt} prefix="U$D " fixedDecimals={2} />
                        }
                    </h4>
                    <h6 className="mt-0">
                        {t("Paid proffit")}&nbsp;
                        {
                            fullSettlement.fetching ?
                                <Spinner animation="border" size="sm" />
                                :
                                <FormattedNumber value={fullSettlement?.debt?.fixedDeposits?.payedProfit} prefix="U$D " fixedDecimals={2} />
                        }
                    </h6>
                </Col>
                <Col xs="auto">
                    <h6 className="mb-0">
                        {t("Debts of fixed terms at maturity")}
                    </h6>
                    <h4 className="mt-0 mb-0">
                        {
                            fullSettlement.fetching ?
                                <Spinner animation="border" size="sm" />
                                :
                                <FormattedNumber value={fixedDepositAtClose()} prefix="U$D " fixedDecimals={2} />
                        }
                    </h4>
                </Col>
                <Col xs="auto">
                    <h6 className="mb-0">
                        {t("Accounts debt")}
                    </h6>
                    <h4 className="mt-0 mb-0">
                        {
                            fullSettlement.fetching ?
                                <Spinner animation="border" size="sm" />
                                :
                                <FormattedNumber value={fullSettlement?.debt?.accountsDebt} prefix="U$D " fixedDecimals={2} />
                        }

                        &nbsp;
                        {
                            !fullSettlement.fetching &&
                            <h6 className="mt-0 clickable d-inline-block" onClick={() => setOpen(prevState => !prevState)}>
                                {t("Detalle")}
                            </h6>
                        }
                    </h4>
                </Col>
                <Col xs="auto">
                    <h6 className="mb-0">
                        {t("Loans to clients")}
                    </h6>
                    <h4 className="mt-0">
                        {
                            Accounts.fetching ?
                                <Spinner animation="border" size="sm" />
                                :
                                <FormattedNumber value={clientLoans} prefix="U$D " fixedDecimals={2} />
                        }
                    </h4>
                </Col>
                <Collapse in={open}>
                    <Row>
                        <Col className="mb-2" xs="12">
                            <div style={{ borderBottom: "1px solid lightgrey" }} />
                        </Col>
                        <Col xs="auto">
                            <h2>
                                {t("Accounts debt detail")}
                            </h2>
                        </Col>
                        <Col className="ms-auto" xs="auto">
                            <ButtonGroup>
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
                                    <img src={`${process.env.PUBLIC_URL}/images/generalUse/table${tableView ? "" : "-active"}.svg`} alt="performance" />
                                </ToggleButton>
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
                                    <img src={`${process.env.PUBLIC_URL}/images/generalUse/grid${tableView ? "-active" : ""}.svg`} alt="performance" />
                                </ToggleButton>
                            </ButtonGroup>
                        </Col>
                        <div className='d-flex flex-wrap'>
                            {
                                tableView ?
                                    <Table striped bordered hover className="mb-auto m-0 mt-2" >
                                        <thead >
                                            <tr>
                                                <th className="tableHeader" onClick={() => sortData('clientCompleteName')} style={{ cursor: "pointer" }}>
                                                    <span className='d-flex'>

                                                        <span>
                                                            {t("Client")}
                                                        </span>
                                                        <FontAwesomeIcon className='ms-auto' icon={sortField === "clientCompleteName" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                                    </span>
                                                </th>
                                                <th className="tableHeader" onClick={() => sortData('balance')} style={{ cursor: "pointer" }}>
                                                    <span className='d-flex'>
                                                        <span>
                                                            {t("Balance")}
                                                        </span>
                                                        <FontAwesomeIcon className="ms-auto" icon={sortField === "balance" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                                    </span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                sortedAccounts.map(account => {

                                                    return (
                                                        <tr key={account.clientId}>
                                                            <td className="tableDate">{account?.clientCompleteName}</td>
                                                            <td className="tableDate"><FormattedNumber value={account.balance} prefix="U$D " fixedDecimals={2} /></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                            <tr >
                                                <td className="tableDate"><strong>Total</strong></td>
                                                <td className="tableDate"><strong><FormattedNumber value={total} prefix="U$D " fixedDecimals={2} /></strong></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    :
                                    sortedAccounts.map(account => (
                                        <Col lg="3">
                                            <h2 className="mt-2 pe-2 topic text-nowrap">
                                                {account?.clientCompleteName}
                                                <br />
                                                <span style={{ fontWeight: "bolder" }}>
                                                    <FormattedNumber value={account.balance} prefix="U$D " fixedDecimals={2} />
                                                </span>
                                            </h2>
                                        </Col>
                                    ))
                            }
                        </div>
                    </Row>
                </Collapse>
                <Col className="my-2" xs="12">
                    <div style={{ borderBottom: "1px solid lightgrey" }} />
                </Col>
                {
                    !!(fullSettlement?.debt?.transactions) &&
                    <>
                        <Col xs="12">
                            <h6 className="mb-0">
                                {t("Total debt")} ({t("Funds")})
                                <OverlayTrigger
                                    show={showFundClick || showFundHover}
                                    placement="right"
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
                                            {t("Sum of all fund debts")}
                                        </Tooltip>
                                    }
                                >
                                    <span>
                                        <button
                                            onBlur={() => setShowFundClick(false)}
                                            onClick={() => setShowFundClick(prevState => !prevState)}
                                            onMouseEnter={() => setShowFundHover(true)}
                                            onMouseLeave={() => setShowFundHover(false)}
                                            type="button" className="noStyle"  ><FontAwesomeIcon icon={faInfoCircle} /></button>
                                    </span>
                                </OverlayTrigger>
                            </h6>
                            <h4 className="mt-0">
                                {
                                    fullSettlement.fetching ?
                                        <Spinner animation="border" size="sm" />
                                        :
                                        <>
                                            <FormattedNumber value={fundTotalDebt()} prefix="U$D " fixedDecimals={2} />
                                            {/* {
                                                Object.keys(fullSettlement?.debt?.transactions).length > 0 &&
                                                <span style={{ cursor: "pointer" }} onClick={() => setOpen(prevState => !prevState)}>
                                                    &nbsp;<FontAwesomeIcon icon={open ? faChevronUp : faChevronDown} />
                                                </span>
                                            } */}
                                        </>
                                }
                            </h4>
                        </Col>
                    </>
                }
            </Row>


        </div >
    );
}

export default GeneralInfo