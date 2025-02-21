import React, { useState, useContext, useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../operationsForm.scss'

import { Container, Row, Col, Accordion, Form } from 'react-bootstrap'
import DurationData from './DurationData'
import InvestmentData from './InvestmentData'
import Loading from '../Loading';
import { DashBoardContext } from 'context/DashBoardContext';
import ActionConfirmationModal from './ActionConfirmationModal';
import moment from 'moment';
import axios from 'axios';
import Decimal from 'decimal.js';
import ReactGA from "react-ga4";
import NoFixedDeposit from '../NoFixedDeposit';
import RuleSelector, { getFixedDepositType } from './RuleSelector';
import RateData from './RateData';

const FixedDepositTicket = ({ balanceChanged }) => {
    Decimal.set({ precision: 100 })
    useEffect(() => {

        ReactGA.event({
            category: "Acceso a secciones para generar tickets",
            action: "Generación De Plazos Fijos",
            label: "Retiros",
        })
    }, [])

    const { token, contentReady, AccountSelected, toLogin, ClientSelected } = useContext(DashBoardContext);

    //If the user came from an specific fund, we use the query to auto select that one

    const [data, setData] = useState({
        amount: "",
        ruleSelected: "",
        days: "",
        until: "",
        preferential: false,
        rate: "",
        daysInterval: "",
        type: "standard"
    })

    const [ShowModal, setShowModal] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [validated, setValidated] = useState(true);

    const [profit, setProfit] = useState({ fetching: false, fetched: false, valid: false, value: 0 })

    let history = useHistory();
    const SelectedType = getFixedDepositType(data.type)

    const invest = () => {
        if (!fetching) {
            setFetching(true)
            axios.post('fixed-deposits', {
                initialAmount: data.amount,
                depositPlanId: FixedDeposit?.content?.id,
                clientId: ClientSelected.id,
                duration: data.days,
                type: data.type,
                ...SelectedType.additionalFieldsProps ?
                    SelectedType.additionalFieldsProps.reduce((acc, field) => {
                        acc[field] = data[field]
                        return acc
                    }, {})
                    : {}
            }).then(function (response) {
                if (response.status < 300 && response.status >= 200) {
                    setFetching(false)
                    balanceChanged()
                    history.push(`/DashBoard/operationResult`);
                } else {
                    switch (response.status) {
                        case 401:
                            toLogin();
                            break;
                        default:
                            history.push(`/DashBoard/operationResult?result=failed`);
                            break
                    }
                }
            }).catch((err) => {
                if (err.message !== "canceled") {
                    history.push(`/DashBoard/operationResult?result=failed`);
                }
            });
        }
    }

    const investOnPreferential = () => {
        if (!fetching) {
            setFetching(true)
            axios.post('fixed-deposits/bid', {
                initialAmount: data.amount,
                interestRate: data?.rate,
                clientId: ClientSelected.id,
                duration: data.days,
                type: data.type,
                ...SelectedType?.additionalFieldsProps ?
                    SelectedType?.additionalFieldsProps.reduce((acc, field) => {
                        acc[field] = data[field]
                        return acc
                    }, {})
                    : {}
            }).then(function (response) {
                if (response.status < 300 && response.status >= 200) {
                    setFetching(false)
                    balanceChanged()
                    history.push(`/DashBoard/operationResult`);
                } else {
                    switch (response.status) {
                        case 401:
                            toLogin();
                            break;
                        default:
                            history.push(`/DashBoard/operationResult?result=failed`);
                            break
                    }
                }
            }).catch((err) => {
                if (err.message !== "canceled") {
                    history.push(`/DashBoard/operationResult?result=failed`);
                }
            });
        }
    }

    const handleChange = (event) =>
        setData(
            prevState => {
                let aux = { ...prevState }
                aux[event?.target?.id] = event?.target?.value
                switch (event.target.id) {
                    case "until":
                        const untilDate = moment(event.target.value, "YYYY-MM-DD")
                        aux.days = untilDate.isValid() ? (untilDate.diff(moment().startOf('day'), 'days') + "") : "";
                        break;
                    case "days":
                        const days = event.target.value
                        aux.until = days !== "" ? moment().add(event.target.value, 'days').format("YYYY-MM-DD") : ""
                        break
                    default:
                }
                return { ...prevState, ...aux }
            }
        );


    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() === true && !fetching) {
            if (token === null) {
                console.log("compra")
            } else {
                setShowModal(true)
            }
        }
        setValidated(true);
    }

    const [FixedDeposit, setFixedDeposit] = useState({ fetching: true, fetched: false, valid: false, content: {} })

    const FixedDepositRules = Object.keys(FixedDeposit?.content?.interest ?? [])
    const selectedRuleIndex = FixedDepositRules.findIndex(rule => (rule === data.ruleSelected))

    const minDuration = selectedRuleIndex === -1 ?
        data.preferential ?
            3
            :
            Decimal.min(...[...FixedDepositRules.map(string => parseInt(string)), 365]).toNumber()
        :
        parseInt(data.ruleSelected)

    const maxDuration = selectedRuleIndex === -1 ?
        data.preferential ?
            1825
            :
            Decimal.max(...[...FixedDepositRules.map(string => parseInt(string)), 730]).toNumber()
        :
        selectedRuleIndex < FixedDepositRules.length - 1 ?
            FixedDepositRules[selectedRuleIndex + 1] - 1
            : parseInt(data.ruleSelected)

    const minRate = 1
    const maxRate = 10

    const isPreferential = data?.preferential;
    const amount = data?.amount?.trim();
    const days = data?.days?.trim();
    const rate = data?.rate?.trim();
    const isRateValid = rate !== "" && Number(rate) >= minRate && Number(rate) <= maxRate;
    const isDaysValid = Number(days) >= minDuration && Number(days) <= maxDuration;
    const isAmountValid = amount !== "";
    const isFetched = FixedDeposit.fetched;

    const getFixedDepositPlans = useCallback((signal) => {
        setFixedDeposit((prevState) => ({ fetching: true, fetched: false }))
        axios.get(`/fixed-deposits/plans`, {
            signal: signal,
        }).then(function (response) {
            if (response.status < 300 && response.status >= 200) {
                setFixedDeposit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, content: response?.data[0] || {} } }))
            } else {
                switch (response.status) {
                    case 401:
                        toLogin();
                        break;
                    default:
                        setFixedDeposit((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
                        break
                }
            }
        }).catch((err) => {
            if (err.message !== "canceled") {
                setFixedDeposit((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
            }
        });
    }, [toLogin]);

    const getAnualRate = () => {
        if (isFetched && isAmountValid && isDaysValid && (!isPreferential || (isPreferential && isRateValid))) {
            if (isPreferential) {
                return Number(rate)
            } else {
                const investmentDays = Number(data.days)
                return FixedDeposit?.content?.interest[Object.keys(FixedDeposit?.content?.interest).filter(ruleDays => ruleDays <= investmentDays).reduce((prev, curr) => Math.abs(curr - investmentDays) < Math.abs(prev - investmentDays) ? curr : prev)] || 0
            }
        }
        return 0
    }

    const calculateProfitFE = () => {
        const investmentDays = Number(data.days)
        const correspondingRule = Object.keys(FixedDeposit?.content?.interest).filter(ruleDays => ruleDays <= investmentDays).reduce((prev, curr) => Math.abs(curr - investmentDays) < Math.abs(prev - investmentDays) ? curr : prev)
        const ratePerDay = new Decimal(FixedDeposit.content.interest).div(FixedDeposit.content.interest[correspondingRule]).toString()
        const profit = new Decimal(investmentDays).times(new Decimal(ratePerDay).times(investmentDays).toString()).toString()
        return (new Decimal(profit).add(data.amount).toString()) || "0"
    }


    const calculateProfit = () => {
        if (isFetched && isAmountValid && isDaysValid && (!isPreferential || (isPreferential && isRateValid))) {
            setProfit((prevState) => ({ ...prevState, ...{ fetching: true } }))
            axios.post(`/fixed-deposits/profit`,
                {
                    duration: data?.days,
                    initialAmount: data?.amount,
                    interestRate: getAnualRate()
                }).then(function (response) {
                    if (response.status < 300 && response.status >= 200) {
                        setProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: response.data || 0 } }))
                    } else {
                        switch (response.status) {
                            case 401:
                                toLogin();
                                break;
                            default:
                                setProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: calculateProfitFE() } }))
                                break
                        }
                    }
                }).catch((err) => {
                    if (err.message !== "canceled") {
                        setProfit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, value: calculateProfitFE() } }))
                    }
                });
        }
    }

    useEffect(() => {

        const controller = new AbortController();
        const signal = controller.signal;

        getFixedDepositPlans(signal)

        return () => {
            controller.abort();
        };
        //eslint-disable-next-line
    }, [getFixedDepositPlans])

    return (
        <div className="tabContent">
            <div className={`d-flex flex-column h-100`}>
                <Container className="h-100" >
                    <Row className="newTicket h-100 growAnimation">
                        {
                            FixedDeposit.fetching || !contentReady ?
                                <Loading />
                                :
                                Object.keys(FixedDeposit.content).length > 0 ?
                                    <Col xs="12">
                                        <Form noValidate validated={validated} onSubmit={handleSubmit}>

                                            <Accordion flush defaultActiveKey="0">
                                                <RuleSelector handleChange={handleChange} data={data} setData={setData} RulesObject={FixedDeposit.content} />
                                            </Accordion>

                                            <Accordion flush defaultActiveKey="0">
                                                <InvestmentData handleChange={handleChange} data={data} calculateProfit={calculateProfit} />
                                            </Accordion>

                                            <Accordion flush defaultActiveKey="0" >
                                                <DurationData
                                                    data={data} setData={setData} handleChange={handleChange}
                                                    minDuration={minDuration} maxDuration={maxDuration}
                                                    calculateProfit={calculateProfit} fetching={fetching}
                                                />
                                            </Accordion>

                                            {
                                                !!(data.preferential) &&
                                                <Accordion flush defaultActiveKey="0" >
                                                    <RateData
                                                        data={data} handleChange={handleChange}
                                                        maxRate={maxRate} minRate={minRate}
                                                        calculateProfit={calculateProfit} fetching={fetching}
                                                    />
                                                </Accordion>

                                            }

                                        </Form>
                                    </Col>
                                    :
                                    <NoFixedDeposit />
                        }
                    </Row>
                </Container>
                {
                    !!(FixedDeposit.fetched && contentReady) &&
                    <ActionConfirmationModal
                        setShowModal={setShowModal} show={ShowModal}
                        fetching={fetching} action={data.preferential ? investOnPreferential : invest}
                        anualRate={getAnualRate()} profit={profit}
                        data={data} Balance={AccountSelected?.balance}
                    />

                }
            </div>
        </div >

    )
}
export default FixedDepositTicket