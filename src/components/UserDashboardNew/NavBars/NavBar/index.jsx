import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import { Nav, Navbar, Container, Row, Col, NavDropdown, Button, OverlayTrigger, Popover } from 'react-bootstrap'
import LanguageSelector from '../../../LanguageSelector';
import { useRouteMatch, useHistory } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt, faChevronCircleUp } from '@fortawesome/free-solid-svg-icons'

import { useTranslation } from "react-i18next";

const NavBarDashBoard = ({ setItemSelected, itemSelected, NavInfoToggled, setNavInfoToggled }) => {


    const { t } = useTranslation();

    const { url } = useRouteMatch()
    let history = useHistory();

    const logOut = () => {
        sessionStorage.clear();
        history.push(`/`);
    }

    const toAccounts = () => {
        setItemSelected("accounts");
        history.push(`${url}/accounts`);
    }

    const toMovements = () => {
        setItemSelected("history");
        history.push(`${url}/history`);
    }

    const toBuy = (type) => {
        setItemSelected("buy");
        history.push(`${url}/buy`);
    }

    const toSell = (type) => {
        setItemSelected("sell");
        history.push(`${url}/sell`);
    }
    
    const toDeposit = (type) => {
        setItemSelected("deposit");
        history.push(`${url}/deposit`);
    }
    
    const toWithdraw = (type) => {
        setItemSelected("withdraw");
        history.push(`${url}/withdraw`);
    }

    const toAddAccount = () => {
        setItemSelected("addAccount");
        history.push(`${url}/addAccount`);
    }

    const toggleNavInfo = () => {
        setNavInfoToggled(!NavInfoToggled)
    }

    const admin = sessionStorage.getItem("admin")

    return (

        <Navbar  sticky="top" className="py-0 mb-0 navBarDesktop" collapseOnSelect expand="sm" variant="dark" >
            <Container fluid className="bottomInnerBorder px-0 d-none d-sm-block">
                <Row className="w-100 d-flex align-items-center mx-0">
                    <Col md={1} lg={2} style={{ paddingBottom: "5px" }}>
                        <Button className={`navInfoToggler ${NavInfoToggled ? "toggled" : ""}`} onClick={() => toggleNavInfo()}>
                            <FontAwesomeIcon icon={faChevronCircleUp} />
                        </Button>
                    </Col>
                    <Col className="px-0 flex-grow-1" sm="auto">
                        <Nav >
                            {
                                JSON.parse(admin)
                                ?
                                <Nav.Link
                                    className="px-2"
                                    active={itemSelected === "addAccount" || itemSelected === "addAccount"}
                                    onClick={() => { toAddAccount() }}>
                                    {t("Add Account")}
                                </Nav.Link>
                                :
                                <>
                                    <Nav.Link
                                        className="px-2"
                                        active={itemSelected === "accounts" || itemSelected === "Accounts"}
                                        onClick={() => { toAccounts() }}>
                                        {t("Accounts")}
                                    </Nav.Link>
                                    <Nav.Link
                                        className="px-2 px-lg-4"
                                        active={itemSelected === "history"}
                                        onClick={() => { toMovements() }}>
                                        {t("History")}
                                    </Nav.Link>
                                    <NavDropdown className="px-0 transactionDropdown" active={itemSelected === "buy" || itemSelected === "sell" || itemSelected === "deposit" || itemSelected === "withdraw"} title={t("Operations")} id="collasible-nav-dropdown">
                                        <NavDropdown.Item
                                            active={itemSelected === "buy"}
                                            onClick={() => { toBuy(); }}>
                                            {t("Buy")}
                                        </NavDropdown.Item>
                                        <NavDropdown.Item
                                            active={itemSelected === "sell"}
                                            onClick={() => { toSell(); }}>
                                            {t("Sell")}
                                        </NavDropdown.Item>
                                        <NavDropdown.Item
                                            active={itemSelected === "deposit"}
                                            onClick={() => { toDeposit(); }}>
                                            {t("Deposit")}
                                        </NavDropdown.Item>
                                        <NavDropdown.Item
                                            active={itemSelected === "withdraw"}
                                            onClick={() => { toWithdraw(); }}>
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
                                <LanguageSelector />
                            </div>
                            <Nav.Link onClick={() => logOut()}>
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
                    <Row className={`w-100 justify-content-between align-items-center mx-0 px-0 ${itemSelected === "accounts" || itemSelected === "Accounts" || itemSelected === "history" ? "d-flex" : "d-none"}`}>
                        <Col xs="6" className="px-0">
                            <Nav.Link
                                className="ps-4 text-start"
                                active={itemSelected === "accounts" || itemSelected === "Accounts"}
                                onClick={() => { toAccounts() }}>
                                {t("Accounts")}
                            </Nav.Link> </Col>
                        <Col xs="6" className="px-0">
                            <Nav.Link
                                className="pe-4 text-end"
                                active={itemSelected === "history"}
                                onClick={() => { toMovements() }}>
                                {t("History")}
                            </Nav.Link>
                        </Col>
                    </Row>
                    <Row className={`w-100 justify-content-between align-items-center mx-0 px-0 ${itemSelected === "buy" || itemSelected === "sell" || itemSelected === "deposit" || itemSelected === "withdraw" ? "d-flex" : "d-none"}`}>
                        <Col xs="6" className="px-0">
                            <OverlayTrigger  trigger='focus' placement="bottom" overlay={
                                <Popover id="popover-funds" className="OverlayNavMobile" >
                                    <Popover.Body>
                                        <NavDropdown.Item
                                            active={itemSelected === "buy"}
                                            onClick={() => { toBuy(); }}>
                                            {t("Buy")}
                                        </NavDropdown.Item>
                                        <NavDropdown.Item
                                            active={itemSelected === "sell"}
                                            onClick={() => { toSell(); }}>
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
                                        <NavDropdown.Item
                                            active={itemSelected === "deposit"}
                                            onClick={() => { toDeposit(); }}>
                                            {t("Deposit")}
                                        </NavDropdown.Item>
                                        <NavDropdown.Item
                                            active={itemSelected === "withdraw"}
                                            onClick={() => { toWithdraw(); }}>
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
