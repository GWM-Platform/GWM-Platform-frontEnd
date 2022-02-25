import React, { useContext } from 'react'

import { Nav, Navbar, Container, Row, Col, NavDropdown, Button, OverlayTrigger, Popover } from 'react-bootstrap'
import { useRouteMatch, useHistory } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faChevronCircleUp } from '@fortawesome/free-solid-svg-icons'

import { useTranslation } from "react-i18next";
import { dashboardContext } from '../../../../context/dashboardContext';

import LanguageSelector from '../../../LanguageSelector';
import ClientSelector from './ClientSelector';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

const NavBarDashBoard = ({ itemSelected, NavInfoToggled, setNavInfoToggled }) => {
    const { admin, IndexClientSelected, UserClients } = useContext(dashboardContext)

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
            <Container fluid className="bottomInnerBorder px-0 d-none d-sm-block">
                <Row className="w-100 d-flex align-items-center mx-0">
                    <Col sm="auto" md={1} lg={admin && UserClients.length > 0 && IndexClientSelected === -1 ? "auto" : 2} style={{ paddingBottom: "5px" }}>
                        <Button className={`navInfoToggler ${NavInfoToggled ? "toggled" : ""}`} onClick={() => toggleNavInfo()}>
                            <FontAwesomeIcon icon={faChevronCircleUp} />
                        </Button>
                    </Col>
                    <Col className="px-0 flex-grow-1">
                        <Nav >
                            {
                                admin && IndexClientSelected === -1
                                    ?
                                    <>
                                        <Nav.Link
                                            className="px-2"
                                            active={itemSelected === "fundsAdministration" || itemSelected === "FundsAdministration"}
                                            onClick={() => { goTo("FundsAdministration") }}>
                                            {t("Funds Administration")}
                                        </Nav.Link>
                                        <Nav.Link
                                            className="px-2"
                                            active={itemSelected === "assetsAdministration" || itemSelected === "AssetsAdministration"}
                                            onClick={() => { goTo("AssetsAdministration") }}>
                                            {t("Assets Administration")}
                                        </Nav.Link>
                                        <Nav.Link
                                            className="px-2"
                                            active={itemSelected === "ticketsAdministration" || itemSelected === "TicketsAdministration"}
                                            onClick={() => { goTo("ticketsAdministration") }}>
                                            {t("Tickets Administration")}
                                        </Nav.Link>


                                        <NavDropdown
                                            active={itemSelected === "depositCash" || itemSelected === "DepositCash" || itemSelected === "AddAccount" || itemSelected === "addAccount" || itemSelected === "accountsSupervision"}
                                            className="px-0 transactionDropdown" title={t("Accounts Administration")} id="collasible-nav-dropdown">
                                            <NavDropdown.Item
                                                active={itemSelected === "depositCash" || itemSelected === "DepositCash"}
                                                onClick={() => { goTo("DepositCash") }}>
                                                {t("Deposit Cash")}
                                            </NavDropdown.Item>
                                            <NavDropdown.Item
                                                active={itemSelected === "addAccount" || itemSelected === "addAccount"}
                                                onClick={() => { goTo("addAccount") }}>
                                                {t("Add Account")}
                                            </NavDropdown.Item>
                                            <NavDropdown.Item
                                                active={itemSelected === "accountsSupervision" || itemSelected === "accountssupervision"}
                                                onClick={() => { goTo("accountsSupervision") }}>
                                                {t("Accounts Supervision")}
                                            </NavDropdown.Item>
                                        </NavDropdown>

                                    </>
                                    :
                                    <>
                                        <Nav.Link
                                            className="px-2"
                                            active={itemSelected === "accounts" || itemSelected === "Accounts"}
                                            onClick={() => { goTo("accounts") }}>
                                            {t("Accounts")}
                                        </Nav.Link>
                                        <Nav.Link
                                            className="px-2 px-lg-4"
                                            active={itemSelected === "history"}
                                            onClick={() => {
                                                goTo("history")
                                            }}>
                                            {t("History")}
                                        </Nav.Link>
                                        <NavDropdown className="px-0 transactionDropdown" active={itemSelected === "buy" || itemSelected === "sell" || itemSelected === "deposit" || itemSelected === "withdraw"} title={t("Operations")} id="collasible-nav-dropdown">
                                            <NavDropdown.Item
                                                active={itemSelected === "buy"}
                                                onClick={() => { goTo("buy") }}>
                                                {t("Buy")}
                                            </NavDropdown.Item>
                                            <NavDropdown.Item
                                                active={itemSelected === "sell"}
                                                onClick={() => { goTo("sell") }}>
                                                {t("Sell")}
                                            </NavDropdown.Item>
                                            {/*
                                            <NavDropdown.Item
                                                active={itemSelected === "deposit"}
                                                onClick={() => { toDeposit(); }}>
                                                {t("Deposit")}
                                            </NavDropdown.Item>
                                            */}
                                            <NavDropdown.Item
                                                active={itemSelected === "withdraw"}
                                                onClick={() => { goTo("withdraw"); }}>
                                                {t("Withdraw")}
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    </>
                            }

                        </Nav>
                    </Col>
                    <Col sm="auto">
                        <Nav className="d-flex align-items-center justify-content-end">

                            <div className="d-block d-sm-none d-md-block" style={{ paddingBottom: "5px" }}>
                                <ClientSelector />
                            </div>



                            <div className="d-block d-sm-none d-md-block" style={{ paddingBottom: "5px" }}>
                                <LanguageSelector />
                            </div>
                            <Nav.Link className="text-black" onClick={() => logOut()}>
                                {t("LogOut")}{" "}
                                <FontAwesomeIcon icon={faSignOutAlt} />
                            </Nav.Link>
                        </Nav>
                    </Col>
                </Row>
            </Container>
            <Navbar.Toggle style={{ borderColor: "rgba(0,0,0,0)" }} className="ps-2 ms-2 d-none" aria-controls="responsive-navbar-nav" />
            <Nav className={`w-100 d-block d-sm-none`}  >
                <Container fluid className="px-0">
                    <Row className={`w-100 justify-content-between align-items-center mx-0 px-0 ${itemSelected === "fundsAdministration" || itemSelected === "assetsAdministration" ? "d-flex" : "d-none"}`}>
                        <Col xs="6" className="px-0">
                            <Nav.Link
                                className="ps-4 text-start"
                                active={itemSelected === "fundsAdministration" || itemSelected === "FundsAdministration"}
                                onClick={() => { goTo("fundsAdministration") }}>
                                {t("Funds Administration")}
                            </Nav.Link> </Col>
                        <Col xs="6" className="px-0">
                            <Nav.Link
                                className="pe-4 text-end"
                                active={itemSelected === "assetsAdministration" || itemSelected === "AssetsAdministration"}
                                onClick={() => { goTo("assetsAdministration") }}>
                                {t("Assets Administration")}
                            </Nav.Link>
                        </Col>
                    </Row>

                    <Row className={`w-100 justify-content-between align-items-center mx-0 px-0 ${itemSelected === "addAccount" || itemSelected === "DepositCash" ? "d-flex" : "d-none"}`}>
                        <Col xs="6" className="px-0">
                            <Nav.Link
                                className="ps-4 text-start"
                                active={itemSelected === "DepositCash" || itemSelected === "depositCash"}
                                onClick={() => { goTo("DepositCash") }}>
                                {t("Deposit Cash")}
                            </Nav.Link> </Col>
                        <Col xs="6" className="px-0">
                            <Nav.Link
                                className="pe-4 text-end"
                                active={itemSelected === "addAccount" || itemSelected === "addAccount"}
                                onClick={() => { goTo("addAccount") }}>
                                {t("Add Account")}
                            </Nav.Link>
                        </Col>
                    </Row>

                    <Row className={`w-100 justify-content-between align-items-center mx-0 px-0 ${itemSelected === "ticketsAdministration" || itemSelected === "TicketsAdministration" ? "d-flex" : "d-none"}`}>
                        <Col xs="12" className="px-0">
                            <Nav.Link
                                className="text-center"
                                active={itemSelected === "ticketsAdministration" || itemSelected === "TicketsAdministration"}
                                onClick={() => { goTo("ticketsAdministration") }}>
                                {t("Tickets Administration")}
                            </Nav.Link> </Col>
                    </Row>

                    <Row className={`w-100 justify-content-between align-items-center mx-0 px-0 ${itemSelected === "accounts" || itemSelected === "Accounts" || itemSelected === "history" ? "d-flex" : "d-none"}`}>
                        <Col xs="6" className="px-0">
                            <Nav.Link
                                className="text-center"
                                active={itemSelected === "accounts" || itemSelected === "Accounts"}
                                onClick={() => { goTo("accounts") }}>
                                {t("Accounts")}
                            </Nav.Link> </Col>
                        <Col xs="6" className="px-0">
                            <Nav.Link
                                className="text-center"
                                active={itemSelected === "history"}
                                onClick={() => { goTo("history") }}>
                                {t("History")}
                            </Nav.Link>
                        </Col>
                    </Row>
                    <Row className={`w-100 justify-content-between align-items-center mx-0 px-0 ${itemSelected === "buy" || itemSelected === "sell" || itemSelected === "deposit" || itemSelected === "withdraw" ? "d-flex" : "d-none"}`}>
                        <Col xs="6" className="px-0">
                            <OverlayTrigger trigger='focus' placement="bottom" overlay={
                                <Popover id="popover-funds" className="OverlayNavMobile" >
                                    <Popover.Body>
                                        <NavDropdown.Item
                                            active={itemSelected === "buy"}
                                            onClick={() => { goTo("buy") }}>
                                            {t("Buy")}
                                        </NavDropdown.Item>
                                        <NavDropdown.Item
                                            active={itemSelected === "sell"}
                                            onClick={() => {
                                                goTo("sell")
                                                    ;
                                            }}>
                                            {t("Sell")}
                                        </NavDropdown.Item>
                                    </Popover.Body>
                                </Popover>
                            } popperConfig={1}>
                                <Button className={`left ${itemSelected === "sell" || itemSelected === "buy" ? "active" : ""}`}>
                                    <p className="mb-0" >Fund Operations</p>
                                </Button>
                            </OverlayTrigger>
                        </Col>
                        <Col xs="6" className="px-0">
                            <OverlayTrigger trigger='focus' placement="bottom" overlay={
                                <Popover id="popover-cash" className="OverlayNavMobile">
                                    <Popover.Body>
                                        {/*<NavDropdown.Item
                                            active={itemSelected === "deposit"}
                                            onClick={() => { toDeposit(); }}>
                                            {t("Deposit")}
                                        </NavDropdown.Item>*/}
                                        <NavDropdown.Item
                                            active={itemSelected === "withdraw"}
                                            onClick={() => { goTo("withdraw"); }}>
                                            {t("Withdraw")}
                                        </NavDropdown.Item>
                                    </Popover.Body>
                                </Popover>
                            } popperConfig={1}>
                                <Button className={`right ${itemSelected === "withdraw" || itemSelected === "deposit" ? "active" : ""}`}>
                                    <p className="mb-0" onClick={(e) => { e.target.focus() }}>Cash Operations</p>
                                </Button>
                            </OverlayTrigger>
                        </Col>
                    </Row>
                </Container>
            </Nav>
        </Navbar>
    )
}
export default NavBarDashBoard
