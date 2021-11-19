import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import CardsContainer from './CardsContainer';
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom'
import { Spinner, Row, Container, Col } from 'react-bootstrap';
const MovementsTable = ({ isMobile, setItemSelected, numberOfFunds, NavInfoToggled, setNumberOfFunds }) => {
    const { t } = useTranslation();

    const [Accounts, setAccounts] = useState([]);
    const [Funds, setFunds] = useState([]);

    const [FetchingFunds, setFetchingFunds] = useState(false);

    const [error, setError] = useState("Loading Content");

    const [selected, setSelected] = useState(0)

    const token = sessionStorage.getItem('access_token')

    let history = useHistory();

    // eslint-disable-next-line 
    const toLogin = () => {
        sessionStorage.clear(); history.push(`/login`);
    }

    const getAccounts = async () => {
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
            setAccounts(data)
            if (data.length > 0) sessionStorage.setItem('balance', data[0].balance)
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
                    console.error("Error. obteniendo stakes")
                    break;
                default:
                    console.error("Error. obteniendo stakes")
            }
        }
    }


    useEffect(() => {
        setNumberOfFunds(0)
        setFetchingFunds(true)
        getAccounts();
        getFunds();
        setFetchingFunds(false)
        return () => {
        }
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        setNumberOfFunds(Accounts.length + Funds.length)
        if (Accounts.length + Funds.length === 0) setError("No tiene participacion en ningun fondo")
    }, [Accounts, Funds, setNumberOfFunds])

    return (
        <Container fluid className={NavInfoToggled ? "free-area-withoutNavInfo" : "free-area"}>
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
                    />
            }

        </Container>
    )
}
export default MovementsTable
