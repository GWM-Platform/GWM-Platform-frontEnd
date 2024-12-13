import React, { createRef, useState, useContext, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Row, Form, Accordion, Container, Col } from 'react-bootstrap'
import RuleCard from './RuleCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';
import PreferentialCard from './PreferentialCard';
import TooltipInfo from 'components/DashBoard/Admin/Broadcast/TooltipInfo';
import Decimal from 'decimal.js';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import moment from 'moment';

const RuleSelector = ({ data, setData, RulesObject, handleChange }) => {
    const { t } = useTranslation();
    const [CardWidth, setCardWidth] = useState(false)
    const [Offset, setOffset] = useState(0)
    const [showRightChevron, setShowRightChevron] = useState(true)
    const [showLeftChevron, setShowLeftChevron] = useState(false)
    const { width } = useContext(DashBoardContext)

    const Rules = Object.keys(RulesObject?.interest || {}).sort()
    //For scrolling
    const RulesContainer = createRef()

    const isNull = () => !RulesContainer.current

    //Scrolling Function
    const setScrollPositionByOffset = (offset) => {
        if (!isNull()) {
            let widthScroll =
                isNull() ?
                    "" :
                    CardWidth ?
                        RulesContainer.current.clientWidth / CardWidth :
                        RulesContainer.current.clientWidth / 3
            let scroll = widthScroll * offset
            RulesContainer.current.scrollTo({
                top: 0,
                left: scroll,
                behavior: 'smooth'
            })
            let maxOffset = Rules.length - 1 - CardWidth
            let toSetOffset = offset > maxOffset ? maxOffset : offset
            setShowRightChevron(toSetOffset !== maxOffset)
            setShowLeftChevron(toSetOffset !== 0)
            setOffset(toSetOffset)
        }
    }

    useEffect(() => {
        if (width < 578) {
            setCardWidth(10)
        } else {
            setCardWidth(4)
        }
    }, [width])

    const SelectedType = fixedDepositTypes.find(type => type.value === data.type)

    return (
        <Accordion.Item eventKey="0">
            <Accordion.Header>
                <Container>
                    <Row className="d-flex justify-content-center">
                        <Form.Label className="pt-0 label d-flex align-items-center" column sm="auto">
                            <span>
                                <span className="d-inline-block numberContainer">
                                    <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                        <span className="number">1</span>
                                    </div>
                                </span>
                                {t("Choose a product")}
                            </span>
                        </Form.Label>
                    </Row>
                </Container>
            </Accordion.Header>
            <Accordion.Body>
                <div className="formSection">
                    <Container fluid className="px-0">
                        <Row className="d-flex justify-content-center mx-0">
                            <div className="p-relative px-0">
                                <Container fluid className="px-0">
                                    <Row className="mx-0 flex-row flex-nowrap  overflow-auto overflow-sm-hidden RuleCardsContainer" ref={RulesContainer}>
                                        {Rules.map((Rule, index) =>
                                            <RuleCard handleChange={handleChange} key={`Rule-${index}`} Rule={Rule} data={data} setData={setData} index={index} Rules={Rules} RulesObject={RulesObject} />

                                        )}
                                        <PreferentialCard data={data} setData={setData} handleChange={handleChange} />
                                    </Row>
                                </Container>
                                <div className={`arrow  right d-none d-sm-block
                                ${Rules.length > 4 && showRightChevron ? "opacity-1" : ""}`}
                                    onClick={() => { if (showRightChevron) setScrollPositionByOffset(Offset + 1) }}>
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </div>
                                <div className={` arrow left d-none d-sm-block
                                ${Rules.length > 4 && showLeftChevron ? "opacity-1" : ""}`}
                                    onClick={() => { if (showLeftChevron) setScrollPositionByOffset(Offset - 1) }}>
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </div>
                            </div>

                            <Col className="me-auto mt-3">
                                <Form.Label>
                                    {t("Fixed deposit type")}
                                </Form.Label>
                            </Col>
                            <Col xs="12" className='w-100 p-0 m-0' />
                            <Col className="ps-0">
                                <Form.Select value={data.type} onChange={handleChange} id="type">
                                    <option value="" disabled>
                                        {t("Select a type")}
                                    </option>
                                    {fixedDepositTypes.map((type, index) =>
                                        <option key={`type-${index}`} value={type.value}>
                                            {t(type.label)}
                                        </option>
                                    )}
                                </Form.Select>
                            </Col>
                            <Col xs="auto" className='ps-0'>
                                <TooltipInfo
                                    tooltipClassName="text-align-start p-2"
                                    text={
                                        <>
                                            <h4 style={{ fontSize: "1rem" }} className="font-medium mb-1">{t("Fixed deposit types")}</h4>
                                            {
                                                fixedDepositTypes.map(
                                                    (type, index) => <p className='mb-0' key={`type-${index}`}><strong>{t(type.label)}:</strong> {t(type.desc)}</p>
                                                )
                                            }
                                        </>
                                    }
                                >
                                    <FontAwesomeIcon icon={faInfoCircle} size="lg" className='mt-2' />
                                </TooltipInfo>
                            </Col>
                            {
                                SelectedType?.additionalFields &&
                                SelectedType.additionalFields({ data, handleChange, t })

                            }
                        </Row>
                    </Container>
                </div>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default RuleSelector

const WithdrawalAdditionalFields = ({ data, handleChange, t }) => {
    return (
        <>
            <Col xs="12" className='w-100 p-0 m-0' />
            <Col className="me-auto mt-3">
                <Form.Label>
                    {t("Interest crediting frequency")}
                </Form.Label>
            </Col>
            <Col xs="12" className='w-100 p-0 m-0' />
            <Col className="ps-0">
                <Form.Control
                    value={data.daysInterval} onChange={handleChange} id="daysInterval" type='number' min="1" step="1"
                    placeholder={t("Enter frequency in days (minimum {{minimum}})", { minimum: 1 })}
                />
            </Col>
        </>
    )
}

export const withdrawalResume = ({ data, t, anualRate }) => {
    // based on daysInterval, get the array of expected interest crediting dates and amoun
    try {
        const dailyRate = Decimal(anualRate).div(100).div(365).toNumber(10)
        // round floor
        const crediting = Decimal(data?.days).div(data?.daysInterval).floor().toNumber()
        const rest = Decimal(data?.days).mod(data?.daysInterval).toFixed(0)
        const hasRest = Decimal(rest).gt(0)
        const creditingInterest = Decimal(data.amount).mul(dailyRate).mul(data?.daysInterval).toFixed(10)
        const creditingRest = Decimal(data.amount).mul(dailyRate).mul(rest).toFixed(10)
        const finalPayment = Decimal(data.amount).add(creditingRest).toFixed(2)

        return (
            <>
                <li className="listedInfo">
                    {t("Interest crediting frequency")}:&nbsp;
                    <span className="emphasis">{data.daysInterval}&nbsp;{t("days")}</span>
                </li>
                <li className="listedInfo">
                    {t("Interest crediting")} ({crediting} {t("times")}&nbsp;
                    <TooltipInfo
                        btnClassName="btn no-style alt-focus m-0 d-inline-block"
                        tooltipClassName="text-align-start"

                        text={
                            <ol style={{ marginBottom: 0, paddingLeft: "1.25rem" }}>
                                {
                                    Array.apply(null, { length: crediting }).map((_, index) =>
                                        <li key={`crediting-${index}`}>
                                            {moment().add((index + 1) * data.daysInterval, 'days').format("L")}
                                        </li>
                                    )
                                }
                            </ol>
                        } />):
                    <br />
                    <span className="emphasis">
                        <FormattedNumber value={creditingInterest} prefix="U$D " fixedDecimals={2} /> {t("each")}, <FormattedNumber value={Decimal(creditingInterest).times(crediting).toFixed(2)} prefix="U$D " fixedDecimals={2} /> {t("in total")}
                    </span>
                </li>
                <li className="listedInfo">
                    {t("Final payment")}:
                    &nbsp;<span className="emphasis">
                        {moment().add(data.days, 'days').format("L")}, <FormattedNumber value={finalPayment} prefix="U$D " fixedDecimals={2} />
                    </span><br />

                    &nbsp;<span className="emphasis"><FormattedNumber value={data.amount} prefix="U$D " fixedDecimals={2} /></span>
                    &nbsp;({t("Initial investment")})
                    {
                        hasRest &&
                        <>
                            &nbsp;+&nbsp;<span className="emphasis"><FormattedNumber value={creditingRest} prefix="U$D " fixedDecimals={2} /></span>
                            &nbsp;({t("Rest of interest")}&nbsp;
                            <TooltipInfo
                                tooltipClassName="text-align-start"
                                btnClassName="btn no-style alt-focus m-0 d-inline-block"
                                text={t("As there are less than {{frequency}} days between the last date of interest crediting and the closing date ({{rest}} days), the accumulated interest will be refunded in the final payment along with the initial investment.", {
                                    frequency: data.daysInterval,
                                    rest
                                })} />)
                        </>
                    }
                </li>
            </>
        )
    } catch (err) {
        console.log(err)
        return ""
    }
}
export const getWithdrawalResumeItems = ({ data, anualRate }) => {
    // based on daysInterval, get the array of expected interest crediting dates and amoun
    try {
        const dailyRate = Decimal(anualRate).div(100).div(365).toNumber(10)
        const crediting = Decimal(data?.days).div(data?.daysInterval || 0).floor().toNumber()
        const rest = Decimal(data?.days).mod(data?.daysInterval || 0).toFixed(0)
        const hasRest = Decimal(rest).gt(0)
        const creditingInterest = Decimal(data?.amount).mul(dailyRate).mul(data?.daysInterval || 0).toFixed(10)
        const creditingRest = Decimal(data?.amount).mul(dailyRate).mul(rest).toFixed(10)
        const finalPayment = Decimal(data?.amount).add(creditingRest).toFixed(2)

        return (
            {
                daysInterval: data?.daysInterval,
                crediting,
                creditingDetail: ((crediting || 0) > 0) ? Array.apply(null, { length: crediting || 1 }).map((_, index) => {
                    const date = moment(
                        data.startDate
                    ).add((index + 1) * data?.daysInterval, 'days')
                    return {
                        date: date,
                        credited: data.lastAccreditationDate && date.isSameOrBefore(moment(data.lastAccreditationDate)),
                        nextToBeCredited: date.isAfter(moment()) && date.diff(moment(), 'days') <= data?.daysInterval
                    }
                }
                ) : [],
                creditingInterest,
                creditingInterestTotal: Decimal(creditingInterest).times(crediting).toFixed(2),
                finalPayment,
                initialInvestment: data?.amount,
                hasRest,
                creditingRest,
                frecuency: data?.daysInterval,
                rest
            }
        )
    } catch (err) {
        console.log(err)
        return {}
    }
}

export const getAdvanceResumeItems = ({ data, anualRate }) => {
    try {
        const dailyRate = Decimal(anualRate).div(100).div(365).toNumber(10)
        const totalProfit = Decimal(data.amount).mul(Decimal(data.days).mul(dailyRate)).toFixed(2)

        return {
            inAdvance: totalProfit,
            finalPayment: data.amount
        }
    } catch (err) {
        return {
            totalProfit: null,
            finalPayment: null
        }
    }
}
export const inAdvanceResume = ({ data, t, anualRate }) => {
    try {
        const dailyRate = Decimal(anualRate).div(100).div(365).toNumber(10)
        const totalProfit = Decimal(data.amount).mul(Decimal(data.days).mul(dailyRate)).toFixed(2)

        return (
            <>
                <li>
                    {t("Interest crediting in advance (when the ticket is approved)")}:&nbsp;
                    <span className="emphasis">
                        <FormattedNumber value={totalProfit} prefix="U$D " fixedDecimals={2} />
                    </span>
                </li>
                <li>
                    {t("Final payment")}:
                    &nbsp;<span className="emphasis">
                        {moment().add(data.days, 'days').format("L")}, <FormattedNumber value={Decimal(data.amount).toFixed(2)} prefix="U$D " fixedDecimals={2} />&nbsp;({t("Initial investment")})
                    </span>
                </li>
            </>
        )
    } catch (err) {
        console.log(err)
        return ""
    }
}

export const getFixedDepositType = (type) => fixedDepositTypes.find(t => t.value === type)
export const fixedDepositTypes = [
    {
        value: "standard",
        label: "Traditional",
        desc: "Interest and initial investment paid at dueDate"
    },
    {
        value: "withdrawal",
        label: "Periodic crediting of interests",
        desc: "Periodic interest paid, initial investment paid at dueDate",
        additionalFields: WithdrawalAdditionalFields,
        additionalFieldsProps: ["daysInterval"],
        resume: withdrawalResume,
        getResumeItems: getWithdrawalResumeItems
    },
    {
        value: "inAdvance",
        label: "With advance interest credit",
        desc: "Interest paid at the beginning of the period, initial investment paid at dueDate",
        resume: inAdvanceResume,
        getResumeItems: getAdvanceResumeItems
    }
]