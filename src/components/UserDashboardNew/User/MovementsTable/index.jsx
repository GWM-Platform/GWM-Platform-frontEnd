import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useCallback } from 'react';
import CardsContainer from './CardsContainer';
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom'
import { Spinner, Row, Container, Col, Form } from 'react-bootstrap';
const MovementsTable = ({ isMobile, setItemSelected, numberOfFunds, NavInfoToggled, setNumberOfFunds }) => {
    var acumulador = 0
    const { t } = useTranslation();

    const [Funds, setFunds] = useState([]);
    const [Accounts, setAccounts] = useState([]);

    const [FetchingFunds, setFetchingFunds] = useState(false);

    const [error, setError] = useState("Loading Content");
    const [SwitchState, setSwitchState] = useState(false);
    const [selected, setSelected] = useState(0)

    const token = sessionStorage.getItem('access_token')

    let history = useHistory();

    // eslint-disable-next-line 
    const toLogin = () => {
        sessionStorage.clear(); history.push(`/login`);
    }

    const handleSwitch = (event) => {
        setSwitchState(event.target.checked)
    }


    const getAccountsWithApi = async () => {
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
        } else {
            switch (response.status) {
                case 500:
                    console.error("Error ", response.status, " obteniendo stakes")
                    break;
                default:
                    console.error("Error ", response.status, " obteniendo stakes")
            }
        }
        setFetchingFunds(false)
    }

    const getAccounts = useCallback(
        (acumulador) => {
            setFetchingFunds(true)
            if (SwitchState) {
                getAccountsWithApi()
            } else {
                setAccounts([{
                    "id": 1,
                    "clientId": 1,
                    "balance": 4450,
                    "createdAt": "2021-11-17T21:37:32.427Z",
                    "updatedAt": "2021-11-17T21:56:10.000Z"
                }])
            }
            setFetchingFunds(false)
            // eslint-disable-next-line
        }, [SwitchState]);

    const getFundsWithApi = async () => {
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
        } else {
            switch (response.status) {
                case 500:
                    console.error("Error. obteniendo stakes")
                    break;
                default:
                    console.error("Error. obteniendo stakes")
            }
            setFetchingFunds(false)
        }
    }

    const getFunds = useCallback(
        () => {
            setFetchingFunds(true)
            if (SwitchState) {
                getFundsWithApi(acumulador)
            } else {
                setFunds([
                    {
                        "id": 17,
                        "clientId": 1,
                        "fundId": 1,
                        "shares": 5,
                        "createdAt": "2021-11-03T17:30:34.014Z",
                        "updatedAt": "2021-11-04T20:16:14.000Z",
                        "fund": {
                            "id": 1,
                            "name": "Hardcoded Fund 1",
                            "shares": 100,
                            "sharePrice": 50,
                            "freeShares": 30,
                            "createdAt": "2021-11-02T12:34:38.768Z",
                            "updatedAt": "2021-11-03T17:30:34.000Z"
                        }
                    },
                    {
                        "id": 18,
                        "clientId": 1,
                        "fundId": 4,
                        "shares": 10,
                        "createdAt": "2021-11-04T20:12:12.937Z",
                        "updatedAt": "2021-11-04T20:12:12.937Z",
                        "fund": {
                            "id": 4,
                            "name": "Hardcoded Fund 2",
                            "shares": 20,
                            "sharePrice": 5,
                            "freeShares": 3.5,
                            "createdAt": "2021-11-02T12:36:32.559Z",
                            "updatedAt": "2021-11-04T20:12:13.000Z"
                        }
                    }
                ])
            }
            setFetchingFunds(false)
            // eslint-disable-next-line
        }, [SwitchState]);

    useEffect(() => {
        setSelected(0)
        getFunds();
        getAccounts();
        return () => {
        }
        // eslint-disable-next-line
    }, [SwitchState])
    useEffect(() => {
        setNumberOfFunds(Accounts.length+Funds.length)
        if (Accounts.length+Funds.length === 0) setError("No tiene participacion en ningun fondo")
    }, [Accounts,Funds,setNumberOfFunds])
    return (
        <Container fluid className={NavInfoToggled ? "free-area-withoutNavInfo" : "free-area"}>
            <Form.Check
                onChange={handleSwitch}
                checked={SwitchState}
                type="switch"
                id="FundApi"
                label={t("API's Funds (For devops)")}
            />
            {
                FetchingFunds || Funds.length + Accounts.length === 0
                    ?
                    <Container fluid>
                        <Row className="d-flex justify-content-center align-items-center">
                            <Col className="free-area d-flex justify-content-center align-items-center">
                                <Spinner className={`me-2 ${error !== "No tiene participacion en ningun fondo" ? "d-none" : ""}`} animation="border" variant="danger" />
                                <span className="loadingText">{t(error)}</span>
                            </Col>
                        </Row>
                    </Container>
                    :
                    <CardsContainer
                        NavInfoToggled={NavInfoToggled}
                        selected={selected}
                        setSelected={setSelected}
                        setItemSelected={setItemSelected}
                        isMobile={isMobile}
                        Funds={Funds}
                        Accounts={Accounts}
                        numberOfFunds={numberOfFunds}
                        SwitchState={SwitchState}
                    />
            }

        </Container>
    )
}
export default MovementsTable
