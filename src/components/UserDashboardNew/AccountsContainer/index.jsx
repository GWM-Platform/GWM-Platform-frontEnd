import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect, useCallback, useContext } from 'react';
import CardsContainer from './CardsContainer';
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom'
import { Spinner, Row, Container, Col } from 'react-bootstrap';
import { urlContext } from '../../../context/urlContext';
const AccountsContainer = ({ isMobile, setItemSelected, numberOfAccounts, setNumberOfAccounts }) => {
    // eslint-disable-next-line
    const { urlPrefix } = useContext(urlContext)
    const { t } = useTranslation();

    const [account, setAccount] = useState([]);
    const [error, setError] = useState("Loading Content");

    let history = useHistory();

    // eslint-disable-next-line 
    const toLogin = () => {
        sessionStorage.clear();
        history.push(`/login`);
    }



    const getAccounts = useCallback(
        () => {
            let catchedUserData = JSON.parse(sessionStorage.getItem('account'));//If its catched we wont fetch the 

            if (catchedUserData === null) {
                setAccount([
                    {
                       "id":293,
                       "description":"Cash",
                       "type":"cash",
                       "externalNumber":"000000000000001",
                       "currency":{
                          "code":"USD",
                          "name":"United States Dollar",
                          "symbol":"$",
                          "decimals":2
                       },
                       "decimals":0,
                       "beneficiaryName":"Burton Gray",
                       "balance":24989989828.999996,
                       "movementsCount":124
                    },
                    {
                       "id":294,
                       "description":"Fondo de crypto",
                       "type":"crypto",
                       "externalNumber":"000000000000002",
                       "currency":{
                          "code":"EUR",
                          "name":"Euro",
                          "symbol":"€",
                          "decimals":2
                       },
                       "decimals":0,
                       "beneficiaryName":"Burton Gray",
                       "balance":34999999985,
                       "movementsCount":4
                    },
                    {
                       "id":295,
                       "description":"Fondo Real State",
                       "type":"realState",
                       "externalNumber":"00000000000000003",
                       "currency":{
                          "code":"USD",
                          "name":"United States Dollar",
                          "symbol":"$",
                          "decimals":2
                       },
                       "decimals":0,
                       "beneficiaryName":"Burton Gray",
                       "balance":8520388,
                       "movementsCount":99
                    }
                 ])
                setNumberOfAccounts(3)
            } else {
                setAccount(catchedUserData)
                if (catchedUserData.length === 0) {
                    setError("Your user don't have any account")
                }
                setNumberOfAccounts(catchedUserData.length)
            }
            // eslint-disable-next-line
        }, []);

    useEffect(() => {
        getAccounts();
        return () => {
        }
    }, [getAccounts])

    return (
            <Container fluid className="mt-0 px-0 min-free-area d-flex align-items-center">
                {
                    account.length === 0
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
                            accounts={account}
                            numberOfAccounts={numberOfAccounts}
                        />
                }
            </Container>
    )
}
export default AccountsContainer
