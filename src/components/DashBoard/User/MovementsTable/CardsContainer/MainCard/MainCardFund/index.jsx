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

const MainCard = ({ Fund, Hide, setHide, NavInfoToggled, SearchById, setSearchById,resetSearchById,handleMovementSearchChange }) => {
    const [SelectedTab, setSelectedTab] = useState("0")
    const [Performance, setPerformance] = useState(0)
    const { PendingTransactions } = useContext(DashBoardContext)
    const { t } = useTranslation();

    const balanceInCash = Fund.shares ? (Fund.shares * Fund.fund.sharePrice) : 0
    const pendingfeeParts = PendingTransactions.value.filter((transaction) => transaction.fundId === Fund.fund.id && Math.sign(transaction.shares) === +1).map((transaction) => transaction.shares).reduce((a, b) => a + b, 0).toFixed(2)

    return (
        <div className="movementsMainCardFund growAnimation mt-2">
            <div className="bg-white info ms-0 mb-2 px-0">
                <div className="d-flex justify-content-between align-items-end pe-2">
                    <h1 className="m-0 title px-2">
                        {t(Fund.fund.name)}
                    </h1>
                    <h2 className="m-0 left">
                        {t("Share price")}
                        <span className="ps-3" style={{ fontWeight: "bolder" }}>
                            ${Fund.fund.sharePrice}
                        </span>
                    </h2>
                </div>

                <div>
                    <h2 className="px-2 left">
                        {t("Balance (Shares)")}:{" "}{Fund.shares ? Fund.shares : 0}
                    </h2>
                </div>
                <div className="d-flex justify-content-between align-items-end pe-2">
                    <Col className="d-flex justify-content-between pe-5" sm="auto">
                        <Col className="pe-2">
                            <div className="containerHideInfo px-2">
                                <span>{t("Balance ($)")}: $</span>
                                <span className={`info ${Hide ? "shown" : "hidden"}`}>
                                    {balanceInCash.toFixed(2).toString().replace(/./g, "*")}
                                </span>

                                <span className={`info ${Hide ? "hidden" : "shown"}`}>
                                    {balanceInCash.toFixed(2).toString()}
                                </span>

                                <span className={`info placeholder`}>
                                    {balanceInCash.toFixed(2).toString()}
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
                    <Col sm="auto" >
                        {t("Performance")}{": "}
                        <span
                            className={{
                                '1': 'text-green',
                                '-1': 'text-red'
                            }[Math.sign(Performance)]}>
                            {Performance}%
                        </span>
                    </Col>
                </div>
                <div className="border-bottom-main pb-2">
                    <h2 className="px-2 left">
                        {t("Pending transactions (shares)")}{" "}{pendingfeeParts ? pendingfeeParts : 0}{" "}
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
                            <MovementsTab setPerformance={setPerformance} NavInfoToggled={NavInfoToggled}
                                Fund={Fund} SearchById={SearchById} setSearchById={setSearchById} 
                                resetSearchById={resetSearchById} handleMovementSearchChange={handleMovementSearchChange}/>,
                        1:
                            <FundDetail NavInfoToggled={NavInfoToggled} />
                    }[SelectedTab]
                }
            </Container>
        </div>)
}
export default MainCard

