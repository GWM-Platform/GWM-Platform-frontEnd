import React, { useEffect, useRef, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup, Row, Accordion, Container } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import CurrencyInput from '@osdiab/react-currency-input-field';
import { unMaskNumber } from 'utils/unmask';
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';


const InvestmentData = ({ data, handleChange, calculateProfit }) => {

    const { t } = useTranslation();

    const {  Balance } = useContext(DashBoardContext);
    

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
                                        <span className="number">2</span>
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
                        className={`form-control ${inputValid ? 'hardcoded-valid' : 'hardcoded-invalid'} `}
                        decimalSeparator={decimalSeparator}
                        decimalsLimit={2}
                        defaultValue={data.amount}
                        groupSeparator={groupSeparator}
                        name="currencyInput"
                        onBlur={() => calculateProfit()}
                        onValueChange={(value, name) => handleAmountChange(value)}
                    />
                </InputGroup>
                <InputGroup className="mb-3">
                    <Form.Control
                        className='d-none'
                        id="amount"
                        max={Balance}
                        min="1"
                        onBlur={() => calculateProfit()}
                        onChange={handleChange}
                        onWheel={event => event.currentTarget.blur()}
                        placeholder={t("Amount")}
                        ref={inputRef}
                        required
                        step=".01"
                        type="number"
                        value={data.amount}
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