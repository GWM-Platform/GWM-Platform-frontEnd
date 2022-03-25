import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import TransactionRow from './TransactionRow'

const TransactionsTable = ({ UsersInfo, FundInfo, transactions, state, reloadData, take }) => {
    const { t } = useTranslation();

    const anyWithActions = () => Object.values(transactions).some((field) => field.stateId === 1)

    return (
        <Col xs="12">
            <div style={{ overflowX: "auto", minHeight: `calc( .5rem + ( 0.5rem * 2 + 25.5px ) * ${take + 1} )` }}>
                <Table className="TicketsTable table table-striped table-bordered table-hover growAnimation mb-0 mt-2">
                    <thead className="tableHeader solid-bg">
                        <tr>
                            <th >{t("#id")}</th>
                            <th >{t("Client")}</th>
                            <th >{t("Concept")}</th>
                            <th >{t("Fund name")}</th>
                            <th >{t("FeeParts")}</th>
                            <th >{t("FeePart Price")}</th>
                            <th >{t("Created at")}</th>
                            {
                                anyWithActions() ? <th >{t("Action")}</th> : null
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            transactions.map((transaction, key) =>
                                <TransactionRow UsersInfo={UsersInfo} FundInfo={FundInfo}
                                    reloadData={reloadData} key={key} Transaction={transaction} state={state} />
                            )
                        }
                    </tbody>
                </Table>

            </div>
        </Col>
    )
}
export default TransactionsTable


