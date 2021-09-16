import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import { Nav, Navbar, NavDropdown, Container, Row, Col } from 'react-bootstrap'
import LanguageSelector from '../../LanguageSelector';
import { useRouteMatch, useHistory } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from "react-i18next";

const NavBarDashBoard = ({ setItemSelected, setTransactionInfo, itemSelected }) => {
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
        history.push(`${url}/movementsTable`);
    }

    const toTransaction = (type) => {
        history.push(`${url}/transactionRequest/0/${type}`);
    }

    const { t } = useTranslation();

    return (

        <Navbar sticky="top" className="py-0 navBarSections" collapseOnSelect expand="sm" variant="dark">
            <Container fluid className="bottomInnerBorder">
                <Row className="w-100 d-flex justify-content-between align-items-center">
                    <Col className="offset-md-1 offset-lg-2" sm="auto">
                        <Nav>
                            <Nav.Link active={itemSelected === "accounts" || itemSelected === "Accounts"} eventKey={2} onClick={() => { toAccounts(); setItemSelected("accounts"); setTransactionInfo("notDoneYet") }}>Accounts</Nav.Link>
                            <Nav.Link active={itemSelected === "movementsTable"} eventKey={5} onClick={() => { toMovements(); setItemSelected("movementsTable"); setTransactionInfo("notDoneYet") }}>Movements table</Nav.Link>
                            <NavDropdown active={itemSelected === "internalTransaction" || itemSelected === "otherTransaction"} title="Transactions" id="collasible-nav-dropdown">
                                <NavDropdown.Item
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
                                    active={itemSelected === "otherTransaction"}
                                    eventKey={4}
                                    onClick={() => {
                                        toTransaction(4);
                                        setItemSelected("otherTransaction");
                                        setTransactionInfo("notDoneYet")
                                    }}>
                                    Other Transaction
                                </NavDropdown.Item>
                            </NavDropdown>
                        </Nav>
                    </Col>
                    <Col sm="auto">
                        <Nav className="d-flex align-items-center">
                            <LanguageSelector />
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
                <Nav.Link eventKey={1} onClick={() => { toAccounts(); setItemSelected("accounts"); setTransactionInfo("notDoneYet") }}>Accounts</Nav.Link>
                <Nav.Link eventKey={1} onClick={() => { toTransaction(1); setItemSelected("internalTransaction"); setTransactionInfo("notDoneYet") }}>Internal Transaction</Nav.Link>
                <Nav.Link eventKey={1} onClick={() => { toTransaction(4); setItemSelected("otherTransaction"); setTransactionInfo("notDoneYet") }}>Other Transaction</Nav.Link>
                <NavDropdown.Divider />
                <Nav.Link eventKey={1} onClick={() => logOut()}>LogOut</Nav.Link>
            </NavDropdown>
        </Navbar>
    )
}
export default NavBarDashBoard
