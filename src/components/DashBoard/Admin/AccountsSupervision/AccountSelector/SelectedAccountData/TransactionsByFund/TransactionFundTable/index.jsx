import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Table } from 'react-bootstrap'
import TransactionRow from './TransactionRow'
import TableControls from '../../../../../../TableControls';

const TransactionFundTable = ({ transactions }) => {
    const { t } = useTranslation();
    const [InScreenTransactions, setInScreenTransactions] = useState(5)

    useEffect(() => {
        setInScreenTransactions(5)
    }, [transactions])
    return (
        <>
            <Table id="tabletransactions" striped bordered hover className="mt-3 mb-auto m-0" >
                <thead >
                    <tr>
                        <th className="tableHeader">{t("Date")}</th>
                        <th className="d-none d-sm-table-cell">{t("Concept")}</th>
                        <th className="tableDescription d-none d-sm-table-cell">{t("Share value")}</th>
                        <th className="tableAmount">{t("Amount")}</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction, key) => {
                        return key < InScreenTransactions ?
                            <TransactionRow key={key} transaction={transaction} /> :
                            null
                    })}
                </tbody>
            </Table>
            <TableControls InScreen={InScreenTransactions} content={transactions}
                setInScreen={setInScreenTransactions} />
        </>
    )
}

export default TransactionFundTable