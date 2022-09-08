import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap'
import TransactionRow from './TransactionRow'

const TransactionsTable = ({ UsersInfo, FundInfo, transactions, state, reloadData, take }) => {


    return (
        <Col xs="12" className="mt-2">
            <div style={{ overflowX: "overlay", minHeight: `calc( .5rem + ( 0.5rem * 2 + 25.5px ) * ${take + 1} )`, scrollSnapType: "both mandatory" }}>
                {
                    transactions.map((transaction, key) =>
                        <TransactionRow UsersInfo={UsersInfo} FundInfo={FundInfo}
                            reloadData={reloadData} key={key} Transaction={transaction} state={state} />
                    )
                }
            </div>
        </Col>
    )
}
export default TransactionsTable


