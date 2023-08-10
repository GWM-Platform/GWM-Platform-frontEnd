import React, { useContext } from 'react'
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
import { useEffect } from 'react';
import TransfersTab from './TransfersTab';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import PerformanceComponent from 'components/DashBoard/GeneralUse/PerformanceComponent';

const MainCardFund = ({ Fund, Hide, setHide, NavInfoToggled, SearchById, setSearchById, resetSearchById, handleMovementSearchChange }) => {
    const location = useLocation();
    const history = useHistory()

    function useQuery() {
        const { search } = useLocation();

        return React.useMemo(() => new URLSearchParams(search), [search]);
    }

    const desiredType = useQuery().get("type")
    const desiredFundId = useQuery().get("fundId")

    const [SelectedTab, setSelectedTab] = useState(desiredType ? "2" : "0")
    const { PendingTransactions } = useContext(DashBoardContext)
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
        if (desiredFundId !== (Fund.fund.id + "")) {
            resetQueryParams()
        } else {
            return () => {
                resetQueryParams()
            }
        }
        //eslint-disable-next-line
    }, [Fund])


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
                    <Col className='ms-auto' xs="auto">
                        <PerformanceComponent text={"Performance"} fundId={Fund.fund.id} />
                    </Col>
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
            <Container fluid className="px-0">
                <Nav className="history-tabs" variant="tabs" activeKey={SelectedTab} onSelect={(e) => { setSelectedTab(e) }}>
                    <Nav.Item>
                        <Nav.Link eventKey={"0"}>{t("Transactions")}</Nav.Link>
                    </Nav.Item>
                    {/*
                        <Nav.Item>
                            <Nav.Link eventKey={"1"}>{t("Investment Evolution")}</Nav.Link>
                        </Nav.Item>
                    */}
                    <Nav.Item>
                        <Nav.Link eventKey={"2"}>{t("Transfers")}</Nav.Link>
                    </Nav.Item>
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
                            <FundDetail NavInfoToggled={NavInfoToggled} />,
                        2:
                            <TransfersTab SearchById={SearchById} setSearchById={setSearchById} Fund={Fund}
                                resetSearchById={resetSearchById} handleMovementSearchChange={handleMovementSearchChange} />
                    }[SelectedTab]
                }
            </Container>
        </div>)
}
export default MainCardFund