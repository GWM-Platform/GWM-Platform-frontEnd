import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Row, Nav } from 'react-bootstrap';

import { useTranslation } from "react-i18next";
import { useState } from 'react';
import { useHistory } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import { urlContext } from '../../../../../../context/urlContext';

import moment from 'moment';
import './index.css'
import MovementsTab from './MovementsTab';


const MainCard = ({ IsMobile, account, accounts }) => {
    const [SelectedTabs, setSelectedTabs] = useState("0")
    // eslint-disable-next-line 
    const { urlPrefix } = useContext(urlContext)
    const [Hide, setHide] = useState(true)


    const { t } = useTranslation();
    let history = useHistory();

    // eslint-disable-next-line 
    const toLogin = () => {
        sessionStorage.clear();
        history.push(`/login`);
    }

    return (
        <div className="min-free-area-total">
            <Container fluid className="p-0 mt-4">
                <Row className="m-0">
                    <Container className="info ms-0 mb-4 px-0">
                        <Col className="d-flex justify-content-between align-items-end pe-2">
                            <h1 className="m-0 title">
                                {t(account.description)}
                                <span className="ps-3 edit">
                                    Edit
                                </span>
                            </h1>
                            <h2 className="m-0 left">
                                Total balance
                                <span className="ps-3" style={{ fontWeight: "bolder" }}>
                                    {account.currency.symbol}{parseFloat(account.balance).toFixed(account.currency.decimals)}
                                </span>
                            </h2>
                        </Col>
                        <Col className="d-flex justify-content-between align-items-end pe-2 mb-2 pb-2 border-bottom-main">
                            <Col className="d-flex justify-content-between" sm={3}>
                                <Col>
                                    {Hide ? account.externalNumber.replace(/./g, "*") : account.externalNumber}{" "}
                                </Col>
                                <Col sm="auto">
                                    <FontAwesomeIcon
                                        onClick={() => {
                                            setHide(!Hide)
                                        }}
                                        icon={Hide ? faEyeSlash : faEye}
                                    />
                                </Col>
                            </Col>
                            <h2 className="m-0 left">Available
                                <span className="ps-3" style={{ fontWeight: "bolder" }}>
                                    {account.currency.symbol}{parseFloat(account.balance).toFixed(account.currency.decimals)}
                                </span>
                            </h2>
                        </Col>
                        <Col className="d-flex justify-content-between align-items-end">
                            <h1 className="m-0 left">
                                headline:
                                <span className="content">
                                    {` ${account.beneficiaryName}`}
                                </span>
                            </h1>
                        </Col>

                    </Container>
                    {/* Details */}
                    <Col sm="6" className="ps-0 details">
                        <div className="bg-white  p-3">
                            <h1 className="title m-0 mb-3 p-0">
                                Account details
                            </h1>
                            <h2 className="text d-flex justify-content-between ps-2 mb-2">
                                Interest <span className="amount">{account.currency.symbol}4000</span>
                            </h2>
                            <h2 className="text d-flex justify-content-between ps-2 mb-2">
                                Total balance <span className="amount">{account.currency.symbol}1005</span>
                            </h2>
                            <h2 className="text d-flex justify-content-between ps-2 mb-2">
                                Available <span className="amount">{account.currency.symbol}23</span>
                            </h2>
                            <h2 className="text d-flex justify-content-between ps-2 mb-2 border-bottom-none">
                                Accrued interest <span className="amount">{account.currency.symbol}1000</span>
                            </h2>
                        </div>
                    </Col>
                    <Col sm="6" className="pe-0 details">
                        <div className="bg-white p-3">
                            <h1 className="title m-0 mb-3 p-0">
                                Account details
                            </h1>
                            <h2 className="text d-flex justify-content-between ps-2 mb-2">
                                {(moment().subtract(3, 'months').format("MMMM"))} <span className="amount">{account.currency.symbol}4000</span>
                            </h2>
                            <h2 className="text d-flex justify-content-between ps-2 mb-2">
                                {(moment().subtract(2, 'months').format("MMMM"))} <span className="amount">{account.currency.symbol}1005</span>
                            </h2>
                            <h2 className="text d-flex justify-content-between ps-2 mb-2">
                                {(moment().subtract(1, 'months').format("MMMM"))} <span className="amount">{account.currency.symbol}23</span>
                            </h2>
                            <h2 className="text d-flex justify-content-between ps-2 mb-2 border-bottom-none">
                                This month <span className="amount">{account.currency.symbol}1000</span>
                            </h2>
                        </div>
                    </Col>
                    {/*tabs controller*/}
                    <Container fluid className="mt-4 px-0">
                        <Nav className="history-tabs" variant="tabs" activeKey={SelectedTabs} onSelect={(e) => { setSelectedTabs(e) }}>
                            <Nav.Item>
                                <Nav.Link eventKey={"0"}>{t("Last Movements")}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey={"1"}>{t("Accounts State")}</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Container>
                    {/*tabs content */}
                    <Container fluid className="p-3 bg-white">
                        {
                            SelectedTabs === "0" ?
                                <MovementsTab IsMobile={IsMobile} account={account} accounts={accounts} />
                                :
                                <Container>
                                    <Row style={{ height: "55vh" }}>
                                    </Row>
                                </Container>
                        }
                    </Container>
                </Row>
            </Container>
        </div>)
}
export default MainCard

