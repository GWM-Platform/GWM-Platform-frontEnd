import React, { useCallback, useContext, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Nav } from 'react-bootstrap';

import { DashBoardContext } from 'context/DashBoardContext';
import { useTranslation } from "react-i18next";
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'

import MovementsTab from './MovementsTab';
import FundDetail from './FundDetail';
import './index.css'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import axios from 'axios';

const MainCardFund = ({ Fund, Hide, setHide, NavInfoToggled, SearchById, setSearchById, resetSearchById, handleMovementSearchChange }) => {
    const [SelectedTab, setSelectedTab] = useState("0")
    //eslint-disable-next-line
    const [Performance, setPerformance] = useState({ fetching: true, fetched: false, valid: false, content: {} })
    const { PendingTransactions, ClientSelected, toLogin } = useContext(DashBoardContext)
    const { t } = useTranslation();

    const balanceInCash = Fund.shares ? (Fund.shares * Fund.fund.sharePrice) : 0
    const pendingshares = PendingTransactions.value.filter((transaction) => transaction.fundId === Fund.fund.id && Math.sign(transaction.shares) === +1).map((transaction) => transaction.shares).reduce((a, b) => a + b, 0).toFixed(2)

    const getPerformance = useCallback((signal) => {
        setPerformance((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.get(`/funds/${Fund.fund.id}/performance`, {
            params: { client: ClientSelected.id },
            signal: signal,
        }).then(function (response) {
            setPerformance((prevState) => (
                {
                    ...prevState,
                    fetching: false,
                    fetched: true,
                    valid: true,
                    content: response.data,
                }))
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setPerformance((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
            }
        });
    }, [toLogin, setPerformance, Fund, ClientSelected.id]);


    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        getPerformance(signal)

        return () => {
            controller.abort();
        };
    }, [getPerformance])

    const PerformanceComponent = ({ text, performance }) => {
        return (
            <span className='text-end w-100 d-block' style={{ fontWeight: "300" }}>
                {t(text)}:&nbsp;
                <strong>
                    <FormattedNumber className={{
                        '1': 'text-green',
                        '-1': 'text-red'
                    }[Math.sign(performance)]}
                        value={performance} suffix="%" fixedDecimals={2} />
                </strong>
            </span>
        )
    }
    return (
        <div className="movementsMainCardFund growAnimation mt-2">
            <div className="bg-white info ms-0 mb-2 px-0">
                <div className="d-flex justify-content-between align-items-end pe-2 mb-1">
                    <h1 className="m-0 title px-2">
                        {t(Fund.fund.name)}
                    </h1>
                    <h2 className="m-0 left">
                        {t("Share price")}:&nbsp;
                        <FormattedNumber style={{ fontWeight: "bolder" }} value={Fund.fund.sharePrice} prefix="U$D " suffix="" fixedDecimals={2} />
                    </h2>
                </div>
                <div className="d-flex justify-content-between align-items-start pe-2">
                    <Col className="d-flex justify-content-between pe-5" sm="auto">
                        <h2 className="px-2 left mb-1">
                            {t("Balance (shares)")}:&nbsp;
                            <FormattedNumber style={{ fontWeight: "bolder" }} value={Fund.shares ? Fund.shares : 0} fixedDecimals={2} />
                        </h2>
                    </Col>

                    {
                        !!(Performance?.fetched) &&
                        (
                            Performance?.content?.result &&
                            <Col sm="auto" >
                                <PerformanceComponent text={"Actual performance"} performance={Performance.content.result} />
                            </Col>
                        )
                    }
                </div>

                <div className="d-flex justify-content-between align-items-end pe-2">
                    <Col className="d-flex justify-content-between pe-5" sm="auto">
                        <Col className="pe-2">
                            <div className="containerHideInfo px-2 description" style={{ lineHeight: "1em" }}>
                                <span>{t("Balance ($)")}:&nbsp;</span>
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

                    {
                        !!(Performance.fetched) &&
                        (
                            Performance?.content?.performance &&
                            <Col sm="auto" >
                                <PerformanceComponent text={"Period performance"} performance={Performance.content.performance} />
                            </Col>
                        )
                    }
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

                    {
                        !!(Performance.fetched) &&
                        (
                            Performance?.content?.anualPerf &&
                            <Col sm="auto" >
                                <PerformanceComponent text={"Anual performance"} performance={Performance.content.anualPerf} />
                            </Col>
                        )
                    }
                </div>
                <div className="border-bottom-main pb-2">
                    <h2 className="px-2 left">

                    </h2>

                </div>
            </div>
            {/*tabs controller*/}
            <Container fluid className="px-0">
                <Nav className="history-tabs" variant="tabs" activeKey={SelectedTab} onSelect={(e) => { setSelectedTab(e) }}>
                    <Nav.Item>
                        <Nav.Link eventKey={"0"}>{t("Transactions")}</Nav.Link>
                    </Nav.Item>
                    {/*<Nav.Item>
                                <Nav.Link eventKey={"1"}>{t("Investment Evolution")}</Nav.Link>
                            </Nav.Item>*/}
                </Nav>
            </Container>
            {/*tabs content */}
            <Container fluid className="p-3 pb-2  bg-white historyContent">
                {
                    {
                        0:
                            <MovementsTab
                                Fund={Fund} SearchById={SearchById} setSearchById={setSearchById}
                                resetSearchById={resetSearchById} handleMovementSearchChange={handleMovementSearchChange} />,
                        1:
                            <FundDetail NavInfoToggled={NavInfoToggled} />
                    }[SelectedTab]
                }
            </Container>
        </div>)
}
export default MainCardFund

