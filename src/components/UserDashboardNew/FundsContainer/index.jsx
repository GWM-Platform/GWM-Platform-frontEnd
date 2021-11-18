import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import CardsContainer from './CardsContainer';
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom'
import { Spinner, Row, Container, Col } from 'react-bootstrap';
const FundsContainer = ({ NavInfoToggled, isMobile, setItemSelected, numberOfFunds, setNumberOfFunds }) => {
    let history = useHistory();
    // eslint-disable-next-line
    const { t } = useTranslation();
    const [Funds, setFunds] = useState([]);
    const [SwitchState, setSwitchState] = useState(false);
    const [FetchingFunds, setFetchingFunds] = useState(false);

    const [Accounts, setAccounts] = useState([])

    const handleSwitch = (event) => {
        setSwitchState(event.target.checked)
    }
    // eslint-disable-next-line 
    const toLogin = () => {
        sessionStorage.clear();
        history.push(`/login`);
    }

    const token = sessionStorage.getItem('access_token')
    useEffect(() => {
        const getFunds = async () => {
            var url = `${process.env.REACT_APP_APIURL}/funds/stakes`;
            setFetchingFunds(true)
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
                setFetchingFunds(false)
            } else {
                switch (response.status) {
                    case 500:
                        console.error("Error. Vefique los datos ingresados")
                        break;
                    default:
                        console.error(response.status)
                }
                setFetchingFunds(false)
            }
        }
        const getAccounts = async () => {
            var url = `${process.env.REACT_APP_APIURL}/accounts`;
            setFetchingFunds(true)
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
                setAccounts(data)
                setFetchingFunds(false)
            } else {
                switch (response.status) {
                    case 500:
                        console.error("Error. Vefique los datos ingresados")
                        break;
                    default:
                        console.error(response.status)
                }
                setFetchingFunds(false)
            }
        }
        const hardcodedFunds = [
            {
                "id": 11,
                "clientId": 1,
                "fundId": 4,
                "shares": 17,
                "createdAt": "2021-11-03T14:00:19.348Z",
                "updatedAt": "2021-11-03T14:05:00.000Z",
                "fund": {
                    "type": "realState",
                    "id": 4,
                    "name": "Fondo hardcodeado Real state",
                    "shares": 20,
                    "sharePrice": 2,
                    "freeShares": 15,
                    "createdAt": "2021-11-02T12:36:32.559Z",
                    "updatedAt": "2021-11-03T14:05:00.000Z"
                }
            },
            {
                "id": 12,
                "clientId": 1,
                "fundId": 5,
                "shares": 7,
                "createdAt": "2021-11-03T14:04:16.821Z",
                "updatedAt": "2021-11-03T14:08:11.000Z",
                "fund": {
                    "type": "crypto",
                    "id": 5,
                    "name": "Fondo hardcodeado crypto",
                    "shares": 7,
                    "sharePrice": 55,
                    "freeShares": 0,
                    "createdAt": "2021-11-02T12:36:32.562Z",
                    "updatedAt": "2021-11-03T14:08:11.000Z"
                }
            },
            {
                "id": 12,
                "clientId": 1,
                "fundId": 5,
                "shares": 7,
                "createdAt": "2021-11-03T14:04:16.821Z",
                "updatedAt": "2021-11-03T14:08:11.000Z",
                "fund": {
                    "type": "crypto",
                    "id": 5,
                    "name": "Fondo hardcodeado crypto",
                    "shares": 7,
                    "sharePrice": 55,
                    "freeShares": 0,
                    "createdAt": "2021-11-02T12:36:32.562Z",
                    "updatedAt": "2021-11-03T14:08:11.000Z"
                }
            }
        ]
        const hardcodedAccounts =[{
                "id": 1,
                "clientId": 1,
                "balance": 4450,
                "createdAt": "2021-11-17T21:37:32.427Z",
                "updatedAt": "2021-11-17T21:56:10.000Z"
            }]

        if (SwitchState) {
            getFunds()
            getAccounts()
        } else {
            setFunds(hardcodedFunds)
            setAccounts(hardcodedAccounts)
        }
        return () => {
        }
        // eslint-disable-next-line
    }, [SwitchState])

    return (
        <Container fluid
            className={`accountParent px-0 ${NavInfoToggled ? "min-free-area-withoutNavInfo" : "min-free-area"} d-flex align-items-center`}>            {
                FetchingFunds
                    ?
                    <Container fluid>
                        <Row className="d-flex justify-content-center align-items-center">
                            <Col xs="12" className="d-flex justify-content-center align-items-center">
                                <Spinner className="me-2" animation="border" variant="danger" />
                                <span className="loadingText">{t("Loading Content")}</span>
                            </Col>
                        </Row>
                    </Container>
                    :
                    <CardsContainer
                        NavInfoToggled={NavInfoToggled}
                        setItemSelected={setItemSelected}
                        isMobile={isMobile}
                        Funds={Funds}
                        numberOfFunds={numberOfFunds}
                        Accounts={Accounts}
                        SwitchState={SwitchState}
                        handleSwitch={handleSwitch}
                    />
            }
        </Container>
    )
}
export default FundsContainer
