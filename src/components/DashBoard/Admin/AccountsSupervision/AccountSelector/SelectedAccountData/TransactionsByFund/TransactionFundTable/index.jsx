import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Table } from 'react-bootstrap'
import TransactionRow from './TransactionRow'

const TransactionFundTable = ({ transactions }) => {
    const { t } = useTranslation();

    return (
        <Table id="tableMovements" striped bordered hover className="mt-3 mb-auto m-0" >
            <thead >
                <tr>
                    <th className="tableHeader">{t("Date")}</th>
                    <th className="d-none d-sm-table-cell">{t("Concept")}</th>
                    <th className="tableDescription d-none d-sm-table-cell">{t("Share value")}</th>
                    <th className="tableAmount">{t("Amount")}</th>
                </tr>
            </thead>
            <tbody>
                {transactions.map((transaction, key) => { ; return (<TransactionRow key={key} transaction={transaction} />) })}
            </tbody>
        </Table>
    )
}

export default TransactionFundTable