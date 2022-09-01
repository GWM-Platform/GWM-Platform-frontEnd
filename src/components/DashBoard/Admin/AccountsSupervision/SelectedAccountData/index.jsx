import React, { useState } from 'react'
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
import { useEffect } from 'react';
import { Link, Route, Switch } from 'react-router-dom';
import ClientUsersAccordion from './ClientUsersAccordion';
import ConnectForm from './ConnectForm';

const SelectedAccountData = ({ Account, Client, setSelectedAccountId, Movements, stakes, Transactions, users }) => {

    const { t } = useTranslation();

    const [accountMovements] = useState(Movements.filter(movement => movement.accountId === Account.id))
    const [clientFunds] = useState(stakes.filter(stake => stake.clientId === Client.id))
    const [accountTransactions] = useState(Transactions.filter(transaction => transaction.clientId === Client.id))

    useEffect(() => {
        setSelectedAccountId(Client.id)
        return () => {
            setSelectedAccountId(-1)
        }
    }, [Client.id, setSelectedAccountId])

    return (
        <Switch>
            <Route exact path={`/DashBoard/accountsSupervision/${Client.id}`}>
                <div className="AccountData h-100 mb-5 growOpacity">
                    <div className="header">
                        <h1 className="title">
                            {t("Data from client")}&nbsp;#{Client.id},&nbsp;{t("Alias")}:&nbsp;{Client.alias}
                        </h1>
                        <Link className="button icon" to={`/DashBoard/accountsSupervision/`}>
                            <FontAwesomeIcon className="button icon" onClick={() => setSelectedAccountId(false)} icon={faChevronCircleLeft} />
                        </Link>

                    </div>
                    <Accordion flush>
                        <AccountGeneralData Account={Account} Client={Client} />
                        <ClientUsersAccordion client={Client} />
                        {clientFunds.length > 0 ? <FundsPossesion stakes={clientFunds} /> : null}
                        {Movements.length > 0 ? <AccountMovements Movements={accountMovements} /> : null}
                        {
                            clientFunds.length > 0 && accountTransactions.length > 0 ?
                                <TransactionsByFund transactions={accountTransactions} stakes={clientFunds} /> :
                                null
                        }
                    </Accordion>
                </div>
            </Route>

            <Route exact path={`/DashBoard/accountsSupervision/${Client.id}/connectUserToClient`}>
                <ConnectForm client={Client} users={users} />
            </Route>

            <Route path="*">
                <h1>{t("Not found")}</h1>
            </Route>
        </Switch>

    )
}

export default SelectedAccountData