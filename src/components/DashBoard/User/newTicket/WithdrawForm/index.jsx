import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../operationsForm.css'

import { Container, Row, Col } from 'react-bootstrap'
import { DashBoardContext } from 'context/DashBoardContext';
import WithdrawData from './WithdrawData'
import Loading from '../Loading';
import ActionConfirmationModal from './ActionConfirmationModal';
import ReactGA from "react-ga4";
import { useEffect } from 'react';
import axios from 'axios';

const WithdrawForm = ({ balanceChanged }) => {

    useEffect(() => {
        ReactGA.event({
            category: "acceso_seccion_generacion_tickets",
            action: "acceso_seccion_generacion_ticket_retiro",
            label: "Acceso a la seccion Generación De Retiro",
        })
    }, [])

    const [data, setData] = useState({ amount: "" })
    const [ShowModal, setShowModal] = useState(false)
    const [validated, setValidated] = useState(true);
    const [fetching, setFetching] = useState(false)

    const { token, toLogin, Accounts, contentReady } = useContext(DashBoardContext);

    let history = useHistory();

    const withdraw = () => {
        if (!fetching) {
            setFetching(true)
            axios.post(`/accounts/${Accounts[0].id}/withdraw`, {
                amount: parseFloat(data.amount)
            }).then(function (response) {
                ReactGA.event({
                    category: "generacion_ticket",
                    action: "generacion_ticket_retiro",
                    label: `Retiro de $${data.amount}.`,
                    value: parseFloat(data.amount),
                })
                balanceChanged()
                history.push(`/DashBoard/operationResult`);
            }).catch((err) => {
                console.log(err)
                if (err?.message !== "canceled") {
                    switch (err?.response?.status) {
                        case 401:
                            toLogin();
                            break;
                        default:
                            history.push(`/DashBoard/operationResult?result=failed`);
                            break
                    }
                }
            });
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
        if (form.checkValidity() === true && !fetching) {
            if (token === null) {
                console.log("compra")
            } else {
                setShowModal(true)
            }
        }
        setValidated(true);
    }

    return (
        <div className={`d-flex flex-column h-100`}>
            <Container className="h-100">
                <Row className="newTicket h-100 growAnimation">
                    {
                        !contentReady ?
                            <Loading />
                            :
                            <Col xs="12">
                                <WithdrawData
                                    handleSubmit={handleSubmit} validated={validated}
                                    handleChange={handleChange} data={data} account={Accounts[0]} fetching={fetching} />
                            </Col>
                    }

                </Row>
            </Container>
            {
                contentReady ?
                    <ActionConfirmationModal fetching={fetching} setShowModal={setShowModal} show={ShowModal} action={withdraw} data={data} Balance={Accounts[0].balance} />
                    :
                    null
            }
        </div>
    )
}
export default WithdrawForm