import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row } from 'react-bootstrap'
import Loading from 'components/DashBoard/User/MovementsTable/CardsContainer/MainCard/MainCardFund/MovementsTab/Loading';
import ClientSelector from './ClientSelector';
import SelectedClientData from './SelectedClientData';
import { Route, Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCallback } from 'react';
import axios from 'axios';
import { DashBoardContext } from 'context/DashBoardContext';
import { useContext } from 'react';
import CreateClientForm from './CreateClientForm';

const ClientsSupervision = () => {
    const { toLogin } = useContext(DashBoardContext)

    const { t } = useTranslation();

    const [Accounts, setAccounts] = useState({ fetching: true, fetched: false, content: [] })
    const [Clients, setClients] = useState({ fetching: true, fetched: false, content: [] })
    const [stakes, setStakes] = useState({ fetching: true, fetched: false, content: [] })
    const [users, setUsers] = useState({ fetching: true, fetched: false, valid: false, content: [] })

    const getUsers = useCallback((signal) => {
        setUsers((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.get(`/users`, {
            params: { all: true },
            signal: signal,
        }).then(function (response) {
            setUsers((prevState) => (
                {
                    ...prevState,
                    fetching: false,
                    fetched: true,
                    valid: true,
                    content: response.data,
                }))
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setUsers((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
            }
        });
    }, [toLogin, setUsers]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        getUsers(signal)

        return () => {
            controller.abort();
        };
    }, [getUsers])

    const getClients = async () => {
        const token = sessionStorage.getItem('access_token')
        setClients((prevState) => ({ fetching: true, fetched: true, content: [] }))
        var url = `${process.env.REACT_APP_APIURL}/Clients/?` + new URLSearchParams({
            all: true,
        });

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
            }
        })

        if (response.status === 200) {
            const dataFetched = await response.json()
            setClients((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, content: dataFetched } }))
        } else {
            switch (response.status) {
                case 500:
                    setClients((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                    break;
                default:
                    setClients((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                    console.error(response.status)
            }
        }
    }

    useEffect(() => {
        const token = sessionStorage.getItem('access_token')

        const getAccounts = async () => {
            setAccounts((prevState) => ({ fetching: true, fetched: true, content: [] }))
            var url = `${process.env.REACT_APP_APIURL}/Accounts`
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                }
            })

            if (response.status === 200) {
                const dataFetched = await response.json()
                setAccounts((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, content: dataFetched } }))
            } else {
                switch (response.status) {
                    case 500:
                        setAccounts((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                        break;
                    default:
                        setAccounts((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                        console.error(response.status)
                }
            }
        }

        getAccounts()
        getClients()

    }, [])

    useEffect(() => {
        const token = sessionStorage.getItem('access_token')

        const getStakes = async () => {

            setStakes((prevState) => ({ ...prevState, fetching: true, fetched: true, content: [] }))

            var url = `${process.env.REACT_APP_APIURL}/stakes`
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                }
            })

            if (response.status === 200) {
                const dataFetched = await response.json()
                setStakes((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, content: dataFetched } }))
            } else {
                switch (response.status) {
                    case 500:
                        setStakes((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                        break;
                    default:
                        setStakes((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                        console.error(response.status)
                }
            }
        }

        if (!Accounts.fetching && !Clients.fetching) {
            getStakes()
        }
    }, [Accounts, Clients])

    const getAccountByClientId = (searchedClientId) => {
        let index = Accounts.content.findIndex((account) => account.clientId === searchedClientId)
        return index === -1 ? false : Accounts.content[index]
    }

    return (
        <Container className="h-100 ClientsSupervision">
            <Row className="h-100">
                {Accounts.fetching || Clients.fetching || stakes.fetching ?
                    <Loading />
                    :
                    <Switch>
                        <Route exact path="/DashBoard/clientsSupervision/">
                            <ClientSelector Accounts={Accounts.content} Clients={Clients.content} />
                        </Route>
                        <Route exact path="/DashBoard/clientsSupervision/create-client">
                            <CreateClientForm getClients={getClients}/>
                        </Route>
                        {
                            Clients.content.map((client) =>
                                <Route key={`client-data-${client.id}`} path={`/DashBoard/clientsSupervision/${client.id}`}>
                                    <SelectedClientData
                                        users={users}
                                        stakes={stakes.content}
                                        Client={client}
                                        Account={getAccountByClientId(client.id)}
                                    />
                                </Route>
                            )
                        }
                        <Route path="*">
                            <h1>{t("Not found")}</h1>
                        </Route>
                    </Switch>
                }
            </Row>
        </Container>

    )
}
export default ClientsSupervision


