import React, { useContext, useEffect, useState } from 'react'
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye, faPiggyBank } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';
import Decimal from 'decimal.js';
import axios from 'axios';
import { DashBoardContext } from 'context/DashBoardContext';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const TimeDepositCard = ({ Hide, setHide, TimeDeposit, ownKey }) => {
    const { toLogin } = useContext(DashBoardContext);
    const { t } = useTranslation();

    Decimal.set({ precision: 6 })

    const getAnualRate = () => TimeDeposit.interestRate ?? 0

    //const ellapsedDays = () => Math.abs(moment(TimeDeposit?.startDate).diff(moment(), "days",true)) ?? 0
    const ellapsedDays = () => Math.abs(new Date().getTime() - new Date(TimeDeposit?.startDate).getTime()) / 1000 / 60 / 60 / 24 ?? 0 //We are doing it in the same way that the backend does it


    const [profit, setProfit] = useState({ fetching: false, fetched: false, valid: false, value: 0 })
    const [actualProfit, setActualProfit] = useState({ fetching: false, fetched: false, valid: false, value: 0 })

    const calculateActualProfit = (signal) => {
        if (TimeDeposit.initialAmount) {
            axios.post(`/fixed-deposits/profit`,
                {
                    duration: ellapsedDays(),
                    initialAmount: TimeDeposit?.initialAmount,
                    interestRate: getAnualRate()
                }, { signal: signal }).then(function (response) {
                    if (response.status < 300 && response.status >= 200) {
                        setActualProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: response.data || TimeDeposit.initialAmount } }))
                    } else {
                        switch (response.status) {
                            case 401:
                                toLogin();
                                break;
                            default:
                                setActualProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: TimeDeposit.initialAmount } }))
                                break
                        }
                    }
                }).catch((err) => {
                    if (err.message !== "canceled") {
                        setActualProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: TimeDeposit.initialAmount } }))
                    }
                });
        }
    }

    const calculateProfit = (signal) => {
        if (TimeDeposit.initialAmount) {
            axios.post(`/fixed-deposits/profit`,
                {
                    duration: TimeDeposit?.duration,
                    initialAmount: TimeDeposit?.initialAmount,
                    interestRate: getAnualRate()
                }, { signal: signal }).then(function (response) {
                    if (response.status < 300 && response.status >= 200) {
                        setProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: response.data || TimeDeposit.initialAmount } }))
                    } else {
                        switch (response.status) {
                            case 401:
                                toLogin();
                                break;
                            default:
                                setProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: TimeDeposit.initialAmount } }))
                                break
                        }
                    }
                }).catch((err) => {
                    if (err.message !== "canceled") {
                        setProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: TimeDeposit.initialAmount } }))
                    }
                });
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        calculateProfit(signal)
        calculateActualProfit()

        return () => {
            controller.abort();
        };
        //eslint-disable-next-line
    }, [])

    return (
        <Col className="fund-col growAnimation" sm="6" md="6" lg="4" >
            <Card className="FundCard TimeDeposit h-100">
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
                                    {t("Time Deposit")}&nbsp;{ownKey + 1}&nbsp;{!!(TimeDeposit?.stateId === 1) && <span style={{ textTransform: "none" }}>({t("Pending approval")})</span>}
                                </h1>
                                <Card.Text className="subTitle lighter mt-0 mb-2">
                                    {t("Elapsed")}:&nbsp;
                                    <span className="bolder">
                                        <FormattedNumber className="growOpacity" value={TimeDeposit.stateId === 2 ? ellapsedDays() : 0} prefix="" fixedDecimals={2} />
                                        &nbsp;{t("out of")}&nbsp;
                                        {TimeDeposit?.duration}&nbsp;{t("days")}
                                    </span>
                                </Card.Text>
                            </Card.Title>
                            <Container>
                                <Row className="d-flex justify-content-between">
                                    <h1 className="title-gray mt-1">
                                        <Container fluid className="px-0">
                                            <Row className="mx-0 w-100 gx-0 d-flex justify-content-between">
                                                <div className="pe-2 containerHideInfo">
                                                    <FormattedNumber hidden className={`info ${Hide ? "shown" : "hidden"}`} value={actualProfit.fetched ? actualProfit.value.toString() : TimeDeposit?.initialAmount.toString()} prefix="$" fixedDecimals={2} />
                                                    <FormattedNumber className={`info ${Hide ? "hidden" : "shown"}`} value={actualProfit.fetched ? actualProfit.value.toString() : TimeDeposit?.initialAmount.toString()} prefix="$" fixedDecimals={2} />
                                                    <FormattedNumber className={`info placeholder`} value={actualProfit.fetched ? actualProfit.value.toString() : TimeDeposit?.initialAmount.toString()} prefix="$" fixedDecimals={2} />
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
                                        {t("From")}:&nbsp;
                                        <span className="bolder">
                                            {TimeDeposit?.startDate ? moment(TimeDeposit?.startDate).format('LL') : <>{moment().format('LL')}&nbsp;({t("To be confirmed")})</>}
                                        </span><br />

                                        {t("To")}:&nbsp;
                                        <span className="bolder">
                                            {TimeDeposit?.endDate ? moment(TimeDeposit?.endDate).format('LL') : <>{moment().add(TimeDeposit.duration, "days").format('LL')}&nbsp;({t("To be confirmed")})</>}
                                        </span><br />

                                        {t("Anual rate")}:&nbsp;
                                        <FormattedNumber className={`bolder`} value={getAnualRate()} suffix="%" fixedDecimals={2} /><br />

                                        {t("Initial investment")}:&nbsp;
                                        <FormattedNumber className={`bolder`} value={TimeDeposit.initialAmount} prefix="$" fixedDecimals={2} />,&nbsp;
                                        {t("At the end of the term")}:
                                        <span className="bolder">&nbsp;
                                            {
                                                profit.fetching ?
                                                    <Spinner className="ms-2" animation="border" size="sm" />
                                                    :
                                                    <FormattedNumber  value={profit.value} prefix="$" fixedDecimals={2} />
                                            }
                                        </span>
                                        <br />
                                    </Card.Text>
                                </Row>
                            </Container>
                        </Row>
                    </Container>
                </Card.Body>
            </Card >
        </Col >


    )
}
export default TimeDepositCard