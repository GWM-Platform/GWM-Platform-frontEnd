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

const MainCard = ({ Fund, Hide, setHide, NavInfoToggled }) => {
    const [SelectedTab, setSelectedTab] = useState("0")
    const [Performance, setPerformance] = useState(0)

    // eslint-disable-next-line 


    const { t } = useTranslation();
    let history = useHistory();

    // eslint-disable-next-line 
    const toLogin = () => {
        sessionStorage.clear();
        history.push(`/login`);
    }

    const balanceInCash = (Fund.shares * Fund.fund.sharePrice)

    return (
        <div className="movementsMainCardFund">
            <Container fluid className="p-0 mt-2">
                <Row className="m-0">
                    <Container className="bg-white info ms-0 mb-2 px-0">
                        <Col className="d-flex justify-content-between align-items-end pe-2">
                            <h1 className="m-0 title px-2">
                                {t(Fund.fund.name)}
                            </h1>
                            <h2 className="m-0 left">
                                FeePart price (Now)
                                <span className="ps-3" style={{ fontWeight: "bolder" }}>
                                    ${Fund.fund.sharePrice}
                                </span>
                            </h2>
                        </Col>
                        <Col>
                            <h2 className="px-2 left">
                                {Fund.shares} FeeParts in possession
                            </h2>
                        </Col>
                        <Col className="d-flex justify-content-between align-items-end pe-2 pb-2 border-bottom-main">
                            <Col className="d-flex justify-content-between pe-5" sm="auto">
                                <Col className="pe-2">
                                    <div className="containerHideInfo px-2">
                                        <span>Actual Value in cash of your holding: $</span>
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
                            <Col sm="auto" >
                                {"Performance: "}
                                <span
                                    className={{
                                        '1': 'text-green',
                                        '-1': 'text-red'
                                    }[Math.sign(Performance)]}>
                                    {Performance.toFixed(2)}%
                                </span>
                            </Col>
                        </Col>

                    </Container>
                    {/*tabs controller*/}
                    <Container fluid className="px-0">
                        <Nav className="history-tabs" variant="tabs" activeKey={SelectedTab} onSelect={(e) => { setSelectedTab(e) }}>
                            <Nav.Item>
                                <Nav.Link eventKey={"0"}>{t("Last Movements")}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey={"1"}>{t("Fund Detail")}</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Container>
                    {/*tabs content */}
                    <Container fluid className="p-3 bg-white">
                        {
                            {
                                0:
                                    <MovementsTab setPerformance={setPerformance} NavInfoToggled={NavInfoToggled}
                                        Fund={Fund} />,
                                1:
                                    <FundDetail NavInfoToggled={NavInfoToggled} />
                            }[SelectedTab]
                        }
                    </Container>
                </Row>
            </Container>
        </div>)
}
export default MainCard
