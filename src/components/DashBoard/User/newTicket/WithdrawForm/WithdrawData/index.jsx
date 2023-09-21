import React, { useEffect, useRef, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup, Row, Button, Container } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { unMaskNumber } from 'utils/unmask';
import CurrencyInput from '@osdiab/react-currency-input-field';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Decimal from 'decimal.js';


const WithdrawData = ({ data, handleChange, validated, handleSubmit, account, fetching }) => {

    const { t } = useTranslation();

    const [inputValid, setInputValid] = useState(false)
    const [NoteActive, setNoteActive] = useState(false)

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

    const amountDeductedFromOverdraft = Decimal(data?.amount || 0).minus(account?.balance || 0).toNumber()

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

                <InputGroup className="mb-3">

                    <Form.Control
                        className="d-none"
                        ref={inputRef}
                        onWheel={event => event.currentTarget.blur()}
                        value={data.amount}
                        step=".01"
                        onChange={handleChange}
                        min="0.01"
                        max={account.totalAvailable}
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
                                data.amount > account.totalAvailable ?
                                    t("The amount must be less than or equal to the available cash of your account") + " ($" + account.totalAvailable + ")"
                                    :
                                    t("The amount must be greater than 0")
                        }
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                        {t("Looks good")}! <span style={{ color: "orange" }}>
                            {
                                amountDeductedFromOverdraft > 0 &&
                                t("This movement will deduct {{amount}} from your overdraft balance", { amount: amountDeductedFromOverdraft })
                            }
                        </span>
                    </Form.Control.Feedback>
                </InputGroup>
                {
                    NoteActive ?
                        <div className="d-flex align-items-center mb-3">
                            <Form.Control
                                placeholder={t("Withdrawal note")}
                                value={data.note} type="text" id="note" maxLength="250"
                                onChange={(e) => { handleChange(e); }}
                                required
                            />

                            <button
                                type="button"
                                onClick={
                                    () => {
                                        handleChange({ target: { id: "note", value: "" } })
                                        setNoteActive(false)
                                    }
                                }
                                className="noStyle ms-2" title={t("Remove note")}>
                                <FontAwesomeIcon icon={faMinusCircle} />
                            </button>
                        </div>

                        :
                        <div style={{ height: "38px" }} className="mb-3 w-100 d-flex align-items-start">
                            <Button type="button" className="ms-auto" size="sm" variant="danger" onClick={() => setNoteActive(true)}>
                                <FontAwesomeIcon className="me-1" icon={faPlusCircle} />
                                {t("Add note")}
                            </Button>
                        </div>
                }
                <Container className='px-sm-0'>
                    <div className='d-flex justify-content-end'>
                        <Button disabled={fetching || data.amount === "" || data.amount <= 0}
                            variant="danger" type="submit" className="submitBtn">{t("Submit")}</Button>
                    </div>
                </Container>
            </Form>
        </>
    )
}
export default WithdrawData