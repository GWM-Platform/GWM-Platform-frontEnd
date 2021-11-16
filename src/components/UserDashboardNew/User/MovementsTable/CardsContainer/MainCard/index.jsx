import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Row, Nav } from 'react-bootstrap';

import { useTranslation } from "react-i18next";
import { useState } from 'react';
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import { urlContext } from '../../../../../../context/urlContext';

import MovementsTab from './MovementsTab';
import FundDetail from './FundDetail';
import './index.css'

const MainCard = ({ IsMobile, Fund, Funds,SwitchState }) => {
    const [SelectedTab, setSelectedTab] = useState("0")
    // eslint-disable-next-line 
    const { urlPrefix } = useContext(urlContext)
    const [Hide, setHide] = useState(false)


    const { t } = useTranslation();
    let history = useHistory();

    // eslint-disable-next-line 
    const toLogin = () => {
        sessionStorage.clear();
        history.push(`/login`);
    }

    return (
        <div className="min-free-area-total movementsMainCard">
            <Container fluid className="p-0 mt-4">
                <Row className="m-0">
                    <Container className="info ms-0 mb-1 px-0">
                        <Col className="d-flex justify-content-between align-items-end pe-2">
                            <h1 className="m-0 title">
                                {t(Fund.fund.name)}
                            </h1>
                            <h2 className="m-0 left">
                                FeePart price (Now)
                                <span className="ps-3" style={{ fontWeight: "bolder" }}>
                                    ${Fund.fund.sharePrice}
                                </span>
                            </h2>
                        </Col>
                        <Col className="d-flex justify-content-between align-items-end pe-2 mb-2 pb-2 border-bottom-main">
                            <Col className="d-flex justify-content-between" sm={3}>
                                <Col>
                                    ${Hide ? (Fund.shares*Fund.fund.sharePrice).toString().replace(/./g, "*") : (Fund.shares*Fund.fund.sharePrice)}{" "}
                                </Col>
                                <Col sm="auto" className="hideInfoButton">
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
                    <Container fluid className="mt-4 px-0">
                        <Nav className="history-tabs" variant="tabs" activeKey={SelectedTab} onSelect={(e) => { setSelectedTab(e) }}>
                            <Nav.Item>
                                <Nav.Link eventKey={"0"}>{t("Last Movements")}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey={"1"}>{t("Funds Detail")}</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Container>
                    {/*tabs content */}
                    <Container fluid className="p-3 bg-white">
                        {
                            {
                                0:
                                    <MovementsTab SwitchState={SwitchState} IsMobile={IsMobile} Fund={Fund} Funds={Funds} />,
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

