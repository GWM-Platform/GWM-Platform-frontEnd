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

const TimeDepositCard = ({ Hide, setHide, TimeDeposit, ownKey }) => {
    const { toLogin } = useContext(DashBoardContext);
    const { t } = useTranslation();
    Decimal.set({ precision: 6 })

    const getAnualRate = () => {
        if (TimeDeposit.duration >= 365 && TimeDeposit.initialAmount) {
            return TimeDeposit?.interest[Object.keys(TimeDeposit?.interest).filter(ruleDays => ruleDays <= TimeDeposit.duration).reduce((prev, curr) => Math.abs(curr - TimeDeposit.duration) < Math.abs(prev - TimeDeposit.duration) ? curr : prev)] || 0
        }
        return 0
    }

    const [profit, setProfit] = useState({ fetching: false, fetched: false, valid: false, value: 0 })
    const [actualProfit, setActualProfit] = useState({ fetching: false, fetched: false, valid: false, value: 0 })

    const calculateActualProfit = (signal) => {
        if (TimeDeposit.duration >= 365 && TimeDeposit.stateId === 2 && TimeDeposit.startDate) {
            const elapsedTime = moment(TimeDeposit?.startDate).diff(moment(), "days")
            const ratePerDay = new Decimal((new Decimal(getAnualRate()).div(100)).toString()).div(365).toString()
            const gain = new Decimal(new Decimal(ratePerDay).times(elapsedTime).toString()).times(TimeDeposit.initialAmount).toString()
            setActualProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: new Decimal(TimeDeposit.initialAmount).add(gain).toString() } }))
        } else {
            setActualProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: TimeDeposit.initialAmount } }))
        }
    }

    const calculateProfit = (signal) => {
        if (TimeDeposit.duration >= 365 && TimeDeposit.initialAmount) {
            axios.post(`/fixed-deposits/profit`,
                {
                    initialAmount: TimeDeposit.initialAmount,
                    interest: TimeDeposit?.interest,
                    startDate: moment().format(),
                    endDate: moment().add(TimeDeposit.duration, 'days').format()
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
                                    {t("Elapsed")}:
                                    <span className="bolder">&nbsp;{TimeDeposit.stateId === 2 ? moment(TimeDeposit?.startDate).fromNow(true) : t("0 days")}&nbsp;{t("out of")}&nbsp;
                                        {moment().add(TimeDeposit.duration, "days").fromNow(true)}
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
                                                        {(actualProfit.fetched ? actualProfit.value.toString() : TimeDeposit?.initialAmount.toString()).replace(/./g, "*")}
                                                    </span>

                                                    <span className={`info ${Hide ? "hidden" : "shown"}`}>
                                                        {actualProfit.fetched ? actualProfit.value.toString() : TimeDeposit?.initialAmount.toString()}
                                                    </span>

                                                    <span className={`info placeholder`}>
                                                        {actualProfit.fetched ? actualProfit.value.toString() : TimeDeposit?.initialAmount.toString()}
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
                                        {t("From")}:
                                        <span className="bolder">&nbsp;
                                            {TimeDeposit?.startDate ? TimeDeposit?.startDate.format('LL') : <>{moment().format('LL')}&nbsp;({t("To be confirmed")})</>}
                                        </span><br />
                                        {t("To")}:
                                        <span className="bolder">&nbsp;
                                            {TimeDeposit?.startDate ? TimeDeposit?.endDate.format('LL') : <>{moment().add(TimeDeposit.duration, "days").format('LL')}&nbsp;({t("To be confirmed")})</>}
                                        </span><br />
                                        {t("Anual rate")}:<span className="bolder">&nbsp;{getAnualRate()}%</span><br />
                                        {t("Initial investment")}:<span className="bolder">&nbsp;${TimeDeposit.initialAmount}</span>,&nbsp;
                                        {t("At the end of the term")}:
                                        <span className="bolder">&nbsp;
                                            {profit.fetching ?
                                                <Spinner className="ms-2" animation="border" size="sm" />
                                                :
                                                <>${profit.value}</>
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