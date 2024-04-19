import React, { useState, useEffect, useContext, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext'
import moment from 'moment';
import { unMaskNumber } from 'utils/unmask';
import CurrencyInput from '@osdiab/react-currency-input-field';
import BaseSelect from "react-select";
import FixRequiredSelect from 'components/DashBoard/GeneralUse/Forms/FixRequiredSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

const WithdrawCashFromClient = () => {
    const { toLogin } = useContext(DashBoardContext)

    const [Accounts, setAccounts] = useState(
        {
            fetching: true,
            fetched: false,
            value: []
        }
    )

    const [data, setData] = useState(
        {
            idSelected: "",
            date: moment().format(moment.HTML5_FMT.DATETIME_LOCAL),
            account: "",
            note: "",
            affectsProfit: false
        }
    )

    const [validated, setValidated] = useState(true);

    const [NoteActive, setNoteActive] = useState(false)

    const token = sessionStorage.getItem('access_token')
    let history = useHistory();
    const { t } = useTranslation();

    const withdraw = async () => {
        var url = `${process.env.REACT_APP_APIURL}/accounts/${data?.account?.value}/adminWithdraw`;
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                amount: parseFloat(data.amount),
                date: moment(data.date).format(),
                note: NoteActive ? data.note : undefined,
                affectsProfit: data.affectsProfit
            }),
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 201) {
            history.push(`/DashBoard/operationResult`);
        } else {
            switch (response.status) {
                case 500:
                    console.error(response.status)
                    break;
                default:
                    console.error(response.status)
                    break;
            }
        }
    }

    const handleChange = (event) => {
        let aux = data;
        aux[event.target.id] = event.target.type === "checkbox" ? event.target.checked : event.target.value;
        setData({ ...data, ...aux });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            if (token === null) {
                toLogin()
            } else {
                withdraw()
            }
        }
        setValidated(true);
    }

    useEffect(() => {
        const getAccounts = async () => {
            const token = sessionStorage.getItem('access_token')
            var url = `${process.env.REACT_APP_APIURL}/accounts`;
            setAccounts(
                {
                    ...Accounts,
                    ...{
                        fetching: true,
                    }
                }
            )
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                const data = await response.json()
                setAccounts(
                    {
                        ...Accounts,
                        ...{
                            fetching: false,
                            fetched: true,
                            value: data
                        }
                    }
                )
            } else {
                switch (response.status) {
                    default:
                        console.log(response.status)
                        setAccounts(
                            {
                                ...Accounts,
                                ...{
                                    fetching: false,
                                    fetched: false,
                                }
                            }
                        )
                }
            }
        }

        getAccounts()
        // eslint-disable-next-line
    }, [])

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

    const getAccountPropertyById = (searchedId, property) => {
        let index = Accounts.value.findIndex((account) => account.id.toString() === searchedId.toString())
        return index === -1 ? false : Accounts.value[index][property]
    }

    const Select = props => (
        <FixRequiredSelect
            {...props}
            SelectComponent={BaseSelect}
            options={props.options}
        />
    );

    const accountSelectedValid = () => data?.account?.value

    return (
        <Container className="h-100 AssetsAdministration">
            <Row className="h-100 d-flex justify-content-center">
                <Col className="newTicket h-100 growAnimation section" sm="12">
                    <div className="header">
                        <h1 className="title">{t("Withdraw cash from an account")}</h1>
                    </div>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Select the account for which you want to generate a withdrawal ticket")}</Form.Label>
                            <Select
                                classNamePrefix="react-select"
                                valid={validated ? accountSelectedValid() : false}
                                invalid={validated ? !accountSelectedValid() : false}

                                className="mb-3" required value={data.account} placeholder={false} noOptionsMessage={() => t('No accounts found')}
                                onChange={(val) => {
                                    setData(prevState => ({ ...prevState, account: val }));
                                }}
                                options={Accounts.value.map((Account) => (
                                    {
                                        label: `${t("Account Alias")}: ${Account.alias} / ${t("Account Id")}: ${Account.id} / ${t("Actual Balance")}: ${Account.balance}`,
                                        value: Account.id
                                    }
                                ))}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>{t("Date that will appear as when the operation was performed")}</Form.Label>
                            <Form.Control
                                onWheel={event => event.currentTarget.blur()}
                                value={data.date}
                                onChange={handleChange}
                                id="date"
                                type="datetime-local"
                                required
                                placeholder={t("Date")}
                            />
                            <Form.Control.Feedback type="invalid">
                                {
                                    data.date === "" ?
                                        t("You must enter the date that will appear as when the operation was performed")
                                        :
                                        t("Please, enter the date in a valid format")
                                }
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="valid">
                                {
                                    t("Looks good") + "!"
                                }
                            </Form.Control.Feedback>
                        </Form.Group>

                        <Form.Label>{t("Amount")}</Form.Label>
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
                                className='d-none'
                                ref={inputRef}
                                onWheel={event => event.currentTarget.blur()}
                                value={data.amount}
                                step=".01"
                                onChange={handleChange}
                                min="0.01"
                                max={data.idSelected === "" ? null : getAccountPropertyById(data.idSelected, "balance")}
                                id="amount"
                                type="number"
                                required
                                placeholder={t("Amount")}
                            />
                            <Form.Control.Feedback type="invalid">
                                {

                                    data.amount === "" ?
                                        t("You must enter how much you want to withdraw from the selected account")
                                        :
                                        data.idSelected === "" ?
                                            t("The amount must be greater than 0")
                                            :
                                            getAccountPropertyById(data.idSelected, "balance") < data.amount ?
                                                t("The amount must be lower or equal to the selected account's available cash") + " ($" + getAccountPropertyById(data.idSelected, "balance") + ")"
                                                :
                                                t("The amount must be greater than 0")
                                }
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="valid">
                                {
                                    t("Looks good") + "!"
                                }
                            </Form.Control.Feedback>
                        </InputGroup>
                        <Form.Group className="mb-3" controlId="affectsProfit">
                            <Form.Check checked={data.affectsProfit} onChange={handleChange} type="checkbox" label={`${t("Include this movement in performance calculations")} (${t("Penalty")}).`} />
                        </Form.Group>
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
                        <div className='d-flex pb-3'>
                            <Button className="ms-auto" disabled={data.amount === "" || data.amount <= 0} variant="danger" type="submit">
                                {t("Submit")}
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default WithdrawCashFromClient