import React, { useContext } from 'react'

import { Nav, Navbar, Container, Row, Col, NavDropdown, Button, OverlayTrigger, Popover } from 'react-bootstrap'
import { useRouteMatch, useHistory } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faChevronCircleUp } from '@fortawesome/free-solid-svg-icons'

import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';

import LanguageSelector from 'components/LanguageSelector';
import ClientSelector from './ClientSelector';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

const NavBarDashBoard = ({ NavInfoToggled, setNavInfoToggled }) => {
    const { admin, IndexClientSelected, UserClients, itemSelected } = useContext(DashBoardContext)
    const itemSelectedLC = itemSelected.toLowerCase()
    const { t } = useTranslation();

    const { url } = useRouteMatch()
    let history = useHistory();

    const logOut = () => {
        sessionStorage.clear();
        history.push(`/`);
    }

    const goTo = (destination) => {
        history.push(`${url}/${destination}`);
    }

    const toggleNavInfo = () => {
        setNavInfoToggled(!NavInfoToggled)
    }

    return (
        <Navbar sticky="top" className={`py-0 mb-0 navBarDesktop`} collapseOnSelect expand="sm" variant="dark" >
            {/*====================================================Desktop==================================================== */}
            <Container fluid className="bottomInnerBorder px-0 d-none d-sm-block">
                <Row className="w-100 d-flex align-items-center mx-0">
                    <Col sm="auto" md={1} lg={admin &&  UserClients.content.length > 0 && IndexClientSelected === -1 ? "auto" : 2} style={{ paddingBottom: "5px" }}>
                        <button className={`noStyle navInfoToggler ${NavInfoToggled ? "toggled" : ""}`} onClick={() => toggleNavInfo()}>
                            <FontAwesomeIcon icon={faChevronCircleUp} />
                        </button>
                    </Col>
                    <Col className="px-0 flex-grow-1">
                        <Nav >
                            {
                                admin && IndexClientSelected === -1 ?
                                    /*----------------------------------------------------------Admin----------------------------------------------------------*/
                                    <>
                                        <NavDropdown
                                            active={itemSelectedLC === "timedeposit" || itemSelectedLC === "apl" || itemSelectedLC === "fundsadministration" || itemSelectedLC === "assetsadministration"}
                                            className="px-0 transactionDropdown" title={t("Funds administration")} id="collasible-nav-dropdown">
                                            <NavDropdown.Item
                                                active={itemSelectedLC === "fundsadministration"}
                                                onClick={() => { goTo("FundsAdministration") }}>
                                                {t("Funds")}
                                            </NavDropdown.Item>
                                            <NavDropdown.Item
                                                active={itemSelectedLC === "timedeposit"}
                                                onClick={() => { goTo("TimeDeposit") }}>
                                                {t("Time deposit")}
                                            </NavDropdown.Item>
                                            <NavDropdown.Item
                                                active={itemSelectedLC === "assetsadministration"}
                                                onClick={() => { goTo("AssetsAdministration") }}>
                                                {t("Assets")}
                                            </NavDropdown.Item>
                                            <NavDropdown.Item
                                                active={itemSelectedLC === "apl"}
                                                onClick={() => { goTo("APL") }}>
                                                {t("APL")}
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                        <Nav.Link
                                            className="px-2"
                                            active={itemSelectedLC === "ticketsadministration"}
                                            onClick={() => { goTo("ticketsAdministration") }}>
                                            {t("Tickets administration")}
                                        </Nav.Link>
                                        <NavDropdown
                                            active={itemSelectedLC === "withdrawcash" || itemSelectedLC === "depositcash" || itemSelectedLC === "addaccount" || itemSelectedLC === "accountssupervision" || itemSelectedLC === "connectusertoclient"}
                                            className="px-0 transactionDropdown" title={t("Clients administration")} id="collasible-nav-dropdown">
                                            <NavDropdown.Item
                                                active={itemSelectedLC === "accountssupervision"}
                                                onClick={() => { goTo("accountsSupervision") }}>
                                                {t("Clients supervision")}
                                            </NavDropdown.Item>
                                            <NavDropdown.Item
                                                active={itemSelectedLC === "addaccount"}
                                                onClick={() => { goTo("addAccount") }}>
                                                {t("Add user")}
                                            </NavDropdown.Item>
                                            <NavDropdown.Item
                                                active={itemSelectedLC === "depositcash"}
                                                onClick={() => { goTo("DepositCash") }}>
                                                {t("Deposit cash")}
                                            </NavDropdown.Item>
                                            <NavDropdown.Item
                                                active={itemSelectedLC === "withdrawcash"}
                                                onClick={() => { goTo("withdrawCash") }}>
                                                {t("Withdraw cash")}
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    </>
                                    :
                                    /*----------------------------------------------------------Client----------------------------------------------------------*/
                                    <>
                                        <Nav.Link
                                            className="px-2"
                                            active={itemSelectedLC === "accounts"}
                                            onClick={() => { goTo("accounts") }}>
                                            {t("Accounts")}
                                        </Nav.Link>
                                        <Nav.Link
                                            className="px-2 px-lg-4"
                                            active={itemSelectedLC === "history"}
                                            onClick={() => {
                                                goTo("history")
                                            }}>
                                            {t("History")}
                                        </Nav.Link>
                                        <NavDropdown className="px-0 transactionDropdown" active={itemSelectedLC === "timedeposit" || itemSelectedLC === "buy" || itemSelectedLC === "sell" || itemSelectedLC === "deposit" || itemSelectedLC === "withdraw" || itemSelectedLC === "transfer"} title={t("Transactions")} id="collasible-nav-dropdown">
                                            <NavDropdown.Item
                                                active={itemSelectedLC === "buy"}
                                                onClick={() => { goTo("buy") }}>
                                                {t("Buy")}
                                            </NavDropdown.Item>
                                            <NavDropdown.Item
                                                active={itemSelectedLC === "sell"}
                                                onClick={() => { goTo("sell") }}>
                                                {t("Sell")}
                                            </NavDropdown.Item>
                                            <NavDropdown.Item
                                                active={itemSelectedLC === "withdraw"}
                                                onClick={() => { goTo("withdraw"); }}>
                                                {t("Withdraw")}
                                            </NavDropdown.Item>
                                            <NavDropdown.Item
                                                active={itemSelectedLC === "transfer"}
                                                onClick={() => { goTo("Transfer") }}>
                                                {t("to Transfer")}
                                            </NavDropdown.Item>
                                            <NavDropdown.Item
                                                active={itemSelectedLC === "timedeposit"}
                                                onClick={() => { goTo("TimeDeposit") }}>
                                                {t("Time deposit")}
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    </>
                            }

                        </Nav>
                    </Col>
                    {/*----------------------------------------------------------General----------------------------------------------------------*/}
                    <Col sm="auto">
                        <Nav className="d-flex align-items-center justify-content-end">

                            <div className="d-block d-sm-none d-md-block" style={{ paddingBottom: "5px" }}>
                                <ClientSelector />
                            </div>

                            <div className="d-block d-sm-none d-md-block" style={{ paddingBottom: "5px" }}>
                                <LanguageSelector />
                            </div>

                            <Nav.Link className="text-black" onClick={() => logOut()}>
                                {t("LogOut")}&nbsp;
                                <FontAwesomeIcon icon={faSignOutAlt} />
                            </Nav.Link>
                        </Nav>
                    </Col>
                </Row>
            </Container>
            <Navbar.Toggle style={{ borderColor: "rgba(0,0,0,0)" }} className="ps-2 ms-2 d-none" aria-controls="responsive-navbar-nav" />

            {/*====================================================Mobile==================================================== */}
            <Nav className={`w-100 d-block d-sm-none`}  >
                <Container fluid className="px-0">
                    {/*----------------------------------------------------------Admin----------------------------------------------------------*/}
                    <Row className={`w-100 justify-content-between align-items-center mx-0 px-0 ${itemSelectedLC === "fundsadministration" || itemSelectedLC === "assetsadministration" ? "d-flex" : "d-none"}`}>
                        <Col xs="6" className="px-0">
                            <Nav.Link
                                className="ps-4 text-center"
                                active={itemSelectedLC === "fundsadministration" || itemSelectedLC === "Fundsadministration"}
                                onClick={() => { goTo("fundsAdministration") }}>
                                {t("Funds")}
                            </Nav.Link> </Col>
                        <Col xs="6" className="px-0">
                            <Nav.Link
                                className="pe-4 text-center"
                                active={itemSelectedLC === "assetsadministration"}
                                onClick={() => { goTo("assetsAdministration") }}>
                                {t("Assets")}
                            </Nav.Link>
                        </Col>
                    </Row>

                    <Row className={`w-100 justify-content-between align-items-center mx-0 px-0 ${itemSelectedLC === "addaccount" || itemSelectedLC === "depositcash" || itemSelectedLC === "withdrawcash" || itemSelectedLC === "accountssupervision" || itemSelectedLC === "connectusertoclient" ? "d-flex" : "d-none"}`}>
                        <Col xs="6" className="px-0">
                            <OverlayTrigger placement="bottom" overlay={
                                <Popover id="popover-funds" className="OverlayNavMobile" >
                                    <Popover.Body>
                                        <NavDropdown.Item
                                            className="p-2"
                                            active={itemSelectedLC === "depositcash"} onClick={() => goTo("depositCash")}>
                                            {t("Deposit cash")}
                                        </NavDropdown.Item>
                                        <NavDropdown.Item
                                            className="p-2"
                                            active={itemSelectedLC === "withdrawcash"} onClick={() => goTo("withdrawCash")}>
                                            {t("Withdraw cash")}
                                        </NavDropdown.Item>
                                    </Popover.Body>
                                </Popover>
                            } popperConfig={1}>
                                <Button className={`dropdownButton nav-link ${itemSelectedLC === "withdrawcash" || itemSelectedLC === "depositcash" ? "active" : ""}`}>
                                    <p className="mobile-dropdown mb-0" >{t("Operations")}</p>
                                </Button>
                            </OverlayTrigger>
                        </Col>
                        <Col xs="6" className="px-0">
                            <OverlayTrigger placement="bottom" overlay={
                                <Popover id="popover-funds" className="OverlayNavMobile" >
                                    <Popover.Body>
                                        <NavDropdown.Item
                                            className="p-2"
                                            active={itemSelectedLC === "accountssupervision"}
                                            onClick={() => { goTo("accountsSupervision") }}>
                                            {t("Clients supervision")}
                                        </NavDropdown.Item>
                                        <NavDropdown.Item
                                            className="p-2"
                                            active={itemSelectedLC === "addaccount"} onClick={() => { goTo("addAccount") }}>
                                            {t("Add user")}
                                        </NavDropdown.Item>
                                    </Popover.Body>
                                </Popover>
                            } popperConfig={1}>
                                <Button className={`dropdownButton nav-link ${itemSelectedLC === "addaccount" || itemSelectedLC === "accountssupervision" || itemSelectedLC === "connectusertoclient" ? "active" : ""}`}>
                                    <p className="mobile-dropdown mb-0" >{t("Accounts")}</p>
                                </Button>
                            </OverlayTrigger>
                        </Col>
                    </Row>

                    <Row className={`w-100 justify-content-between align-items-center mx-0 px-0 ${itemSelectedLC === "ticketsadministration" ? "d-flex" : "d-none"}`}>
                        <Col xs="12" className="px-0">
                            <Nav.Link
                                className="text-center"
                                active={itemSelectedLC === "ticketsadministration"}
                                onClick={() => { goTo("ticketsAdministration") }}>
                                {t("Tickets Administration")}
                            </Nav.Link>
                        </Col>
                    </Row>

                    {/*----------------------------------------------------------Client----------------------------------------------------------*/}
                    <Row className={`w-100 justify-content-between align-items-center mx-0 px-0 ${itemSelectedLC === "accounts" || itemSelectedLC === "history" ? "d-flex" : "d-none"}`}>
                        <Col xs="6" className="px-0">
                            <Nav.Link
                                className="text-center"
                                active={itemSelectedLC === "accounts"}
                                onClick={() => { goTo("accounts") }}>
                                {t("Accounts")}
                            </Nav.Link> </Col>
                        <Col xs="6" className="px-0">
                            <Nav.Link
                                className="text-center"
                                active={itemSelectedLC === "history"}
                                onClick={() => { goTo("history") }}>
                                {t("History")}
                            </Nav.Link>
                        </Col>
                    </Row>
                    <Row className={`w-100 justify-content-between align-items-center mx-0 px-0 ${itemSelectedLC === "buy" || itemSelectedLC === "sell" || itemSelectedLC === "deposit" || itemSelectedLC === "withdraw" || itemSelectedLC === "transfer" ? "d-flex" : "d-none"}`}>
                        <Col xs="6" className="px-0">
                            <OverlayTrigger placement="bottom" overlay={
                                <Popover id="popover-funds" className="OverlayNavMobile" >
                                    <Popover.Body>
                                        <NavDropdown.Item className="p-2"
                                            active={itemSelectedLC === "buy"} onClick={() => goTo("buy")}>
                                            {t("Buy")}
                                        </NavDropdown.Item>
                                        <NavDropdown.Item className="p-2"
                                            active={itemSelectedLC === "sell"} onClick={() => goTo("sell")}>
                                            {t("Sell")}
                                        </NavDropdown.Item>
                                    </Popover.Body>
                                </Popover>
                            } popperConfig={1}>
                                <Button className={`nav-link dropdownButton ${itemSelectedLC === "sell" || itemSelectedLC === "buy" ? "active" : ""}`}>
                                    <p className="mb-0 mobile-dropdown" >{t("Funds")}</p>
                                </Button>
                            </OverlayTrigger>
                        </Col>
                        <Col xs="6" className="px-0">
                            <OverlayTrigger
                                placement="bottom" overlay={
                                    <Popover id="popover-cash" className="OverlayNavMobile">
                                        <Popover.Body>
                                            <NavDropdown.Item
                                                className="p-2"
                                                active={itemSelectedLC === "withdraw"}
                                                onClick={() => { goTo("withdraw"); }}>
                                                {t("Withdraw")}
                                            </NavDropdown.Item>
                                            <NavDropdown.Item
                                                className="p-2"
                                                active={itemSelectedLC === "transfer"}
                                                onClick={() => { goTo("Transfer") }}>
                                                {t("to Transfer")}
                                            </NavDropdown.Item>
                                        </Popover.Body>
                                    </Popover>
                                } popperConfig={1}>
                                <Button className={`nav-link dropdownButton ${itemSelectedLC === "withdraw" || itemSelectedLC === "deposit" || itemSelectedLC === "transfer" ? "active" : ""}`}>
                                    <p className="mb-0 mobile-dropdown" onClick={(e) => { e.target.focus() }}>{t("Account")}</p>
                                </Button>
                            </OverlayTrigger>
                        </Col>
                    </Row>
                </Container>
            </Nav >
        </Navbar >
    )
}
export default NavBarDashBoard
