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

const TransferForm = ({ balanceChanged }) => {

    useEffect(() => {
        ReactGA.event({
            category: "Acceso a secciones para generar tickets",
            action: "Transferencias",
            label: "Transferencias",
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

    const transfer = async () => {
        setTransfer(prevState => ({ ...prevState, fetching: true }))
        var url = `${process.env.REACT_APP_APIURL}/transfers`
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(
                {
                    senderId: data.senderId,
                    receiverId: TargetAccount?.content?.id,
                    amount: data.amount
                }
            ),
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 201) {
            balanceChanged()
            history.push(`/DashBoard/operationResult`);
        } else {
            switch (response.status) {
                case 500:
                    history.push(`/DashBoard/operationResult?result=failed`);
                    break
                default:
                    history.push(`/DashBoard/operationResult?result=failed`);
                    break
            }
            setTransfer(prevState => ({ ...prevState, fetching: false, fetched: true, valid: false }))
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