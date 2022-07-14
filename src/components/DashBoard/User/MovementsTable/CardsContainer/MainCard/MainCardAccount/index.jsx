import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Nav } from 'react-bootstrap';

import { useTranslation } from "react-i18next";
import { useState } from 'react';
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'

import MovementsTab from './MovementsTab';
import TransfersTab from './TransfersTab';
import FundDetail from './FundDetail';
import './index.css'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const MainCard = ({ Fund, Hide, setHide, NavInfoToggled, SearchById, setSearchById, resetSearchById, handleMovementSearchChange }) => {
    const [SelectedTab, setSelectedTab] = useState("0")
    // eslint-disable-next-line 

    const { t } = useTranslation();
    let history = useHistory();

    // eslint-disable-next-line 
    const toLogin = () => {
        sessionStorage.clear();
        history.push(`/login`);
    }

    const balanceInCash = Fund.balance

    return (
        <div className="movementsMainCardAccount growAnimation mt-2">
            <div className="bg-white info ms-0 mb-2 px-0">
                <div className="d-flex justify-content-between align-items-end pe-2">
                    <h1 className="m-0 title px-2">
                        {t("Cash")}
                    </h1>
                </div>
                <div className="d-flex justify-content-between align-items-end pe-2 pb-2 border-bottom-main">
                    <Col className="d-flex justify-content-between pe-5" sm="auto">
                        <Col className="pe-2">
                            <div className="containerHideInfo px-2">
                                <span>{t("Balance")}:&nbsp;</span>
                                <FormattedNumber hidden className={`info ${Hide ? "shown" : "hidden"}`} value={balanceInCash.toString()} prefix="$" fixedDecimals={2} />
                                <FormattedNumber className={`info ${Hide ? "hidden" : "shown"}`} value={balanceInCash.toString()} prefix="$" fixedDecimals={2} />
                                <FormattedNumber className={`info placeholder`} value={balanceInCash.toString()} prefix="$" fixedDecimals={2} />
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
            </div>
            {/*tabs controller*/}
            <Container fluid className="px-0">
                <Nav className="history-tabs" variant="tabs" activeKey={SelectedTab} onSelect={(e) => { setSelectedTab(e) }}>
                    <Nav.Item>
                        <Nav.Link eventKey={"0"}>{t("Transactions")}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={"1"}>{t("Transfer activity")}</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Container>
            {/*tabs content */}
            <Container fluid className="p-3 pb-2 bg-white historyContent">
                {
                    {
                        0:
                            <MovementsTab SearchById={SearchById} setSearchById={setSearchById} Fund={Fund}
                                resetSearchById={resetSearchById} handleMovementSearchChange={handleMovementSearchChange} />,
                        1:
                            <TransfersTab SearchById={SearchById} setSearchById={setSearchById} Fund={Fund}
                                resetSearchById={resetSearchById} handleMovementSearchChange={handleMovementSearchChange} />,
                        2:
                            <FundDetail />,
                    }[SelectedTab]
                }
            </Container>
        </div>
    )
}
export default MainCard

