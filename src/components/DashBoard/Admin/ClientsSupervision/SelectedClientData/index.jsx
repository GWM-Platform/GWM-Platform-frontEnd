import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'
import { Accordion, Badge } from 'react-bootstrap'

import AccountGeneralData from './AccountGeneralData'
import AccountMovements from './AccountMovements'
import TransactionsByFund from './TransactionsByFund'

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import './index.scss'
import { Link, Route, Switch } from 'react-router-dom';
import ClientUsersAccordion from './ClientUsersAccordion';
import ConnectForm from './ConnectForm';
import TimeDeposits from './TimeDeposits';
import axios from 'axios';
import { DashBoardContext } from 'context/DashBoardContext';
import DocumentForm from './DocumentForm';
import DocumentsAccordion from './DocumentsAccordion';
import { YearlyStatement } from 'components/DashBoard/User/MovementsTable/CardsContainer/MainCard/MainCardAccount';

const SelectedAccountData = ({ Account, Client, users, setAccounts, toggleClient }) => {

    const { t } = useTranslation();

    const [stakes, setStakes] = useState({ fetching: true, fetched: false, content: [] })
    const [documents, setDocuments] = useState({ fetching: false, fetched: false, valid: false, content: [] })

    const { toLogin } = useContext(DashBoardContext)

    const [clientUsers, setUsers] = useState({ fetching: false, fetched: false, valid: false, content: [] })

    const getUsers = useCallback((signal) => {
        setUsers((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.get(`/users`, {
            params: { clientId: Client.id },
            signal: signal,
        }).then(function (response) {
            setUsers((prevState) => (
                {
                    ...prevState,
                    fetching: false,
                    fetched: true,
                    valid: true,
                    content: response.data.sort((user) => user.isOwner ? -1 : 0),
                }))
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setUsers((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Client.id]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        getUsers(signal)

        return () => {
            controller.abort();
        };
    }, [getUsers])

    useEffect(() => {
        const getStakes = async () => {
            setStakes((prevState) => ({ ...prevState, fetching: true, fetched: true, content: [] }))
            axios.get(`/stakes`, {
                params: { all: true },
                client: Client.id
            }).then(function (response) {
                setStakes((prevState) => (
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
                    setStakes((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
                }
            });
        }
        getStakes()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [Client.id])

    const clientFunds = useMemo(() => stakes?.content?.filter(stake => stake.clientId === Client.id), [Client.id, stakes?.content])
    const ownersAmount = clientUsers?.content?.filter(user => user?.isOwner)?.length || 0

    return (
        <Switch>
            <Route exact path={`/DashBoard/clientsSupervision/${Client.id}`}>
                <div className="AccountData h-100 mb-5 growOpacity">
                    <div className="header">
                        <div className='d-flex align-items-center'>
                            <h1 className="title fw-normal">
                                {t("Data from client")}&nbsp;#{Client.id},&nbsp;{t("Alias")}:&nbsp;{Client.alias}
                            </h1>
                            <div className='ms-auto' />
                            <YearlyStatement wrapperClassName="d-flex align-items-center mt-0 mb-0" ClientSelected={Client} />
                            <h5 className='mb-0 ms-2'>
                                <Badge bg={Client.enabled ? "success" : "danger"}>{t(Client.enabled ? "Enabled" : "Disabled")}</Badge>
                            </h5>
                        </div>
                        <Link className="button icon" to={`/DashBoard/clientsSupervision/`}>
                            <FontAwesomeIcon className="button icon" icon={faChevronCircleLeft} />
                        </Link>

                    </div>
                    <Accordion flush alwaysOpen>
                        <AccountGeneralData setAccounts={setAccounts} Account={Account} Client={Client} toggleClient={toggleClient} />
                        <ClientUsersAccordion client={Client} users={clientUsers} getUsers={getUsers} ownersAmount={ownersAmount} />
                        <DocumentsAccordion client={Client} documents={documents} setDocuments={setDocuments} />
                        <AccountMovements ClientId={Client.id} AccountId={Account.id} Account={Account} />
                        <TransactionsByFund ClientId={Client.id} AccountId={Account.id} clientFunds={clientFunds} />
                        <TimeDeposits ClientId={Client.id} AccountId={Account.id} />
                    </Accordion>
                </div>
            </Route>

            <Route exact path={`/DashBoard/clientsSupervision/${Client.id}/connectUserToClient`}>
                <ConnectForm getUsers={getUsers} clientUsers={clientUsers} client={Client} users={users} ownersAmount={ownersAmount} />
            </Route>

            <Route exact path={`/DashBoard/clientsSupervision/${Client.id}/document`}>
                <DocumentForm client={Client} users={users} documents={documents} />
            </Route>

            <Route path="*">
                <h1>{t("Not found")}</h1>
            </Route>
        </Switch>

    )
}

export default SelectedAccountData