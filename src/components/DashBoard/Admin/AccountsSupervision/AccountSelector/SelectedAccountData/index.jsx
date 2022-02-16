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

const SelectedAccountData = ({ Account, Client, setSelectedAccountId, Movements, stakes, Transactions }) => {
    const { t } = useTranslation();

    const [accountMovements] = useState(Movements.filter(movement => movement.accountId === Account.id))
    const [clientFunds] = useState(stakes.filter(stake => stake.clientId === Client.id))
    const [accountTransactions] = useState(Transactions.filter(transaction => transaction.clientId === Client.id))

    return (
        <div className="AccountData h-100 mb-5">
            <div className="header">
                <h1 className="title">
                    {t("Data from Account with the id ")}{" \""}{Account.id}{"\" "}{t(" owned by ")}{Client.alias}
                </h1>
                <FontAwesomeIcon className="button icon" onClick={() => setSelectedAccountId(false)} icon={faChevronCircleLeft} />
            </div>
            <Accordion flush>
                <AccountGeneralData Account={Account} Client={Client} />
                {clientFunds.length > 0 ? <FundsPossesion stakes={clientFunds} /> : null}
                {Movements.length > 0 ? <AccountMovements Movements={accountMovements} /> : null}
                {
                    clientFunds.length > 0 && accountTransactions.length > 0 ?
                        <TransactionsByFund transactions={accountTransactions} stakes={clientFunds} /> :
                        null
                }
            </Accordion>
        </div>
    )
}

export default SelectedAccountData