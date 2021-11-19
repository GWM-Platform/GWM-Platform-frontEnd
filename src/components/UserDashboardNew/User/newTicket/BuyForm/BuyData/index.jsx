import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup, Row, Button, Accordion, Container } from 'react-bootstrap'
import { useTranslation } from "react-i18next";


const BuyData = ({ data, Funds, handleChange, validated, handleSubmit, toggleAccordion,Balance }) => {

    const { t } = useTranslation();

    return (
        <Accordion.Item eventKey="0" disabled>
            <Accordion.Header onClick={() => {if(data.FundSelected!==-1)toggleAccordion()}}>
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
                            disabled={data.FundSelected===-1}
                            value={data.amount}
                            step=".01"
                            onChange={handleChange}
                            min="0.01"
                            max={data.FundSelected === -1 ?
                                1
                                :
                                Math.min(Funds[data.FundSelected].freeShares * Funds[data.FundSelected].sharePrice,Balance)}
                            id="amount"
                            type="number"
                            required
                            placeholder={t("Amount")}
                        />
                        <Form.Control.Feedback type="invalid">
                            {
                                data.FundSelected === -1 ?
                                    "Please, select a Fund to buy"
                                    :
                                    data.amount === "" ?
                                        "you should enter how much you want to invest"
                                        :
                                        `You are trying to invest $${data.amount}, with you could buy
                                        ${data.amount / Funds[data.FundSelected].sharePrice} shares, but there are only
                                        ${Funds[data.FundSelected].freeShares} free.`}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">
                            {
                                data.FundSelected === -1 ?
                                    "Please, select a Fund to buy"
                                    :
                                    `You are trying to invest $${data.amount}, with you could buy ${data.amount / Funds[data.FundSelected].sharePrice} shares.`
                            }
                        </Form.Control.Feedback>
                    </InputGroup>
                    <Button disabled={
                        data.FundSelected === -1 ? true : data.amount > Math.min(Funds[data.FundSelected].freeShares * Funds[data.FundSelected].sharePrice,Balance) && data.amount>0}
                        variant="danger" type="submit">{t("Submit")}</Button>
                </Form>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default BuyData