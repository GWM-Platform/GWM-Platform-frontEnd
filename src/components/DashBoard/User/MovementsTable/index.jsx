import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useContext } from 'react';
import CardsContainer from './CardsContainer';
import { useTranslation } from "react-i18next";
import { Spinner, Row, Container, Col } from 'react-bootstrap';
import { DashBoardContext } from 'context/DashBoardContext';

const MovementsTable = ({ isMobile, setItemSelected, numberOfFunds, NavInfoToggled, setNumberOfFunds }) => {
    

    const { t } = useTranslation();

    const { FetchingFunds, Funds, Accounts, contentReady } = useContext(DashBoardContext);

    const [error, setError] = useState("Loading content");


    useEffect(() => {
        setNumberOfFunds(0)
    }, [setNumberOfFunds])

    useEffect(() => {
        if (!FetchingFunds && contentReady) {
            setNumberOfFunds(Accounts.length + Funds.length)
            if (Accounts.length + Funds.length === 0 && !FetchingFunds && contentReady) setError("No tiene participacion en ningun fondo")
        }
    }, [Accounts, Funds, setNumberOfFunds, FetchingFunds, contentReady])

    return (
        <Container fluid className="tabContent">
            {
                FetchingFunds || Funds.length + Accounts.length === 0 || !contentReady
                    ?
                    <Container fluid>
                        <Row className="d-flex justify-content-center align-items-center">
                            <Col className="free-area d-flex justify-content-center align-items-center">
                                <Spinner className={`me-2 ${error === "No tiene participacion en ningun fondo" ? "d-none" : ""}`} animation="border" variant="danger" />
                                <span className="d-none d-md-block loadingText">{t(error)}</span>
                                <span className="d-block d-md-none loadingText">{t("Loading")}</span>
                            </Col>
                        </Row>
                    </Container>
                    :
                    <CardsContainer
                        NavInfoToggled={NavInfoToggled}
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
