import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import './index.css'
import {  useHistory } from 'react-router-dom';



const FundCard = ({ Hide, setHide, Fund, PendingTransactions }) => {
    const { t } = useTranslation();

    let history = useHistory();

    const pendingFeeParts = PendingTransactions.value.filter((transaction) => transaction.fundId === Fund.fund.id && Math.sign(transaction.shares) === +1).map((transaction) => transaction.shares).reduce((a, b) => a + b, 0).toFixed(2)
    
    const toTickets = (operation) => {
        history.push(`${operation}?fund=${Fund.fund.id}`);
    }

    return (
        <Col className="fund-col growAnimation" sm="6" md="6" lg="4" >
            <Card className="FundCard h-100">
                <Card.Header
                    className="header d-flex align-items-center justify-content-center"
                >
                    <div className="currencyContainer d-flex align-items-center justify-content-center">
                        {
                            Fund.fund.type !== undefined ?
                                <img className="currency px-0 mx-0" alt={Fund.fund.type} src={process.env.PUBLIC_URL + '/images/' + Fund.fund.type + '.svg'} />
                                :
                                <img className="currency px-0 mx-0" alt="crypto" src={process.env.PUBLIC_URL + '/images/crypto.svg'} />
                        }
                    </div>
                </Card.Header>
                <Card.Body className="body">
                    <Row className="h-100 align-content-between">
                        <Card.Title >
                            <h1 className="title mt-0">
                                {t(Fund.fund.name)}
                            </h1>
                        </Card.Title>
                        <Container>
                            <Row className="d-flex justify-content-between">
                                <h1 className="title-gray mt-1">
                                    <Row className="d-flex justify-content-between">
                                        <div className="pe-2 containerHideInfo">
                                            <span>$</span>
                                            <span className={`info ${Hide ? "shown" : "hidden"}`}>
                                                {Fund.shares ? (Fund.shares * Fund.fund.sharePrice).toFixed(2).toString().replace(/./g, "*") : 0}
                                            </span>

                                            <span className={`info ${Hide ? "hidden" : "shown"}`}>
                                                {Fund.shares ? (Fund.shares * Fund.fund.sharePrice).toFixed(2).toString() : 0}
                                            </span>

                                            <span className={`info placeholder`}>
                                                {Fund.shares ? (Fund.shares * Fund.fund.sharePrice).toFixed(2).toString() : 0}
                                            </span>
                                        </div>
                                        <div className="ps-0 hideInfoButton d-flex align-items-center">
                                            <FontAwesomeIcon
                                                className={`icon ${Hide ? "hidden" : "shown"}`}
                                                onClick={() => { setHide(!Hide) }}
                                                icon={faEye}
                                            />
                                            <FontAwesomeIcon
                                                className={`icon ${!Hide ? "hidden" : "shown"}`}
                                                onClick={() => { setHide(!Hide) }}
                                                icon={faEyeSlash}
                                            />
                                            <FontAwesomeIcon
                                                className="icon placeholder"
                                                icon={faEyeSlash}
                                            />
                                        </div>
                                    </Row>
                                </h1>
                                <Card.Text className="subTitle lighter mt-0 mb-2">
                                    {t("Acquired FeeParts")}:<span className="bolder"> {Fund.shares ? Fund.shares : 0}</span><br />
                                    {t("Pending FeeParts")}:
                                    <span className={`bolder text-green`}>{" "}
                                        +{pendingFeeParts}</span><br />
                                    {t("FeePart Price (updated")}: {t("Now")}):<span className="bolder"> ${Fund.fund.sharePrice}</span><br />

                                </Card.Text>
                            </Row>
                        </Container>
                    </Row>
                </Card.Body>
                <Card.Footer className="footer mt-2 m-0 p-0">
                    <Row className="d-flex justify-content-center m-0">
                        <Col xs="6" className="d-flex justify-content-center p-0 m-0">
                            <Button onClick={() => toTickets("buy")} className="me-1 button left">
                                <span className="label">{t("Buy")}</span>
                            </Button>
                        </Col>
                        <Col xs="6" className="d-flex justify-content-center p-0 m-0">
                            <Button onClick={() => toTickets("sell")} className="ms-1 button right">
                                <span className="label">{t("Sell")}</span>
                            </Button>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </Col>


    )
}
export default FundCard