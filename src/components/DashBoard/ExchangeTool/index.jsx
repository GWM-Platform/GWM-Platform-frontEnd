import { faExchange } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useMemo, useState } from "react";
import "./index.scss"
import { Col, Form, InputGroup, Modal, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import CurrencyInput from "@osdiab/react-currency-input-field";
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

    const defaultValues = useMemo(() => ({
        date: moment().format("L"),
        market: "paralelo",
        operation: "venta"
    }), [])

    const [data, setData] = useState({
        sourceAmount: "",
        targetAmount: "",
        exchangeRate: "",
        date: defaultValues.date,
        market: defaultValues.market,
        operation: defaultValues.operation
    });

    const handleChange = (value, name, realEvent = false) => {
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
                    setData(prevState => ({
                        ...prevState, targetAmount: calculatedTargetAmount, exchangeRate: value, ...realEvent ? {
                            date: "",
                            operation: "",
                            market: ""
                        } : {}
                    }))
                } else {
                    setData(prevState => ({ ...prevState, targetAmount: "", exchangeRate: value }))
                }
            } else {
                setData(prevState => ({ ...prevState, exchangeRate: "", targetAmount: data.sourceAmount }))
            }
        } else {
            setData(prevState => ({ ...prevState, [name]: value }))
            if (name === "date") {
                selectFromApiData(data.market, data.operation, value)
            }

            if (name === "operation") {
                selectFromApiData(data.market, value, data.date)
            }

            if (name === "market") {
                selectFromApiData(value, data.operation, data.date)
            }
        }

    }

    const selectFromApiData = (market, operation, date) => {
        if (market === "oficial") {
            const quote = oficialExchangeRate.exchangeRates.find(exchangeRate => exchangeRate.fecha === date)
            if (quote) {
                const exchangeValue = operation === "venta" ? quote.venta : operation === "compra" ? quote.compra : (Decimal(quote.compra).add(quote.venta).div(2).toString())
                handleChange(exchangeValue.replaceAll(".", ","), "exchangeRate")
            }
        }
        if (market === "paralelo") {
            const quote = paraleloExchangeRate.exchangeRates.find(exchangeRate => exchangeRate.fecha === date)
            if (quote) {
                const exchangeValue = operation === "venta" ? quote.venta : operation === "compra" ? quote.compra : (Decimal(quote.compra).add(quote.venta).div(2).toString())
                handleChange(exchangeValue.replaceAll(".", ","), "exchangeRate")
            }
        }
    }

    const [paraleloExchangeRate, setParaleloExchangeRate] = useState({
        exchangeRates: [],
        fetching: false
    })
    useEffect(() => {
        const fetchData = async () => {
            setParaleloExchangeRate({ ...{ exchangeRates: [], fetching: true } })
            try {
                const response = await fetch(
                    `https://mercados.ambito.com/dolar/informal/historico-general/${moment().subtract(1, "month").format("YYYY-MM-DD")}/${moment().add(2, "day").format("YYYY-MM-DD")}`,
                    {
                        headers: {
                            "accept": "*/*",
                            "accept-language": "es-419,es;q=0.9,es-ES;q=0.8,en;q=0.7,en-GB;q=0.6,en-US;q=0.5,hu;q=0.4",
                            "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Microsoft Edge\";v=\"116\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Windows\"",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-site"
                        },
                        referrer: "https://www.ambito.com/",
                        referrerPolicy: "strict-origin-when-cross-origin",
                        method: "GET",
                        mode: "cors",
                        credentials: "omit"
                    }
                );

                if (!response.ok) {
                    console.error(`Fetch failed with status ${response.status}`);
                    setParaleloExchangeRate({ ...{ exchangeRates: [], fetching: false } })
                }

                const data = await response.json();
                const guide = data.find(exchangeRate => exchangeRate.some(item => (item === "Venta" || item === "Compra" || item === "Promedio")))
                setParaleloExchangeRate({
                    ...{
                        exchangeRates:
                            data
                                .filter(item => item !== guide)
                                .map(item => ({
                                    venta: (item[guide.findIndex(item => item === "Venta")] + "").replaceAll(",", "."),
                                    compra: (item[guide.findIndex(item => item === "Compra")] + "").replaceAll(",", "."),
                                    fecha: moment(item[guide.findIndex(item => item === "Fecha")], "DD/MM/YYYY").format("L")
                                })).filter((date, i, self) =>
                                    self.findIndex(d => d.fecha === date.fecha) === i
                                ),
                        fetching: false
                    }
                })
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const [oficialExchangeRate, setOficialExchangeRate] = useState({
        exchangeRates: [],
        fetching: false
    })

    useEffect(() => {
        const fetchData = async () => {
            setOficialExchangeRate({ ...{ exchangeRates: [], fetching: true } })
            try {
                const response = await fetch(
                    `https://mercados.ambito.com/dolar/oficial/historico-general/${moment().subtract(1, "month").format("YYYY-MM-DD")}/${moment().add(1, "day").format("YYYY-MM-DD")}`,
                    {
                        headers: {
                            "accept": "*/*",
                            "accept-language": "es-419,es;q=0.9,es-ES;q=0.8,en;q=0.7,en-GB;q=0.6,en-US;q=0.5,hu;q=0.4",
                            "sec-ch-ua": "\"Chromium\";v=\"116\", \"Not)A;Brand\";v=\"24\", \"Microsoft Edge\";v=\"116\"",
                            "sec-ch-ua-mobile": "?0",
                            "sec-ch-ua-platform": "\"Windows\"",
                            "sec-fetch-dest": "empty",
                            "sec-fetch-mode": "cors",
                            "sec-fetch-site": "same-site"
                        },
                        referrer: "https://www.ambito.com/",
                        referrerPolicy: "strict-origin-when-cross-origin",
                        method: "GET",
                        mode: "cors",
                        credentials: "omit"
                    }
                );

                if (!response.ok) {
                    console.error(`Fetch failed with status ${response.status}`);
                    setOficialExchangeRate({ ...{ exchangeRates: [], fetching: false } })
                }

                const data = await response.json();
                const guide = data.find(exchangeRate => exchangeRate.some(item => (item === "Venta" || item === "Compra" || item === "Promedio")))
                setOficialExchangeRate({
                    ...{
                        exchangeRates:
                            data
                                .filter(item => item !== guide)
                                .map(item => ({
                                    venta: (item[guide.findIndex(item => item === "Venta")] + "").replaceAll(",", "."),
                                    compra: (item[guide.findIndex(item => item === "Compra")] + "").replaceAll(",", "."),
                                    fecha: moment(item[guide.findIndex(item => item === "Fecha")], "DD/MM/YYYY").format("L")
                                })).filter((date, i, self) =>
                                    self.findIndex(d => d.fecha === date.fecha) === i
                                ),
                        fetching: false
                    }
                })
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (paraleloExchangeRate.exchangeRates.length > 0) {
            selectFromApiData(defaultValues.market, defaultValues.operation, defaultValues.date)
        }
        //eslint-disable-next-line
    }, [paraleloExchangeRate.exchangeRates, defaultValues.market, defaultValues.operation, defaultValues.date])


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
                            <h3>
                                <span>
                                    <Form.Select className='inline-selector' onChange={e => handleChange(e.target.value, e.target.id)} value={data.market} id="market">
                                        <option disabled value="">{t("Market")}</option>
                                        <option value="oficial">{t("Official market")}</option>
                                        <option value="paralelo">{t("Parallel market")}</option>
                                    </Form.Select>
                                </span>
                                <div className="mx-2 pb-1 d-inline" style={{ borderLeft: "1px solid lightgray" }} />
                                <span>
                                    <Form.Select className='inline-selector me-2' onChange={e => handleChange(e.target.value, e.target.id)} value={data.operation} id="operation">
                                        <option disabled value="">{t("Valor")}</option>
                                        <option value="venta">{t("sell_quote")}</option>
                                        <option value="compra">{t("buy_quote")}</option>
                                        <option value="promedio">{t("Average")}</option>
                                    </Form.Select>
                                </span>
                                {t("_at_quote")}
                                <span>
                                    <Form.Select disabled={data.operation === "" || data.market === ""} className='inline-selector ms-2' onChange={e => handleChange(e.target.value, e.target.id)} value={data.date} id="date">
                                        <option disabled value="">{t("Date")}</option>
                                        {
                                            data.market === "oficial" && oficialExchangeRate.exchangeRates.map((exchangeRate, index) => {
                                                return <option key={index} value={exchangeRate.fecha}>{moment(exchangeRate.fecha, "DD/MM/YYYY").format("L")}</option>
                                            })
                                        }
                                        {
                                            data.market === "paralelo" && paraleloExchangeRate.exchangeRates.map((exchangeRate, index) => {
                                                return <option key={index} value={exchangeRate.fecha}>{moment(exchangeRate.fecha, "DD/MM/YYYY").format("L")}</option>
                                            })
                                        }
                                    </Form.Select>
                                </span>
                            </h3>
                        </Col>

                        <Col xs="12">
                            <h1>{t("1 USD is equivalent to")}</h1>
                        </Col>

                        <Col md="8" className="mb-2">
                            <InputGroup>
                                <CurrencyInput
                                    allowNegativeValue={false}
                                    name="exchangeRate"
                                    value={data.exchangeRate}
                                    decimalsLimit={2}
                                    decimalSeparator={decimalSeparator}
                                    groupSeparator={groupSeparator}
                                    onValueChange={(value, name) => handleChange(value, name, true)}
                                    className="form-control"
                                    prefix="ARS "
                                />
                                <InputGroup.Text onClick={() => { navigator.clipboard.writeText(data.exchangeRate) }}>
                                    <FontAwesomeIcon icon={faClipboard} />
                                </InputGroup.Text>
                            </InputGroup>
                        </Col>
                        <div className="w-100" />

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