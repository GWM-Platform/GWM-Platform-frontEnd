import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup, Row, Button, Accordion, Container } from 'react-bootstrap'
import { useTranslation } from "react-i18next";

const TransferData = ({ data, handleChange, TargetAccount, toggleAccordion, Balance }) => {

    const { t } = useTranslation();
    
    return (
        <Accordion.Item eventKey="0" disabled>
            <Accordion.Header onClick={() => { if (TargetAccount.fetched && !TargetAccount.fetching && TargetAccount.valid) toggleAccordion() }}>
                <Container>
                    <Row className="d-flex justify-content-center">
                        <Form.Label className="pt-0 label d-flex align-items-center" column sm="auto">
                            <span>
                                <span className="d-inline-block numberContainer">
                                    <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                        <span className="number">2</span>
                                    </div>
                                </span>
                                {t("Specify the amount you want to transfer")}
                            </span>
                        </Form.Label>
                    </Row>
                </Container>
            </Accordion.Header>
            <Accordion.Body>
                <InputGroup className="mb-3">
                    <InputGroup.Text>U$D</InputGroup.Text>
                    <Form.Control
                        onWheel={event => event.currentTarget.blur()}
                        disabled={false}
                        value={data.amount}
                        step=".0001"
                        onChange={handleChange}
                        min={1}
                        max={Balance}
                        id="amount"
                        type="number"
                        required
                        placeholder={t("Amount")}
                    />
                    <Form.Control.Feedback type="invalid">
                        {
                            data.amount === "" ?
                                t("You must enter how much you want to transfer")
                                :
                                data.amount > Balance ?
                                    t("The amount must be less than or equal to the available cash of the selected account") + " ($" + Balance + ")"
                                    :
                                    t("The amount must be greater than 0")
                        }
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                        {
                            t("Looks good") + "!"
                        }
                    </Form.Control.Feedback>
                </InputGroup>
                <Button disabled={false}
                    variant="danger" type="submit" className="submitBtn">{t("Submit")}</Button>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default TransferData