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
import { editedDuration, editedInterestRate, getAnualRate, getDuration, getEditedDuration, getOriginalDuration, isPending, wasEdited } from 'utils/fixedDeposit';

const FixedDepositCard = ({ Hide, setHide, FixedDeposit, ownKey }) => {
    Decimal.set({ precision: 100 })

    const { toLogin } = useContext(DashBoardContext);
    const { t } = useTranslation();

    const ellapsedDays = () => (
        Math.floor(new Date().getTime() / 1000 / 60 / 60 / 24) -
        Math.floor(new Date(FixedDeposit?.startDate).getTime() / 1000 / 60 / 60 / 24)
    ) ?? 0

    const [profit, setProfit] = useState({ fetching: false, fetched: false, valid: false, value: 0 })
    const [actualProfit, setActualProfit] = useState({ fetching: false, fetched: false, valid: false, value: 0 })

    const calculateActualProfit = (signal) => {
        if (FixedDeposit.initialAmount) {
            axios.post(`/fixed-deposits/profit`,
                {
                    duration: ellapsedDays(),
                    initialAmount: FixedDeposit?.initialAmount,
                    interestRate: getAnualRate(FixedDeposit)
                }, { signal: signal }).then(function (response) {
                    if (response.status < 300 && response.status >= 200) {
                        setActualProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: response.data || FixedDeposit.initialAmount } }))
                    } else {
                        switch (response.status) {
                            case 401:
                                toLogin();
                                break;
                            default:
                                setActualProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: FixedDeposit.initialAmount } }))
                                break
                        }
                    }
                }).catch((err) => {
                    if (err.message !== "canceled") {
                        setActualProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: FixedDeposit.initialAmount } }))
                    }
                });
        }
    }

    const calculateProfit = (signal) => {
        if (FixedDeposit.initialAmount) {
            axios.post(`/fixed-deposits/profit`,
                {
                    duration: getDuration(FixedDeposit),
                    initialAmount: FixedDeposit?.initialAmount,
                    interestRate: getAnualRate(FixedDeposit)
                }, { signal: signal }).then(function (response) {
                    if (response.status < 300 && response.status >= 200) {
                        setProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: response.data || FixedDeposit.initialAmount } }))
                    } else {
                        switch (response.status) {
                            case 401:
                                toLogin();
                                break;
                            default:
                                setProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: FixedDeposit.initialAmount } }))
                                break
                        }
                    }
                }).catch((err) => {
                    if (err.message !== "canceled") {
                        setProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: FixedDeposit.initialAmount } }))
                    }
                });
        }
    }

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        calculateProfit(signal)
        //If its approved
        if (FixedDeposit.stateId !== 1) calculateActualProfit(signal)

        return () => {
            controller.abort();
        };
        //eslint-disable-next-line
    }, [])

    return (
        <Col className="fund-col growAnimation" sm="6" md="6" lg="4" >
            <Card className="FundCard FixedDeposit h-100">
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
                                <h1 className="title m-0">
                                    {t("Time deposit")}&nbsp;{FixedDeposit.id}
                                    &nbsp;{!!(isPending(FixedDeposit)) ?
                                        <span style={{ textTransform: "none" }}>({t("Pending approval")})</span>
                                        :
                                        wasEdited(FixedDeposit) &&
                                        <span style={{ textTransform: "none" }}>({t("Preferential *")})</span>}
                                </h1>
                                <Card.Text className="subTitle lighter mt-0 my-0">
                                    {t("Elapsed")}:&nbsp;
                                    <span className="bolder">
                                        <span className="growOpacity" >
                                            {FixedDeposit.stateId === 2 ? ellapsedDays() : 0}
                                        </span>
                                        &nbsp;{t("out of")}&nbsp;
                                        {getDuration(FixedDeposit)}&nbsp;{t("days")}
                                        {(editedDuration(FixedDeposit) && !isPending(FixedDeposit)) && " *"}
                                    </span>
                                </Card.Text>
                            </Card.Title>
                            <Container fluid className="px-0">
                                <Row className="d-flex justify-content-between">
                                    <h1 className="title-gray my-0">
                                        <Container fluid className="px-0">
                                            <Row className="mx-0 w-100 gx-0 d-flex justify-content-between">
                                                <div className="pe-2 containerHideInfo">
                                                    <FormattedNumber hidden className={`info ${Hide ? "shown" : "hidden"}`} value={actualProfit.fetched ? actualProfit.value.toString() : FixedDeposit?.initialAmount.toString()} prefix="$" fixedDecimals={2} />
                                                    <FormattedNumber className={`info ${Hide ? "hidden" : "shown"}`} value={actualProfit.fetched ? actualProfit.value.toString() : FixedDeposit?.initialAmount.toString()} prefix="$" fixedDecimals={2} />
                                                    <FormattedNumber className={`info placeholder`} value={actualProfit.fetched ? actualProfit.value.toString() : FixedDeposit?.initialAmount.toString()} prefix="$" fixedDecimals={2} />
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
                                    <Card.Text className="subTitle lighter my-0">
                                        {t("Time deposit Start date")}:&nbsp;
                                        <span className="bolder">
                                            {FixedDeposit?.startDate ? moment(FixedDeposit?.startDate).format('L') : moment().format('L')}
                                        </span><br />
                                    </Card.Text>
                                    <Card.Text className="subTitle lighter my-0">
                                        {t("Due date")}:&nbsp;
                                        <span className="bolder">
                                            {FixedDeposit?.endDate ? moment(FixedDeposit?.endDate).format('L') : moment().add(getDuration(FixedDeposit), "days").format('L')}
                                        </span>
                                        {(editedDuration(FixedDeposit) && !isPending(FixedDeposit)) && " *"}
                                    </Card.Text>
                                    <Card.Text className="subTitle lighter my-0">
                                        {t("Anual rate")}:&nbsp;
                                        <FormattedNumber className={`bolder`} value={getAnualRate(FixedDeposit)} suffix="%" fixedDecimals={2} />
                                        {editedInterestRate(FixedDeposit) && " *"}
                                        <br />
                                    </Card.Text>
                                    <Card.Text className="subTitle lighter my-0">
                                        {t("Initial investment")}:&nbsp;
                                        <FormattedNumber className={`bolder`} value={FixedDeposit.initialAmount} prefix="$" fixedDecimals={2} />
                                    </Card.Text>
                                    <Card.Text className="subTitle lighter my-0">
                                        {t("Amount on due date")}:&nbsp;
                                        <span className="bolder">&nbsp;
                                            {
                                                profit.fetching ?
                                                    <Spinner className="ms-2" animation="border" size="sm" />
                                                    :
                                                    <FormattedNumber value={profit.value} prefix="$" fixedDecimals={2} />
                                            }
                                        </span>
                                        {(wasEdited(FixedDeposit) && !isPending(FixedDeposit)) && " *"}
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
export default FixedDepositCard