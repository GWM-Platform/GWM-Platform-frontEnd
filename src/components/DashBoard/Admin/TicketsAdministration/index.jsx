import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Container, Row } from 'react-bootstrap'
import StateSelector from './StateSelector'
import Message from './Message'
import Tables from './Tables'
import './index.css'
import ClientSelector from './ClientSelector';
import { useTranslation } from 'react-i18next';
const TicketsAdministration = () => {

    const messageVariants = [
        {
            message: "loading",
            needSpinner: true
        }, {
            message: "couldn't fetch states, try again later",
            needSpinner: false
        }, {
            message: "there are no states, ask for the administrator to create them",
            needSpinner: false
        }, {
            message: "couldn't fetch sell/purchase tickets, try again later",
            needSpinner: false
        }, {
            message: "There are no sell/purchase tickets in the state selected",
            needSpinner: false
        }
        , {
            message: "couldn't fetch account movements tickets, try again later",
            needSpinner: false
        }, {
            message: "There are no account movements tickets in the state selected",
            needSpinner: false
        }
    ]

    const [TransactionStates, setTransactionStates] = useState({
        selected: "",
        fetching: true,
        fetched: false,
        values: []
    })

    useEffect(() => {
        const token = sessionStorage.getItem('access_token')

        const transactionsStates = async () => {
            var url = `${process.env.REACT_APP_APIURL}/states`;
            setTransactionStates({
                ...TransactionStates,
                ...{
                    selected: 0,
                    fetching: true,
                    fetched: false,
                    valid: false,
                    values: []
                }
            })
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
                setTransactionStates({
                    ...TransactionStates,
                    ...{
                        selected: data[0].id,
                        fetching: false,
                        fetched: true,
                        valid: true,
                        values: [...data, { id: 99, name: "Reverted transfers" }]
                    }
                })
            } else {
                setTransactionStates({
                    ...TransactionStates,
                    ...{
                        fetching: false,
                        fetched: true,
                        valid: false,
                    }
                })
                switch (response.status) {
                    case 500:
                        break;
                    default:
                        console.error(response.status)
                }
            }
        }
        transactionsStates()
        // eslint-disable-next-line
    }, [])

    const handleChange = (event) => {
        setTransactionStates({
            ...TransactionStates,
            ...{
                selected: event.target.value,
            }
        })
    }
    const { t } = useTranslation();

    const [client, setClient] = useState("")
    return (
        <Container className="h-100 TicketsAdministration">
            <Row className="pb-2">
                {
                    TransactionStates.fetching ?
                        <Message selected={0} messageVariants={messageVariants} />
                        :
                        !TransactionStates.valid ?
                            <Message selected={1} messageVariants={messageVariants} />
                            :
                            TransactionStates.values.length === 0 ?
                                <Message selected={2} messageVariants={messageVariants} />
                                :
                                <>
                                    <Col xs="12">
                                        <div className="header">
                                            <h1 className="title fw-normal">{t("Tickets administration")}</h1>
                                        </div>
                                    </Col>
                                    <Col md="6">
                                        <StateSelector handleChange={handleChange} TransactionStates={TransactionStates} />
                                    </Col>
                                    <Col md="6">
                                        <ClientSelector client={client} setClient={setClient} />
                                    </Col>
                                    <Tables state={TransactionStates.selected} messageVariants={messageVariants} client={client} />
                                </>
                }
            </Row>
        </Container>
    )
}
export default TicketsAdministration


