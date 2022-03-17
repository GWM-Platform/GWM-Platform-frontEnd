import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Table } from 'react-bootstrap'
import TransactionRow from './TransactionRow'

const TransactionsTable = ({ Transactions, movements }) => {
    const { t } = useTranslation();

    return (
        <div style={{ minHeight: `calc( ( 0.5rem * 2 + 25.5px ) * ${movements + 1} )` }}>
        <Table 
         id="tabletransactions" striped bordered hover className="mt-2 mb-auto m-0" >
            <thead >
                <tr>
                    <th className="tableHeader">{t("Date")}</th>
                    <th className="d-none d-sm-table-cell">{t("Concept")}</th>
                    <th className="d-none d-sm-table-cell">{t("State")}</th>
                    <th className="tableDescription d-none d-sm-table-cell">{t("Share value")}</th>
                    <th className="tableAmount">{t("Amount")}</th>
                </tr>
            </thead>
            <tbody>
                {Transactions.content.transactions.map((transaction, key) =>
                    <TransactionRow key={key} transaction={transaction} />
                )}
            </tbody>
        </Table>
        </div>
    )
}

export default TransactionsTable