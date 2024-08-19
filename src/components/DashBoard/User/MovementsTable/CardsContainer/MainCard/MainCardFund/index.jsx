import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Nav, Spinner } from 'react-bootstrap';

import { DashBoardContext } from 'context/DashBoardContext';
import { useTranslation } from "react-i18next";
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'

import MovementsTab from './MovementsTab';
import FundDetail from './FundDetail';
import './index.css'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { useEffect } from 'react';
import TransfersTab from './TransfersTab';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import PerformanceComponent from 'components/DashBoard/GeneralUse/PerformanceComponent';
import { useDispatch } from 'react-redux';
import { fetchTransactions } from 'Slices/DashboardUtilities/transactionsSlice';
import { PrintButton, PrintDefaultWrapper, usePrintDefaults } from 'utils/usePrint';
import ReactPDF from '@react-pdf/renderer';
import TransactionTable from 'TableExport/TransactionTable';
import axios from 'axios'

const MainCardFund = ({ Fund, Hide, setHide, NavInfoToggled, SearchById, setSearchById, resetSearchById, handleMovementSearchChange }) => {
    const location = useLocation();
    const history = useHistory()

    function useQuery() {
        const { search } = useLocation();

        return React.useMemo(() => new URLSearchParams(search), [search]);
    }

    const desiredType = useQuery().get("type")

    const [SelectedTab, setSelectedTab] = useState(desiredType === "share-transfer" ? "2" : "0")
    const { PendingTransactions, AccountSelected, sharesDecimalPlaces } = useContext(DashBoardContext)
    const { t } = useTranslation();

    const balanceInCash = Fund.shares ? (Fund.shares * Fund.fund.sharePrice) : 0
    const pendingshares = PendingTransactions.value.filter((transaction) => transaction.fundId === Fund.fund.id && Math.sign(transaction.shares) === +1).map((transaction) => transaction.shares).reduce((a, b) => a + b, 0).toFixed(2)

    useEffect(() => {
        const resetQueryParams = () => {
            const queryParams = new URLSearchParams(location.search);
            queryParams.delete("type");
            queryParams.delete("loc");
            queryParams.delete("id");
            queryParams.delete("client");
            queryParams.delete("fundId");
            const queryString = `?${queryParams.toString()}`;
            history.replace({ pathname: location.pathname, search: queryString });
        }
        resetQueryParams()
        //eslint-disable-next-line
    }, [])

    const dispatch = useDispatch()
    const { ClientSelected } = useContext(DashBoardContext)

    useEffect(() => {
        const newParams = {
            client: ClientSelected.id,
            filterFund: Fund.fund.id,
            take: 1,
            skip: 0,
            sort: "ASC"
        }
        // if (params.filterFund !== newParams.filterFund) {
        dispatch(fetchTransactions(newParams))
        // }
    }, [ClientSelected.id, Fund.fund.id, dispatch])

    const { getPageMargins, componentRef, title, aditionalStyles } = usePrintDefaults(
        {
            aditionalStyles: `@media print { 
                .historyContent{ padding: 0!important; page-break-before: avoid; }
                .main-card-header{ page-break-inside: avoid; page-break-before: avoid; margin-top: 1rem; }
                .movementsMainCardFund{ overflow: visible!important; }
                .tabs-container,select,.hideInfoButton, .accordion, button, td[data-column-name="actions"], th[data-column-name="actions"],td[data-column-name="ticket"], th[data-column-name="ticket"]{ display: none!important; }
                td, td * , th , th * {
                    font-size: 14px;
                    width: auto;
                }
                .tableDescription {
                    text-wrap: normal
                }
                .tableConcept, .tableDate, .tableAmount, .tableDescription  {
                    width: auto;
                    max-width: unset
                }
            }`,
            title: `Cuenta corriente`,
            bodyClass: "ProveedoresObra"
        }
    )

    const [performance, setPerformance] = useState(0)
    const [Movements, setMovements] = useState({
        transactions: 0,
        total: 0,//Total of movements with the filters applied
    })

    useEffect(() => {
        axios.get(`/clients/${ClientSelected.id}/fundPerformance?fund=${Fund.fund.id}`)
            .then(response => {
                setPerformance(response.data)
            })
            .catch(err => {
                setPerformance(0)
            })
    }, [ClientSelected.id, Fund.fund.id])

    const [rendering, setRendering] = useState(false)

    const renderAndDownloadTablePDF = async () => {
        setRendering(true)
        const blob = await ReactPDF.pdf(
            <TransactionTable
                transactions={Movements.transactions}
                headerInfo={{
                    fundName: Fund.fund.name,
                    balance: Fund.shares ? Fund.shares : 0,
                    sharePrice: Fund.fund.sharePrice,
                    balanceInCash: balanceInCash.toFixed(2),
                    pendingshares: pendingshares ? pendingshares : 0,
                    performance: performance,
                    clientName:
                        `${ClientSelected?.firstName === undefined ? "" : ClientSelected?.firstName === "-" ? "" : ClientSelected?.firstName
                        }${ClientSelected?.lastName === undefined ? "" : ClientSelected?.lastName === "-" ? "" : ` ${ClientSelected?.lastName}`
                        }`,
                }}
                sharesDecimalPlaces={sharesDecimalPlaces}
                AccountSelected={AccountSelected}
            />).toBlob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${t("Fund {{fund}} movements", { fund: Fund.fund.name })}.pdf`)
        // 3. Append to html page
        document.body.appendChild(link)
        // 4. Force download
        link.click()
        // 5. Clean up and remove the link
        link.parentNode.removeChild(link)
        setRendering(false)
    }

    return (
        <PrintDefaultWrapper className="movementsMainCardFund growAnimation pt-2" aditionalStyles={aditionalStyles} ref={componentRef} getPageMargins={getPageMargins} title={title} >
            <div className="bg-white main-card-header info ms-0 mb-2 px-0">
                <div className="d-flex justify-content-between align-items-end pe-2 mb-1">
                    <h1 className="m-0 title px-2">
                        {t(Fund.fund.name)}
                    </h1>
                    <Col xs="auto">
                        {
                            rendering ?
                                <Spinner animation="border" size="sm" />
                                :
                                <PrintButton className="w-100 h-100" variant="info" handlePrint={renderAndDownloadTablePDF} />
                        }
                    </Col>
                </div>
                <div className="d-flex justify-content-between align-items-start pe-2">
                    <Col className="d-flex justify-content-between pe-5" sm="auto">
                        <h2 className="px-2 left mb-1">
                            {t("Balance (shares)")}:&nbsp;
                            <FormattedNumber style={{ fontWeight: "bolder" }} value={Fund.shares ? Fund.shares : 0} fixedDecimals={2} />
                        </h2>
                    </Col>
                    <h2 className="m-0 left">
                        {t("Share price")}:&nbsp;
                        <FormattedNumber style={{ fontWeight: "bolder" }} value={Fund.fund.sharePrice} prefix="U$D " suffix="" fixedDecimals={2} />
                    </h2>

                </div>

                <div className="d-flex justify-content-between align-items-end pe-2">
                    <Col className="d-flex justify-content-between pe-5" sm="auto">
                        <Col className="pe-2">
                            <div className="containerHideInfo px-2 description" style={{ lineHeight: "1em" }}>
                                <span>{t("Balance (U$D)")}:&nbsp;</span>
                                <span style={{ fontWeight: "bolder" }}>
                                    <FormattedNumber hidden className={`info ${Hide ? "shown" : "hidden"}`} value={balanceInCash.toFixed(2)} prefix="" fixedDecimals={2} />
                                    <FormattedNumber className={`info ${Hide ? "hidden" : "shown"}`} value={balanceInCash.toFixed(2)} prefix="" fixedDecimals={2} />
                                    <FormattedNumber className={`info placeholder`} value={balanceInCash.toFixed(2)} prefix="" fixedDecimals={2} />
                                </span>

                            </div>
                        </Col>
                        <Col sm="auto" className="hideInfoButton d-flex align-items-center">
                            <FontAwesomeIcon
                                className={`icon ${Hide ? "hidden" : "shown"}`}
                                onClick={() => { setHide(!Hide) }}
                                icon={faEye}
                            />
                            <FontAwesomeIcon
                                className={`icon ${!Hide ? "hidden" : "shown"}`}
                                onClick={() => { setHide(!Hide) }}
                                icon={faEyeSlash}
                            />
                            <FontAwesomeIcon
                                className="icon placeholder"
                                icon={faEyeSlash}
                            />
                        </Col>
                    </Col>
                    <Col className='ms-auto' xs="auto">
                        <PerformanceComponent className='performance-component' text={"Accumulated performance"} fundId={Fund.fund.id} />
                    </Col>
                </div>
                <div className="d-flex justify-content-between align-items-start pe-2">
                    <Col className="d-flex justify-content-between pe-5" sm="auto">
                        <Col className="pe-2">
                            <div className="containerHideInfo px-2 description">
                                {t("Pending transactions (shares)")}&nbsp;
                                <FormattedNumber style={{ fontWeight: "bolder" }} value={pendingshares ? pendingshares : 0} fixedDecimals={2} />
                            </div>
                        </Col>
                        <Col sm="auto" className="hideInfoButton d-flex align-items-center">
                            <FontAwesomeIcon
                                className={`icon ${Hide ? "hidden" : "shown"}`}
                                onClick={() => { setHide(!Hide) }}
                                icon={faEye}
                            />
                            <FontAwesomeIcon
                                className={`icon ${!Hide ? "hidden" : "shown"}`}
                                onClick={() => { setHide(!Hide) }}
                                icon={faEyeSlash}
                            />
                            <FontAwesomeIcon
                                className="icon placeholder"
                                icon={faEyeSlash}
                            />
                        </Col>
                    </Col>
                </div>
                <div className="border-bottom-main pb-2">
                    <h2 className="px-2 left">

                    </h2>

                </div>
            </div>
            {/*tabs controller*/}
            <Container fluid className="tabs-container px-0">
                <Nav className="history-tabs" variant="tabs" activeKey={SelectedTab} onSelect={(e) => { setSelectedTab(e) }}>
                    <Nav.Item>
                        <Nav.Link eventKey={"0"}>{t("Transactions")}</Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Nav.Link eventKey={"2"}>{t("Transfers")}</Nav.Link>
                    </Nav.Item>

                    <Nav.Item>
                        <Nav.Link eventKey={"1"}>{t("Historic prices")}</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Container>
            {/*tabs content */}
            <Container fluid className="p-3 pb-2  bg-white historyContent">
                {
                    {
                        0:
                            <MovementsTab
                                Movements={Movements} setMovements={setMovements}
                                Fund={Fund} SearchById={SearchById} setSearchById={setSearchById}
                                resetSearchById={resetSearchById} handleMovementSearchChange={handleMovementSearchChange} />,
                        1:
                            <FundDetail fund={Fund?.fund} />,
                        2:
                            <TransfersTab SearchById={SearchById} setSearchById={setSearchById} Fund={Fund}
                                resetSearchById={resetSearchById} handleMovementSearchChange={handleMovementSearchChange} />
                    }[SelectedTab]
                }
            </Container>
        </PrintDefaultWrapper>)
}
export default MainCardFund