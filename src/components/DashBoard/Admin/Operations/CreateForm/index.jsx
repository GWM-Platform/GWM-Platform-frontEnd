import React, { useEffect, useMemo, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Spinner } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'
import { maskNumber, unMaskNumber } from 'utils/unmask';
import CurrencyInput from '@osdiab/react-currency-input-field';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import Select from 'react-select';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFunds, selectAllFunds } from 'Slices/DashboardUtilities/fundsSlice';
import Decimal from 'decimal.js';
import axios from 'axios';

const CreateForm = ({ eventOptions }) => {
    const { t } = useTranslation();
    const history = useHistory()
    const dispatch = useDispatch()

    const [fetchingCreateRequest, setFetchingCreateRequest] = useState(false)
    const [error, setError] = useState(false)
    const decimalSeparator = process.env.REACT_APP_DECIMALSEPARATOR ?? '.'
    const groupSeparator = process.env.REACT_APP_GROUPSEPARATOR ?? ','

    const [data, setData] = useState(
        {
            type: null,
            fund: null,
            customSharePrice: "",
        }
    )
    const unMaskedCustomSharePrice = useMemo(() => {
        const value = unMaskNumber({ value: data.customSharePrice ? data.customSharePrice + "" : "" })
        if (value === "") return ""
        let lastCharacter = value.slice(-1)
        if (lastCharacter === ".") {
            return value.slice(0, -1)
        }
        return value
    }, [data.customSharePrice])

    const handleChange = (e) => {
        setData((prevState) => ({ ...prevState, [e.target.id]: e.target.value }))
    }

    const createOperation = () => {
        setFetchingCreateRequest(true)
        setError(false)
        axios.post(`/operations`, {
            operationType: data.type.value,
            operationMetadata: {
                fundId: data.fund.value,
                customSharePrice: Decimal(unMaskedCustomSharePrice || 0).toNumber()
            }
        }).then(function (response) {
            history.push("/DashBoard/operations")
            setFetchingCreateRequest(false)
        }).catch((err) => {
            setError(true)
            setFetchingCreateRequest(false)
        });
    }

    const [validated, setValidated] = useState(false)
    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() && !fetchingCreateRequest && data?.type?.value && data?.type?.value) {
            createOperation()
        }
        setValidated(true);
    }

    const funds = useSelector(selectAllFunds)
    useEffect(() => {
        dispatch(fetchFunds())
    }, [dispatch])

    const fundOptions = useMemo(() => funds
        .map(fund => ({ label: `${fund.name}${
            fund?.disabled ?  ` - (${t("Disabled")})` : fund.freeShares === fund.shares ? ` - (${t("Sin tenencia de clientes")})` : ""
            }`, value: fund.id, isDisabled: fund?.disabled || fund.freeShares === fund.shares }))
        .sort((a, b) => a.isDisabled - b.isDisabled), [funds, t])

        useEffect(() => {
        if (data?.fund?.value) {
            const fundSelected = funds.find(fund => fund.id === data.fund.value)
            if (fundSelected) {
                handleChange({ target: { id: "customSharePrice", value: maskNumber({ value: fundSelected.sharePrice }) } })
            }
        }
    }, [data.fund, funds])

    return (
        <div className="editForm">
            <div className="header" style={{ borderBottomColor: "#b3b3b3" }}>
                <h1 className="title">
                    {t("Create operation")}
                </h1>
                <FontAwesomeIcon className="button icon" onClick={() => history.push("/DashBoard/operations")} icon={faChevronCircleLeft} />
            </div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Label>{t("Operation type")}</Form.Label>
                <Select
                    menuPosition="fixed"
                    className="basic-single mb-3"
                    classNamePrefix="select"
                    isSearchable
                    alwaysDisplayPlaceholder
                    noOptionsMessage={() => t("No results")}
                    placeholder=""
                    name="Type"
                    onChange={(selectedOption) => handleChange({ target: { id: "type", value: selectedOption } })}
                    options={eventOptions}
                    value={data.type}
                    classNames={{
                        input: () => "react-select-input",
                    }}
                    isClearable
                />

                {
                    data?.type?.value === "LIQUIDATE_FUND" &&
                    <>
                        <Form.Label>{t("Fund")}</Form.Label>
                        <Select
                            menuPosition="fixed"
                            className="basic-single mb-3"
                            classNamePrefix="select"
                            isSearchable
                            alwaysDisplayPlaceholder
                            noOptionsMessage={() => t("No results")}
                            placeholder=""
                            name="fund"
                            onChange={(selectedOption) => handleChange({ target: { id: "fund", value: selectedOption } })}
                            options={fundOptions}
                            value={data.fund}
                            classNames={{
                                input: () => "react-select-input",
                            }}
                            isClearable
                        />
                        <Form.Label>{t("Share price")}</Form.Label>
                        <CurrencyInput
                            allowNegativeValue={false}
                            name="customSharePrice"
                            value={data.customSharePrice}
                            decimalsLimit={2}
                            decimalSeparator={decimalSeparator}
                            groupSeparator={groupSeparator}
                            onValueChange={(value, name) => handleChange({ target: { id: name, value } })}
                            placeholder={t("Value")}
                            className={`form-control ${validated ? Decimal(unMaskedCustomSharePrice || 0).gt(0) ? 'hardcoded-valid' : 'hardcoded-invalid' : ""} mb-3`}
                        />
                        <Form.Group controlId='customSharePrice'>
                            <Form.Control className='d-none' required onChange={handleChange} value={unMaskedCustomSharePrice} min="0.01" step="0.01" type="number" placeholder={t("Rate")} />
                            <Form.Control.Feedback type="invalid">
                                {t("The value must be greater than 0")}
                            </Form.Control.Feedback>
                        </Form.Group>
                    </>
                }
                {
                    error &&
                    <div className="alert alert-danger" role="alert">
                        {t("An error occurred, please try again")}
                    </div>
                }

                <div className="d-flex justify-content-end">
                    <Button variant="danger" type="submit" className="mb-3" disabled={fetchingCreateRequest}>
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