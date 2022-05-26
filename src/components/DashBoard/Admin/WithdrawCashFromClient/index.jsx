import React, { useState, useEffect, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext'
import moment from 'moment';

const WithdrawCashFromClient = () => {
    const { toLogin, TransactionStates } = useContext(DashBoardContext)

    const [Accounts, setAccounts] = useState(
        {
            fetching: true,
            fetched: false,
            value: []
        }
    )

    const [Clients, setClients] = useState(
        {
            fetching: true,
            fetched: false,
            value: []
        }
    )
    const [data, setData] = useState(
        {
            amount: "",
            idSelected: "",
            date: moment().format(moment.HTML5_FMT.DATETIME_LOCAL),
            stateId: ""
        }
    )

    const [validated, setValidated] = useState(true);

    const token = sessionStorage.getItem('access_token')
    let history = useHistory();
    const { t } = useTranslation();

    const withdraw = async () => {
        var url = `${process.env.REACT_APP_APIURL}/accounts/${data.idSelected}/adminWithdraw`;
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

        const getClients = async () => {
            const token = sessionStorage.getItem('access_token')
            var url = `${process.env.REACT_APP_APIURL}/Clients/?` + new URLSearchParams({
                all: true,
            });

            setClients(
                {
                    ...Clients,
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
                setClients(
                    {
                        ...Clients,
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
                        setClients(
                            {
                                ...Clients,
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
        getClients()
        // eslint-disable-next-line
    }, [])

    const getAccountPropertyById = (searchedId, property) => {
        let index = Accounts.value.findIndex((account) => account.id.toString() === searchedId.toString())
        return index === -1 ? false : Accounts.value[index][property]
    }
    return (
        <Container className="h-100 AssetsAdministration">
            <Row className="h-100 d-flex justify-content-center">
                <Col className="newTicket h-100 growAnimation" sm="12" md="9">
                    <h1>{t("Withdraw cash from an Account")}</h1>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Label>{t("Select the account for which you want to generate a withdrawal ticket")}</Form.Label>
                        <Form.Select
                            id="idSelected" onChange={handleChange} value={data.idSelected}
                            className="mb-3" aria-label="Select Account id" required>
                            <option disabled value="">{t("Open this select menu")}</option>
                            {Accounts.value.map((Account, key) => {
                                return (
                                    <option disabled={Account.balance === 0} key={key + "-account"} value={Account.id}>
                                        {t("Account Alias")}:{Account.alias}&nbsp;/ {t("Account Id")}: {Account.id} / {t("Actual Balance")}: {Account.balance}
                                    </option>
                                )
                            })}
                        </Form.Select>

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
                            <Form.Control
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

                        <Form.Label>{t("Operation state")}</Form.Label>
                        <Form.Select id="stateId" onChange={handleChange} required className="mb-3" value={data.stateId} aria-label="Select State Id">
                            <option disabled value="">{t("Open this select menu")}</option>
                            {TransactionStates.values.map((state, key) =>
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

export default WithdrawCashFromClient