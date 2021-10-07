import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import { Nav, Navbar, Container, Row, Col } from 'react-bootstrap'
import LanguageSelector from '../../LanguageSelector';
import { useRouteMatch, useHistory } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

import { useTranslation } from "react-i18next";

const NavBarDashBoard = ({ setItemSelected, itemSelected }) => {


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

    const toCreateTicket = (type) => {
        history.push(`${url}/createTicket`);
    }

    const toAddAccount = () => {
        history.push(`${url}/addAccount`);
    }

    const admin = sessionStorage.getItem("admin")

    return (

        <Navbar sticky="top" className="py-0 mb-0 navBarDesktop" collapseOnSelect expand="sm" variant="dark" >
            <Container fluid className="bottomInnerBorder px-0">
                <Row className="w-100 d-flex justify-content-between align-items-center mx-0">
                    <Col className="offset-md-0 offset-lg-2 px-0" sm="auto">
                        <Nav className="scrollable" >
                            {
                                admin === "true" ?
                                    <Nav.Link
                                        className="px-2"
                                        active={itemSelected === "addAccount"}
                                        eventKey={0}
                                        onClick={() => {
                                            setItemSelected("addAccount");
                                            toAddAccount()
                                        }}
                                    >{t("Add Account")}</Nav.Link>
                                    :
                                    <>
                                        <Nav.Link
                                            className="px-2"
                                            active={itemSelected === "accounts" || itemSelected === "Accounts"}
                                            eventKey={1}
                                            onClick={() => {
                                                toAccounts();
                                                setItemSelected("accounts");
                                            }}
                                        >{t("Accounts")}</Nav.Link>

                                        <Nav.Link
                                            className="px-2 px-lg-4"
                                            active={itemSelected === "createTicket"}
                                            eventKey={8}
                                            onClick={() => {
                                                toCreateTicket();
                                                setItemSelected("createTicket");
                                            }}
                                        >{t("Create New Ticket")}</Nav.Link>

                                        <Nav.Link
                                            className="px-2 px-lg-4"
                                            active={itemSelected === "history"}
                                            eventKey={2}
                                            onClick={() => {
                                                toMovements();
                                                setItemSelected("history");
                                            }}
                                        >{t("History")}</Nav.Link>

                                        <Nav.Link
                                            className="px-2 px-lg-4"
                                            active={itemSelected === "Contact"}
                                            eventKey={5}
                                            onClick={() => {
                                                setItemSelected("Contact");
                                            }}
                                        >{t("Contact")}</Nav.Link>

                                        <Nav.Link
                                            className="px-2 px-lg-4"
                                            active={itemSelected === "Profile"}
                                            eventKey={7}
                                            onClick={() => {
                                                setItemSelected("Profile");
                                            }}
                                        >{t("Profile")}</Nav.Link>
                                    </>
                            }
                            <Nav.Link className="d-block d-md-none" eventKey={9} onClick={() => logOut()}>
                                {t("LogOut")}{" "}
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
