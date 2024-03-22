import React, { useContext, useEffect, useState } from 'react'
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEyeSlash, faEye, faPiggyBank, faThumbtack } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';
import Decimal from 'decimal.js';
import axios from 'axios';
import { DashBoardContext } from 'context/DashBoardContext';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import { getAnualRate, getDuration, isPending, wasEdited } from 'utils/fixedDeposit';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const FixedDepositCard = ({ Hide, setHide, FixedDeposit, cardsAmount, inScreenFunds }) => {
    Decimal.set({ precision: 100 })

    const { toLogin, isMobile } = useContext(DashBoardContext);
    const { t } = useTranslation();

    const ellapsedDays = () => (
        Math.floor(new Date().getTime() / 1000 / 60 / 60 / 24) -
        Math.floor(new Date(FixedDeposit?.startDate || FixedDeposit?.creationDate).getTime() / 1000 / 60 / 60 / 24)
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
    const history = useHistory();
    const goToHistory = () => {
        history.push(`/DashBoard/history?type=t-d`);
    }
    
    return (
        <Col className="fund-col growAnimation" sm="6" md="6" lg="4" style={{ maxHeight: "100%" }}  >
            <Card onClick={goToHistory} className="FundCard FixedDeposit h-100" style={{ maxHeight: "100%", display: "flex", cursor: "pointer"  }}>
                <Card.Header
                    className="header d-flex align-items-center justify-content-center"
                    style={{ flex: "none" }}
                >
                    <div className="currencyContainer d-flex align-items-center justify-content-center">
                        <FontAwesomeIcon color='white' icon={faPiggyBank} />
                    </div>
                </Card.Header>
                <Card.Body className="body" style={{ flexGrow: "1", overflow: "overlay" }}>
                    <Container fluid className="px-0">
                        <Row className="mx-0 w-100 gx-0">
                            <Card.Title className="my-0" >
                                <Container fluid className="px-0">
                                    <Row className="mx-0 w-100 my-0">
                                        <Col className="ps-0">
                                            <h1 className="title m-0">
                                                {t("Time deposit")}&nbsp;{FixedDeposit.id}
                                                &nbsp;{!!(isPending(FixedDeposit)) ?
                                                    <span style={{ textTransform: "none", fontSize: "12px" }}>({t("Pending approval")})</span>
                                                    :
                                                    wasEdited(FixedDeposit) &&
                                                    <span style={{ textTransform: "none" }}>({t("Personalized  *")})</span>}
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

                                <Card.Text className="lighter mt-0 mt-0 mb-1">
                                    {t("Elapsed")}:&nbsp;
                                    <span className="bolder">
                                        <span className="growOpacity" >
                                            {FixedDeposit.stateId === 2 ? ellapsedDays() : 0}
                                        </span>
                                        &nbsp;{t("out of")}&nbsp;
                                        {getDuration(FixedDeposit)}&nbsp;{t("days")}
                                        {wasEdited(FixedDeposit) && " *"}
                                    </span>
                                </Card.Text>
                            </Card.Title>
                            <Container fluid className="px-0">
                                <Row className="d-flex justify-content-between">
                                    <h1 className="title-gray">
                                        <span className='label invisible'>
                                            {t("Available funds")}
                                        </span>
                                        <Container fluid className="px-0">
                                            <Row className="mx-0 w-100 gx-0 d-flex justify-content-between">
                                                <div className="pe-2 containerHideInfo">
                                                    <FormattedNumber hidden className={`info ${Hide ? "shown" : "hidden"}`} value={actualProfit.fetched ? actualProfit.value.toString() : FixedDeposit?.initialAmount.toString()} prefix="U$D " fixedDecimals={2} />
                                                    <FormattedNumber className={`info ${Hide ? "hidden" : "shown"}`} value={actualProfit.fetched ? actualProfit.value.toString() : FixedDeposit?.initialAmount.toString()} prefix="U$D " fixedDecimals={2} />
                                                    <FormattedNumber className={`info placeholder`} value={actualProfit.fetched ? actualProfit.value.toString() : FixedDeposit?.initialAmount.toString()} prefix="U$D " fixedDecimals={2} />
                                                </div>
                                                <div className="ps-0 hideInfoButton d-flex align-items-center">
                                                    <FontAwesomeIcon
                                                        className={`icon ${Hide ? "hidden" : "shown"}`}
                                                        onClick={(e) => {e.stopPropagation();setHide(!Hide) }}
                                                        icon={faEye}
                                                    />
                                                    <FontAwesomeIcon
                                                        className={`icon ${!Hide ? "hidden" : "shown"}`}
                                                        onClick={(e) => { e.stopPropagation();setHide(!Hide) }}
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
                                    <Card.Text className="lighter my-0">
                                        {t("Establishment date")}:&nbsp;
                                        <span className="bolder">
                                            {FixedDeposit?.startDate ? moment(FixedDeposit?.startDate).format('L') : moment().format('L')}
                                        </span><br />
                                    </Card.Text>
                                    <Card.Text className="lighter my-0">
                                        {t("Due date")}:&nbsp;
                                        <span className="bolder">
                                            {FixedDeposit?.endDate ? moment(FixedDeposit?.endDate).format('L') : moment().add(getDuration(FixedDeposit), "days").format('L')}
                                        </span>
                                        {wasEdited(FixedDeposit) && " *"}
                                    </Card.Text>
                                    <Card.Text className="lighter my-0">
                                        {t("Anual rate")}:&nbsp;
                                        <FormattedNumber className={`bolder`} value={getAnualRate(FixedDeposit)} suffix="%" fixedDecimals={2} />
                                        {wasEdited(FixedDeposit) && " *"}
                                        <br />
                                    </Card.Text>
                                    <Card.Text className="lighter my-0">
                                        {t("Initial investment")}:&nbsp;
                                        <FormattedNumber className={`bolder`} value={FixedDeposit.initialAmount} prefix="U$D " fixedDecimals={2} />
                                    </Card.Text>
                                    <Card.Text className="lighter my-0">
                                        {t("Amount on due date")}:&nbsp;
                                        <span className="bolder">&nbsp;
                                            {
                                                profit.fetching ?
                                                    <Spinner className="ms-2" animation="border" size="sm" />
                                                    :
                                                    <FormattedNumber value={profit.value} prefix="U$D " fixedDecimals={2} />
                                            }
                                        </span>
                                    </Card.Text>
                                </Row>
                            </Container>
                        </Row>
                    </Container>
                </Card.Body>
                <Card.Footer className="footer m-0 p-0" style={{ flex: "none" }}>
                </Card.Footer>
            </Card >
        </Col >


    )
}
export default FixedDepositCard