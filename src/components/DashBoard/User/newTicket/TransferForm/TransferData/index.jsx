import React, { useEffect, useMemo, useRef, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup, Row, Button, Accordion, Container } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import CurrencyInput, { formatValue } from '@osdiab/react-currency-input-field';
import { unMaskNumber } from 'utils/unmask';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Decimal from 'decimal.js';

const TransferData = ({ data, Funds, handleChange, TargetAccount, toggleAccordion, Balance, RealBalance }) => {

    const { t } = useTranslation();

    const [inputValid, setInputValid] = useState(false)
    const [NoteActive, setNoteActive] = useState(false)

    const decimalSeparator = process.env.REACT_APP_DECIMALSEPARATOR ?? '.'
    const groupSeparator = process.env.REACT_APP_GROUPSEPARATOR ?? ','
    const inputRef = useRef()

    const share_transfer = useMemo(() => data.FundSelected !== "cash", [data.FundSelected])
    const fund_selected = useMemo(() => share_transfer ? Funds?.find(fund => fund.fundId === data.FundSelected) : null, [Funds, data.FundSelected, share_transfer])
    const sharePrice = useMemo(() => fund_selected?.fund?.sharePrice || 1, [fund_selected])
    const max = useMemo(() => share_transfer ? Decimal(fund_selected?.shares || "0").toFixed(2) : Balance, [Balance, fund_selected?.shares, share_transfer])

    const handleAmountChange = (value, updateAmountUsd = true) => {
        const decimalSeparator = process.env.REACT_APP_DECIMALSEPARATOR ?? '.'

        let fixedValue = value || ""
        handleChange({ target: { id: 'value', value: fixedValue } })
        if (value) {
            let lastCharacter = value.slice(-1)
            if (lastCharacter === decimalSeparator) {
                fixedValue = value.slice(0, -1)
            }
        }
        const unMaskedValue = unMaskNumber({ value: fixedValue || "" })
        handleChange({ target: { id: 'amount', value: unMaskedValue } })

        if (share_transfer && updateAmountUsd) {
            handleUSDAmountChange(
                unMaskedValue === "" ?
                    ""
                    :
                    formatValue({ value: Decimal(unMaskedValue).times(sharePrice).toFixed(2), groupSeparator: '.', decimalSeparator: ',' }).replaceAll(".", "")
                ,
                false
            )
        }
    }

    useEffect(() => {
        setInputValid(inputRef?.current?.checkValidity())
    }, [inputRef, data.amount])

    const handleUSDAmountChange = (value, updateAmount = true) => {

        const decimalSeparator = process.env.REACT_APP_DECIMALSEPARATOR ?? '.'

        let fixedValue = value || ""
        handleChange({ target: { id: 'usd_value', value: fixedValue } })
        if (value) {
            let lastCharacter = value.slice(-1)
            if (lastCharacter === decimalSeparator) {
                fixedValue = value.slice(0, -1)
            }
        }
        const unMaskedValue = unMaskNumber({ value: fixedValue || "" })
        handleChange({ target: { id: 'usd_amount', value: unMaskedValue } })
        if (updateAmount) {
            handleAmountChange(
                unMaskedValue === "" ?
                    ""
                    :
                    formatValue({ value: Decimal(unMaskedValue).div(sharePrice).toFixed(2), groupSeparator: '.', decimalSeparator: ',' }).replaceAll(".", "")
                ,
                false)
        }
    }

    const amountDeductedFromOverdraft = Decimal(data?.amount || 0).minus(RealBalance || 0).toNumber()

    return (
        <Accordion.Item eventKey="0" disabled>
            <Accordion.Header onClick={() => { if (TargetAccount.fetched && !TargetAccount.fetching && TargetAccount.valid) toggleAccordion() }}>
                <Container>
                    <Row className="d-flex justify-content-center">
                        <Form.Label className="pt-0 label d-flex align-items-center" column sm="auto">
                            <span>
                                <span className="d-inline-block numberContainer">
                                    <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                        <span className="number">3</span>
                                    </div>
                                </span>
                                {t("Specify the amount you want to transfer")}
                            </span>
                        </Form.Label>
                    </Row>
                </Container>
            </Accordion.Header>
            <Accordion.Body>

                <InputGroup >
                    <InputGroup.Text>
                        {
                            share_transfer ?
                                t("Shares")
                                :
                                t("U$D")
                        }
                    </InputGroup.Text>
                    {/*Shown input formatted*/}
                    <CurrencyInput
                        allowNegativeValue={false}
                        value={data.value}
                        decimalsLimit={2}
                        decimalSeparator={decimalSeparator}
                        groupSeparator={groupSeparator}
                        onValueChange={(value) => handleAmountChange(value)}
                        className={`form-control ${inputValid ? 'hardcoded-valid' : 'hardcoded-invalid'} `}
                    />
                </InputGroup>

                <InputGroup>
                    <Form.Control
                        className='d-none'
                        ref={inputRef}
                        onWheel={event => event.currentTarget.blur()}
                        disabled={false}
                        value={data.amount}
                        step="0.01"
                        onChange={handleChange}
                        min="0.01"
                        max={max}
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
                                Decimal(max).lt(data.amount) ?
                                    share_transfer ?
                                        t("The amount must be less than or equal to the holdings of the selected fund") + " (" + max + " " + t("Shares") + ")"
                                        :
                                        t("The amount must be less than or equal to the available cash of the selected account") + " (U$D " + max + ")"
                                    :
                                    t("The amount must be greater than 0")
                        }
                    </Form.Control.Feedback>
                    <Form.Control.Feedback type="valid">
                        {
                            t("Looks good") + "! "
                        }
                        <span style={{ color: "orange" }}>
                            {
                                amountDeductedFromOverdraft > 0 &&
                                t("This movement will deduct {{amount}} from your overdraft balance", { amount: amountDeductedFromOverdraft })
                            }
                        </span>
                    </Form.Control.Feedback>
                </InputGroup>

                {
                    share_transfer &&
                    <>
                        <Form.Label>{t("Approximate amount in U$S")}</Form.Label>
                        <InputGroup className='mb-3'>
                            {/*Shown input formatted*/}
                            <CurrencyInput
                                allowNegativeValue={false}
                                value={data.usd_value}
                                decimalsLimit={2}
                                decimalSeparator={decimalSeparator}
                                groupSeparator={groupSeparator}
                                onValueChange={(value) => handleUSDAmountChange(value)}
                                className={`form-control ${inputValid ? 'hardcoded-valid' : 'hardcoded-invalid'} `}
                            />
                        </InputGroup>
                    </>
                }

                {
                    NoteActive ?
                        <div className="d-flex align-items-center mb-3">
                            <Form.Control
                                placeholder={t("Transfer note")} required
                                value={data.note} type="text" id="note" maxLength="250"
                                onChange={(e) => { handleChange(e); }}
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
                        <Button disabled={false}
                            variant="danger" type="submit" className="submitBtn">{t("Submit")}</Button>
                    </div>
                </Container>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default TransferData