import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useEffect, useState } from 'react';
import CardsContainer from './CardsContainer';
import { useTranslation } from "react-i18next";
import { Spinner, Row, Container, Col } from 'react-bootstrap';
import { DashBoardContext } from 'context/DashBoardContext';
import axios from 'axios';

const FundsContainer = ({ isMobile, setItemSelected, numberOfFunds }) => {

    const { FetchingFunds, contentReady, PendingWithoutpossession, PendingTransactions, Accounts, Funds, ClientSelected, toLogin } = useContext(DashBoardContext);
    const { t } = useTranslation();

    const [Mounted, setMounted] = useState(false);
    const [FixedDeposits, setFixedDeposits] = useState({ fetching: true, fetched: false, valid: false, content: {} })

    useEffect(() => {
        const getFixedDeposits = () => {
            setFixedDeposits((prevState) => ({ fetching: true, fetched: false }))
            axios.get(`/fixed-deposits`, {
                params: {
                    limit: 50,
                    skip: 0,
                    client: ClientSelected.id,
                    filterState:null
                }
            }).then(function (response) {
                if (response.status < 300 && response.status >= 200) {
                    setFixedDeposits((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, content: response?.data || {} } }))
                } else {
                    switch (response.status) {
                        case 401:
                            toLogin();
                            break;
                        default:
                            setFixedDeposits((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
                            break
                    }
                }
            }).catch((err) => {
                if (err.message !== "canceled") {
                    setFixedDeposits((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
                }
            });
        }
        setMounted(true)
        if (contentReady) {
            getFixedDeposits()
        }
        //eslint-disable-next-line
    }, [contentReady]);

    return (
        <Container fluid
            className={`accountParent tabContent px-0  d-flex align-items-start align-items-md-center`}>
            {
                FetchingFunds || !contentReady || !Mounted || FixedDeposits.fetching
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
                        FixedDeposits={FixedDeposits.content}
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
