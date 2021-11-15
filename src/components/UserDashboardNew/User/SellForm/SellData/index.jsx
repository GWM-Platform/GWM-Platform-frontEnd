import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup, Row, Button, Accordion, Container } from 'react-bootstrap'
import { useTranslation } from "react-i18next";


const SellData = ({ data, founds, handleChange, validated, handleSubmit }) => {

    const { t } = useTranslation();

    return (
        <Accordion.Item disabled eventKey="0">
            <Accordion.Header>
                <Container>
                    <Row className="d-flex justify-content-center">
                        <Form.Label className="pt-0 label d-flex align-items-center" column sm="auto">
                            <span>
                                <span className="d-inline-block numberContainer">
                                    <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                        <span className="number">2</span>
                                    </div>
                                </span>
                                {t("Specify amount in dollars you want to sell")}
                            </span>
                        </Form.Label>
                    </Row>
                </Container>
            </Accordion.Header>
            <Accordion.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <InputGroup className="mb-1">
                        <InputGroup.Text>U$D</InputGroup.Text>

                        <Form.Control
                            value={data.amount}
                            onChange={handleChange}
                            min="1"
                            max={data.foundSelected === -1 ?
                                1
                                :
                                founds[data.foundSelected].shares * founds[data.foundSelected].fund.sharePrice}
                            id="amount"
                            type="number"
                            required
                            placeholder={t("Amount")}
                        />
                        <Form.Control.Feedback type="invalid">
                            {
                                data.foundSelected === -1 ?
                                    "Please, select a found to Sell"
                                    :
                                    data.amount === "" ?
                                        "you should enter how much you want to invest"
                                        :
                                        `You are trying to invest $${data.amount}, with you could Sell
                                        ${data.amount / founds[data.foundSelected].fund.sharePrice} shares, but there are only
                                        ${founds[data.foundSelected].fund.freeShares} free.`}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">
                            {
                                data.foundSelected === -1 ?
                                    "Please, select a found to Sell"
                                    :
                                    `You are trying to invest $${data.amount}, with you could Sell ${data.amount / founds[data.foundSelected].sharePrice} shares.`
                            }
                        </Form.Control.Feedback>
                    </InputGroup>
                    {data.foundSelected !== -1 ? <h2 className="sellDescription mt-0 mb-3">Selling ${data.amount} from {founds[data.foundSelected].fund.name},
                        equivalent to {data.amount / founds[data.foundSelected].fund.sharePrice} feeParts</h2> : null}
                    <Button disabled={
                        data.foundSelected === -1 ? true : data.amount > founds[data.foundSelected].shares * founds[data.foundSelected].fund.sharePrice}
                        variant="danger" type="submit">{t("Submit")}</Button>
                </Form>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default SellData