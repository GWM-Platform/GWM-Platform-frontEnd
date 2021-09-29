import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import { Nav, Navbar, NavDropdown, Container, Row, Col } from 'react-bootstrap'
import LanguageSelector from '../../LanguageSelector';
import { useRouteMatch, useHistory } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import { useTranslation } from "react-i18next";

const NavBarDashBoard = ({ setItemSelected, setTransactionInfo, itemSelected, haveInternal }) => {
    const { t } = useTranslation();

    const { url } = useRouteMatch()
    let history = useHistory();

    const logOut = () => {
        sessionStorage.clear();
        history.push(`/`);
    }

    const toAccounts = () => {
        history.push(`${url}/accounts`);
    }


    const toMovements = () => {
        history.push(`${url}/history`);
    }

    const toTransaction = (type) => {
        history.push(`${url}/transactionRequest/0/${type}`);
    }

    return (

        <Navbar sticky="top" className="py-0 mb-0 navBarDesktop" collapseOnSelect expand="sm" variant="dark" >
            <Container fluid className="bottomInnerBorder px-0 d-none d-sm-none d-md-block">
                <Row className="w-100 d-flex justify-content-between align-items-center mx-0">
                    <Col className="offset-md-1 offset-lg-2 px-0" sm="auto">
                        <Nav >
                            <Nav.Link className="px-2" active={itemSelected === "accounts" || itemSelected === "Accounts"} eventKey={1} onClick={() => { toAccounts(); setItemSelected("accounts"); setTransactionInfo("notDoneYet") }}>Accounts</Nav.Link>
                            <Nav.Link className="px-2 px-lg-4" active={itemSelected === "history"} eventKey={2} onClick={() => { toMovements(); setItemSelected("history"); setTransactionInfo("notDoneYet") }}>{t("History")}</Nav.Link>
                            <NavDropdown className="px-0 transactionDropdown" active={itemSelected === "internalTransaction" || itemSelected === "bankTransfer"} title="Transactions" id="collasible-nav-dropdown">
                                <NavDropdown.Item
                                    className={haveInternal ? "d-block" : "d-none"}
                                    active={itemSelected === "internalTransaction"}
                                    eventKey={3}
                                    onClick={() => {
                                        toTransaction(1);
                                        setItemSelected("internalTransaction");
                                        setTransactionInfo("notDoneYet")
                                    }}>
                                    Internal Transaction
                                </NavDropdown.Item>
                                <NavDropdown.Item
                                    active={itemSelected === "bankTransfer"}
                                    eventKey={4}
                                    onClick={() => {
                                        toTransaction(4);
                                        setItemSelected("bankTransfer");
                                        setTransactionInfo("notDoneYet")
                                    }}>
                                    Bank Transfer
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Nav.Link className="px-2 px-lg-4" active={itemSelected === "Contact"} eventKey={5} onClick={() => { setItemSelected("Contact"); setTransactionInfo("notDoneYet") }}>Contact</Nav.Link>

                            <Nav.Link className="px-2 px-lg-4" active={itemSelected === "Security"} eventKey={6} onClick={() => { setItemSelected("Security"); setTransactionInfo("notDoneYet") }}>Security</Nav.Link>

                            <Nav.Link className="px-2 px-lg-4" active={itemSelected === "Profile"} eventKey={7} onClick={() => { setItemSelected("Profile"); setTransactionInfo("notDoneYet") }}>Profile</Nav.Link>

                        </Nav>
                    </Col>
                    <Col sm="auto">
                        <Nav className="d-flex align-items-center justify-content-end">
                            <div style={{ paddingBottom: "5px" }}>
                                <LanguageSelector />
                            </div>
                            <Nav.Link eventKey={6} onClick={() => logOut()}>
                                LogOut{" "}
                                <FontAwesomeIcon icon={faSignOutAlt} />
                            </Nav.Link>
                        </Nav>
                    </Col>
                </Row>
            </Container>
            <Navbar.Toggle style={{ borderColor: "rgba(0,0,0,0)" }} className="ps-2 ms-2 d-none" aria-controls="responsive-navbar-nav" />

            <NavDropdown rootCloseEvent="click" title="☰" className="d-block d-sm-block d-md-none d-lg-none ms-2" id="navbarScrollingDropdown">
                <Nav.Link
                    eventKey={0}
                    onClick={() => {
                        toAccounts();
                        setItemSelected("accounts");
                        setTransactionInfo("notDoneYet")
                    }}>
                    Accounts
                </Nav.Link>
                <Nav.Link
                    eventKey={1}
                    className="px-2 px-lg-4"
                    active={itemSelected === "history"}
                    onClick={() => {
                        toMovements();
                        setItemSelected("history");
                        setTransactionInfo("notDoneYet")
                    }}>
                    {t("History")}
                </Nav.Link>
                <Nav.Link
                    eventKey={2}
                    onClick={() => {
                        toTransaction(1);
                        setItemSelected("internalTransaction");
                        setTransactionInfo("notDoneYet")
                    }}>
                    Internal Transaction
                </Nav.Link>
                <Nav.Link
                    eventKey={3}
                    onClick={() => {
                        toTransaction(4);
                        setItemSelected("bankTransfer");
                        setTransactionInfo("notDoneYet")
                    }}>
                    Bank Transfer
                </Nav.Link>
                <Nav.Link
                    eventKey={4}
                    className="px-2 px-lg-4"
                    active={itemSelected === "Contact"}
                    onClick={() => {
                        setItemSelected("Contact");
                        setTransactionInfo("notDoneYet")
                    }}>
                    Contact
                </Nav.Link>
                <Nav.Link
                    eventKey={5}
                    className="px-2 px-lg-4"
                    active={itemSelected === "Security"}
                    onClick={() => {
                        setItemSelected("Security");
                        setTransactionInfo("notDoneYet")
                    }}>
                    Security
                </Nav.Link>
                <Nav.Link
                    eventKey={6}
                    className="px-2 px-lg-4"
                    active={itemSelected === "Profile"}
                    onClick={() => {
                        setItemSelected("Profile");
                        setTransactionInfo("notDoneYet")
                    }}>
                    Profile
                </Nav.Link>
                <NavDropdown.Divider />
                <Nav.Link eventKey={7} onClick={() => logOut()}>LogOut</Nav.Link>
            </NavDropdown>
        </Navbar>
    )
}
export default NavBarDashBoard
