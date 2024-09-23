import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Accordion, Button, Col, Container, Row, Spinner } from 'react-bootstrap'
import TransactionFundTable from './TransactionFundTable';
import axios from 'axios';
import { useMemo } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';
import FundSelector from './FundSelector';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import PerformanceComponent from 'components/DashBoard/GeneralUse/PerformanceComponent';
import TransactionTable from 'TableExport/TransactionTable';
import ReactPDF from '@react-pdf/renderer';
import { exportToExcel } from 'utils/exportToExcel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel } from '@fortawesome/free-regular-svg-icons';
import { PrintButton } from 'utils/usePrint';
const TransactionsByFund = ({ AccountId, Account, ClientId, Client, clientFunds }) => {
    const { t } = useTranslation();

    const { toLogin, sharesDecimalPlaces } = useContext(DashBoardContext)

    const [FundSelected, setFundSelected] = useState("")

    const initialState = useMemo(() => ({ fetching: true, fetched: false, valid: false, content: [] }), [])
    const [Funds, setFunds] = useState(initialState)

    useEffect(() => {
        const getFunds = (signal) => {
            axios.get(`/funds`, { signal: signal }).then(function (response) {
                setFunds((prevState) => (
                    {
                        ...prevState,
                        fetching: false,
                        fetched: true,
                        valid: true,
                        content: response.data,
                    }))
                setFundSelected(response?.data?.[0]?.id || "")
            }).catch((err) => {
                if (err.message !== "canceled") {
                    if (err.response.status === "401") {
                        toLogin()
                    } else {
                        setFunds((prevState) => (
                            {
                                ...prevState,
                                fetching: false,
                                fetched: true,
                                valid: false,
                                content: [],
                            }))
                    }


                }
            });
        }
        getFunds();

        return () => {
            setFunds((prevState) => (
                {
                    ...prevState,
                    initialState
                }))
        }
        //eslint-disable-next-line
    }, [])

    const stake = useMemo(() => clientFunds?.find(clientFund => clientFund?.fundId === FundSelected), [FundSelected, clientFunds])
    const balanceInCash = useMemo(() => stake?.shares ? (stake.shares * stake?.fund?.sharePrice) : 0, [stake?.fund?.sharePrice, stake?.shares])

    const [rendering, setRendering] = useState(false)
    const initialStateTransactions = useMemo(() => ({ fetching: true, fetched: false, valid: false, content: { transactions: 0, total: 0 } }), [])
    const [Transactions, setTransactions] = useState(initialStateTransactions)

    const [performance, setPerformance] = useState(0)


    useEffect(() => {
        axios.get(`/clients/${ClientId}/fundPerformance?fund=${stake?.fund?.id}`)
            .then(response => {
                setPerformance(response.data)
            })
            .catch(err => {
                setPerformance(0)
            })
    }, [ClientId, stake?.fund?.id])

    const renderAndDownloadTablePDF = async () => {
        setRendering(true)
        const blob = await ReactPDF.pdf(
            <TransactionTable
                transactions={Transactions.content.transactions}
                headerInfo={{
                    fundName: stake.fund.name,
                    balance: stake.shares ? stake.shares : 0,
                    sharePrice: stake.fund.sharePrice,
                    balanceInCash: balanceInCash.toFixed(2),
                    performance: performance,
                    showPending: false,
                    clientName:
                        `${Client?.firstName === undefined ? "" : Client?.firstName === "-" ? "" : Client?.firstName
                        }${Client?.lastName === undefined ? "" : Client?.lastName === "-" ? "" : ` ${Client?.lastName}`
                        }`,
                }}
                sharesDecimalPlaces={sharesDecimalPlaces}
                AccountSelected={Account}
            />).toBlob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${t("Fund {{fund}} movements", { fund: stake.fund.name })}.pdf`)
        // 3. Append to html page
        document.body.appendChild(link)
        // 4. Force download
        link.click()
        // 5. Clean up and remove the link
        link.parentNode.removeChild(link)
        setRendering(false)
    }
    return (
        Funds.content.length > 0 &&
        <Accordion.Item eventKey="4">
            <Accordion.Header>{t("Funds")}</Accordion.Header>
            <Accordion.Body className='px-0'>
                <Col md="12">
                    <FundSelector SelectedFund={FundSelected} setSelectedFund={setFundSelected} Funds={Funds.content} clientFunds={clientFunds} />
                </Col>
                {
                    stake &&
                    <>
                        <Container fluid>
                            <Row>
                                <Col xs="12" className='my-3'>
                                    <div style={{ borderBottom: "1px solid lightgray" }}></div>
                                </Col>
                                <Col xs="auto" className='me-auto'>
                                    {t("Balance (shares)")}:&nbsp;
                                    <FormattedNumber className="bolder" value={stake.shares ? stake.shares : 0} prefix="" fixedDecimals={2} />
                                </Col>
                                {
                                    Transactions.content.transactions?.length > 0 &&
                                    <>

                                        <Col xs="auto" className='pe-0'>
                                            <Button className="me-2 print-button no-style" variant="info" onClick={() => exportToExcel(
                                                {
                                                    filename: t("Fund_movements", { fundName: stake.fund.name }),
                                                    sheetName: t("Fund_movements", { fundName: stake.fund.name }),
                                                    dataTableName: "fund-movements",
                                                    excludedColumns: ["ticket", "actions"],
                                                    // plainNumberColumns: ["unit_floor", "unit_unitNumber", "unit_typology"]
                                                }

                                            )} >
                                                <FontAwesomeIcon icon={faFileExcel} />
                                            </Button>
                                        </Col>
                                        <Col xs="auto">
                                            {
                                                rendering ?
                                                    <Spinner animation="border" size="sm" />
                                                    :
                                                    <PrintButton className="w-100" variant="info" handlePrint={renderAndDownloadTablePDF} />
                                            }
                                        </Col>
                                    </>
                                }
                            </Row>
                        </Container>
                        <Container fluid>
                            <Row>
                                <Col xs="auto">
                                    <span>{t("Balance (U$D)")}:&nbsp;</span>
                                    <FormattedNumber className="bolder" value={balanceInCash.toFixed(2)} prefix="" fixedDecimals={2} />
                                </Col>
                                <Col xs="auto" className='ms-auto'>
                                    <PerformanceComponent numberFw="fw-bold" clientId={ClientId} className='performance-component' text={"Accumulated performance"} fundId={stake.fund.id} />
                                </Col>
                            </Row>
                        </Container>
                        <Container fluid>
                            <Row>
                                <Col xs="auto">
                                    {t("Share price")}:&nbsp;
                                    <FormattedNumber style={{ fontWeight: "bolder" }} value={stake.fund.sharePrice} prefix="U$D " suffix="" fixedDecimals={2} />
                                </Col>
                                <Col xs="12" className='my-3'>
                                    <div style={{ borderBottom: "1px solid lightgray" }}></div>
                                </Col>
                            </Row>
                        </Container>
                    </>
                }
                {
                    FundSelected === "" ? null :
                        <TransactionFundTable
                            Transactions={Transactions} setTransactions={setTransactions}
                            AccountId={AccountId} ClientId={ClientId} FundId={FundSelected} />
                }
            </Accordion.Body>
        </Accordion.Item >
    )
}

export default TransactionsByFund