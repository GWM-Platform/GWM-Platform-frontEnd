import React, { useState, useContext } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../operationsForm.css'

import { Container, Row, Col, Accordion, Form } from 'react-bootstrap'
import TargetAccountSelector from './TargetAccountSelector'
import TransferData from './TransferData'
import Loading from '../Loading';
import { DashBoardContext } from 'context/DashBoardContext';
import ActionConfirmationModal from './ActionConfirmationModal';
import { useHistory } from 'react-router-dom';

const TransferForm = ({ balanceChanged }) => {

    const { token, contentReady, Accounts, ClientSelected,AccountSelected } = useContext(DashBoardContext);
    const senderId = ClientSelected?.id

    const history = useHistory()

    const [data, setData] = useState({
        amount: "",
        senderId: senderId,
        receiverId: "",
        alias:""
    })

    const [ShowModal, setShowModal] = useState(false)
    const [validated, setValidated] = useState(true);
    const [CollapsedFields, setCollapsedFields] = useState(true);

    const [TargetAccount, setTargetAccount] = useState({
        fetched: false,
        fetching: false,
        valid: false,
        content:{}
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
                    receiverId: data.receiverId,
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
                    console.error(response.status)
                    break
                default:
                    console.error(response.status)
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
                                            TargetAccount={TargetAccount} handleChange={handleChange} data={data} toggleAccordion={toggleAccordion} Balance={AccountSelected ? AccountSelected.balance : 0} />
                                    </Accordion>
                                </Col>
                        }
                    </Row>
                </Container>
                {
                    contentReady && Accounts.length >= 1 ?
                        <ActionConfirmationModal setShowModal={setShowModal} show={ShowModal} action={transfer} data={data} Balance={AccountSelected.balance} Transfer={Transfer} />
                        :
                        null
                }
            </Form >
        </div >

    )
}
export default TransferForm