import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup, Row, Button, Accordion, Container } from 'react-bootstrap'
import { useTranslation } from "react-i18next";


const BuyData = ({ data, Funds, handleChange, validated, handleSubmit, toggleAccordion, Balance }) => {

    const { t } = useTranslation();

    const multiplier = 10000

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
                                {t("Specify amount in dollars you want to invest")}
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
                            step=".0001"
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
                                            t("You are trying to invest") + " $" + data.amount + " " + t("but you only have") + t(" $") + Balance +
                                            " " + t("available in your account.")
                                            :
                                            data.amount < (Funds[data.FundSelected] ? Funds[data.FundSelected].sharePrice || 1 : 1) ?
                                                t("At least you must buy 1 feepart")+" ($"+ (Funds[data.FundSelected] ? Funds[data.FundSelected].sharePrice || 1 : 1) +")"
                                                :
                                                (data.amount * multiplier) % (0.0001 * multiplier) === 0 ?
                                                    t("You are trying to invest") + t(" $") + data.amount + t(", with you could buy") + t(" ") +
                                                    (data.amount / Funds[data.FundSelected].sharePrice).toFixed(4) + " " + t("shares, but there are only") + t(" ") +
                                                    Funds[data.FundSelected].freeShares + t(" free.")
                                                    :
                                                    t("The min step is 0.0001")
                            }
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">
                            {
                                data.FundSelected === -1 ?
                                    t("Please, select a fund to buy")
                                    :
                                    t("You are trying to invest") + " $" + data.amount + t(", with you could buy") + t(" ") +
                                    (data.amount / Funds[data.FundSelected].sharePrice).toFixed(2) + " " + t("feeparts") + "."
                            }
                        </Form.Control.Feedback>
                    </InputGroup>
                    <Button disabled={
                        data.FundSelected === -1 ? true : data.amount > Math.min(Funds[data.FundSelected].freeShares * Funds[data.FundSelected].sharePrice, Balance) && data.amount > 0}
                        variant="danger" type="submit" className="submitBtn">{t("Submit")}</Button>
                </Form>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default BuyData