import React, { useEffect, useRef, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, FloatingLabel, Spinner } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'
import CurrencyInput from '@osdiab/react-currency-input-field';
import { unMaskNumber } from 'utils/unmask';

const CreateAssets = ({ data, CreateRequest, handleChange, Action, setAction, validated, handleSubmit, AssetTypes }) => {
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
                { id: name ? name : 'value', value: unMaskedValue }
        })
    }
    useEffect(() => {
        setInputValid(inputRef?.current?.checkValidity())
    }, [inputRef, data.value])

    return (
        <div className="editForm">
            <div className="header">
                <h1 className="title fw-normal">
                    {t("Asset Create form")}
                </h1>
                <FontAwesomeIcon className="button icon" onClick={() => { setAction({ ...Action, ...{ action: -1, Asset: -1 } }) }} icon={faChevronCircleLeft} />
            </div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>

                <FloatingLabel
                    label={t("Name")}
                    className="mb-3"
                >
                    <Form.Control required onChange={handleChange} id="name" value={data.name} type="text" placeholder={t("Name")} />
                    <Form.Control.Feedback type="invalid">
                        {t("You must provide a name for the Asset")}
                    </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel className="mb-3" label={t("Asset Types")}>
                    <Form.Select required id="typeId" onChange={handleChange} value={data.typeId}>
                        {AssetTypes.map((Asset, key) => {
                            return <option key={key} value={Asset.id}>{Asset.name}</option>
                        })}
                    </Form.Select>
                </FloatingLabel>

                <FloatingLabel
                    label={t("Symbol")}
                    className="mb-3"
                >
                    <Form.Control required onChange={handleChange} id="symbol" value={data.symbol} type="text" placeholder={t("Symbol")} />
                </FloatingLabel>

                {/*Shown input formatted*/}
                <FloatingLabel
                    label={t("Value")}
                >
                    <CurrencyInput
                        allowNegativeValue={false}
                        name="currencyInput"
                        defaultValue={data.value}
                        decimalsLimit={2}
                        decimalSeparator={decimalSeparator}
                        groupSeparator={groupSeparator}
                        onValueChange={(value, name) => handleAmountChange(value)}
                        placeholder={t("Value")}
                        className={`form-control ${validated ? inputValid ? 'hardcoded-valid' : 'hardcoded-invalid' : ""} `}
                    />
                </FloatingLabel>
                <FloatingLabel
                    label={t("Value")}
                    className="mb-3 hideFormControl"
                >
                    <Form.Control ref={inputRef} required onChange={handleChange} id="value" value={data.value} min="0.01" step="0.01" type="number" placeholder={t("Value")} />
                    <Form.Control.Feedback type="invalid">
                        {t("The value must be greater than 0")}
                    </Form.Control.Feedback>
                </FloatingLabel>
                

                <div className="d-flex justify-content-end">
                    <Button variant="danger" type="submit" className="mb-3" disabled={CreateRequest.fetching}>
                        <Spinner animation="border" variant="light"
                            className={`${CreateRequest.fetching ? "d-inline-block" : "d-none"} littleSpinner ms-1`} />
                        {t("Submit")}
                    </Button>
                </div>
            </Form>
        </div>

    )
}

export default CreateAssets