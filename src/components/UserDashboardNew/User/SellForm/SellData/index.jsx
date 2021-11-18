import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup, Row, Button, Accordion, Container } from 'react-bootstrap'
import { useTranslation } from "react-i18next";


const SellData = ({ data, Funds, handleChange, validated, handleSubmit,toggleAccordion }) => {

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
                                {t("Specify the amount of shares you want to sell")}
                            </span>
                        </Form.Label>
                    </Row>
                </Container>
            </Accordion.Header>
            <Accordion.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <InputGroup className="mb-1">
                        <Form.Control
                            value={data.shares}
                            onChange={handleChange}
                            min="1"
                            max={data.FundSelected === -1 ?
                                1
                                :
                                Funds[data.FundSelected].shares
                            }
                            id="shares"
                            type="number"
                            required
                            placeholder={t("Shares")}
                        />
                        <Form.Control.Feedback type="invalid">
                            {
                                data.FundSelected === -1 ?
                                    "Please, select a Fund to Sell"
                                    :
                                    data.shares === "" ?
                                        "you should enter how much you want to invest"
                                        :
                                        `You are trying to sell ${data.shares} shares, equivalent to
                                        $${data.shares * Funds[data.FundSelected].fund.sharePrice}, but you only have ${Funds[data.FundSelected].shares} in position.`}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">
                            {
                                data.FundSelected === -1 ?
                                    "Please, select a Fund to Sell"
                                    :
                                    `You are trying to sell  $${data.shares}, equivalent to $${data.shares * Funds[data.FundSelected].sharePrice}.`
                            }
                        </Form.Control.Feedback>
                    </InputGroup>
                    {data.FundSelected !== -1 ? <h2 className="sellDescription mt-0 mb-3">Selling {data.shares} feeParts from {Funds[data.FundSelected].fund.name},
                        equivalent to ${data.shares * Funds[data.FundSelected].fund.sharePrice} </h2> : null}
                    <Button disabled={
                        data.FundSelected === -1 ? true : data.shares > Funds[data.FundSelected].shares}
                        variant="danger" type="submit">{t("Submit")}</Button>
                </Form>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default SellData