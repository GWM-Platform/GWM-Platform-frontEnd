import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import CardsContainer from './CardsContainer';
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom'
import { Spinner, Row, Container, Col } from 'react-bootstrap';
const FundsContainer = ({ NavInfoToggled, isMobile, setItemSelected, numberOfFunds, setNumberOfFunds }) => {
    let history = useHistory();
    // eslint-disable-next-line
    const { t } = useTranslation();
    const [Funds, setFunds] = useState([]);
    const [FetchingFunds, setFetchingFunds] = useState(true);

    const [Accounts, setAccounts] = useState([])

    // eslint-disable-next-line 

    useEffect(() => {
        const token = sessionStorage.getItem('access_token')

        const toLogin = () => {
            sessionStorage.clear();
            history.push(`/login`);
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
                    default:
                        toLogin()
                }
            }
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
                    default:
                        toLogin()
                }
            }
        }

        if(token===null) toLogin()
        setFetchingFunds(true)
        getFunds()
        getAccounts()
        setFetchingFunds(false)

        return () => {
        }
        // eslint-disable-next-line
    }, [])

    return (
        <Container fluid
            className={`accountParent px-0 ${NavInfoToggled ? "min-free-area-withoutNavInfo" : "min-free-area"} d-flex align-items-center`}>            {
                    FetchingFunds
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
