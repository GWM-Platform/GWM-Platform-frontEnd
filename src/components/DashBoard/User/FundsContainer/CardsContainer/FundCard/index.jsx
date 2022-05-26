import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye } from '@fortawesome/free-solid-svg-icons'
import './index.css'
import { useHistory } from 'react-router-dom';
import Decimal from 'decimal.js'

const FundCard = ({ Hide, setHide, Fund, PendingTransactions }) => {
    const { t } = useTranslation();

    let history = useHistory();

    Decimal.set({ precision: 6 })

    const pendingShares = () => {
        //Filtro de todos los movimientos pendientes solo los del fondo correspondiente
        const fundPendingTransactions = PendingTransactions.value.filter(
            transaction => transaction.fundId === Fund.fund.id && Math.sign(transaction.shares) === +1
        )

        //Sumatoria de los movimientos pendientes del fondo
        return fundPendingTransactions.map((transaction) => transaction.shares).reduce(
            (previousValue, currentValue) => new Decimal(previousValue).plus(new Decimal(currentValue)), 0).toString()
    }

    const HoldingInCash = () => new Decimal(Fund?.shares).times(Fund?.fund?.sharePrice).toFixed(2).toString()

    const toTickets = (operation) => {
        history.push(`${operation}?fund=${Fund.fund.id}`);
    }

    const checkImage = async (url) => {
        const res = await fetch(url);
        const buff = await res.blob();
        return buff.type.startsWith('image/')
    }

    const hasCustomImage = () => Fund.fund.imageUrl ? checkImage(Fund.fund.imageUrl) : false

    return (
        <Col className="fund-col growAnimation" sm="6" md="6" lg="4" >
            <Card className="FundCard h-100">
                <Card.Header
                    className="header d-flex align-items-center justify-content-center"
                >
                    <div className="currencyContainer d-flex align-items-center justify-content-center">
                        {

                            <img className="currency px-0 mx-0" alt=""
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null;
                                    currentTarget.src = process.env.PUBLIC_URL + '/images/FundsLogos/default.svg';
                                }}
                                src={hasCustomImage() ? Fund.fund.imageUrl : process.env.PUBLIC_URL + '/images/FundsLogos/default.svg'} />
                        }
                    </div>
                </Card.Header>
                <Card.Body className="body">
                    <Container fluid className="px-0">
                        <Row className="mx-0 w-100 gx-0">
                            <Card.Title >
                                <h1 className="title mt-0">
                                    {t(Fund.fund.name)}
                                </h1>
                                <Card.Text className="subTitle lighter mt-0 mb-2">
                                    {t("Share price")}:<span className="bolder"> ${Fund.fund.sharePrice}</span><br />
                                </Card.Text>
                            </Card.Title>
                            <Container>
                                <Row className="d-flex justify-content-between">
                                    <h1 className="title-gray mt-1">
                                        <Container fluid className="px-0">
                                            <Row className="mx-0 w-100 gx-0 d-flex justify-content-between">
                                                <div className="pe-2 containerHideInfo">
                                                    <span>$</span>
                                                    <span className={`info ${Hide ? "shown" : "hidden"}`}>
                                                        {Fund.shares ? HoldingInCash().replace(/./g, "*") : 0}
                                                    </span>

                                                    <span className={`info ${Hide ? "hidden" : "shown"}`}>
                                                        {Fund.shares ? HoldingInCash() : 0}
                                                    </span>

                                                    <span className={`info placeholder`}>
                                                        {Fund.shares ? HoldingInCash() : 0}
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
                                        </Container>
                                    </h1>
                                    <Card.Text className="subTitle lighter mt-0 mb-2">
                                        {t("Balance (shares)")}:<span className="bolder"> {Fund.shares ? Fund.shares : 0}</span><br />
                                        <span className="text-nowrap">{t("Pending transactions")}&nbsp;</span>
                                        <span className="text-nowrap">
                                            ({t("shares")}):
                                            <span className={`bolder text-green`}>&nbsp;+{pendingShares()}</span>
                                        </span>
                                    </Card.Text>
                                </Row>
                            </Container>
                        </Row>
                    </Container>
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