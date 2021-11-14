import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useCallback, useContext } from 'react';
import CardsContainer from './CardsContainer';
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom'
import { Spinner, Row, Container, Col } from 'react-bootstrap';
import { urlContext } from '../../../../context/urlContext';
const MovementsTable = ({ isMobile, setItemSelected, numberOfFounds, NavInfoToggled,setNumberOfFounds }) => {
// eslint-disable-next-line 
        const { urlPrefix } = useContext(urlContext)
    const { t } = useTranslation();

    const [Found, setFound] = useState([]);
    const [error, setError] = useState("Loading Content");

    let history = useHistory();

    // eslint-disable-next-line 
    const toLogin = () => {
        sessionStorage.clear(); history.push(`/login`);
    }



    const getFounds = useCallback(
        () => {
            let catchedUserData = JSON.parse(sessionStorage.getItem('Found'));//If its catched we wont fetch the 

            if (catchedUserData === null) {
                setFound([{ "id": 293, "description": "asset custody usd", "type": { "id": 111, "description": "asset custody", "productLine": { "id": 0, "description": " " } }, "externalNumber": "000000000000001", "currency": { "code": "USD", "name": "United States Dollar", "symbol": "$", "decimals": 2 }, "decimals": 0, "beneficiaryName": "Burton Gray", "balance": 24989989828.999996, "movementsCount": 124 }, { "id": 294, "description": "asset custody EUR", "type": { "id": 112, "description": "asset custody", "productLine": { "id": 0, "description": " " } }, "externalNumber": "000000000000002", "currency": { "code": "EUR", "name": "Euro", "symbol": "€", "decimals": 2 }, "decimals": 0, "beneficiaryName": "Burton Gray", "balance": 34999999985, "movementsCount": 4 }, { "id": 295, "description": "asset custody usd", "type": { "id": 111, "description": "asset custody", "productLine": { "id": 0, "description": " " } }, "externalNumber": "00000000000000003", "currency": { "code": "USD", "name": "United States Dollar", "symbol": "$", "decimals": 2 }, "decimals": 0, "beneficiaryName": "Burton Gray", "balance": 8520388, "movementsCount": 99 }])
                setNumberOfFounds(3)
            } else {
                setFound(catchedUserData)
                if (catchedUserData.length === 0) {
                    setError("Your user don't have any Found")
                }
                setNumberOfFounds(catchedUserData.length)
            }
             // eslint-disable-next-line
        }, [Found]);

    useEffect(() => {
        getFounds();
        return () => {
        }
    // eslint-disable-next-line
    }, [])

    return (
            <Container fluid className={NavInfoToggled? "free-area-withoutNavInfo": "free-area"}>
                {
                    Found.length === 0
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
                            Founds={Found}
                            numberOfFounds={numberOfFounds}
                        />
                }

            </Container>
    )
}
export default MovementsTable
