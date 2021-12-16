import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import TransactionRow from './TransactionRow'
const TransactionsTable = ({ transactions, state,reloadTransactions }) => {
    const { t } = useTranslation();

    return (
        <Col xs="12">
            <Table className="TicketsTable table table-striped table-bordered table-hover">
                <thead className="tableHeader solid-bg">
                    <tr>
                        <th >{t("#id")}</th>
                        <th >{t("Fund Id")}</th>
                        <th >{t("Shares")}</th>
                        <th >{t("Share Price")}</th>
                        <th >{t("Created at")}</th>
                        {
                            state === 1 || state === "1" ? <th >{t("Action")}</th> : null
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        transactions.map((transaction, key) => {
                            return <TransactionRow reloadTransactions={reloadTransactions} key={key} Transaction={transaction} state={state} />
                        })
                    }
                </tbody>
            </Table>
        </Col>
    )
}
export default TransactionsTable


