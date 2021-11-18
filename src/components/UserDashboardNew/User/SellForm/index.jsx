import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../operationsForm.css'

import { Container, Row, Col, Accordion } from 'react-bootstrap'
import FundSelector from './FundSelector'
import SellData from './SellData'
import { useHistory } from 'react-router-dom';

const SellForm = ({NavInfoToggled}) => {
    //HardCoded data (here we should request Funds that have available feeParts to sell)
    const [data, setData] = useState({ amount: 1, FundSelected: -1 })
    const [some, setSome] = useState(false)
    const [SwitchState, setSwitchState] = useState(false)
    const [Funds, setFunds] = useState([])
    const [validated, setValidated] = useState(false);
    const [CollapsedFields, setCollapsedFields] = useState(true);

    const token = sessionStorage.getItem('access_token')

    let history = useHistory();


    const sell = async () => {
        var url = `${process.env.REACT_APP_APIURL}/funds/${Funds[data.FundSelected].fundId}/sell`;
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ shares: data.shares }),
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 201) {
            return (true)
        } else {
            switch (response.status) {
                case 500:
                    console.error(response.status)
                    return (false)
                default:
                    console.error(response.status)
                    return (false)
            }
        }
    }

    useEffect(() => {
        const getFunds = async () => {
            var url = `${process.env.REACT_APP_APIURL}/funds/stakes`;
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
                setFunds(data)
            } else {
                switch (response.status) {
                    case 500:
                        console.error("Error. Vefique los datos ingresados")
                        break;
                    default:
                        console.error(response.status)
                }
            }
        }
        const hardcodedFunds = [
            {
                id: 13,
                clientId: 1,
                fundId: 4,
                shares: 1.5,
                createdAt: "2021-11-03T14:34:01.612Z",
                updatedAt: "2021-11-03T14:34:10.000Z",
                fund: {
                    id: 4,
                    name: "CryptoCurrency Fund",
                    shares: 1000,
                    freeShares: 37,
                    sharePrice: 30,
                    "createdAt": "2021-11-02T12:36:32.559Z",
                    "updatedAt": "2021-11-03T14:34:10.000Z",
                    composition: [{
                        label: 'Bitcoin USD',
                        value: 15
                    }, {
                        label: 'Ethereum USD',
                        value: 5
                    }, {
                        label: 'HEX USD',
                        value: 7
                    }, {
                        label: 'Tether USD',
                        value: 0.2
                    }, {
                        label: 'Cardano USD',
                        value: 5
                    }, {
                        label: 'BinanceCoin US',
                        value: 15
                    }]
                }
            }, {
                id: 13,
                clientId: 1,
                fundId: 4,
                shares: 1.5,
                createdAt: "2021-11-03T14:34:01.612Z",
                updatedAt: "2021-11-03T14:34:10.000Z",
                fund: {
                    id: 4,
                    name: "CryptoCurrency Fund",
                    shares: 1000,
                    freeShares: 37,
                    sharePrice: 30,
                    "createdAt": "2021-11-02T12:36:32.559Z",
                    "updatedAt": "2021-11-03T14:34:10.000Z",
                    composition: [{
                        label: 'Bitcoin USD',
                        value: 15
                    }, {
                        label: 'Ethereum USD',
                        value: 5
                    }, {
                        label: 'HEX USD',
                        value: 7
                    }, {
                        label: 'Tether USD',
                        value: 0.2
                    }, {
                        label: 'Cardano USD',
                        value: 5
                    }, {
                        label: 'BinanceCoin US',
                        value: 15
                    }]
                }
            }, {
                id: 13,
                clientId: 1,
                fundId: 4,
                shares: 1.5,
                createdAt: "2021-11-03T14:34:01.612Z",
                updatedAt: "2021-11-03T14:34:10.000Z",
                fund: {
                    name: "CryptoCurrency Fund",
                    shares: 10000,
                    freeShares: 1000,
                    sharePrice: 6,
                    composition: [{
                        label: 'Bitcoin USD',
                        value: 25
                    }, {
                        label: 'Cardano USD',
                        value: 5
                    }, {
                        label: 'Ethereum USD',
                        value: 75,
                    }]

                }
            }, {
                id: 13,
                clientId: 1,
                fundId: 4,
                shares: 1.5,
                createdAt: "2021-11-03T14:34:01.612Z",
                updatedAt: "2021-11-03T14:34:10.000Z",
                fund: {
                    name: "CryptoCurrency Fund",
                    shares: 1000,
                    freeShares: 37,
                    sharePrice: 30,
                    composition: [{
                        label: 'Bitcoin USD',
                        value: 15
                    }, {
                        label: 'Ethereum USD',
                        value: 5
                    }, {
                        label: 'HEX USD',
                        value: 7
                    }, {
                        label: 'Tether USD',
                        value: 0.2
                    }, {
                        label: 'Cardano USD',
                        value: 5
                    }, {
                        label: 'BinanceCoin US',
                        value: 15
                    }]

                }
            }, {
                id: 13,
                clientId: 1,
                fundId: 4,
                shares: 1.5,
                createdAt: "2021-11-03T14:34:01.612Z",
                updatedAt: "2021-11-03T14:34:10.000Z",
                fund: {
                    name: "CryptoCurrency Fund",
                    shares: 10000,
                    freeShares: 1000,
                    sharePrice: 6,
                    composition: [{
                        label: 'Bitcoin USD',
                        value: 25
                    }, {
                        label: 'Cardano USD',
                        value: 5
                    }, {
                        label: 'Ethereum USD',
                        value: 75,
                    }]

                }
            }, {
                id: 13,
                clientId: 1,
                fundId: 4,
                shares: 1.5,
                createdAt: "2021-11-03T14:34:01.612Z",
                updatedAt: "2021-11-03T14:34:10.000Z",
                fund: {
                    name: "CryptoCurrency Fund",
                    shares: 10000,
                    freeShares: 1000,
                    sharePrice: 6,
                    composition: [{
                        label: 'Bitcoin USD',
                        value: 25
                    }, {
                        label: 'Cardano USD',
                        value: 5
                    }, {
                        label: 'Ethereum USD',
                        value: 75,
                    }]
                }
            }
        ]

        if (SwitchState) {
            getFunds()
        } else {
            setFunds(hardcodedFunds)
        }
        let aux = data
        aux.FundSelected = -1
        setData(aux)
        return () => {
        }
        // eslint-disable-next-line
    }, [SwitchState])

    const handleChange = (event) => {
        let aux = data;
        aux[event.target.id] = event.target.value;
        setData(aux);
        setSome(!some)
    }

    const handleSwitch = () => {
        setSwitchState(!SwitchState)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            if (token === null) {
                console.log("venta")
            } else {
                let success = sell()
                if (success) {
                    history.push(`/dashboardnew/operationResult`);
                }
            }
        }
        setValidated(true);
    }

    const toggleAccordion=()=>{
        setCollapsedFields(!CollapsedFields)
    }
    const openAccordion=()=>{
        setCollapsedFields(false)
    }

    return (
        <Container >
            <Row className={`${NavInfoToggled? "free-area-withoutNavInfo": "free-area"} newTicket`}>
                <Col xs="12">
                    <Accordion flush defaultActiveKey="0">
                        <FundSelector SwitchState={SwitchState} handleSwitch={handleSwitch}  openAccordion={openAccordion}
                            Funds={Funds} data={data} some={some} setData={setData} setSome={setSome} />
                    </Accordion>
                    <Accordion flush activeKey={CollapsedFields ? "-1" : "0"}>
                        <SellData toggleAccordion={toggleAccordion} handleSubmit={handleSubmit} validated={validated}
                            handleChange={handleChange} Funds={Funds} data={data} />
                    </Accordion>
                </Col>
            </Row>
        </Container>
    )
}
export default SellForm