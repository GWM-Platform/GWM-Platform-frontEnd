import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Nav, Button } from 'react-bootstrap';

import { useTranslation } from "react-i18next";
import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'

import MovementsTab from './MovementsTab';
import TransfersTab from './TransfersTab';
import FundDetail from './FundDetail';
import './index.css'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { PrintButton, PrintDefaultWrapper, usePrintDefaults } from 'utils/usePrint';
import { faFileExcel } from '@fortawesome/free-regular-svg-icons';
import { exportToExcel } from 'utils/exportToExcel';

const MainCardAccount = ({ Fund, Hide, setHide, SearchById, setSearchById, resetSearchById, handleMovementSearchChange }) => {

    function useQuery() {
        const { search } = useLocation();

        return React.useMemo(() => new URLSearchParams(search), [search]);
    }

    const DesiredSelectedTab = useQuery().get("SelectedTab")

    const validTabs = ["Movements", "Transfers"]

    const [SelectedTab, setSelectedTab] = useState(DesiredSelectedTab ? validTabs.includes(DesiredSelectedTab) ? DesiredSelectedTab : validTabs[0] : validTabs[0])

    // eslint-disable-next-line 

    const { t } = useTranslation();
    const history = useHistory();
    const location = useLocation()

    // eslint-disable-next-line 
    const toLogin = () => {
        sessionStorage.clear();
        history.push(`/login`);
    }

    const balanceInCash = Fund.balance

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
                .main-card-header{ page-break-inside: avoid; page-break-before: avoid; margin-top: 1rem; }
                .movementsMainCardAccount{ overflow: visible!important; }
                .tabs-container,.hideInfoButton, .accordion, button, td[data-column-name="actions"], th[data-column-name="actions"],td[data-column-name="ticket"], th[data-column-name="ticket"]{ display: none!important; }
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
            }`,
            title: `Cuenta corriente`,
            bodyClass: "ProveedoresObra"
        }
    )

    return (
        <PrintDefaultWrapper className="movementsMainCardAccount growAnimation pt-2" aditionalStyles={aditionalStyles} ref={componentRef} getPageMargins={getPageMargins} title={title} >
            <div className="main-card-header bg-white info ms-0 mb-2 px-0">
                <div className="d-flex align-items-start pe-2">
                    <Col className="d-flex justify-content-between pe-5 me-auto" sm="auto">
                        <h1 className="m-0 title px-2">
                            {t("Cash")}
                        </h1>
                    </Col>
                    <Col xs="auto">
                        <PrintButton className="w-100 h-100" variant="info" handlePrint={handlePrint} />
                    </Col>
                    <Col xs="auto" className='ms-2'>

                        <Button className="me-2 print-button no-style" variant="info" onClick={() => exportToExcel(
                            {
                                filename: "Cuenta corriente",
                                sheetName: "Cuenta corriente",
                                dataTableName: "cta-cte-movements",
                                excludedColumns: ["ticket", "actions"],
                                // plainNumberColumns: ["unit_floor", "unit_unitNumber", "unit_typology"]
                            }
                        )} >
                            <FontAwesomeIcon icon={faFileExcel} />
                        </Button>
                    </Col>
                </div>
                <div className="d-flex justify-content-between align-items-end pe-2 pb-2 border-bottom-main">
                    <Col className="d-flex justify-content-between pe-5" sm="auto">
                        <Col className="pe-2">
                            <div className="containerHideInfo px-2">
                                <span>{t("Balance")}:&nbsp;</span>
                                <FormattedNumber hidden className={`info ${Hide ? "shown" : "hidden"}`} value={balanceInCash.toString()} prefix="U$D " fixedDecimals={2} />
                                <FormattedNumber className={`info ${Hide ? "hidden" : "shown"}`} value={balanceInCash.toString()} prefix="U$D " fixedDecimals={2} />
                                <FormattedNumber className={`info placeholder`} value={balanceInCash.toString()} prefix="U$D " fixedDecimals={2} />
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
            <Container fluid className="px-0 tabs-container">
                <Nav className="history-tabs" variant="tabs" activeKey={SelectedTab}
                    onSelect={(e) => {
                        const params = new URLSearchParams({ SelectedTab: e })
                        history.replace({ pathname: location.pathname, search: params.toString() })
                        setSelectedTab(e)
                    }}
                >
                    <Nav.Item>
                        <Nav.Link eventKey={"Movements"}>{t("Transactions")}</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey={"Transfers"}>{t("Transfer activity")}</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Container>
            {/*tabs content */}
            <Container fluid className="p-3 pb-2 bg-white historyContent">
                {
                    {
                        Movements:
                            <MovementsTab SearchById={SearchById} setSearchById={setSearchById} Fund={Fund}
                                resetSearchById={resetSearchById} handleMovementSearchChange={handleMovementSearchChange} />,
                        Transfers:
                            <TransfersTab SearchById={SearchById} setSearchById={setSearchById} Fund={Fund}
                                resetSearchById={resetSearchById} handleMovementSearchChange={handleMovementSearchChange} />,
                        Detail:
                            <FundDetail />,
                    }[SelectedTab]
                }
            </Container>
        </PrintDefaultWrapper>
    )
}
export default MainCardAccount