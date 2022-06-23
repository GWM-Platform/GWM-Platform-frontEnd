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
            <div style={{ overflowX: "overlay", minHeight: `calc( .5rem + ( 0.5rem * 2 + 25.5px ) * ${take + 1} )`, scrollSnapType: "both mandatory" }}>
                <Table className="TicketsTable table table-striped table-bordered table-hover growAnimation mb-0 mt-2">
                    <thead className="tableHeader solid-bg">
                        <tr>
                            <th >{t("Client")}</th>
                            <th >{t("Concept")}</th>
                            <th >
                                <span className="d-inline d-md-none">{t("Fund")}</span>
                                <span className="d-none d-md-inline">{t("Fund name")}</span>
                            </th>
                            <th >{t("Shares")}</th>
                            <th >
                                <span className="d-inline d-md-none">{t("Price")}</span>
                                <span className="d-none d-md-inline">{t("Share Price")}</span>
                            </th>
                            <th >
                                <span className="d-inline d-md-none">{t("Date")}</span>
                                <span className="d-none d-md-inline">{t("Created at")}</span>
                            </th>
                            <th >{t("Ticket #")}</th>
                            {
                                anyWithActions() ? <th className='Actions' >{t("Action")}</th> : null
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


