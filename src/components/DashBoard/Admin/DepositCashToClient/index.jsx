import React, { useState, useEffect, useContext, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext'
import moment from 'moment';
import CurrencyInput from '@osdiab/react-currency-input-field';
import { unMaskNumber } from 'utils/unmask';
import BaseSelect from "react-select";
import FixRequiredSelect from 'components/DashBoard/GeneralUse/Forms/FixRequiredSelect';

const DepositCashToClient = () => {
    const { toLogin, TransactionStates } = useContext(DashBoardContext)

    const [Accounts, setAccounts] = useState(
        {
            fetching: true,
            fetched: false,
            value: []
        }
    )

    const [data, setData] = useState(
        {
            amount: "",
            date: moment().format(moment.HTML5_FMT.DATETIME_LOCAL),
            stateId: "",
            account: ""
        }
    )
    const [validated, setValidated] = useState(true);

    const token = sessionStorage.getItem('access_token')
    let history = useHistory();
    const { t } = useTranslation();

    const deposit = async () => {
        var url = `${process.env.REACT_APP_APIURL}/accounts/${data?.account?.value}/deposit`;
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                amount: parseFloat(data.amount),
                date: moment(data.date).format(),
                stateId: parseInt(data.stateId)
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
        aux[event.target.id] = event.target.value;

        setData({ ...data, ...aux });
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        console.log()
        if (form.checkValidity()) {
            if (token === null) {
                toLogin()
            } else {
                deposit()
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

    const PendingSettlementsId = 4
    const DeniedStateId = 3

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
                        <h1 className="title">{t("Deposit cash to an account")}</h1>
                    </div>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>{t("Select the account to which cash will be deposited")}</Form.Label>
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
                            <Form.Control
                                ref={inputRef}
                                className="d-none"
                                onWheel={event => event.currentTarget.blur()}
                                value={data.amount}
                                step=".01"
                                onChange={handleChange}
                                min="0.01"
                                id="amount"
                                type="number"
                                required
                                placeholder={t("Amount")}
                            />
                            <Form.Control.Feedback type="invalid">
                                {

                                    data.amount === "" ?
                                        t("You must enter how much you want to deposit")
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

                        <Form.Label>{t("Transaction status")}</Form.Label>
                        <Form.Select id="stateId" onChange={handleChange} required className="mb-3" value={data.stateId} aria-label="Select State Id">
                            <option disabled value="">{t("Open this select menu")}</option>
                            {TransactionStates.values.map((state, key) =>
                                !!(state.id !== PendingSettlementsId && state.id !== DeniedStateId) &&
                                <option key={key + "-state"} value={state.id}>{state.id + " - " + state.name}</option>
                            )}
                        </Form.Select>

                        <Button disabled={data.amount === "" || data.amount <= 0}
                            variant="danger" type="submit">{t("Submit")}</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default DepositCashToClient