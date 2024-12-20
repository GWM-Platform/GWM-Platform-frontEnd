import React, { useCallback, useContext, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Nav, Button, Spinner, Dropdown } from 'react-bootstrap';

import { useTranslation } from "react-i18next";
import { useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye, faChevronDown } from '@fortawesome/free-solid-svg-icons'

import MovementsTab from './MovementsTab';
import TransfersTab from './TransfersTab';
import FundDetail from './FundDetail';
import './index.css'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { PrintButton, PrintDefaultWrapper, usePrintDefaults } from 'utils/usePrint';
import { faFileExcel } from '@fortawesome/free-regular-svg-icons';
import { exportToExcel } from 'utils/exportToExcel';
import MovementTable from 'TableExport/MovementTable';
import ReactPDF from '@react-pdf/renderer';
import { DashBoardContext } from 'context/DashBoardContext';
import { yearsArraySince } from 'components/DashBoard/GeneralUse/PerformanceComponent';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAnnualStatement, selectAnnualStatementById } from 'Slices/DashboardUtilities/annualStatementsSlice';
import HoldingsReport from 'TableExport/HoldingsReport';
import moment from 'moment';
import "components/DashBoard/Admin/Broadcast/index.scss"

const MainCardAccount = ({ Fund, Hide, setHide, SearchById, setSearchById, resetSearchById, handleMovementSearchChange, sections, linkToFixedDeposit }) => {
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

    const { getPageMargins, componentRef, title, aditionalStyles } = usePrintDefaults(
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

    const [Movements, setMovements] = useState({ movements: 0, total: 0 })
    const [rendering, setRendering] = useState(false)
    const { getMoveStateById, ClientSelected } = useContext(DashBoardContext)

    const renderAndDownloadTablePDF = async () => {
        setRendering(true)
        const blob = await ReactPDF.pdf(
            <MovementTable
                movements={Movements.movements}
                headerInfo={{
                    clientName:
                        `${ClientSelected?.firstName === undefined ? "" : ClientSelected?.firstName === "-" ? "" : ClientSelected?.firstName
                        }${ClientSelected?.lastName === undefined ? "" : ClientSelected?.lastName === "-" ? "" : ` ${ClientSelected?.lastName}`
                        }`,
                    balance: balanceInCash.toString()
                }} getMoveStateById={getMoveStateById} />).toBlob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${t("Cash_movements")}.pdf`)
        // 3. Append to html page
        document.body.appendChild(link)
        // 4. Force download
        link.click()
        // 5. Clean up and remove the link
        link.parentNode.removeChild(link)
        setRendering(false)
    }


    return (
        <PrintDefaultWrapper className="movementsMainCardAccount growAnimation pt-2" aditionalStyles={aditionalStyles} ref={componentRef} getPageMargins={getPageMargins} title={title} >
            <div className="main-card-header bg-white info ms-0 mb-2 px-0">
                <div className="d-flex align-items-start pe-2">
                    <Col className="d-flex justify-content-between pe-5 me-auto mt-2" sm="auto">
                        <SectionSelector sections={sections} title={t("Cash")} />
                    </Col>
                    <Col xs="auto" className='ms-2' style={{ marginTop: ".4rem" }}>

                        <Button className="me-2 print-button no-style" variant="info" onClick={() => exportToExcel(
                            SelectedTab === "Movements" ?
                                {
                                    filename: t("Cash_movements"),
                                    sheetName: t("Cash_movements"),
                                    dataTableName: "cta-cte-movements",
                                    excludedColumns: ["ticket", "actions"],
                                    // plainNumberColumns: ["unit_floor", "unit_unitNumber", "unit_typology"]
                                }
                                :
                                {
                                    filename: t("Cash_transfers"),
                                    sheetName: t("Cash_transfers"),
                                    dataTableName: "cta-cte-transfers",
                                    excludedColumns: ["ticket", "actions"],
                                    // plainNumberColumns: ["unit_floor", "unit_unitNumber", "unit_typology"]
                                }
                        )} >
                            <FontAwesomeIcon icon={faFileExcel} />
                        </Button>
                    </Col>
                    {
                        SelectedTab === "Movements" &&
                        <Col xs="auto" style={{ marginTop: ".4rem" }}>
                            {
                                rendering ?
                                    <Spinner animation="border" size="sm" />
                                    :
                                    <PrintButton className="w-100 h-100" variant="info" handlePrint={renderAndDownloadTablePDF} />
                            }
                        </Col>
                    }
                    {/* <YearlyStatement ClientSelected={ClientSelected} /> */}
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
                            <MovementsTab
                                linkToFixedDeposit={linkToFixedDeposit}
                                Movements={Movements} setMovements={setMovements}
                                SearchById={SearchById} setSearchById={setSearchById} Fund={Fund}
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

export const SectionSelector = ({ sections, title, titleClassName }) => {
    return (<Dropdown>
        <Dropdown.Toggle as={CustomToggle} id="dropdown-custom-components" titleClassName={titleClassName}>
            {title}
        </Dropdown.Toggle>
        <Dropdown.Menu>
            {
                sections?.map((section, index) =>
                    section.children ?
                        <React.Fragment key={index}>
                            <Dropdown.Header className="py-1">{section.title}</Dropdown.Header>
                            {section.children.map(
                                (child, childIndex) =>
                                    <Dropdown.Item key={`${index}-${childIndex}`} eventKey={`${index}-${childIndex}`} active={child.active} onClick={child.onSelect}>{child.title}</Dropdown.Item>

                            )}
                            <Dropdown.Divider className='my-1' />
                        </React.Fragment>
                        :
                        <React.Fragment key={index}>
                            <Dropdown.Item eventKey={index} active={section.active} onClick={section.onSelect}>{section.title}</Dropdown.Item>
                            {
                                sections.length - 1 !== index &&
                                <Dropdown.Divider className='my-1' />
                            }
                        </React.Fragment>
                )
            }
        </Dropdown.Menu>
    </Dropdown>)
}

const CustomToggle = React.forwardRef(({ children, onClick, titleClassName = `m-0 title px-2` }, ref) => (
    <h1
        className={titleClassName}
        style={{ cursor: "pointer" }}
        ref={ref}
        onClick={(e) => {
            onClick(e);
        }}
    >
        {children}
        <FontAwesomeIcon icon={faChevronDown} className="ms-2" size='2xs' />
    </h1>
));

export const YearlyStatement = ({ ClientSelected, wrapperClassName = "d-inline-block mt-2 mb-0", selectClassName = "ms-2", selectWidth = "21.5ch", label = "Reporte de tenencias" }) => {

    const { t } = useTranslation()
    const dispatch = useDispatch()

    const [renderingAnnual, setRenderingAnnual] = useState(false)

    const [value, setValue] = useState("")
    const annualStatement = useSelector(state => selectAnnualStatementById(state, value))
    const status = annualStatement?.status || "idle"

    const renderAndDownloadAnnualStatementPDF = useCallback(
        async () => {
            setRenderingAnnual(true)
            const blob = await ReactPDF.pdf(
                <HoldingsReport
                    holdings={annualStatement?.annualStatement}
                    headerInfo={{
                        clientName:
                            `${ClientSelected?.firstName === undefined ? "" : ClientSelected?.firstName === "-" ? "" : ClientSelected?.firstName
                            }${ClientSelected?.lastName === undefined ? "" : ClientSelected?.lastName === "-" ? "" : ` ${ClientSelected?.lastName}`
                            }`
                    }}
                    year={value}
                />).toBlob()
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `Reporte de tenencias ${value}.pdf`)
            // 3. Append to html page
            document.body.appendChild(link)
            // 4. Force download
            link.click()
            // 5. Clean up and remove the link
            link.parentNode.removeChild(link)
            setRenderingAnnual(false)
        }, [ClientSelected?.firstName, ClientSelected?.lastName, annualStatement?.annualStatement, value]
    )

    useEffect(() => {
        if (renderingAnnual) {
            if (status === "succeeded") {
                renderAndDownloadAnnualStatementPDF()
            } else if (status === "error") {
                setRenderingAnnual(false)
            }
        }
    }, [renderAndDownloadAnnualStatementPDF, renderingAnnual, status])

    return (
        <div className={`tiptap-wrapper ${wrapperClassName}`}>
            <select
                className={selectClassName}
                style={{ width: selectWidth }}
                value={renderingAnnual ? value : ""}
                onChange={e => {
                    setRenderingAnnual(true)
                    dispatch(fetchAnnualStatement({
                        ...e.target.value !== "" ? { year: e.target.value } : {},
                        clientId: ClientSelected?.id
                    }))
                    setValue(e.target.value)
                }}
                disabled={renderingAnnual}
            >
                <option value="" disabled>
                    {t(label)}
                </option>
                {
                    yearsArraySince(2022, moment().subtract(1, "year").get("year")).map(year => (
                        <option value={year} key={year}>Periodo {year - 1} - {year}</option>
                    ))
                }
            </select>
        </div>
    )
}