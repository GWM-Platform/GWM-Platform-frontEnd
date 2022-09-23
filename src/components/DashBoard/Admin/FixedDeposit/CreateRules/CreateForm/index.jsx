import React, { useEffect, useRef, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, FloatingLabel, Spinner } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'
import { unMaskNumber } from 'utils/unmask';
import CurrencyInput from '@osdiab/react-currency-input-field';

const CreateForm = ({ data, fetchingCreateRequest, handleChange, ActionDispatch, validated, handleSubmit, AssetTypes }) => {
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
                { id: name ? name : 'rate', value: unMaskedValue }
        })
    }
    useEffect(() => {
        setInputValid(inputRef?.current?.checkValidity())
    }, [inputRef, data.rate])

    return (
        <div className="editForm">
            <div className="header">
                <h1 className="title">
                    {t("Rule creation")}
                </h1>
                <FontAwesomeIcon className="button icon" onClick={() => ActionDispatch({ type: "view" })} icon={faChevronCircleLeft} />
            </div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <FloatingLabel
                    label={t("Days")}
                    className="mb-3"
                >
                    <Form.Control required onChange={handleChange} min="1" step="1" id="days" value={data.days} type="number" placeholder={t("Days")} />
                    <Form.Control.Feedback type="invalid">
                        {t("The value must be greater than 0")}
                    </Form.Control.Feedback>
                </FloatingLabel>


                {/*Shown input formatted*/}
                <FloatingLabel
                    label={t("Rate")}
                >
                    <CurrencyInput
                        allowNegativeValue={false}
                        name="currencyInput"
                        defaultValue={data.rate}
                        decimalsLimit={2}
                        decimalSeparator={decimalSeparator}
                        groupSeparator={groupSeparator}
                        onValueChange={(value) => handleAmountChange(value)}
                        placeholder={t("Rate")}
                        className={`form-control ${validated ? inputValid ? 'hardcoded-valid' : 'hardcoded-invalid' : ""} `}
                    />
                </FloatingLabel>
        
                <FloatingLabel
                    label={t("Rate")}
                    className="mb-3 hideFormControl"
                >
                    <Form.Control ref={inputRef}required onChange={handleChange} id="rate" value={data.rate} min="0.01" step="0.01" type="number" placeholder={t("Rate")} />
                    <Form.Control.Feedback type="invalid">
                        {t("The rate must be greater than 0")}
                    </Form.Control.Feedback>
                </FloatingLabel>

                <div className="d-flex justify-content-end">
                    <Button variant="danger" type="submit" className="mb-3">
                        <Spinner animation="border" variant="light"
                            className={`${fetchingCreateRequest ? "d-inline-block" : "d-none"} littleSpinner me-2`} />
                        {t("Submit")}
                    </Button>
                </div>
            </Form>
        </div>

    )
}

export default CreateForm