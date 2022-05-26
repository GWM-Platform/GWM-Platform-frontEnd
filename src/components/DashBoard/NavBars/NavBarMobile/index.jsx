import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentsDollar, faUser, faSignOutAlt, faTicketAlt, faChartLine } from '@fortawesome/free-solid-svg-icons'
import { Row, Container, Col } from 'react-bootstrap'
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';

const NavBarMobile = () => {

    const { t } = useTranslation();

    const { toLogin, itemSelected, admin, IndexClientSelected } = useContext(DashBoardContext)
    const itemSelectedLC = itemSelected.toLowerCase()

    const { url } = useRouteMatch()
    let history = useHistory();

    const toAccounts = () => {
        history.push(`${url}/accounts`);
    }

    const toBuy = (type) => {
        history.push(`${url}/buy`);
    }

    const toFunds = () => {
        history.push(`${url}/fundsAdministration`);
    }

    const toTickets = () => {
        history.push(`${url}/ticketsAdministration`);
    }

    const toAccountsAdmin = () => {
        history.push(`${url}/accountsSupervision`);
    }



    return (
        <Container className="navBarMobile d-block d-sm-none">
            <Row className="rowNavBarMobile flex-nowrap flex-row row justify-content-center py-2">
                {
                    admin && IndexClientSelected === -1 ?
                        <>
                            <Col
                                xs="auto"
                                onClick={() => { toTickets(); }}
                                className={`section ${itemSelectedLC === "ticketsadministration" ? "selected" : ""}`}>
                                <div className="d-flex justify-content-center">
                                    <FontAwesomeIcon className="icon" icon={faTicketAlt} />
                                </div>
                                <h1 className="section-label  mb-0 pb-0" >{t("Tickets")}</h1>
                            </Col>

                            <Col
                                xs="auto"
                                onClick={() => { toFunds() }}
                                className={`section ${itemSelectedLC === "fundsadministration" || itemSelectedLC === "assetsadministration" ? "selected" : ""}`}>
                                <div className="d-flex justify-content-center">
                                    <FontAwesomeIcon className="icon" icon={faChartLine} />
                                </div>
                                <h1 className="section-label  mb-0 pb-0  pb-0" >{t("Funds and Assets")}</h1>
                            </Col>

                            <Col
                                onClick={() => toAccountsAdmin()} xs="auto"
                                className={`section ${itemSelectedLC === "depositcash" || itemSelectedLC === "withdrawcash" || itemSelectedLC === "accountssupervision" || itemSelectedLC === "addaccount" ? "selected" : ""}`}>
                                <div className="d-flex justify-content-center">
                                    <FontAwesomeIcon className="icon" icon={faUser} />
                                </div>
                                <h1 className="section-label  mb-0 pb-0  " >{t("Accounts")}</h1>
                            </Col>

                            <Col className="section" onClick={() => toLogin()} xs="auto">
                                <div className="d-flex justify-content-center">
                                    <FontAwesomeIcon className="icon" icon={faSignOutAlt} />
                                </div>
                                <h1 className="section-label  mb-0 pb-0  " >{t("Logout")}</h1>
                            </Col>
                        </>
                        :
                        <>
                            <Col
                                xs="auto"
                                onClick={() => { toAccounts() }}
                                className={`section ${itemSelectedLC === "accounts" || itemSelectedLC === "history" ? "selected" : ""}`}>
                                <div className="d-flex justify-content-center">
                                    <FontAwesomeIcon className="icon" icon={faUser} />
                                </div>
                                <h1 className="section-label  mb-0 pb-0  pb-0" >{t("Funds")}</h1>
                            </Col>
                            <Col
                                xs="auto"
                                onClick={() => { toBuy(); }}
                                className={`section ${itemSelectedLC === "buy" || itemSelectedLC === "sell" || itemSelectedLC === "deposit" || itemSelectedLC === "withdraw" || itemSelectedLC === "transfer" ? "selected" : ""}`}>
                                <div className="d-flex justify-content-center">
                                    <FontAwesomeIcon className="icon" icon={faCommentsDollar} />
                                </div>
                                <h1 className="section-label  mb-0 pb-0  " >{t("Operations")}</h1>
                            </Col>
                            <Col className="section" onClick={() => toLogin()} xs="auto">
                                <div className="d-flex justify-content-center">
                                    <FontAwesomeIcon className="icon" icon={faSignOutAlt} />
                                </div>
                                <h1 className="section-label  mb-0 pb-0  " >{t("Logout")}</h1>
                            </Col>
                        </>
                }
            </Row>
        </Container>
    )
}
export default NavBarMobile