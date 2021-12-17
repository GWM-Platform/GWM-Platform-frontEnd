import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../operationsForm.css'

import { Container, Row, Col } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';
import DepositData from './DepositData'

const DepositForm = ({ NavInfoToggled,balanceChanged }) => {
    const [data, setData] = useState({ amount: "" })
    const [validated, setValidated] = useState(true);

    const token = sessionStorage.getItem('access_token')

    let history = useHistory();


    const deposit = async () => {
        var url = `${process.env.REACT_APP_APIURL}/accounts/deposit`;
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
            balanceChanged()
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

    return (
        <Container className={NavInfoToggled ? "free-area-withoutNavInfo" : "free-area"}>
            <Row className="newTicket h-100 growAnimation">
                <Col xs="12">
                    <DepositData
                        handleSubmit={handleSubmit} validated={validated}
                        handleChange={handleChange} data={data} />
                </Col>
            </Row>
        </Container>
    )
}
export default DepositForm