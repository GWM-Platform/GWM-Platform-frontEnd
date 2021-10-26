import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form,InputGroup, Row, Button } from 'react-bootstrap'
import { useTranslation } from "react-i18next";


const BuyData = ({ data, founds, handleChange }) => {
    const [validated, setValidated] = useState(false);

    const { t } = useTranslation();

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            console.log("si")
        }
        setValidated(true);
    }
    return (
        <div className={`formSection ${data.foundSelected === undefined ? "d-none" : "d-block"}`}>
            <Row className="d-flex justify-content-center">
                <Form.Label className="mb-3 pt-0 label d-flex align-items-center" column sm="auto">
                    <div className="d-inline-block numberContainer">
                        <div className="d-flex justify-content-center align-items-center h-100 w-100">
                            <span className="number">2</span>
                        </div>
                    </div>
                    {t("Specify amount in dollars you want to invest")}
                </Form.Label>

                <Form noValidate validated={validated} onSubmit={() => { handleSubmit() }}>
                    <InputGroup className="mb-3">
                        <InputGroup.Text>U$D</InputGroup.Text>
                      
                            <Form.Control
                                value={data.amount}
                                onChange={handleChange}
                                min="1"
                                max={data.foundSelected === undefined ?
                                    1
                                    :
                                    founds[data.foundSelected].feePartsAvalilable}
                                id="amount"
                                type="number"
                                placeholder={t("Amount")}
                            />
                    </InputGroup>
                    <Button disabled={
                        data.foundSelected === undefined ? true : data.amount > founds[data.foundSelected].feePartsAvalilable}
                        variant="danger" type="submit">{t("Submit")}</Button>
                </Form>
            </Row>
        </div>
    )
}
export default BuyData