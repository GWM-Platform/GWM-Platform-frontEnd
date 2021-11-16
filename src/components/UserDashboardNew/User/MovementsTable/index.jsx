import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useCallback, useContext } from 'react';
import CardsContainer from './CardsContainer';
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom'
import { Spinner, Row, Container, Col, Form } from 'react-bootstrap';
import { urlContext } from '../../../../context/urlContext';
const MovementsTable = ({ isMobile, setItemSelected, numberOfFunds, NavInfoToggled, setNumberOfFunds }) => {
    // eslint-disable-next-line 
    const { urlPrefix } = useContext(urlContext)
    const { t } = useTranslation();

    const [Funds, setFunds] = useState([]);
    const [FetchingFunds, setFetchingFunds] = useState(false);
    const [error, setError] = useState("Loading Content");
    const [SwitchState, setSwitchState] = useState(false);

    const token = sessionStorage.getItem('access_token')

    let history = useHistory();

    // eslint-disable-next-line 
    const toLogin = () => {
        sessionStorage.clear(); history.push(`/login`);
    }

    const handleSwitch = (event) => {
        setSwitchState(event.target.checked)
    }

    const getFundsWithApi = async () => {
        var url = `${urlPrefix}/funds/stakes`;
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
            if (data.length === 0) setError("No tiene participacion en ningun fondo")
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

    const getFunds = useCallback(
        () => {
            setFetchingFunds(true)
            if (SwitchState) {
                getFundsWithApi()
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
                setNumberOfFunds(3)
            }
            setFetchingFunds(false)
            // eslint-disable-next-line
        }, [SwitchState]);

    useEffect(() => {
        getFunds();
        return () => {
        }
        // eslint-disable-next-line
    }, [SwitchState])

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
                FetchingFunds || Funds.length === 0
                    ?
                    <Container fluid>
                        <Row className="d-flex justify-content-center align-items-center">
                            <Col className="free-area d-flex justify-content-center align-items-center">
                                <Spinner className="me-2" animation="border" variant="danger" />
                                <span className="loadingText">{t(error)}</span>
                            </Col>
                        </Row>
                    </Container>
                    :
                    <CardsContainer
                        setItemSelected={setItemSelected}
                        isMobile={isMobile}
                        Funds={Funds}
                        numberOfFunds={numberOfFunds}
                        SwitchState={SwitchState}
                    />
            }

        </Container>
    )
}
export default MovementsTable
