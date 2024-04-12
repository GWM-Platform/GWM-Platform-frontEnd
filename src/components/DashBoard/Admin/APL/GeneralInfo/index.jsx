import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import FormattedNumber from "components/DashBoard/GeneralUse/FormattedNumber";
import Decimal from "decimal.js";
import React, { useEffect, useMemo, useState } from "react";
import { Col, Collapse, OverlayTrigger, Row, Spinner, Tooltip } from "react-bootstrap";
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
                        <Col xs="12">
                            <h2>
                                {t("Accounts debt detail")}
                            </h2>
                        </Col>
                        <div className='d-flex flex-wrap'>
                            {
                                Accounts.accounts.filter(account => account.balance > 0).map(account => {
                                    console.log(account)
                                    const client = clients.find(client => client.id === account.clientId)
                                    return (
                                        <Col lg="3">
                                            <h2 className="mt-2 pe-2 topic text-nowrap">
                                                {client?.firstName} {client?.lastName}
                                                <br />
                                                <span style={{ fontWeight: "bolder" }}>
                                                    <FormattedNumber value={account.balance} prefix="U$D " fixedDecimals={2} />
                                                </span>
                                            </h2>
                                        </Col>
                                        // <h4 className="mt-0">
                                        //     <FormattedNumber value={account.balance} prefix="U$D " fixedDecimals={2} />
                                        // </h4>
                                    )
                                })
                                // stakes.content.map(stake => {
                                //     const client = clients.find(client => client.id === stake.clientId)
                                //     return (
                                //         <div className='me-4'>
                                //             <h2 className="mt-2 pe-2 topic text-nowrap">
                                //                 {client?.firstName} {client?.lastName}
                                //                 <br />
                                //                 <span style={{ fontWeight: "bolder" }}>
                                //                     <FormattedNumber value={stake?.shares} fixedDecimals={2} />
                                //                     &nbsp;{t("shares")}
                                //                 </span>
                                //             </h2>
                                //             <h6 className="mt-0">
                                //                 <FormattedNumber value={stake?.shares * (stake.fund.sharePrice || 1)} prefix="U$D " fixedDecimals={2} />
                                //             </h6>
                                //         </div>
                                //     )
                                // })
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
                        {/* <Row> */}
                        {/* <Col className="my-2" xs="12">
                            <div style={{ borderBottom: "1px solid lightgrey" }} />
                        </Col>
                        <h2 className="mb-2">
                            {t("Funds")}
                        </h2> */}
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
                        {/* </Row> */}
                        {/* <Collapse in={open}>
                        <Row>
                            {
                                Object.keys(fullSettlement?.debt?.transactions).map(
                                    fund =>
                                        <Col xs="auto" key={fund}>
                                            <h6 className="mb-0">
                                                {t("\"{{fund}}\" debt", { fund })}
                                            </h6>
                                            <h4 className="mb-0">
                                                {
                                                    fullSettlement.fetching ?
                                                        <Spinner animation="border" size="sm" />
                                                        :
                                                        <FormattedNumber value={fullSettlement?.debt?.transactions?.[fund]?.amount} prefix="U$D " fixedDecimals={2} />
                                                }
                                            </h4>
                                            <h6 className="mt-0">
                                                {
                                                    fullSettlement.fetching ?
                                                        <Spinner animation="border" size="sm" />
                                                        :
                                                        <>
                                                            <FormattedNumber value={fullSettlement?.debt?.transactions?.[fund]?.soldShares} fixedDecimals={2} /> {t("shares")}
                                                        </>
                                                }
                                            </h6>
                                        </Col>
                                )
                            }
                        </Row>
                    </Collapse> */}
                    </>
                }
            </Row>


        </div >
    );
}

export default GeneralInfo