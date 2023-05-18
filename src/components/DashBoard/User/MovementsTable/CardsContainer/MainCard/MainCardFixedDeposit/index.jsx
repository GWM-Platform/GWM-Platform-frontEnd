import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Nav } from 'react-bootstrap';

import { useTranslation } from "react-i18next";
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'

import MovementsTab from './MovementsTab';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const MainCardFixedDeposit = ({ FixedDepositsStats, Hide, setHide }) => {
    const [SelectedTab, setSelectedTab] = useState("0")
    const { t } = useTranslation();

    return (
        <div className="movementsMainCardFund growAnimation mt-2">
            <div className="bg-white info ms-0 mb-2 px-0">
                <div className="d-flex justify-content-between align-items-end pe-2">
                    <h1 className="m-0 title px-2">
                        {t("Time deposits")}
                    </h1>
                </div>
                <div className="d-flex justify-content-between align-items-end pe-2">
                    <Col className="d-flex justify-content-between pe-5" sm="auto">
                        <Col className="pe-2">
                            <div className="containerHideInfo px-2 description">
                                <span>{t("Balance (U$S)")}:&nbsp;</span>
                                <span style={{ fontWeight: "bolder" }}>
                                    <FormattedNumber hidden className={`info ${Hide ? "shown" : "hidden"}`} value={FixedDepositsStats?.balance} prefix="" fixedDecimals={2} />
                                    <FormattedNumber className={`info ${Hide ? "hidden" : "shown"}`} value={FixedDepositsStats?.balance} prefix="" fixedDecimals={2} />
                                    <FormattedNumber className={`info placeholder`} value={FixedDepositsStats?.balance} prefix="" fixedDecimals={2} />
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

                        <span className='text-end w-100 d-block' style={{ fontWeight: "300" }}>
                            {t("Performance")}:&nbsp;
                            <strong className={{
                                '1': 'text-green',
                                '-1': 'text-red'
                            }[Math.sign(FixedDepositsStats?.performancePercentage ? FixedDepositsStats?.performancePercentage : 0)]}>
                                <FormattedNumber
                                    value={FixedDepositsStats?.performancePercentage ? FixedDepositsStats?.performancePercentage : 0} suffix="%" fixedDecimals={2} />
                                &nbsp;(
                                <FormattedNumber
                                    value={FixedDepositsStats?.performanceCash ? FixedDepositsStats?.performanceCash : 0} prefix="U$D " fixedDecimals={2} />
                                )
                            </strong>
                        </span>
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

