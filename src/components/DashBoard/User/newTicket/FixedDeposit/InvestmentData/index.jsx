import React, { useEffect, useRef, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup, Row, Accordion, Container } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import CurrencyInput from '@osdiab/react-currency-input-field';
import { unMaskNumber } from 'utils/unmask';


const InvestmentData = ({ data, handleChange, Balance, calculateProfit }) => {

    const { t } = useTranslation();

    const [inputValid, setInputValid] = useState(false)

    const decimalSeparator = process.env.REACT_APP_DECIMALSEPARATOR ?? '.'
    const groupSeparator = process.env.REACT_APP_GROUPSEPARATOR ?? ','
    const inputRef = useRef()

    const handleAmountChange = (value, name) => {
        const decimalSeparator = process.env.REACT_APP_DECIMALSEPARATOR ?? '.'

        let fixedValue = value || ""
        if (value) {
            let lastCharacter = value.slice(-1)
            if (lastCharacter === decimalSeparator) {
                fixedValue = value.slice(0, -1)
            }
        }
        const unMaskedValue = unMaskNumber({ value: fixedValue || "" })
        handleChange({
            target:
                { id: name ? name : 'amount', value: unMaskedValue }
        })
    }
    useEffect(() => {
        setInputValid(inputRef?.current?.checkValidity())
    }, [inputRef, data.amount])
    return (
        <Accordion.Item eventKey="0" disabled>
            <Accordion.Header>
                <Container>
                    <Row className="d-flex justify-content-center">
                        <Form.Label className="pt-0 label d-flex align-items-center" column sm="auto">
                            <span>
                                <span className="d-inline-block numberContainer">
                                    <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                        <span className="number">1</span>
                                    </div>
                                </span>
                                {t("Specify the amount you want to invest")}
                            </span>
                        </Form.Label>
                    </Row>
                </Container>
            </Accordion.Header>
            <Accordion.Body>
                <InputGroup>
                    <InputGroup.Text>U$D</InputGroup.Text>
                    {/*Shown input formatted*/}
                    <CurrencyInput
                        allowNegativeValue={false}
                        onBlur={() => calculateProfit()}
                        name="currencyInput"
                        defaultValue={data.amount}
                        decimalsLimit={2}
                        decimalSeparator={decimalSeparator}
                        groupSeparator={groupSeparator}
                        onValueChange={(value, name) => handleAmountChange(value)}
                        className={`form-control ${inputValid ? 'hardcoded-valid' : 'hardcoded-invalid'} `}
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <Form.Control
                    className='d-none'
                        ref={inputRef}
                        onBlur={() => calculateProfit()}
                        onWheel={event => event.currentTarget.blur()}
                        value={data.amount}
                        step=".01"
                        onChange={handleChange}
                        min="1"
                        max={Balance}
                        id="amount"
                        type="number"
                        required
                        placeholder={t("Amount")}
                    />
                    <Form.Control.Feedback type="invalid">
                        {

                            data.amount === "" ?
                                t("You must enter how much you want to invest")
                                :
                                data.amount <= 0 ?
                                    t("The value must be greater than 0")
                                    :
                                    data.amount > Balance ?
                                        t("You only have") + " U$D " + Balance + " " + t("available in your account.")
                                        :
                                        t("The min step is 0.01")
                        }
                    </Form.Control.Feedback>
                </InputGroup>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default InvestmentData