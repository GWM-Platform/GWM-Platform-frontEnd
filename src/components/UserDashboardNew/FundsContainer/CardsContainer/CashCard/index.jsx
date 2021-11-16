import React from 'react'
import { Container,Row, Col, Card, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import {  useHistory } from 'react-router-dom';
import './index.css'

const CashCard = ({ Hide, setHide, handleSwitch, SwitchState, Fund }) => {
    const { t } = useTranslation();

    let history = useHistory();

    const toDeposit = (type) => {
        history.push(`/dashboardNew/deposit`);
    }

    const toWithdraw = (type) => {
        history.push(`/dashboardNew/withdraw`);
    }

    return (
        <Col sm="6" md="6" lg="4" className="fund-col">
            <Card className="h-100 cashCard">
                <Card.Header
                    className="header d-flex align-items-center justify-content-center"
                >
                    <div className="currencyContainer d-flex align-items-center justify-content-center">
                        <img className="currency px-0 mx-0" alt={Fund.type} src={process.env.PUBLIC_URL + '/images/' + Fund.type + '.svg'} />
                    </div>
                </Card.Header>
                <Card.Body className="body">
                    <Form.Check
                        onChange={handleSwitch}
                        checked={SwitchState}
                        type="switch"
                        id="FundApi"
                        label={t("API's Funds (For devops)")}
                    />
                    <Card.Title >
                        <h1 className="title mt-0">
                            {t(Fund.description)}
                        </h1>
                        <Container fluid className="px-0">
                            <Row className="d-flex justify-content-between">
                                <h1 className="title mt-1">
                                    <Row className="d-flex justify-content-between">
                                        <div className="pe-0" style={{ width: "auto" }}>
                                            <span>$</span>
                                            {Hide ? parseFloat(Fund.balance).toFixed(Fund.currency.decimals).replace(/./g, "*") : parseFloat(Fund.balance).toFixed(Fund.currency.decimals)}
                                        </div>
                                        <div className="ps-0 hideInfoButton"> 
                                            <FontAwesomeIcon 
                                                className={`icon ${Hide ? "hidden" : "shown"}`}
                                                onClick={() => {setHide(!Hide)}}
                                                icon={faEye}
                                            />
                                            <FontAwesomeIcon 
                                                className={`icon ${!Hide ? "hidden" : "shown"}`}
                                                onClick={() => {setHide(!Hide)}}
                                                icon={faEyeSlash}
                                            />
                                            <FontAwesomeIcon 
                                            className="icon placeholder"
                                                icon={faEyeSlash}
                                            />
                                        </div>
                                    </Row>
                                </h1>
                            </Row>
                        </Container>
                    </Card.Title>
                </Card.Body>
                <Card.Footer className="footer mt-2 m-0 p-0">
                    <Row className="d-flex justify-content-center m-0">
                        <Col xs="6" className="d-flex justify-content-center p-0 m-0">
                            <Button onClick={()=>toDeposit()} className="me-1 button left d-flex align-items-center justify-content-center">
                                <span className="label">Deposit</span>
                            </Button>
                        </Col>
                        <Col xs="6" className="d-flex justify-content-center p-0 m-0">
                            <Button onClick={()=>toWithdraw()} className="ms-1 button right d-flex align-items-center justify-content-center">
                                <span className="label">Withdraw</span>
                            </Button>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </Col>


    )
}
export default CashCard