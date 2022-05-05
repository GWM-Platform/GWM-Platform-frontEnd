import React, { useState, useContext } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../operationsForm.css'

import { Container, Row, Col, Accordion, Form } from 'react-bootstrap'
import TargetAccountSelector from './TargetAccountSelector'
import TransferData from './TransferData'
import Loading from '../Loading';
import { DashBoardContext } from 'context/DashBoardContext';
import ActionConfirmationModal from './ActionConfirmationModal';

const TransferForm = () => {

    const { token, contentReady, Accounts } = useContext(DashBoardContext);

    const [data, setData] = useState({
        amount: "",
        FundSelected: -1,
        FundSelectedId: -1,
        TargetAccountID: ""
    })

    const [ShowModal, setShowModal] = useState(false)
    const [validated, setValidated] = useState(true);
    const [CollapsedFields, setCollapsedFields] = useState(true);

    const [TargetAccount, setTargetAccount] = useState({
        fetched: false,
        fetching: false,
        valid: false
    })

    const transfer = async () => {
        console.log("transfer")
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
                console.log("compra")
            } else {
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
                                            validated={validated} data={data} TargetAccount={TargetAccount} closeAccordion={closeAccordion}
                                            setTargetAccount={setTargetAccount} handleChange={handleChange} openAccordion={openAccordion} />
                                    </Accordion>
                                    <Accordion flush activeKey={CollapsedFields || TargetAccount.fetching || !TargetAccount.fetched || !TargetAccount.valid ? "-1" : "0"}>
                                        <TransferData
                                            TargetAccount={TargetAccount} handleChange={handleChange} data={data} toggleAccordion={toggleAccordion} Balance={Accounts[0] ? Accounts[0].balance : 0} />
                                    </Accordion>
                                </Col>
                        }
                    </Row>
                </Container>
                {
                    contentReady && Accounts.length >= 1 ?
                        <ActionConfirmationModal setShowModal={setShowModal} show={ShowModal} action={transfer} data={data} Balance={Accounts[0].balance} />
                        :
                        null
                }
            </Form >
        </div >

    )
}
export default TransferForm