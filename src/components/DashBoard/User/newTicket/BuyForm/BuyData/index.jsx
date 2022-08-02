import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup, Row, Button, Accordion, Container } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import Decimal from 'decimal.js';


const BuyData = ({ data, Funds, handleChange, validated, handleSubmit, toggleAccordion, Balance, fetching }) => {
    Decimal.set({ precision: 100 })

    const { t } = useTranslation();
    const multiplier = 10000


    const amountDecimal = new Decimal(data.amount.length === 0 ? 0 : data.amount)
 
    const sharePriceDecimal = new Decimal(Funds[data.FundSelected]?.sharePrice || 1)

    const sharesToBuy = new Decimal(amountDecimal).div(sharePriceDecimal).toFixed(5)

    return (
        <Accordion.Item eventKey="0" disabled>
            <Accordion.Header onClick={() => { if (data.FundSelected !== -1) toggleAccordion() }}>
                <Container>
                    <Row className="d-flex justify-content-center">
                        <Form.Label className="pt-0 label d-flex align-items-center" column sm="auto">
                            <span>
                                <span className="d-inline-block numberContainer">
                                    <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                        <span className="number">2</span>
                                    </div>
                                </span>
                                {t("Specify the amount you want to invest")}
                            </span>
                        </Form.Label>
                    </Row>
                </Container>
            </Accordion.Header>
            <Accordion.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>U$D</InputGroup.Text>
                        <Form.Control
                            onWheel={event => event.currentTarget.blur()}
                            disabled={data.FundSelected === -1}
                            value={data.amount}
                            step=".01"
                            onChange={handleChange}
                            min={Funds[data.FundSelected] ? Funds[data.FundSelected].sharePrice || 1 : 1}
                            max={data.FundSelected === -1 ?
                                1
                                :
                                Math.min(Funds[data.FundSelected].freeShares * Funds[data.FundSelected].sharePrice, Balance)}
                            id="amount"
                            type="number"
                            required
                            placeholder={t("Amount")}
                        />
                        <Form.Control.Feedback type="invalid">
                            {
                                data.FundSelected === -1 ?
                                    t("Please, select a fund to buy")
                                    :
                                    data.amount === "" ?
                                        t("You must enter how much you want to invest")
                                        :
                                        data.amount > Balance ?
                                            t("You only have") + " U$D " + Balance + " " + t("available in your account.")
                                            :
                                            data.amount < (Funds[data.FundSelected] ? Funds[data.FundSelected].sharePrice || 1 : 1) ?
                                                t("At least you must buy one share") + " (U$D " + (Funds[data.FundSelected] ? Funds[data.FundSelected].sharePrice || 1 : 1) + ")"
                                                :
                                                (data.amount * multiplier) % (0.01 * multiplier) === 0 ?
                                                    t("You are trying to invest") + t(" U$D ") + data.amount + t(", with you could buy") + t(" ") +
                                                    sharesToBuy.toString() + " " + t("shares, but there are only") + t(" ") +
                                                    Funds[data.FundSelected].freeShares + t(" free.")
                                                    :
                                                    t("The min step is 0.01")
                            }
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">
                            {
                                data.FundSelected === -1 ?
                                    t("Please, select a fund to buy")
                                    :
                                    t("You are buying") + " " +
                                    sharesToBuy.toString() + " " +
                                    (
                                        sharesToBuy.toString() === '1.00' ?
                                            t("share")
                                            :
                                            t("shares")
                                    )
                            }
                        </Form.Control.Feedback>
                    </InputGroup>
                    <Button disabled={fetching ||
                        (data.FundSelected === -1 ? true : data.amount > Math.min(Funds[data.FundSelected].freeShares * Funds[data.FundSelected].sharePrice, Balance) && data.amount > 0)}
                        variant="danger" type="submit" className="submitBtn">{t("Submit")}</Button>
                </Form>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default BuyData