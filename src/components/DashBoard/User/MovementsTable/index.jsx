import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useContext } from 'react';
import CardsContainer from './CardsContainer';
import { useTranslation } from "react-i18next";
import { Spinner, Row, Container, Col } from 'react-bootstrap';
import { DashBoardContext } from 'context/DashBoardContext';
import axios from 'axios';

const MovementsTable = ({ isMobile, setItemSelected, numberOfFunds, setNumberOfFunds }) => {

    const { toLogin, ClientSelected } = useContext(DashBoardContext)

    const { t } = useTranslation();

    const { FetchingFunds, Funds, Accounts, contentReady, PendingWithoutpossession, hasPermission } = useContext(DashBoardContext);

    const [error, setError] = useState("Loading");
    const [FixedDeposits, setFixedDeposits] = useState({ fetching: true, fetched: false, valid: false, content: { deposits: [], total: 0 } })
    const [FixedDepositsStats, setFixedDepositsStats] = useState({ fetching: true, fetched: false, valid: false, content: {} })

    useEffect(() => {
        setNumberOfFunds(0)
    }, [setNumberOfFunds])

    useEffect(() => {
        if (!FetchingFunds && contentReady) {
            setNumberOfFunds(Accounts.length + Funds.length + PendingWithoutpossession.length + (FixedDeposits.content.deposits.length > 0 ? 1 : 0))
            if (Accounts.length + Funds.length === 0 && !FetchingFunds && contentReady) setError("The client does not have any holdings or your user does not have access to view any of these")
        }
    }, [Accounts, Funds, setNumberOfFunds, FetchingFunds, contentReady, PendingWithoutpossession, FixedDeposits])


    useEffect(() => {
        const getFixedDeposits = () => {
            setFixedDeposits((prevState) => ({ ...prevState, fetching: true, fetched: false }))
            axios.get(`/fixed-deposits`, {
                params: {
                    limit: 50,
                    skip: 0,
                    client: ClientSelected.id,
                    filterState: null
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

        const getFixedDepositsStats = () => {
            setFixedDepositsStats((prevState) => ({ ...prevState, fetching: true, fetched: false }))
            axios.get(`/fixed-deposits/stats`, {
                params: {
                    client: ClientSelected.id
                }
            }).then(function (response) {
                if (response.status < 300 && response.status >= 200) {
                    setFixedDepositsStats((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, content: response?.data || {} } }))
                } else {
                    switch (response.status) {
                        case 401:
                            toLogin();
                            break;
                        default:
                            setFixedDepositsStats((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
                            break
                    }
                }
            }).catch((err) => {
                if (err.message !== "canceled") {
                    setFixedDepositsStats((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
                }
            });
        }

        if (contentReady) {
            if (hasPermission("FIXED_DEPOSIT_VIEW")) {
                if(!FixedDeposits.fetched){
                    getFixedDeposits()
                }
                if(!FixedDepositsStats.fetched){
                    getFixedDepositsStats()
                }
            } else {
                setFixedDeposits((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, content: { deposits: [] } } }))
                setFixedDepositsStats((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, content: {} } }))
            }

        }

        //eslint-disable-next-line
    }, [contentReady]);

    return (
        <Container fluid className="tabContent">
            {
                FetchingFunds || Funds.length + Accounts.length === 0 || FixedDepositsStats.fetching || !contentReady
                    ?
                    <Container className="h-100" fluid>
                        <Row className="d-flex justify-content-center align-items-center h-100">
                            <Col className="d-flex justify-content-center align-items-center">
                                <Spinner className={`me-2 ${error === "The client does not have any holdings or your user does not have access to view any of these" ? "d-none" : ""}`} animation="border" variant="primary" />
                                <span className={`d-none d-md-block ${error === "Loading" ? "loadingText" : "text-center"}`}>{t(error)}</span>
                                <span className="d-block d-md-none loadingText">{t("Loading")}</span>
                            </Col>
                        </Row>
                    </Container>
                    :
                    <CardsContainer
                        FixedDepositsStats={FixedDepositsStats}
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
