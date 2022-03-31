import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup, Row, Button, Accordion, Container } from 'react-bootstrap'
import { useTranslation } from "react-i18next";


const SellData = ({ data, Funds, handleChange, validated, handleSubmit, toggleAccordion, fetching }) => {

    const { t } = useTranslation();

    return (
        <Accordion.Item eventKey="0">
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
                            onWheel={event => event.currentTarget.blur()}
                            value={data.shares}
                            onChange={handleChange}
                            min="1"
                            step="0.0001"
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
                                    "Please, select a fund to sell"
                                    :
                                    data.shares === "" ?
                                        t("Quantity of shares you want to sell")
                                        :
                                        data.shares < 1 ?
                                            t("At least you must sell 1 feepart")
                                            :
                                            t("There are only") + " " + Funds[data.FundSelected].shares + " " + t("available shares")
                            }
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">
                            {
                                data.FundSelected === -1 ?
                                    t("Please, select a fund to sell")
                                    :
                                    ""
                            }
                        </Form.Control.Feedback>
                    </InputGroup>
                    <Button
                        disabled={fetching ||
                            (data.FundSelected === -1 ? true : data.shares > Funds[data.FundSelected].shares || data.shares <= 0)}
                        variant="danger" type="submit" className="submitBtn">{t("Submit")}</Button>
                </Form>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default SellData