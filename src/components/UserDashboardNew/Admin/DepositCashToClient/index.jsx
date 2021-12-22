import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';
import { useTranslation } from "react-i18next";

import './operationsForm.css'

const DepositCashToClient = () => {

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
            idSelected: ""
        }
    )
    const [validated, setValidated] = useState(true);

    const token = sessionStorage.getItem('access_token')
    let history = useHistory();
    const { t } = useTranslation();

    const deposit = async () => {
        var url = `${process.env.REACT_APP_APIURL}/accounts/${data.idSelected}/deposit`;
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ amount: parseFloat(data.amount) }),
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 201) {
            history.push(`/dashboardnew/operationResult`);
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
                console.log("compra")
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

    return (
        <Container className="h-100 AssetsAdministration">
            <Row className="h-100 d-flex justify-content-center">
                <Col className="newTicket h-100 growAnimation" xs="12">
                    <h1>Deposit Cash to an Account</h1>
                    <Form noValidate validated={validated} onSubmit={handleSubmit}>
                        <Form.Label>{t("Account Selector")}</Form.Label>
                        <Form.Select
                            id="idSelected" onChange={handleChange} value={data.idSelected}
                            className="mb-3" aria-label="Select Account id" required>
                            <option disabled value="">Open this select menu</option>
                            {Accounts.value.map((Account, key) => {
                                return <option key={key} value={Account.clientId}>Id: {Account.clientId} / Actual Balance: {Account.balance}</option>
                            })}
                        </Form.Select>
                            <Form.Label>{t("Amount")}</Form.Label>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>U$D</InputGroup.Text>
                            <Form.Control
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
                                        t("You should enter how much you want to deposit")
                                        :
                                        t("The amount must be greater than 0")
                                }
                            </Form.Control.Feedback>
                            <Form.Control.Feedback type="valid">
                                {
                                    t("Looks good!")
                                }
                            </Form.Control.Feedback>
                        </InputGroup>
                        <Button disabled={data.amount === "" || data.amount <= 0}
                            variant="danger" type="submit">{t("Submit")}</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default DepositCashToClient