import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'
import { Accordion } from 'react-bootstrap'

import AccountGeneralData from './AccountGeneralData'
import AccountMovements from './AccountMovements'
import TransactionsByFund from './TransactionsByFund'
import FundsPossesion from './FundsPossesion';

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { Link, Route, Switch } from 'react-router-dom';
import ClientUsersAccordion from './ClientUsersAccordion';
import ConnectForm from './ConnectForm';
import TimeDeposits from './TimeDeposits';
import axios from 'axios';
import { DashBoardContext } from 'context/DashBoardContext';

const SelectedAccountData = ({ Account, Client, stakes, users }) => {

    const { t } = useTranslation();

    const [clientFunds] = useState(stakes.filter(stake => stake.clientId === Client.id))

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
    }, [toLogin, setUsers, Client.id]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        getUsers(signal)

        return () => {
            controller.abort();
        };
    }, [getUsers])

    const ownersAmount = clientUsers?.content?.filter(user => user?.isOwner)?.length || 0

    return (
        <Switch>
            <Route exact path={`/DashBoard/clientsSupervision/${Client.id}`}>
                <div className="AccountData h-100 mb-5 growOpacity">
                    <div className="header">
                        <h1 className="title">
                            {t("Data from client")}&nbsp;#{Client.id},&nbsp;{t("Alias")}:&nbsp;{Client.alias}
                        </h1>
                        <Link className="button icon" to={`/DashBoard/clientsSupervision/`}>
                            <FontAwesomeIcon className="button icon" icon={faChevronCircleLeft} />
                        </Link>

                    </div>
                    <Accordion flush alwaysOpen>
                        <AccountGeneralData Account={Account} Client={Client} />
                        <ClientUsersAccordion client={Client} users={clientUsers} getUsers={getUsers} ownersAmount={ownersAmount} />
                        {clientFunds.length > 0 ? <FundsPossesion stakes={clientFunds} /> : null}
                        <AccountMovements ClientId={Client.id} AccountId={Account.id} />
                        <TransactionsByFund ClientId={Client.id} AccountId={Account.id} />
                        <TimeDeposits ClientId={Client.id} AccountId={Account.id} />
                    </Accordion>
                </div>
            </Route>

            <Route exact path={`/DashBoard/clientsSupervision/${Client.id}/connectUserToClient`}>
                <ConnectForm clientUsers={clientUsers} client={Client} users={users} ownersAmount={ownersAmount} />
            </Route>

            <Route path="*">
                <h1>{t("Not found")}</h1>
            </Route>
        </Switch>

    )
}

export default SelectedAccountData