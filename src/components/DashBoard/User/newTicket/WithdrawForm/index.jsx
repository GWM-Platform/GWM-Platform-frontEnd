import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../operationsForm.css'

import { Container, Row, Col } from 'react-bootstrap'
import { DashBoardContext } from 'context/DashBoardContext';
import WithdrawData from './WithdrawData'
import Loading from '../Loading';
import ActionConfirmationModal from './ActionConfirmationModal';
const WithdrawForm = ({ NavInfoToggled, balanceChanged }) => {
    const [data, setData] = useState({ amount: "" })
    const [ShowModal, setShowModal] = useState(false)
    const [validated, setValidated] = useState(true);
    const [fetching, setFetching] = useState(false)

    const { token, Accounts, contentReady } = useContext(DashBoardContext);

    let history = useHistory();


    const withdraw = async () => {
        setFetching(true)
        var url = `${process.env.REACT_APP_APIURL}/accounts/${Accounts[0].id}/withdraw`;
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
            balanceChanged()
            history.push(`/DashBoard/operationResult`);
        } else {
            switch (response.status) {
                case 500:
                    console.error(response.status)
                    break;
                default:
                    console.error(response.status)
            }
        }
        setFetching(false)
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
        const token = sessionStorage.getItem('access_token')
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
                contentReady && contentReady ?
                    <ActionConfirmationModal fetching={fetching} setShowModal={setShowModal} show={ShowModal} action={withdraw} data={data} Balance={Accounts[0].balance} />
                    :
                    null
            }
        </div>
    )
}
export default WithdrawForm