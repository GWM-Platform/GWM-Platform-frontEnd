import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useContext } from 'react';
import CardsContainer from './CardsContainer';
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom'
import { Spinner, Row, Container, Col } from 'react-bootstrap';
import { dashboardContext } from '../../../../context/dashboardContext';
const FundsContainer = ({ NavInfoToggled, isMobile, setItemSelected, numberOfFunds }) => {

    const { token, ClientSelected } = useContext(dashboardContext);

    let history = useHistory();
    const { t } = useTranslation();

    const [contentReady, setContentReady] = useState(false);

    const [Funds, setFunds] = useState([]);
    const [FetchingFunds, setFetchingFunds] = useState(true);
    const [Accounts, setAccounts] = useState([])

    const [PendingTransactions, setPendingTransactions] = useState({
        value: [],
        fetched: false,
        fetching: false
    })

    const [PendingWithoutpossession, setPendingWithoutpossession] = useState([])

    useEffect(() => {
        const toLogin = () => {
            sessionStorage.clear();
            history.push(`/login`);
        }
        const getAccountsAndFunds=async()=>{
            setFetchingFunds(true)
            const [resposponseAccounts, resposponseFunds] = await Promise.all([getAccounts(), getFunds()]);
            setAccounts(resposponseAccounts)
            setFunds(resposponseFunds)
            setFetchingFunds(false)
            getPendingTransactions()
        }

        const getFunds = async () => {
            setFunds([])
            var url = `${process.env.REACT_APP_APIURL}/stakes/?` + new URLSearchParams({
                client: ClientSelected.id,
            });
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                //const data = await response.json()
                //setFunds(data)
                //getPendingTransactions()
                return await response.json()
            } else {
                switch (response.status) {
                    default:
                        toLogin()
                }
            }
        }

        const getAccounts = async () => {
            var url = `${process.env.REACT_APP_APIURL}/accounts/?` + new URLSearchParams({
                client: ClientSelected.id,
            });
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                //const data = await response.json()
                //setAccounts(data)
                //if (data.length > 0) sessionStorage.setItem('balance', data[0].balance)
                return await response.json()
            } else {
                switch (response.status) {
                    default:
                        toLogin()
                }
            }
        }

        const getPendingTransactions = async () => {
            setPendingTransactions({
                ...PendingTransactions, ...{
                    fetched: false,
                    fetching: true
                }
            })
            var url = `${process.env.REACT_APP_APIURL}/transactions/byState/1/?` + new URLSearchParams({
                client: ClientSelected.id,
            });
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
                setPendingTransactions({
                    ...PendingTransactions, ...{
                        value: data,
                        fetched: true,
                        fetching: false
                    }
                })
            } else {
                switch (response.status) {
                    default:
                        setPendingTransactions({
                            ...PendingTransactions, ...{
                                fetched: false,
                                fetching: false
                            }
                        })
                }
            }
        }

        setContentReady(false)
        setPendingWithoutpossession([])
        getAccountsAndFunds()
        //getFunds()
        //getAccounts()

        return () => {
        }
        // eslint-disable-next-line
    }, [ClientSelected])

    useEffect(() => {

        const toLogin = () => {
            sessionStorage.clear();
            history.push(`/login`);
        }

        const addPendingFundsWithoutPosesion = async () => {
            setPendingWithoutpossession([])
            let FundsWithPendingTransactions = new Set(PendingTransactions.value.map(transaction => transaction.fundId))
            let FundsWithPosession = new Set(Funds.map(Funds => Funds.fundId))

            const FundsWithNoPosession = ([...FundsWithPendingTransactions].filter(x => !FundsWithPosession.has(x)))//Diference (All in pending that are not funds with posession)

            const getFund = async (id) => {
                var url = `${process.env.REACT_APP_APIURL}/funds/${id}`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "*/*",
                        'Content-Type': 'application/json'
                    }
                })

                if (response.status === 200) {
                    return await response.json()
                } else {
                    switch (response.status) {
                        default:
                            toLogin()
                    }
                }

            }

            const promises = FundsWithNoPosession.map((fund) => {
                return getFund(fund)
            });

            const responses = await Promise.all(promises);
            
            responses.forEach((response) => {
                setPendingWithoutpossession(prevState => [...prevState, { fund: response }])
            })

            setContentReady(true)
        }

        if (!FetchingFunds && PendingTransactions.fetched && !contentReady) {
            addPendingFundsWithoutPosesion()
        }    

        //eslint-disable-next-line
    }, [Funds, PendingTransactions, ClientSelected]);


    return (
        <Container fluid
            className={`accountParent px-0 ${NavInfoToggled ? "min-free-area-withoutNavInfo" : "min-free-area"} d-flex align-items-center`}>            {
                FetchingFunds || !contentReady
                    ?
                    <Container fluid>
                        <Row className="d-flex justify-content-center align-items-center">
                            <Col xs="12" className="d-flex justify-content-center align-items-center">
                                <Spinner className="me-2" animation="border" variant="danger" />
                                <span className="loadingText">{t("Loading Content")}</span>
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
