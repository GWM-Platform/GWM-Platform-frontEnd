import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { Table } from 'react-bootstrap'
import AccountRow from './AccountRow'
import './index.css'
const AccountsTable = ({ FilteredAccounts, Clients,setSelectedAccountId }) => {

    const { t } = useTranslation();

    const getClientByClientId = (searchedId) => {
        let index = Clients.findIndex((client) => client.id === searchedId)
        return index === -1 ? false : Clients[index]
    }

    return (
        <div style={{ overflowX: "auto" }}>
            <Table className="AccountsTable" striped bordered hover>
                <thead className="verticalTop tableHeader solid-bg">
                    <tr>
                        <th className="id">{t("Client")} #</th>
                        <th className="Alias">{t("Alias")}</th>
                        <th className="Balance">{t("Balance")}</th>
                        <th ></th>
                    </tr>
                </thead>
                <tbody>
                    {FilteredAccounts.map((Account, key) => 
                         <AccountRow setSelectedAccountId={setSelectedAccountId} key={key }Client={getClientByClientId(Account.clientId)} Account={Account} />
                    )}
                </tbody>
            </Table>
        </div>
    )
}
export default AccountsTable