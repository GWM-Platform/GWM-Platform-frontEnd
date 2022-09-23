import React, { useEffect, useRef, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup, Row, Button, Container } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { unMaskNumber } from 'utils/unmask';
import CurrencyInput from '@osdiab/react-currency-input-field';


const WithdrawData = ({ data, handleChange, validated, handleSubmit, account, fetching }) => {

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
                <InputGroup >
                    <InputGroup.Text>U$D</InputGroup.Text>
                    {/*Shown input formatted*/}
                    <CurrencyInput
                        allowNegativeValue={false}
                        name="currencyInput"
                        defaultValue={data.amount}
                        decimalsLimit={2}
                        decimalSeparator={decimalSeparator}
                        groupSeparator={groupSeparator}
                        onValueChange={(value, name) => handleAmountChange(value)}
                        className={`form-control ${inputValid ? 'hardcoded-valid' : 'hardcoded-invalid'} `}
                    />
                </InputGroup>

                <InputGroup  className="mb-3">

                    <Form.Control
                        className="d-none"
                        ref={inputRef}
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
                                    t("The amount must be less than or equal to the available cash of the selected account") + " ($" + account.balance + ")"
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