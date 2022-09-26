import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { Table } from 'react-bootstrap'
import ClientRow from './ClientRow'
import './index.css'
const ClientsTable = ({ FilteredClients, Clients }) => {

    const { t } = useTranslation();

    return (
        <div style={{ overflowX: "auto" }}>
            <Table className="ClientsTable" striped bordered hover>
                <thead className="verticalTop tableHeader solid-bg">
                    <tr>
                        <th className="id">{t("Client")} #</th>
                        <th className="Alias">{t("Alias")}</th>
                        <th className="Balance">{t("Total balance")}</th>
                        <th ></th>
                    </tr>
                </thead>
                <tbody>
                    {Clients.map((Client, key) =>
                        <ClientRow show={FilteredClients.filter(client => client.id === Client.id).length > 0} key={key} Client={Client} />
                    )}
                </tbody>
            </Table>
        </div>
    )
}
export default ClientsTable