import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useEffect, useState } from 'react';
import CardsContainer from './CardsContainer';
import { useTranslation } from "react-i18next";
import { Spinner, Row, Container, Col } from 'react-bootstrap';
import { DashBoardContext } from 'context/DashBoardContext';

const FundsContainer = ({ NavInfoToggled, isMobile, setItemSelected, numberOfFunds }) => {

    const { FetchingFunds, contentReady, PendingWithoutpossession, PendingTransactions, Accounts, Funds } = useContext(DashBoardContext);
    const { t } = useTranslation();

    const [Mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true)
    }, []);


    return (
        <Container fluid
            className={`accountParent tabContent px-0  d-flex align-items-center`}>
            {
                FetchingFunds || !contentReady || !Mounted
                    ?
                    <Container fluid>
                        <Row className="d-flex justify-content-center align-items-center">
                            <Col xs="12" className="d-flex justify-content-center align-items-center">
                                <Spinner className="me-2" animation="border" variant="danger" />
                                <span className="loadingText">{t("Loading content")}</span>
                            </Col>
                        </Row>
                    </Container>
                    :
                    <CardsContainer
                        PendingWithoutpossession={PendingWithoutpossession}
                        PendingTransactions={PendingTransactions}
                        NavInfoToggled={NavInfoToggled}
                        setItemSelected={setItemSelected}
                        isMobile={isMobile}
                        Funds={Funds}
                        numberOfFunds={numberOfFunds}
                        Accounts={Accounts}
                    />
            }
        </Container>
    )
}
export default FundsContainer
