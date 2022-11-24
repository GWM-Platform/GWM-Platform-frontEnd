import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useContext, useEffect, useState } from 'react';
import CardsContainer from './CardsContainer';
import { useTranslation } from "react-i18next";
import { Spinner, Row, Container, Col } from 'react-bootstrap';
import { DashBoardContext } from 'context/DashBoardContext';
import axios from 'axios';

const FundsContainer = ({ isMobile, setItemSelected }) => {

    const { FetchingFunds, contentReady, PendingWithoutpossession, PendingTransactions, Accounts, Funds, ClientSelected, toLogin, hasPermission } = useContext(DashBoardContext);

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
        setMounted(true)
        if (contentReady) {
            if (hasPermission("FIXED_DEPOSIT_VIEW")) {
                getFixedDeposits()
            } else {
                setFixedDeposits((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, content: { deposits: [] } } }))
            }
        }
        //eslint-disable-next-line
    }, [contentReady]);

    const numberOfFunds = () => Accounts.length + Funds.length + PendingWithoutpossession.length + (FixedDeposits.content.deposits.length > 0 ? 1 : 0)

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
                    numberOfFunds() === 0  ? 
                    <Container className="h-100 d-flex align-items-center px-0" fluid>
                        <Row className="w-100 mx-0 d-flex justify-content-center align-items-center">
                            <Col xs="12" className="d-flex justify-content-center align-items-center">
                                <span className="text-center">{t("The client does not have any holdings or your user does not have access to view any of these")}</span>
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
                        Accounts={Accounts}
                    />
            }

        </Container>
    )
}
export default FundsContainer
