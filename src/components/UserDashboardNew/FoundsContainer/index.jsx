import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useCallback, useContext } from 'react';
import CardsContainer from './CardsContainer';
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom'
import { Spinner, Row, Container, Col } from 'react-bootstrap';
import { urlContext } from '../../../context/urlContext';
const FoundsContainer = ({ isMobile, setItemSelected, numberOfFounds, setNumberOfFounds }) => {
    // eslint-disable-next-line
    const { urlPrefix } = useContext(urlContext)
    const { t } = useTranslation();

    const [founds, setFounds] = useState([]);
    const [error, setError] = useState("Loading Content");

    let history = useHistory();

    // eslint-disable-next-line 
    const toLogin = () => {
        sessionStorage.clear();
        history.push(`/login`);
    }



    const getFounds = useCallback(
        () => {
            let catchedUserData = JSON.parse(sessionStorage.getItem('founds'));//If its catched we wont fetch the 

            if (catchedUserData === null) {
                setFounds([
                    {
                        "id": 293,
                        "description": "Cash",
                        "type": "cash",
                        "externalNumber": "000000000000001",
                        "currency": {
                            "code": "USD",
                            "name": "United States Dollar",
                            "symbol": "$",
                            "decimals": 2
                        },
                        "decimals": 0,
                        "balance": 24989989828.999996,
                        "movementsCount": 124
                    },
                    {
                        "id": 294,
                        "description": "Fondo de crypto",
                        "type": "crypto",
                        "externalNumber": "000000000000002",
                        "currency": {
                            "code": "USD",
                            "name": "United States Dollar",
                            "symbol": "$",
                            "decimals": 2
                        },
                        "decimals": 0,
                        "balance": 34999999985,
                        "movementsCount": 4
                    },
                    {
                        "id": 295,
                        "description": "Fondo Real State",
                        "type": "realState",
                        "externalNumber": "00000000000000003",
                        "currency": {
                            "code": "USD",
                            "name": "United States Dollar",
                            "symbol": "$",
                            "decimals": 2
                        },
                        "decimals": 0,
                        "balance": 8520388,
                        "movementsCount": 99
                    },
                    {
                        "id": 295,
                        "description": "Fondo Crypto 2",
                        "type": "realState",
                        "externalNumber": "00000000000000003",
                        "currency": {
                            "code": "USD",
                            "name": "United States Dollar",
                            "symbol": "$",
                            "decimals": 2
                        },
                        "decimals": 0,
                        "balance": 8520388,
                        "movementsCount": 99
                    },
                    {
                        "id": 295,
                        "description": "Fondo Crypto 3",
                        "type": "realState",
                        "externalNumber": "00000000000000003",
                        "currency": {
                            "code": "USD",
                            "name": "United States Dollar",
                            "symbol": "$",
                            "decimals": 2
                        },
                        "decimals": 0,
                        "balance": 8520388,
                        "movementsCount": 99
                    }
                ])
                setNumberOfFounds(3)
            } else {
                setFounds(catchedUserData)
                if (catchedUserData.length === 0) {
                    setError("Your user don't have any founds")
                }
                setNumberOfFounds(catchedUserData.length)
            }
            // eslint-disable-next-line
        }, []);

    useEffect(() => {
        getFounds();
        return () => {
        }
    }, [getFounds])

    return (
        <Container fluid className="mt-0 px-0 min-free-area-total d-flex align-items-center">
            {
                founds.length === 0
                    ?
                    <Container fluid>
                        <Row className="d-flex justify-content-center align-items-center">
                            <Col style={{ height: "calc(100vh - 64px)" }} className="d-flex justify-content-center align-items-center">
                                <Spinner className="me-2" animation="border" variant="danger" />
                                <span className="loadingText">{t(error)}</span>
                            </Col>
                        </Row>
                    </Container>
                    :
                    <CardsContainer
                        setItemSelected={setItemSelected}
                        isMobile={isMobile}
                        founds={founds}
                        numberOfFounds={numberOfFounds}
                    />
            }
        </Container>
    )
}
export default FoundsContainer
