import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import { Nav, Navbar, Container, Row, Col } from 'react-bootstrap'
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

    const toCreateTicket = (type) => {
        history.push(`${url}/createTicket`);
    }

    return (

        <Navbar sticky="top" className="py-0 mb-0 navBarDesktop" collapseOnSelect expand="sm" variant="dark" >
            <Container fluid className="bottomInnerBorder px-0">
                <Row className="w-100 d-flex justify-content-between align-items-center mx-0">
                    <Col className="offset-md-0 offset-lg-2 px-0" sm="auto">
                        <Nav className="scrollable" >
                            <Nav.Link
                                className="px-2"
                                active={itemSelected === "accounts" || itemSelected === "Accounts"}
                                eventKey={1}
                                onClick={() => {
                                    toAccounts();
                                    setItemSelected("accounts");
                                    setTransactionInfo("notDoneYet")
                                }}
                            >Accounts</Nav.Link>
                            
                            <Nav.Link
                                className="px-2 px-lg-4"
                                active={itemSelected === "createTicket"}
                                eventKey={8}
                                onClick={() => {
                                    toCreateTicket();
                                    setItemSelected("createTicket");
                                    setTransactionInfo("notDoneYet")
                                }}
                            >Create New Ticket</Nav.Link>

                            <Nav.Link
                                className="px-2 px-lg-4"
                                active={itemSelected === "history"}
                                eventKey={2}
                                onClick={() => {
                                    toMovements();
                                    setItemSelected("history");
                                    setTransactionInfo("notDoneYet")
                                }}
                            >{t("History")}</Nav.Link>

                            <Nav.Link
                                active={itemSelected === "bankTransfer"}
                                eventKey={4}
                                onClick={() => {
                                    toTransaction(4);
                                    setItemSelected("bankTransfer");
                                    setTransactionInfo("notDoneYet")
                                }}
                            >
                                Bank Transfer
                            </Nav.Link>

                            <Nav.Link
                                className="px-2 px-lg-4"
                                active={itemSelected === "Contact"}
                                eventKey={5}
                                onClick={() => {
                                    setItemSelected("Contact");
                                    setTransactionInfo("notDoneYet")
                                }}
                            >Contact</Nav.Link>

                            <Nav.Link
                                className="px-2 px-lg-4"
                                active={itemSelected === "Security"}
                                eventKey={6}
                                onClick={() => {
                                    setItemSelected("Security");
                                    setTransactionInfo("notDoneYet")
                                }}
                            >Security</Nav.Link>

                            <Nav.Link
                                className="px-2 px-lg-4"
                                active={itemSelected === "Profile"}
                                eventKey={7}
                                onClick={() => {
                                    setItemSelected("Profile");
                                    setTransactionInfo("notDoneYet")
                                }}
                            >Profile</Nav.Link>

                            <Nav.Link className="d-block d-md-none" eventKey={9} onClick={() => logOut()}>
                                LogOut{" "}
                                <FontAwesomeIcon icon={faSignOutAlt} />
                            </Nav.Link>

                        </Nav>
                    </Col>
                    <Col sm="auto" className="d-none d-md-block">
                        <Nav className="d-flex align-items-center justify-content-end">
                            <div style={{ paddingBottom: "5px" }}>
                                <LanguageSelector />
                            </div>
                            <Nav.Link eventKey={9} onClick={() => logOut()}>
                                LogOut{" "}
                                <FontAwesomeIcon icon={faSignOutAlt} />
                            </Nav.Link>
                        </Nav>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    )
}
export default NavBarDashBoard
