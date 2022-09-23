import React, { useEffect, useRef, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup, Row, Button, Accordion, Container } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { unMaskNumber } from 'utils/unmask';
import CurrencyInput from '@osdiab/react-currency-input-field';


const SellData = ({ data, setData, Funds, handleChange, validated, handleSubmit, toggleAccordion, fetching }) => {

    const { t } = useTranslation();

    const [inputValid, setInputValid] = useState(false)
    const [inputValue, setInputValue] = useState(data.shares)

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
                { id: name ? name : 'shares', value: unMaskedValue }
        })
        setInputValue(value)
    }

    useEffect(() => {
        setInputValid(inputRef?.current?.checkValidity())
    }, [inputRef, data.shares])

    const sellAll = () => {
        setData(prevState => ({ ...prevState, shares: Funds[data.FundSelected]?.shares || 0 }));
        setInputValue(Funds[data.FundSelected]?.shares)
    }

    return (
        <Accordion.Item eventKey="0">
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
                                {t("Specify the amount of shares you want to sell")}
                            </span>
                        </Form.Label>
                    </Row>
                </Container>
            </Accordion.Header>
            <Accordion.Body>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <InputGroup>
                        {/*Shown input formatted*/}
                        <CurrencyInput
                            allowNegativeValue={false}
                            name="currencyInput"
                            value={inputValue}
                            decimalsLimit={2}
                            decimalSeparator={decimalSeparator}
                            groupSeparator={groupSeparator}
                            onValueChange={(value, name) => handleAmountChange(value)}
                            className={`form-control ${inputValid ? 'hardcoded-valid' : 'hardcoded-invalid'} `}
                        />
                        <Button variant="outline-secondary" onClick={() => sellAll()}
                            disabled={Funds[data.FundSelected]?.shares === data?.shares}>
                            {t("All")}
                        </Button>
                    </InputGroup>
                    <Form.Group className="mb-1" controlId="shares">
                        <InputGroup hasValidation>
                            <Form.Control
                            className='d-none'
                                ref={inputRef}
                                onWheel={event => event.currentTarget.blur()}
                                value={data.shares}
                                onChange={handleChange}
                                min="1"
                                step="0.00001"
                                max={data.FundSelected === -1 ?
                                    1
                                    :
                                    Funds[data.FundSelected].shares
                                }
                                type="number"
                                required
                                placeholder={t("Shares")}
                            />
                            
                            <Form.Control.Feedback type="invalid">
                                {
                                    data.FundSelected === -1 ?
                                        t("Please, select a fund to sell")
                                        :
                                        data.shares === "" ?
                                            t("Quantity of shares you want to sell")
                                            :
                                            data.shares < 1 ?
                                                t("At least you must sell one share")
                                                :
                                                t("There are only") + " " + Funds[data.FundSelected].shares + " " + t("available shares")
                                }
                            </Form.Control.Feedback>
                        </InputGroup>
                    </Form.Group>
                    <Button
                        disabled={fetching ||
                            (data.FundSelected === -1 ? true : data.shares > Funds[data.FundSelected].shares || data.shares <= 0)}
                        variant="danger" type="submit" className="submitBtn">{t("Submit")}</Button>
                </Form>
            </Accordion.Body>
        </Accordion.Item>
    )
}
export default SellData