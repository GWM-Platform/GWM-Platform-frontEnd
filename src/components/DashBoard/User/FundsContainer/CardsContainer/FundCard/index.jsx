import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye, faThumbtack } from '@fortawesome/free-solid-svg-icons'
import './index.scss'
import { useHistory } from 'react-router-dom';
import Decimal from 'decimal.js'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';
import PerformanceComponent from 'components/DashBoard/GeneralUse/PerformanceComponent';

const FundCard = ({ Hide, setHide, Fund, PendingTransactions, cardsAmount, inScreenFunds }) => {
    const { hasSellPermission, hasBuyPermission, hasPermission, isMobile } = useContext(DashBoardContext)

    Decimal.set({ precision: 100 })

    const { t } = useTranslation();

    let history = useHistory();

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

    return (
        <Col className="fund-col growAnimation" sm="6" md="6" lg="4" >
            <Card className="FundCard h-100">
                <Card.Header className="header d-flex align-items-center justify-content-center">
                    <div className="currencyContainer d-flex align-items-center justify-content-center">
                        {
                            <img className="currency px-0 mx-0" alt=""
                                onError={({ currentTarget }) => {
                                    currentTarget.onerror = null;
                                    currentTarget.src = process.env.PUBLIC_URL + '/images/FundsLogos/default.svg';
                                }}
                                src={Fund?.fund?.imageUrl || '/images/FundsLogos/default.svg'} />
                        }
                    </div>
                </Card.Header>
                <Card.Body className="body">
                    <Container fluid className="px-0">
                        <Row className="mx-0 w-100 gx-0">
                            <Card.Title className="my-0" >
                                <Container fluid className="px-0">
                                    <Row className="mx-0 w-100 my-0">
                                        <Col className="ps-0">
                                            <h1 className="title my-0">
                                                {t(Fund.fund.name)}
                                            </h1>
                                        </Col>
                                        {
                                            !!(cardsAmount > inScreenFunds && !isMobile) &&
                                            <button className="noStyle px-0 hideInfoButton d-flex align-items-center invisible" style={{ width: "0!important", overflow: "hidden" }}>
                                                <div>
                                                    <FontAwesomeIcon
                                                        className="icon pin"
                                                        icon={faThumbtack}
                                                    />
                                                    <FontAwesomeIcon
                                                        className="icon placeholder"
                                                        icon={faEyeSlash}
                                                    />
                                                </div>

                                                <span className="line"></span>
                                            </button>
                                        }
                                    </Row>
                                </Container>
                                <Card.Text className="subTitle lighter  mt-0 mb-1">{t("Share price")}:&nbsp;
                                    <FormattedNumber className="bolder" value={Fund.fund.sharePrice} prefix="U$D " fixedDecimals={2} /><br />
                                </Card.Text>
                            </Card.Title>
                            <Container fluid className="px-0">
                                <h1 className="title-gray mt-0">
                                    <Container fluid className="px-0">
                                        <Row className="mx-0 w-100 gx-0 d-flex justify-content-between">
                                            <div className="pe-2 containerHideInfo">
                                                <FormattedNumber hidden className={`info ${Hide ? "shown" : "hidden"}`} value={Fund.shares ? HoldingInCash() : 0} prefix="U$D " fixedDecimals={2} />
                                                <FormattedNumber className={`info ${Hide ? "hidden" : "shown"}`} value={Fund.shares ? HoldingInCash() : 0} prefix="U$D " fixedDecimals={2} />
                                                <FormattedNumber className={`info placeholder`} value={Fund.shares ? HoldingInCash() : 0} prefix="U$D " fixedDecimals={2} />
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
                                <PerformanceComponent text={"Performance"} fundId={Fund.fund.id} />

                                <Card.Text className="subTitle lighter mt-0 mb-0">
                                    {t("Balance (shares)")}:&nbsp;
                                    <FormattedNumber className="bolder" value={Fund.shares ? Fund.shares : 0} prefix="" fixedDecimals={2} />
                                </Card.Text>
                                <Card.Text className="subTitle lighter mt-0 mb-0">
                                    {t("Pending transactions")}&nbsp;({t("shares")}):&nbsp;<FormattedNumber className="bolder text-green" value={pendingShares()} prefix="+" fixedDecimals={2} />
                                </Card.Text>
                            </Container>
                        </Row>
                    </Container>
                </Card.Body>
                <Card.Footer className="footer mt-2 m-0 p-0">
                    <Row className="d-flex justify-content-center m-0">
                        <Col xs="6" className="d-flex justify-content-center p-0 m-0">
                            <Button
                                disabled={!hasBuyPermission(Fund?.fund?.id) || !hasPermission('VIEW_ACCOUNT')}
                                onClick={() => toTickets("buy")} className="me-1 button left">
                                <span className="label">{t("Buy")}</span>
                            </Button>
                        </Col>
                        <Col xs="6" className="d-flex justify-content-center p-0 m-0">
                            <Button
                                disabled={!hasSellPermission(Fund?.fund?.id)}
                                onClick={() => toTickets("sell")} className="ms-1 button right">
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