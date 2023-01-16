import React, { useState, useContext, useCallback, useEffect } from 'react'
import { useHistory } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../operationsForm.css'

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
import RuleSelector from './RuleSelector';

const FixedDepositTicket = ({ balanceChanged }) => {
    Decimal.set({ precision: 100 })
    useEffect(() => {

        ReactGA.event({
            category: "Acceso a secciones para generar tickets",
            action: "Generación De Plazos Fijos",
            label: "Retiros",
        })
    }, [])

    const { token, contentReady, Accounts, toLogin, ClientSelected } = useContext(DashBoardContext);

    //If the user came from an specific fund, we use the query to auto select that one

    const [data, setData] = useState({
        amount: "",
        ruleSelected: "",
        days: "",
        until: ""
    })

    const [ShowModal, setShowModal] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [validated, setValidated] = useState(true);

    const [profit, setProfit] = useState({ fetching: false, fetched: false, valid: false, value: 0 })

    let history = useHistory();

    const invest = () => {
        if (!fetching) {
            setFetching(true)
            axios.post('fixed-deposits', {
                initialAmount: data.amount,
                depositPlanId: FixedDeposit?.content?.id,
                clientId: ClientSelected.id,
                duration: data.days
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
                        aux.days = moment(event.target.value, "YYYY-MM-DD").diff(moment().startOf('day'), 'days');
                        break;
                    case "days":
                        aux.until = moment().add(event.target.value, 'days').format("YYYY-MM-DD")
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
        if (data.amount.length > 0 && data.days.length > 0 && Number(data.days) >= 365 && FixedDeposit.fetched) {
            const investmentDays = Number(data.days)
            return FixedDeposit?.content?.interest[Object.keys(FixedDeposit?.content?.interest).filter(ruleDays => ruleDays <= investmentDays).reduce((prev, curr) => Math.abs(curr - investmentDays) < Math.abs(prev - investmentDays) ? curr : prev)] || 0
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
        if (data.amount.length > 0 && data.days.length > 0 && Number(data.days) >= 365 && FixedDeposit.fetched) {
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
                                                <RuleSelector data={data} setData={setData} RulesObject={FixedDeposit.content} />
                                            </Accordion>

                                            <Accordion flush defaultActiveKey="0">
                                                <InvestmentData
                                                    calculateProfit={calculateProfit}
                                                    handleSubmit={handleSubmit} validated={validated}
                                                    handleChange={handleChange} data={data}
                                                    Balance={Accounts[0].balance} fetching={fetching} />
                                            </Accordion>

                                            <Accordion flush defaultActiveKey="0" >
                                                <DurationData
                                                    FixedDepositRules={Object.keys(FixedDeposit?.content?.interest ?? [])}
                                                    calculateProfit={calculateProfit} handleChange={handleChange} data={data} setData={setData} Account={Accounts[0]} />
                                            </Accordion>
                                        </Form>
                                    </Col>
                                    :
                                    <NoFixedDeposit />
                        }
                    </Row>
                </Container>
                {
                    !!(FixedDeposit.fetched && contentReady) &&
                    <ActionConfirmationModal anualRate={getAnualRate()} profit={profit} fetching={fetching} setShowModal={setShowModal} show={ShowModal} action={invest} data={data} Balance={Accounts[0].balance} />

                }
            </div>
        </div >

    )
}
export default FixedDepositTicket