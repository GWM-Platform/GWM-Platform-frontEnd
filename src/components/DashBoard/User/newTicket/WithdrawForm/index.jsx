import React, { useState, useEffect,useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../operationsForm.css'

import { Container, Row, Col } from 'react-bootstrap'
import { useHistory } from 'react-router-dom';
import WithdrawData from './WithdrawData'
import { dashboardContext } from '../../../../../context/dashboardContext';

const WithdrawForm = ({ NavInfoToggled, balanceChanged }) => {
    const [data, setData] = useState({ amount: "" })
    const [validated, setValidated] = useState(true);
    const [account, setAccount] = useState({});
    const {token,ClientSelected} = useContext(dashboardContext);

    let history = useHistory();


    const withdraw = async () => {
        const token = sessionStorage.getItem('access_token')
        var url = `${process.env.REACT_APP_APIURL}/accounts/${account.id}/withdraw`;
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
            history.push(`/dashboard/operationResult`);
        } else {
            switch (response.status) {
                case 500:
                    console.error(response.status)
                    break;
                default:
                    console.error(response.status)
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
        const token = sessionStorage.getItem('access_token')
        if (form.checkValidity() === true) {
            if (token === null) {
                console.log("compra")
            } else {
                withdraw()
            }
        }
        setValidated(true);
    }

    useEffect(() => {
        const getAccount = async () => {
            var url = `${process.env.REACT_APP_APIURL}/accounts/?` + new URLSearchParams({
                client: ClientSelected.id,
            });
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
                setAccount(data[0])
            } else {
                switch (response.status) {
                    case 500:
                        console.error(response.status)
                        break;
                    default:
                        console.error(response.status)
                }
            }
        }
        getAccount()
    }, [ClientSelected,token])

    return (
        <Container className={NavInfoToggled ? "free-area-withoutNavInfo" : "free-area"}>
            <Row className="newTicket h-100 growAnimation">
                <Col xs="12">
                    <WithdrawData
                        handleSubmit={handleSubmit} validated={validated}
                        handleChange={handleChange} data={data} account={account} />
                </Col>
            </Row>
        </Container>
    )
}
export default WithdrawForm