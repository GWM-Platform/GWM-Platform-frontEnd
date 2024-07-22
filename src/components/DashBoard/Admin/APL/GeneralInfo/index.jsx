import { faInfoCircle, faSort, faSortDown, faSortUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import FormattedNumber from "components/DashBoard/GeneralUse/FormattedNumber";
import Decimal from "decimal.js";
import React, { useEffect, useMemo, useState } from "react";
import { ButtonGroup, Col, Collapse, OverlayTrigger, Row, Spinner, Table, ToggleButton, Tooltip } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import TableIcon from "../icons/TableIcon";
import GridIcon from "../icons/GridIcon";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

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
        [...Accounts.accounts].map(account => {
            const client = (clients || [])?.find(client => client.id === account.clientId)
            return ({ ...account, client, clientCompleteName: `${client?.firstName} ${client?.lastName}` })
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
    const total = useMemo(() => [...Accounts.accounts || []].reduce((accum, account) => (accum.add(account.balance)), Decimal(0)), [Accounts.accounts])

    useEffect(() => {
        if (open) {
            setTimeout(() => {
                document.getElementById("accounts-table").scrollIntoView({ behavior: "smooth" })
            }, 100);
        }
    }, [open])

    // TODO: Add pending account movements
    // TODO: Clients debt = balances (including loans) + pending movements

    return (
        <div className="general-info box-shadow">
            <h1 className="mt-0 fw-normal">
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
                        {t("Cash holdings")}
                    </h6>
                    <h4 className="mt-0">
                        {
                            Accounts.fetching ?
                                <Spinner animation="border" size="sm" />
                                :
                                <FormattedNumber value={Decimal(total).add(clientLoans)} prefix="U$D " fixedDecimals={2} />
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
                <Col xs="auto">
                    <h6 className="mb-0">
                        {t("Accounts debt")}
                    </h6>
                    <h4 className="mt-0 mb-0">
                        {
                            fullSettlement.fetching ?
                                <Spinner animation="border" size="sm" />
                                :
                                <FormattedNumber value={total} prefix="U$D " fixedDecimals={2} />
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
                <Collapse in={open} id="accounts-table">
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
                                        <TableIcon active={tableView} style={{ height: "1em", width: "1em", display: "block" }} />
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
                                        <GridIcon active={!tableView} style={{ height: "1em", width: "1em", display: "block" }} />
                                        {/* <img src={`${process.env.PUBLIC_URL}/images/generalUse/grid${tableView ? "-active" : ""}.svg`} alt="performance" /> */}
                                    </ToggleButton>
                                </ButtonGroup>
                            </ButtonGroup>
                        </Col>
                        <div className='d-flex flex-wrap' style={{ gap: ".5em" }}>
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
                                                <th className="tableHeader text-end" onClick={() => sortData('balance')} style={{ cursor: "pointer" }}>
                                                    <span className='d-flex'>
                                                        <span className="ms-auto me-2">
                                                            {t("Balance")}
                                                        </span>
                                                        <FontAwesomeIcon icon={sortField === "balance" ? (sortDirection === "asc" ? faSortUp : faSortDown) : faSort} />
                                                    </span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                sortedAccounts.map(account => {

                                                    return (
                                                        <tr key={account.clientId}>
                                                            <td className="tableDate">
                                                                <Link style={{ fontSize: "1em" }} to={`/DashBoard/clientsSupervision/${account.clientId}`}>
                                                                    {account?.clientCompleteName}
                                                                </Link>
                                                            </td>
                                                            <td className="tableDate text-end"><FormattedNumber value={account.balance} prefix="U$D " fixedDecimals={2} styledSybol /></td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                            <tr >
                                                <td className="tableDate"><strong>Total</strong></td>
                                                <td className="tableDate text-end"><strong><FormattedNumber value={total} prefix="U$D " fixedDecimals={2} styledSybol /></strong></td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    :
                                    <Row className='align-items-stretch g-2'>
                                        {
                                            sortedAccounts.map(account => (
                                                <Col key={account.id} sm="10" md="4" lg="4" xl="3">
                                                    <div className="fixed-deposit-item">
                                                        <h2 className="mt-0 pe-2 topic text-nowrap">
                                                            <Link style={{ fontWeight: 300, fontSize: "17px" }} to={`/DashBoard/clientsSupervision/${account.clientId}`}>
                                                                {account?.clientCompleteName}
                                                            </Link>
                                                            <br />
                                                            <span style={{ fontWeight: 600,fontSize: "20px" }}>
                                                                <FormattedNumber value={account.balance} prefix="U$D " fixedDecimals={2} styledSybol />
                                                            </span>
                                                        </h2>
                                                    </div>
                                                </Col>
                                            ))}

                                    </Row>
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