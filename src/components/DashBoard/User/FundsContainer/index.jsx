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
            className={`accountParent tabContent px-0  d-flex align-items-start align-items-md-center`}>
            {
                FetchingFunds || !contentReady || !Mounted
                    ?
                    <Container className="h-100 d-flex align-items-center px-0" fluid>
                        <Row className="w-100 mx-0 d-flex justify-content-center align-items-center">
                            <Col xs="12" className="d-flex justify-content-center align-items-center">
                                <Spinner className="me-2" animation="border" variant="primary" />
                                <span className="loadingText">{t("Loading")}</span>
                            </Col>
                        </Row>
                    </Container>
                    :
                    <CardsContainer
                        PendingWithoutpossession={PendingWithoutpossession}
                        PendingTransactions={PendingTransactions}

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
