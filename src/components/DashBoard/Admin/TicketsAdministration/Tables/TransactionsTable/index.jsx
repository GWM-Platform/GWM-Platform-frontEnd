import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import TransactionRow from './TransactionRow'
import TableControls from '../../TableControls'

const TransactionsTable = ({ UsersInfo, FundInfo, transactions, state, reloadData }) => {
    const { t } = useTranslation();
    const [InScreenTransactions, setInScreenTransactions] = useState(5)

    useEffect(() => {
        setInScreenTransactions(5)
    }, [transactions])
    

    const showMoreTransactions = (add=5) => {
        setInScreenTransactions((prevState) => (prevState + add))
    }

    const showLessTransactions = (subtract=5) => {
        setInScreenTransactions((prevState) => (prevState - subtract))
    }

    return (
        <Col xs="12">
            <h1 className="title">{t("Purchase and sale tickets")}:</h1>
            <div style={{ overflowX: "auto" }}>
                <Table className="TicketsTable table table-striped table-bordered table-hover growAnimation mb-0">
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
                                return key < InScreenTransactions ?
                                    <TransactionRow UsersInfo={UsersInfo} FundInfo={FundInfo}
                                        reloadData={reloadData} key={key} Transaction={transaction} state={state} />
                                    :
                                    null
                            })
                        }
                    </tbody>
                </Table>
                <TableControls InScreen={InScreenTransactions} content={transactions} state={state}
                            showMore={showMoreTransactions} showLess={showLessTransactions} />
            </div>
        </Col>
    )
}
export default TransactionsTable


