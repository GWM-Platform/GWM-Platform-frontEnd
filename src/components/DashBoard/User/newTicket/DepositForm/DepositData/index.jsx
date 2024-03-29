import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup, Row, Button, Container } from 'react-bootstrap'
import { useTranslation } from "react-i18next";


const BuyData = ({ data, handleChange, validated, handleSubmit }) => {

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
                            {t("Enter the dollar amount you deposited to be validated and then credited to your account")}
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
                        id="amount"
                        type="number"
                        required
                        placeholder={t("Amount")}
                    />
                    <Form.Control.Feedback type="invalid">
                        {

                            data.amount === "" ?
                                t("You should enter how much you want to deposit")
                                :
                                t("The amount must be greater than 0")
                        }
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                        {
                            t("Looks good!")
                        }
                    </Form.Control.Feedback>
                </InputGroup>
                <Container className='px-sm-0'>
                    <div className='d-flex justify-content-end'>
                        <Button disabled={data.amount === "" || data.amount <= 0}
                            variant="danger" type="submit">{t("Submit")}</Button>
                    </div>
                </Container>
            </Form>
        </>
    )
}
export default BuyData