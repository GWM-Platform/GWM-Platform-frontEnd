import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup, Row, Button, Container } from 'react-bootstrap'
import { useTranslation } from "react-i18next";


const WithdrawData = ({ data, handleChange, validated, handleSubmit, account,fetching }) => {

    const { t } = useTranslation();

    return (
        <>
            <Container>
                <Row className="d-flex justify-content-center">
                    <Form.Label className="py-5 label d-flex align-items-center" column sm="auto">
                        <span>
                            <span className="d-inline-block numberContainer">
                                <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                    <span className="number">1</span>
                                </div>
                            </span>
                            {t("Enter amount you want to withdraw")}
                        </span>
                    </Form.Label>
                </Row>
            </Container>

            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <InputGroup className="mb-3">
                    <InputGroup.Text>U$D</InputGroup.Text>

                    <Form.Control
                        onWheel={event => event.currentTarget.blur()}
                        value={data.amount}
                        step=".01"
                        onChange={handleChange}
                        min="0.01"
                        max={account.balance}
                        id="amount"
                        type="number"
                        required
                        placeholder={t("Amount")}
                    />
                    <Form.Control.Feedback type="invalid">
                        {

                            data.amount === "" ?
                                t("You must enter how much you want to withdraw")
                                :
                                data.amount > account.balance ?
                                    t("The amount must be lower or equal to the available cash") + " ($" + account.balance + ")"
                                    :
                                    t("The amount must be greater than 0")
                        }
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                        {t("Looks good")}!
                    </Form.Control.Feedback>
                </InputGroup>
                <Button disabled={fetching || data.amount === "" || data.amount <= 0}
                    variant="danger" type="submit" className="submitBtn">{t("Submit")}</Button>
            </Form>
        </>
    )
}
export default WithdrawData