import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'

import { Nav, Navbar, Container, Row, Col, NavDropdown } from 'react-bootstrap'
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

    const toBuy = (type) => {
        history.push(`${url}/buy`);
    }

    const toDeposit = (type) => {
        history.push(`${url}/deposit`);
    }

    const toSell = (type) => {
        history.push(`${url}/sell`);
    }

    const toWithdraw = (type) => {
        history.push(`${url}/withdraw`);
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
                        <Nav className="scrollable">
                            {
                                admin === "true" ?
                                    <Nav.Link
                                        className="px-2"
                                        active={itemSelected === "addAccount"}
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
                                            onClick={() => {
                                                toAccounts();
                                                setItemSelected("accounts");
                                            }}
                                        >{t("Accounts")}</Nav.Link>

                                        <Nav.Link
                                            className="px-2 px-lg-4"
                                            active={itemSelected === "history"}
                                            onClick={() => {
                                                toMovements();
                                                setItemSelected("history");
                                            }}
                                        >{t("History")}</Nav.Link>

                                        <Nav.Link
                                            className="d-block d-sm-none"
                                            active={itemSelected === "buy"}
                                            onClick={() => {
                                                toBuy();
                                                setItemSelected("buy");
                                            }}
                                        >
                                            {t("Buy")}
                                        </Nav.Link>

                                        <Nav.Link
                                            className="d-block d-sm-none"
                                            active={itemSelected === "sell"}
                                            onClick={() => {
                                                toSell();
                                                setItemSelected("sell");
                                            }}
                                        >
                                            {t("Sell")}
                                        </Nav.Link>

                                        <Nav.Link
                                            className="d-block d-sm-none"
                                            active={itemSelected === "deposit"}
                                            onClick={() => {
                                                toDeposit();
                                                setItemSelected("deposit");
                                            }}
                                        >{t("Deposit")}</Nav.Link>

                                        <Nav.Link
                                            className="d-block d-sm-none"
                                            active={itemSelected === "withdraw"}
                                            onClick={() => {
                                                toWithdraw();
                                                setItemSelected("withdraw");
                                            }}
                                        >{t("Withdraw")}</Nav.Link>

                                        <NavDropdown
                                            active={itemSelected === "buy" || itemSelected === "sell" || itemSelected === "deposit" || itemSelected === "withdraw"}
                                            className="d-none d-sm-block d-md-block"
                                            title={t("Create New Ticket")}
                                            id="collasible-nav-dropdown">
                                            <NavDropdown.Item
                                                active={itemSelected === "buy"}
                                                onClick={() => {
                                                    toBuy();
                                                    setItemSelected("buy");
                                                }}
                                            >
                                                {t("Buy")}
                                            </NavDropdown.Item>

                                            <NavDropdown.Item
                                                active={itemSelected === "sell"}
                                                onClick={() => {
                                                    toSell();
                                                    setItemSelected("sell");
                                                }}
                                            >
                                                {t("Sell")}
                                            </NavDropdown.Item>

                                            <NavDropdown.Item
                                                active={itemSelected === "deposit"}
                                                onClick={() => {
                                                    toDeposit();
                                                    setItemSelected("deposit");
                                                }}
                                            >{t("Deposit")}</NavDropdown.Item>

                                            <NavDropdown.Item
                                                active={itemSelected === "withdraw"}
                                                onClick={() => {
                                                    toWithdraw();
                                                    setItemSelected("withdraw");
                                                }}
                                            >{t("Withdraw")}</NavDropdown.Item>
                                        </NavDropdown>

                                        <Nav.Link
                                            className="px-2 px-lg-4"
                                            active={itemSelected === "Profile"}
                                            onClick={() => {
                                                setItemSelected("Profile");
                                            }}
                                        >{t("Profile")}</Nav.Link>
                                    </>
                            }
                            <Nav.Link className="d-block d-md-none" onClick={() => logOut()}>
                                <span className="d-none d-sm-none d-md-inline-block">t("LogOut")}{" "}</span>
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
