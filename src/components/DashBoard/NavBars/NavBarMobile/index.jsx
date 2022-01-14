import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCommentsDollar, faUser,faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { Row, Container, Col } from 'react-bootstrap'
import { useRouteMatch, useHistory } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const NavBarMobile = ({ setItemSelected , itemSelected }) => {
    
    const { t } = useTranslation();

    const { url } = useRouteMatch()
    let history = useHistory();

    const toAccounts = () => {
        setItemSelected("accounts")
        history.push(`${url}/accounts`);
    }

    const toBuy = (type) => {
        setItemSelected("buy");
        history.push(`${url}/buy`);
    }

    const logOut = () => {
        sessionStorage.clear();
        history.push(`/`);
    }

    return (
        <Container className="navBarMobile d-block d-sm-none">
            <Row className="rowNavBarMobile flex-nowrap flex-row row justify-content-center py-2">
                <Col
                    xs="auto"
                    onClick={() => { toAccounts() }}
                    className={`${itemSelected === "accounts" || itemSelected === "Accounts" || itemSelected === "history"  ? "selected" : ""}`}>
                    <div className="d-flex justify-content-center">
                        <FontAwesomeIcon className="icon" icon={faUser} />
                    </div>
                    <h1 className="section-label mt-0 mb-0 pb-0 pt-1 pb-0" >{t("Funds")}</h1>
                </Col>
                <Col
                    xs="auto"
                    onClick={() => { toBuy(); }}
                    className={`${itemSelected === "buy" || itemSelected === "sell" || itemSelected === "deposit" || itemSelected === "withdraw"? "selected" : ""}`}>
                    <div className="d-flex justify-content-center">
                        <FontAwesomeIcon className="icon" icon={faCommentsDollar} />
                    </div>
                    <h1 className="section-label mt-0 mb-0 pb-0  pt-1" >{t("Create Tickets")}</h1>
                </Col>
                <Col
                    onClick={()=>logOut()}
                    xs="auto"
                    className={`${itemSelected === "contact" ? "selected" : ""}`}>
                    <div className="d-flex justify-content-center">
                        <FontAwesomeIcon className="icon" icon={faSignOutAlt} />
                    </div>
                    <h1 className="section-label mt-0 mb-0 pb-0  pt-1" >{t("Logout")}</h1>
                </Col>
            </Row>
        </Container>
    )
}
export default NavBarMobile