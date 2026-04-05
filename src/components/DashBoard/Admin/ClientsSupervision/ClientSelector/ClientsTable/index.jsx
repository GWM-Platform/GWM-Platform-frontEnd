import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { Table } from 'react-bootstrap'
import ClientRow from './ClientRow'
import './index.css'
import PaginationController from 'components/DashBoard/GeneralUse/PaginationController';
import NoAccounts from '../NoAccounts'

const ClientsTable = ({ FilteredClients }) => {

    const { t } = useTranslation();

    const [Pagination, setPagination] = useState({
        skip: 0,//Offset (in quantity of movements)
        take: 15,//Movements per page
        state: null
    })

    const startIndex = Pagination.skip;
    const endIndex = Pagination.skip + Pagination.take;
    const paginatedClients = FilteredClients.slice(startIndex, endIndex);

    const hasResults = FilteredClients.length > 0

    return (
        <>
            <div className={hasResults ? "d-block" : "d-none"} style={{ overflowX: "auto" }}>
                <Table className="ClientsTable" striped bordered hover>
                    <thead className="verticalTop tableHeader solid-bg">
                        <tr>
                            <th className="Alias">{t("Alias")}</th>
                            <th >{t("Status")}</th>
                            <th className="Balance">{t("Total balance")}</th>
                            <th ></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            paginatedClients.map((Client, key) =>
                                <ClientRow show={FilteredClients.filter(client => client.id === Client.id).length > 0} key={key} Client={Client} />
                            )
                        }
                    </tbody>
                </Table>
                <PaginationController PaginationData={Pagination} setPaginationData={setPagination} total={FilteredClients.length} />
            </div>
            {!hasResults && <NoAccounts />}
        </>
    )
}
export default ClientsTable