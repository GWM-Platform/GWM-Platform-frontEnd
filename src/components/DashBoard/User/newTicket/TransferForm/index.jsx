import React, { useState, useContext, useEffect } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../operationsForm.css'

import { Container, Row, Col, Accordion, Form } from 'react-bootstrap'
import TargetAccountSelector from './TargetAccountSelector'
import TransferData from './TransferData'
import Loading from '../Loading';
import { DashBoardContext } from 'context/DashBoardContext';
import ActionConfirmationModal from './ActionConfirmationModal';
import { useHistory } from 'react-router-dom';
import ReactGA from "react-ga4";
import axios from 'axios';

const TransferForm = ({ balanceChanged }) => {

    useEffect(() => {
        ReactGA.event({
            category: "acceso_seccion_generacion_tickets",
            action: "acceso_seccion_generacion_ticket_transferencia",
            label: "Acceso a la seccion Generación De Transferencia",
        })
    }, [])

    const { token, contentReady, Accounts, AccountSelected, toLogin } = useContext(DashBoardContext);

    const history = useHistory()

    const [data, setData] = useState({
        amount: "",
        senderId: Accounts[0]?.id,
        alias: ""
    })

    const [ShowModal, setShowModal] = useState(false)
    const [validated, setValidated] = useState(true);
    const [CollapsedFields, setCollapsedFields] = useState(true);

    const [TargetAccount, setTargetAccount] = useState({
        fetched: false,
        fetching: false,
        valid: false,
        content: {}
    })

    const [Transfer, setTransfer] = useState({ fetching: false, valid: false, fetched: false })

    const transfer = () => {
        if (!Transfer.fetching) {
            setTransfer(prevState => ({ ...prevState, fetching: true }))
            axios.post(`/transfers`, {
                senderId: data.senderId,
                receiverId: TargetAccount?.content?.id,
                amount: data.amount
            }).then(function (response) {
                ReactGA.event({
                    category: "generacion_ticket",
                    action: "generacion_ticket_transferencia",
                    label: `Transferencia de $${data.amount}.`,
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
        setData(prevState => ({ ...prevState, ...aux }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity()) {
            if (token === null) {
                toLogin()
            } else if (TargetAccount?.content?.id && TargetAccount.fetched && TargetAccount.valid && !TargetAccount.fetching) {
                setShowModal(true)
            }
        }
        setValidated(true);
    }

    const toggleAccordion = () => {
        setCollapsedFields(!CollapsedFields)
    }
    const openAccordion = () => {
        setCollapsedFields(false)
    }
    const closeAccordion = () => {
        setCollapsedFields(true)
    }

    useEffect(() => {
        setData(prevState => ({ ...prevState, senderId: Accounts[0]?.id || 0 }))
    }, [Accounts])

    return (
        <div className="tabContent">
            <Form noValidate validated={validated} onSubmit={handleSubmit} className={`d-flex flex-column h-100`}>

                <Container className="h-100" >
                    <Row className="newTicket h-100 growAnimation">
                        {
                            !contentReady || Accounts.length <= 0 ?
                                <Loading />
                                :
                                <Col xs="12">
                                    <Accordion flush defaultActiveKey="0">
                                        <TargetAccountSelector
                                            validated={validated} data={data} setData={setData} TargetAccount={TargetAccount} closeAccordion={closeAccordion}
                                            setTargetAccount={setTargetAccount} handleChange={handleChange} openAccordion={openAccordion} />
                                    </Accordion>
                                    <Accordion flush activeKey={CollapsedFields || TargetAccount.fetching || !TargetAccount.fetched || !TargetAccount.valid ? "-1" : "0"}>
                                        <TransferData
                                            TargetAccount={TargetAccount} handleChange={handleChange} data={data} toggleAccordion={toggleAccordion} Balance={AccountSelected ? AccountSelected.balance : 0} />
                                    </Accordion>
                                </Col>
                        }
                    </Row>
                </Container>
                {
                    !!(contentReady && Accounts.length) >= 1 &&
                    <ActionConfirmationModal TargetAccount={TargetAccount} setShowModal={setShowModal} show={ShowModal} action={transfer} data={data} Balance={AccountSelected.balance} Transfer={Transfer} />


                }
            </Form >
        </div >

    )
}
export default TransferForm