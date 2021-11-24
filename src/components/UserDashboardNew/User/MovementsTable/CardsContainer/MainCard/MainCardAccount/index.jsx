import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Row, Nav } from 'react-bootstrap';

import { useTranslation } from "react-i18next";
import { useState } from 'react';
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'

import MovementsTab from './MovementsTab';
import FundDetail from './FundDetail';
import './index.css'

const MainCard = ({ Fund,  Hide, setHide, NavInfoToggled }) => {
    const [SelectedTab, setSelectedTab] = useState("0")
    // eslint-disable-next-line 

    const { t } = useTranslation();
    let history = useHistory();

    // eslint-disable-next-line 
    const toLogin = () => {
        sessionStorage.clear();
        history.push(`/login`);
    }


    const balanceInCash=Fund.balance 
    

    return (
        <div className="movementsMainCardAccount">
            <Container fluid className="p-0 mt-2">
                <Row className="m-0">
                    <Container className="bg-white info ms-0 mb-2 px-0">
                        <Col className="d-flex justify-content-between align-items-end pe-2">
                            <h1 className="m-0 title px-2">
                                {t("Cash")}
                            </h1>
                        </Col>
                        <Col className="d-flex justify-content-between align-items-end pe-2 pb-2 border-bottom-main">
                            <Col className="d-flex justify-content-between pe-5" sm="auto">
                                <Col className="pe-2">
                                    <div className="containerHideInfo px-2">
                                        <span>Balance: $</span>
                                        <span className={`info ${Hide ? "shown" : "hidden"}`}>
                                            {balanceInCash.toString().replace(/./g, "*")}
                                        </span>

                                        <span className={`info ${Hide ? "hidden" : "shown"}`}>
                                            {balanceInCash.toString()}
                                        </span>

                                        <span className={`info placeholder`}>
                                            {balanceInCash.toString()}
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
                        </Col>

                    </Container>
                    {/*tabs controller*/}
                    <Container fluid className="px-0">
                        <Nav className="history-tabs" variant="tabs" activeKey={SelectedTab} onSelect={(e) => { setSelectedTab(e) }}>
                            <Nav.Item>
                                <Nav.Link eventKey={"0"}>{t("Last Movements")}</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Container>
                    {/*tabs content */}
                    <Container fluid className="p-3 bg-white">
                        {
                            {
                                0:
                                    <MovementsTab NavInfoToggled={NavInfoToggled} Fund={Fund} />,
                                1:
                                    <FundDetail />
                            }[SelectedTab]
                        }
                    </Container>
                </Row>
            </Container>
        </div>)
}
export default MainCard

