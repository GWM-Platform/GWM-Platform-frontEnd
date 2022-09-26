import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Accordion, Col, Container, Form, Row } from 'react-bootstrap'
import TransactionFundTable from './TransactionFundTable';
import axios from 'axios';
import { useMemo } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';
const TransactionsByFund = ({ AccountId, ClientId }) => {
    const { t } = useTranslation();

    const { toLogin } = useContext(DashBoardContext)

    const [FundSelected, setFundSelected] = useState("")

    const handleChange = (event) => {
        setFundSelected(event.target.value)
    }

    const initialState = useMemo(() => ({ fetching: true, fetched: false, valid: false, content: [] }), [])
    const [Funds, setFunds] = useState(initialState)

    useEffect(() => {
        const getFunds = (signal) => {
            axios.get(`/funds`, { signal: signal }).then(function (response) {
                setFunds((prevState) => (
                    {
                        ...prevState,
                        fetching: false,
                        fetched: true,
                        valid: true,
                        content: response.data,
                    }))
            }).catch((err) => {
                if (err.message !== "canceled") {
                    if (err.response.status === "401") {
                        toLogin()
                    } else {
                        setFunds((prevState) => (
                            {
                                ...prevState,
                                fetching: false,
                                fetched: true,
                                valid: false,
                                content: [],
                            }))
                    }


                }
            });
        }
        getFunds();

        return () => {
            setFunds((prevState) => (
                {
                    ...prevState,
                    initialState
                }))
        }
        //eslint-disable-next-line
    }, [])


    return (
        <Accordion.Item eventKey="4">
            <Accordion.Header>{t("Transactions by fund")}</Accordion.Header>
            <Accordion.Body className='px-0'>
                <Container fluid>
                    <Row>
                        <Col>
                            <Form.Group className="mb-3">
                                <Form.Label >{t("Fund")}</Form.Label>
                                <Form.Select  disabled={!Funds.valid} onChange={handleChange} value={FundSelected} aria-label="Default select example">
                                    <option value="" disabled>{t("Open this select menu")}</option>
                                    {!!(Funds.valid) && Funds.content.map(
                                        (fund, key) => <option key={`funds-selector-option-${fund.id}`} value={fund.id}>{fund.name}</option>
                                    )}
                                </Form.Select>
                            </Form.Group>

                        </Col>
                    </Row>
                </Container>
                {
                    FundSelected === "" ? null :
                        <TransactionFundTable AccountId={AccountId} ClientId={ClientId} FundId={FundSelected} />
                }
            </Accordion.Body>
        </Accordion.Item>
    )
}

export default TransactionsByFund