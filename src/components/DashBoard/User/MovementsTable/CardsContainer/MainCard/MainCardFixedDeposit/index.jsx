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
import { PrintButton, PrintDefaultWrapper, usePrintDefaults } from 'utils/usePrint';
import { SectionSelector } from '../MainCardAccount';

const MainCardFixedDeposit = ({ FixedDepositsStats, Hide, setHide, sections }) => {
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

    const { handlePrint, getPageMargins, componentRef, title, aditionalStyles } = usePrintDefaults(
        {
            aditionalStyles: `@media print { 
                .historyContent{ padding: 0!important; page-break-before: avoid; }
                .mobileMovement{ page-break-inside: avoid;  }
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
                .badge {
                    color: #fff!important
                }
                .historyContent {
                    padding-right: .5rem !important;
                    padding-left: .5rem !important;
                }
            }`,
            title: `Cuenta corriente`,
            bodyClass: "ProveedoresObra"
        }
    )

    return (
        <PrintDefaultWrapper className="movementsMainCardFund growAnimation pt-2" aditionalStyles={aditionalStyles} ref={componentRef} getPageMargins={getPageMargins} title={title} >
            <div className="bg-white info ms-0 mb-2 px-0">
                <div className="d-flex justify-content-between align-items-start pe-2">
                    <Col className="d-flex justify-content-between pe-5" sm="auto">
                        <h1 className="m-0 title px-2">
                            <SectionSelector sections={sections} title={t("Time deposits")} titleClassName="m-0 title" />
                        </h1>
                    </Col>
                    <Col className='ms-auto' xs="auto">
                        <PrintButton className="w-100 h-100" variant="info" handlePrint={handlePrint} />
                    </Col>
                </div>
                <div className="d-flex justify-content-between align-items-end pe-2 w-100" >
                    <Col className="d-flex w-100" sm="auto">
                        <Col className="pe-2" xs="auto">
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
                        <Col className='ms-auto' xs="auto">
                            <PerformanceComponent className='performance-component' text="Performance" fixedDepositId='1' />
                        </Col>
                    </Col>
                </div>
                <div className="d-flex justify-content-between align-items-end px-2">
                    <Col className="d-flex justify-content-between pe-5" sm="auto">
                        {t("Active time deposits")}:&nbsp;
                        {FixedDepositsStats?.activeDeposits}
                    </Col>
                </div>
                <div className="border-bottom-main" />
            </div>
            {/*tabs controller*/}
            <Container fluid className="px-0 tabs-container">
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
        </PrintDefaultWrapper>
    )
}
export default MainCardFixedDeposit

