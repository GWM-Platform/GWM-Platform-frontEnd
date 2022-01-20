import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import TransactionRow from './TransactionRow'

const TransactionsTable = ({ transactions, state, reloadData }) => {
    const { t } = useTranslation();

    return (
        <Col xs="12">
            <h1 className="title">{t("Purchase and sale tickets")}:</h1>
            <div style={{ overflowX: "auto" }}>
                <Table className="TicketsTable table table-striped table-bordered table-hover growAnimation">
                    <thead className="tableHeader solid-bg">
                        <tr>
                            <th >{t("#id")}</th>
                            <th >{t("Client")}</th>
                            <th >{t("Concept")}</th>
                            <th >{t("Fund name")}</th>
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
                                return <TransactionRow reloadData={reloadData} key={key} Transaction={transaction} state={state} />
                            })
                        }
                    </tbody>
                </Table>
            </div>
        </Col>
    )
}
export default TransactionsTable


