import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup, Row, Button, Accordion, Container } from 'react-bootstrap'
import { useTranslation } from "react-i18next";


const BuyData = ({ data, founds, handleChange, validated, handleSubmit, toggleAccordion }) => {

    const { t } = useTranslation();

    return (
        <Accordion.Item eventKey="0">
            <Accordion.Header onClick={() => toggleAccordion()}>
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
                            value={data.amount}
                            onChange={handleChange}
                            min="1"
                            max={data.foundSelected === -1 ?
                                1
                                :
                                founds[data.foundSelected].freeShares * founds[data.foundSelected].sharePrice}
                            id="amount"
                            type="number"
                            required
                            placeholder={t("Amount")}
                        />
                        <Form.Control.Feedback type="invalid">
                            {
                                data.foundSelected === -1 ?
                                    "Please, select a found to buy"
                                    :
                                    data.amount === "" ?
                                        "you should enter how much you want to invest"
                                        :
                                        `You are trying to invest $${data.amount}, with you could buy
                                        ${data.amount / founds[data.foundSelected].sharePrice} shares, but there are only
                                        ${founds[data.foundSelected].freeShares} free.`}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">
                            {
                                data.foundSelected === -1 ?
                                    "Please, select a found to buy"
                                    :
                                    `You are trying to invest $${data.amount}, with you could buy ${data.amount / founds[data.foundSelected].sharePrice} shares.`
                            }
                        </Form.Control.Feedback>
                    </InputGroup>
                    <Button disabled={
                        data.foundSelected === -1 ? true : data.amount > founds[data.foundSelected].freeShares * founds[data.foundSelected].sharePrice}
                        variant="danger" type="submit">{t("Submit")}</Button>
                </Form>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default BuyData