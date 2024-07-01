import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Nav } from 'react-bootstrap';

import { useTranslation } from "react-i18next";
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'

import MovementsTab from './MovementsTab';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import PerformanceComponent from 'components/DashBoard/GeneralUse/PerformanceComponent';
import { useHistory, useLocation } from 'react-router-dom/cjs/react-router-dom.min';

const MainCardFixedDeposit = ({ FixedDepositsStats, Hide, setHide }) => {
    const [SelectedTab, setSelectedTab] = useState("0")
    const { t } = useTranslation();

    const location = useLocation();
    const history = useHistory()
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

    return (
        <div className="movementsMainCardFund growAnimation pt-2">
            <div className="bg-white info ms-0 mb-2 px-0">
                <div className="d-flex justify-content-between align-items-start pe-2">
                    <Col className="d-flex justify-content-between pe-5" sm="auto">
                        <h1 className="m-0 title px-2">
                            {t("Time deposits")}
                        </h1>
                    </Col>
                    <Col className='ms-auto' xs="auto">
                        <PerformanceComponent className='performance-component' text="Performance" fixedDepositId='1' />
                    </Col>
                </div>
                <div className="d-flex justify-content-between align-items-end pe-2">
                    <Col className="d-flex justify-content-between pe-5" sm="auto">
                        <Col className="pe-2">
                            <div className="containerHideInfo px-2 description">
                                <span>{t("Balance")}:&nbsp;</span>
                                <span style={{ fontWeight: "bolder" }}>
                                    <FormattedNumber hidden className={`info ${Hide ? "shown" : "hidden"}`} value={FixedDepositsStats?.balance} prefix="U$D " fixedDecimals={2} />
                                    <FormattedNumber className={`info ${Hide ? "hidden" : "shown"}`} value={FixedDepositsStats?.balance} prefix="U$D " fixedDecimals={2} />
                                    <FormattedNumber className={`info placeholder`} value={FixedDepositsStats?.balance} prefix="U$D " fixedDecimals={2} />
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
                <div className="d-flex justify-content-between align-items-end px-2">
                    <Col className="d-flex justify-content-between pe-5" sm="auto">
                        {t("Active time deposits")}:&nbsp;
                        {FixedDepositsStats?.activeDeposits}
                    </Col>
                </div>
            </div>
            {/*tabs controller*/}
            <Container fluid className="px-0">
                <Nav className="history-tabs" variant="tabs" activeKey={SelectedTab} onSelect={(e) => { setSelectedTab(e) }}>
                    <Nav.Item>
                        <Nav.Link eventKey={"0"}>{t("Time Deposits history")}</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Container>
            {/*tabs content */}
            <Container fluid className="p-3 pb-2  bg-white historyContent">
                {
                    {
                        0:
                            <MovementsTab />,
                    }[SelectedTab]
                }
            </Container>
        </div>)
}
export default MainCardFixedDeposit

