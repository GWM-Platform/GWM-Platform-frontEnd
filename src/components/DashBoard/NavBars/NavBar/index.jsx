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

const NavBarDashBoard = ({ itemSelected, NavInfoToggled, setNavInfoToggled }) => {
    const { admin, IndexClientSelected, UserClients } = useContext(DashBoardContext)
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
                                admin && IndexClientSelected === -1 ?
                                    <>
                                        <NavDropdown
                                            active={itemSelectedLC === "apl" || itemSelectedLC === "fundsadministration" || itemSelectedLC === "assetsadministration" }
                                            className="px-0 transactionDropdown" title={t("Funds Administration")} id="collasible-nav-dropdown">
                                            <NavDropdown.Item
                                                active={itemSelectedLC === "fundsadministration"}
                                                onClick={() => { goTo("FundsAdministration") }}>
                                                {t("Funds")}
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
                                            {t("Tickets Administration")}
                                        </Nav.Link>
                                        <NavDropdown
                                            active={itemSelectedLC === "withdrawcash" || itemSelectedLC === "depositcash" || itemSelectedLC === "addaccount" || itemSelectedLC === "accountssupervision"}
                                            className="px-0 transactionDropdown" title={t("Accounts Administration")} id="collasible-nav-dropdown">
                                            <NavDropdown.Item
                                                active={itemSelectedLC === "accountssupervision"}
                                                onClick={() => { goTo("accountsSupervision") }}>
                                                {t("Accounts Supervision")}
                                            </NavDropdown.Item>
                                            <NavDropdown.Item
                                                active={itemSelectedLC === "account"}
                                                onClick={() => { goTo("addAccount") }}>
                                                {t("Add Account")}
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
                                        <NavDropdown className="px-0 transactionDropdown" active={itemSelectedLC === "buy" || itemSelectedLC === "sell" || itemSelectedLC === "deposit" || itemSelectedLC === "withdraw" || itemSelectedLC === "transfer"} title={t("Transactions")} id="collasible-nav-dropdown">
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
                                            <NavDropdown.Item
                                                active={itemSelected === "transfer" || itemSelected === "Transfer"}
                                                onClick={() => { goTo("Transfer") }}>
                                                {t("to Transfer")}
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
                    <Row className={`w-100 justify-content-between align-items-center mx-0 px-0 ${itemSelectedLC === "fundsadministration" || itemSelectedLC === "assetsadministration" ? "d-flex" : "d-none"}`}>
                        <Col xs="6" className="px-0">
                            <Nav.Link
                                className="ps-4 text-start"
                                active={itemSelectedLC === "fundsadministration" || itemSelectedLC === "Fundsadministration"}
                                onClick={() => { goTo("fundsAdministration") }}>
                                {t("Funds Administration")}
                            </Nav.Link> </Col>
                        <Col xs="6" className="px-0">
                            <Nav.Link
                                className="pe-4 text-end"
                                active={itemSelectedLC === "assetsadministration"}
                                onClick={() => { goTo("assetsAdministration") }}>
                                {t("Assets Administration")}
                            </Nav.Link>
                        </Col>
                    </Row>

                    <Row className={`w-100 justify-content-between align-items-center mx-0 px-0 ${itemSelectedLC === "addaccount" || itemSelectedLC === "depositcash" ? "d-flex" : "d-none"}`}>
                        <Col xs="6" className="px-0">
                            <Nav.Link
                                className="ps-4 text-start"
                                active={itemSelectedLC === "depositcash"}
                                onClick={() => { goTo("DepositCash") }}>
                                {t("Deposit cash")}
                            </Nav.Link> </Col>
                        <Col xs="6" className="px-0">
                            <Nav.Link
                                className="pe-4 text-end"
                                active={itemSelectedLC === "addaccount"}
                                onClick={() => { goTo("addAccount") }}>
                                {t("Add Account")}
                            </Nav.Link>
                        </Col>
                    </Row>

                    <Row className={`w-100 justify-content-between align-items-center mx-0 px-0 ${itemSelectedLC === "ticketsadministration" ? "d-flex" : "d-none"}`}>
                        <Col xs="12" className="px-0">
                            <Nav.Link
                                className="text-center"
                                active={itemSelectedLC === "ticketsadministration"}
                                onClick={() => { goTo("ticketsAdministration") }}>
                                {t("Tickets Administration")}
                            </Nav.Link> </Col>
                    </Row>

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
                            <OverlayTrigger trigger='focus' placement="bottom" overlay={
                                <Popover id="popover-funds" className="OverlayNavMobile" >
                                    <Popover.Body>
                                        <NavDropdown.Item
                                            active={itemSelectedLC === "buy"}
                                            onClick={() => { goTo("buy") }}>
                                            {t("Buy")}
                                        </NavDropdown.Item>
                                        <NavDropdown.Item
                                            active={itemSelectedLC === "sell"}
                                            onClick={() => {
                                                goTo("sell")
                                                    ;
                                            }}>
                                            {t("Sell")}
                                        </NavDropdown.Item>
                                    </Popover.Body>
                                </Popover>
                            } popperConfig={1}>
                                <Button className={`left ${itemSelectedLC === "sell" || itemSelectedLC === "buy" ? "active" : ""}`}>
                                    <p className="mb-0" >{t("Fund Operations")}</p>
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
                                            active={itemSelectedLC === "withdraw"}
                                            onClick={() => { goTo("withdraw"); }}>
                                            {t("Withdraw")}
                                        </NavDropdown.Item>
                                        <NavDropdown.Item
                                            active={itemSelectedLC === "transfer"}
                                            onClick={() => { goTo("Transfer") }}>
                                            {t("to Transfer")}
                                        </NavDropdown.Item>
                                    </Popover.Body>
                                </Popover>
                            } popperConfig={1}>
                                <Button className={`right ${itemSelectedLC === "withdraw" || itemSelectedLC === "deposit" || itemSelectedLC === "transfer" ? "active" : ""}`}>
                                    <p className="mb-0" onClick={(e) => { e.target.focus() }}>{t("Account Operations")}</p>
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
