import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../operationsForm.css'

import { Container, Row, Col, Accordion } from 'react-bootstrap'
import FundSelector from './FundSelector'
import BuyData from './BuyData'
import { useHistory } from 'react-router-dom';

const BuyForm = ({ NavInfoToggled }) => {
    //HardCoded data (here we should request Funds that have available feeParts to sell)
    const [data, setData] = useState({ amount: 1, FundSelected: -1 })
    const [some, setSome] = useState(false)
    const [SwitchState, setSwitchState] = useState(false)
    const [Funds, setFunds] = useState([])
    const [validated, setValidated] = useState(false);
    const [CollapsedFields, setCollapsedFields] = useState(true);
    const [Account, setAccount] = useState(0);


    const token = sessionStorage.getItem('access_token')

    let history = useHistory();


    const buy = async () => {
        var url = `${process.env.REACT_APP_APIURL}/funds/${Funds[data.FundSelected].id}/buy`;
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ amount: data.amount }),
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
            var url = `${process.env.REACT_APP_APIURL}/funds`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
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
        const hardcodedFunds = [{
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

        }, {
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

        }, {
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
        }, {
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

        }, {
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

        }, {
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

        }, {
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
        }]
        const getAccountWithApi = async () => {
            var url = `${process.env.REACT_APP_APIURL}/accounts`;
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
                if(data.length>0)sessionStorage.setItem('balance',data[0].balance)
            } else {
                switch (response.status) {
                    case 500:
                        console.error("Error ", response.status, " obteniendo stakes")
                        break;
                    default:
                        console.error("Error ", response.status, " obteniendo stakes")
                }
            }
        }

        const getAccount = () => {
            if (SwitchState) {
                getAccountWithApi()
            } else {
                setAccount({
                    "id": 1,
                    "clientId": 1,
                    "balance": 50,
                    "createdAt": "2021-11-17T21:37:32.427Z",
                    "updatedAt": "2021-11-17T21:56:10.000Z"
                })
                sessionStorage.setItem('balance',5652)
            }
        };
        getAccount()
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
                console.log("compra")
            } else {
                let success = buy()
                if (success) {
                    history.push(`/dashboardnew/operationResult`);
                }
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
    return (
        <Container className={NavInfoToggled ? "free-area-withoutNavInfo" : "free-area"}>
            <Row className="newTicket">
                <Col xs="12">
                    <Accordion flush defaultActiveKey="0">
                        <FundSelector SwitchState={SwitchState} handleSwitch={handleSwitch} openAccordion={openAccordion}
                            Funds={Funds} data={data} some={some} setData={setData} setSome={setSome}/>
                    </Accordion>
                    <Accordion flush activeKey={CollapsedFields ? "-1" : "0"}>
                        <BuyData 
                        handleSubmit={handleSubmit} validated={validated}
                            handleChange={handleChange} Funds={Funds} data={data}
                            toggleAccordion={toggleAccordion} Balance={Account.balance}/>
                    </Accordion>
                </Col>
            </Row>
        </Container>
    )
}
export default BuyForm