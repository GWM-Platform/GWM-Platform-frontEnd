import React, { useEffect, useRef, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup, Row, Button, Accordion, Container } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import Decimal from 'decimal.js';
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import CurrencyInput from '@osdiab/react-currency-input-field';
import { unMaskNumber } from 'utils/unmask';


const BuyData = ({ data, Funds, handleChange, validated, handleSubmit, toggleAccordion, Balance, fetching }) => {
    Decimal.set({ precision: 100 })

    const { t } = useTranslation();
    const multiplier = 10000


    const amountDecimal = new Decimal(data.amount.length === 0 ? 0 : data.amount)

    const sharePriceDecimal = new Decimal(Funds[data.FundSelected]?.sharePrice || 1)

    const sharesToBuy = new Decimal(amountDecimal).div(sharePriceDecimal).toFixed(5)

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
                                {t("Specify the amount you want to invest")}
                            </span>
                        </Form.Label>
                    </Row>
                </Container>
            </Accordion.Header>
            <Accordion.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <InputGroup className="mb-3">
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
                        {/*Hidden input for validation*/}
                        <Form.Control
                            ref={inputRef}
                            className=" d-none"
                            onWheel={event => event.currentTarget.blur()}
                            disabled={data.FundSelected === -1}
                            value={data.amount}
                            step=".01"
                            onChange={handleChange}
                            min={Funds[data.FundSelected] ? Funds[data.FundSelected].sharePrice || 1 : 1}
                            max={data.FundSelected === -1 ?
                                1
                                :
                                Math.min(Funds[data.FundSelected].freeShares * Funds[data.FundSelected].sharePrice, Balance)}
                            id="amount"
                            type="number"
                            required
                            placeholder={t("Amount")}
                        />
                        <Form.Control.Feedback type="invalid">
                            {
                                data.FundSelected === -1 ?
                                    t("Please, select a fund to buy")
                                    :
                                    data.amount === "" ?
                                        t("You must enter how much you want to invest")
                                        :
                                        data.amount > Balance ?
                                            <>
                                                {t("You only have")} <FormattedNumber prefix="U$D " value={Balance} fixedDecimals={2} /> {t("available in your account.")}
                                            </>
                                            :
                                            data.amount < (Funds[data.FundSelected] ? Funds[data.FundSelected].sharePrice || 1 : 1) ?
                                                <>{t("At least you must buy one share")} (<FormattedNumber prefix="U$D " value={(Funds[data.FundSelected] ? Funds[data.FundSelected].sharePrice || 1 : 1)} fixedDecimals={2} />)</>
                                                :

                                                (data.amount * multiplier) % (0.01 * multiplier) === 0 ?
                                                    <>
                                                        {t("You are trying to invest")} <FormattedNumber prefix="U$D " value={data.amount} fixedDecimals={2} /> {t(", with you could buy")} <FormattedNumber value={sharesToBuy.toString()} fixedDecimals={2} /> {t("shares, but there are only")} <FormattedNumber value={Funds[data.FundSelected].freeShares} fixedDecimals={2} />{t(" free.")}
                                                    </>
                                                    :
                                                    t("The min step is 0.01")
                            }
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type="valid">
                            {
                                data.FundSelected === -1 ?
                                    t("Please, select a fund to buy")
                                    :
                                    <>
                                        {t("You are buying")}&nbsp;<FormattedNumber prefix="" value={sharesToBuy.toString()} fixedDecimals={2} />&nbsp;{(sharesToBuy.toString() === '1.00' ? t("share") : t("shares"))}

                                    </>
                            }
                        </Form.Control.Feedback>
                    </InputGroup>
                    <div className='d-flex justify-content-end'>
                        <Button disabled={fetching ||
                            (data.FundSelected === -1 ? true : data.amount > Math.min(Funds[data.FundSelected].freeShares * Funds[data.FundSelected].sharePrice, Balance) && data.amount > 0)}
                            variant="danger" type="submit" className="submitBtn">{t("Submit")}</Button>
                    </div>
                </Form>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default BuyData