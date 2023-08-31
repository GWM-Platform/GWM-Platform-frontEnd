import { faExchange } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import "./index.scss"
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import CurrencyInput, { formatValue } from "@osdiab/react-currency-input-field";
import moment from "moment";
import { unMaskNumber } from "utils/unmask";
import Decimal from "decimal.js";
import { faClipboard } from "@fortawesome/free-regular-svg-icons";
const ExchangeTool = () => {
    const { t } = useTranslation()
    const decimalSeparator = process.env.REACT_APP_DECIMALSEPARATOR ?? '.'
    const groupSeparator = process.env.REACT_APP_GROUPSEPARATOR ?? ','

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const defaultExchangeRate = "730"
    const [data, setData] = useState({
        sourceAmount: "",
        targetAmount: "",
        exchangeRate: defaultExchangeRate
    });

    const handleChange = (value, name) => {
        if (name === "sourceAmount") {
            const unMaskedSourceAmount = unMaskNumber({ value })
            if (value !== undefined) {
                const unMaskedExchangeRate = unMaskNumber({ value: data.exchangeRate.replace("ARS ", "") || "" })
                const calculatedTargetAmount = Decimal(unMaskedSourceAmount).times(unMaskedExchangeRate).toFixed(2)
                setData(prevState => ({ ...prevState, targetAmount: calculatedTargetAmount, sourceAmount: value }))
            } else {
                setData(prevState => ({ ...prevState, targetAmount: "", sourceAmount: "" }))
            }
        } else if (name === "targetAmount") {
            if (value !== undefined) {
                const unMaskedTargetAmount = unMaskNumber({ value })
                if (data.exchangeRate !== "") {
                    const unMaskedExchangeRate = unMaskNumber({ value: data.exchangeRate.replace("ARS ", "") || "" })
                    const calculatedSourceAmount = Decimal(unMaskedTargetAmount).div(unMaskedExchangeRate).toFixed(2)
                    setData(prevState => ({ ...prevState, sourceAmount: calculatedSourceAmount, targetAmount: value }))
                } else {
                    setData(prevState => ({ ...prevState, sourceAmount: value, targetAmount: value }))
                }
            } else {
                setData(prevState => ({ ...prevState, targetAmount: "", sourceAmount: "" }))
            }
        } else if (name === "exchangeRate") {
            if (value !== undefined) {
                const unMaskedSourceAmount = unMaskNumber({ value: data.sourceAmount })
                if (data.sourceAmount !== "") {
                    const unMaskedExchangeRate = unMaskNumber({ value })
                    const calculatedTargetAmount = Decimal(unMaskedSourceAmount).times(unMaskedExchangeRate).toFixed(2)
                    setData(prevState => ({ ...prevState, targetAmount: calculatedTargetAmount, exchangeRate: value }))
                } else {
                    setData(prevState => ({ ...prevState, targetAmount: "", exchangeRate: value }))
                }
            } else {
                setData(prevState => ({ ...prevState, exchangeRate: "", targetAmount: data.sourceAmount }))
            }
        }

    }
    console.log(moment().format())
    return (
        <>
            <button onClick={handleShow} className="exchange-tool-button">
                <FontAwesomeIcon icon={faExchange} />
            </button>
            <Modal className="exchange-modal" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("Currency converter")}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Row>
                        <Col xs="12">
                            <h1>{t("1 USD is equivalent to")}</h1>
                        </Col>

                        <Col md="8">
                            <InputGroup>
                                <CurrencyInput
                                    allowNegativeValue={false}
                                    name="exchangeRate"
                                    value={data.exchangeRate}
                                    decimalsLimit={2}
                                    decimalSeparator={decimalSeparator}
                                    groupSeparator={groupSeparator}
                                    onValueChange={(value, name) => handleChange(value, name)}
                                    className="form-control"
                                    prefix="ARS "
                                />
                                <InputGroup.Text onClick={() => { navigator.clipboard.writeText(data.exchangeRate) }}>
                                    <FontAwesomeIcon icon={faClipboard} />
                                </InputGroup.Text>
                            </InputGroup>
                        </Col>
                        <Col xs="12">
                            <h3>
                                {
                                    (data.exchangeRate !== defaultExchangeRate) &&
                                    <>
                                        <span style={{ cursor: "pointer", textDecoration: "underline" }} onClick={() => { handleChange(defaultExchangeRate, "exchangeRate") }}>
                                            {
                                                formatValue({
                                                    value: defaultExchangeRate,
                                                    groupSeparator: '.',
                                                    decimalSeparator: ',',
                                                    prefix: "ARS ",
                                                })
                                            }
                                        </span>
                                        &nbsp;
                                    </>
                                }
                                {t("As of {{date}}", { date: moment("2023-08-31T14:25:17-03:00").format("L") })}
                            </h3>
                        </Col>

                        <Col>
                            <Form.Group className="mb-3" >
                                <Form.Label>USD</Form.Label>
                                <InputGroup>
                                    <CurrencyInput
                                        allowNegativeValue={false}
                                        name="sourceAmount"
                                        value={data.sourceAmount}
                                        decimalsLimit={2}
                                        decimalSeparator={decimalSeparator}
                                        groupSeparator={groupSeparator}
                                        onValueChange={(value, name) => handleChange(value, name)}
                                        className="form-control"
                                    />
                                    <InputGroup.Text onClick={() => { navigator.clipboard.writeText(data.sourceAmount) }}>
                                        <FontAwesomeIcon icon={faClipboard} />
                                    </InputGroup.Text>
                                </InputGroup>

                            </Form.Group>
                        </Col>
                        <Col xs="auto" className="d-flex align-items-center">
                            <FontAwesomeIcon icon={faExchange} />
                        </Col>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label>ARS</Form.Label>
                                <InputGroup>
                                    <CurrencyInput
                                        allowNegativeValue={false}
                                        name="targetAmount"
                                        value={data.targetAmount}
                                        decimalsLimit={2}
                                        decimalSeparator={decimalSeparator}
                                        groupSeparator={groupSeparator}
                                        onValueChange={(value, name) => handleChange(value, name)}
                                        className="form-control"
                                    />
                                    <InputGroup.Text onClick={() => { navigator.clipboard.writeText(data.targetAmount) }}>
                                        <FontAwesomeIcon icon={faClipboard} />
                                    </InputGroup.Text>
                                </InputGroup>
                            </Form.Group>
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>

        </>
    );
}

export default ExchangeTool