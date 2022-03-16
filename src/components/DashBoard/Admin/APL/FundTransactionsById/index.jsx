import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Table } from 'react-bootstrap'
import TransactionRow from './TransactionRow'
import PaginationController from 'components/DashBoard/PaginationController';

const TransactionFundTable = ({ Id }) => {
    const { t } = useTranslation();

    const [Transactions, setTransactions] = useState({
        fetching: true,
        fetched: false,
        content: {
            transactions: [],
            total: 0,//Total of movements with the filters applied}
        }
    })

    const [Pagination, setPagination] = useState({
        skip: 0,//Offset (in quantity of movements)
        take: 5,//Movements per page
        state: null
    })

    useEffect(() => {
        const getMovements = async () => {
            const token = sessionStorage.getItem('access_token')
            setTransactions(prevState => ({
                ...prevState, ...{
                    fetching: true, fetched: false
                }
            }))
            var url = `${process.env.REACT_APP_APIURL}/transactions/?` + new URLSearchParams(
                Object.fromEntries(Object.entries(
                    {
                        client: "all",
                        filterFund: Id,
                        take: Pagination.take,
                        skip: Pagination.skip,
                        filterState: Pagination.state
                    }
                ).filter(([_, v]) => v != null))
            );
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                const data = await response.json()
                setTransactions(prevState => ({ ...prevState, ...{ content: data, fetching: false, fetched: true } }))
            } else {
                switch (response.status) {
                    default:
                        console.error(response.status)
                }
            }
        }

        getMovements()
    }, [Id, Pagination])


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
                    {Transactions.content.transactions.map((transaction, key) =>
                        <TransactionRow key={key} transaction={transaction} />
                    )}
                </tbody>
            </Table>
            <PaginationController PaginationData={Pagination} setPaginationData={setPagination} total={Transactions.content.total} />
        </>
    )
}

export default TransactionFundTable