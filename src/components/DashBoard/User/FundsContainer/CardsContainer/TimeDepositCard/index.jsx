import React from 'react'
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye, faPiggyBank } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';
import Decimal from 'decimal.js';

const TimeDepositCard = ({ Hide, setHide }) => {
    const { t } = useTranslation();
    Decimal.set({ precision: 6 })

    const timeDeposit = {
        from: moment().subtract(265, "days"),
        to: moment().add(100, "days"),
        initialInvestment: 100,
        rule: {
            days: 365,
            rate: 0.02
        }
    }
    const ratePercentaje=()=>new Decimal(0.02).times(100).toString()

    const daysPercentajeFromTotal = ({ fixed = false }) => {
        const daysFromInvestment = moment().diff(timeDeposit.from, "days")
        const daysPercentajeFromTotal = new Decimal(daysFromInvestment).times(100).div(timeDeposit.rule.days)
        return fixed ? daysPercentajeFromTotal.toFixed(2).toString() : daysPercentajeFromTotal.toString()
    }
    const gainInTheEnd = () => new Decimal(timeDeposit.initialInvestment).times(timeDeposit.rule.rate).toString()

    const actualGain = ({ fixed = false }) => {
        const actualGain = new Decimal(gainInTheEnd()).times(daysPercentajeFromTotal({ fixed: false })).div(100)
        return fixed ? actualGain.toFixed(3).toString() : actualGain.toString()
    }
    const investmentAtTheEnd = () => new Decimal(timeDeposit.initialInvestment).add(gainInTheEnd()).toString()

    const actualValueOfInvestment = () => {
        return new Decimal(actualGain({ fixed: false })).add(timeDeposit.initialInvestment).toString()
    }

    return (
        <Col className="fund-col growAnimation" sm="6" md="6" lg="4" >
            <Card className="FundCard h-100">
                <Card.Header
                    className="header d-flex align-items-center justify-content-center"
                >
                    <div className="currencyContainer d-flex align-items-center justify-content-center">
                        <FontAwesomeIcon color='white' icon={faPiggyBank} />
                    </div>
                </Card.Header>
                <Card.Body className="body">
                    <Container fluid className="px-0">
                        <Row className="mx-0 w-100 gx-0">
                            <Card.Title >
                                <h1 className="title mt-0">
                                    {t("Time Deposit")}
                                </h1>
                                <Card.Text className="subTitle lighter mt-0 mb-2">
                                    {t("Elapsed")}:
                                    <span className="bolder">&nbsp;{timeDeposit.from.fromNow(true)}&nbsp;{t("out of")}&nbsp;
                                        {moment().add(timeDeposit.rule.days, "days").fromNow(true)}&nbsp;({daysPercentajeFromTotal({ fixed: true })}%)
                                    </span>
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
                                                        {(actualValueOfInvestment() + " (+$" + actualGain({ fixed: true }) + ")").replace(/./g, "*")}
                                                    </span>

                                                    <span className={`info ${Hide ? "hidden" : "shown"}`}>
                                                        {actualValueOfInvestment() + " (+$" + actualGain({ fixed: true }) + ")"}
                                                    </span>

                                                    <span className={`info placeholder`}>
                                                        {actualValueOfInvestment() + " (+$" + actualGain({ fixed: true }) + ")"}
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
                                        {t("From")}:<span className="bolder"> {timeDeposit?.from?.format('LL')}</span><br />
                                        {t("To")}:<span className="bolder"> {timeDeposit?.to?.format('LL')}</span><br />
                                        {t("Actual period () rate", { period: moment().add(timeDeposit.rule.days, "days").fromNow(true) })}:<span className="bolder">&nbsp;{ratePercentaje()}%</span><br />
                                        {t("Initial investment")}:<span className="bolder">&nbsp;${timeDeposit.initialInvestment}</span>,&nbsp;
                                        {t("At the end of the period")}:<span className="bolder">&nbsp;${investmentAtTheEnd()}</span>
                                        <br />
                                    </Card.Text>
                                </Row>
                            </Container>
                        </Row>
                    </Container>
                </Card.Body>
                <Card.Footer className="footer mt-2 m-0 p-0">
                    <Row className="d-flex justify-content-center m-0">
                        <Col xs="12" className="d-flex justify-content-center p-0 m-0">
                            <Button className="me-1 button" style={{ borderRadius: "0px 0px 30px 30px" }}>
                                <span className="label">{t("Action")}</span>
                            </Button>
                        </Col>
                    </Row>
                </Card.Footer>
            </Card>
        </Col>


    )
}
export default TimeDepositCard