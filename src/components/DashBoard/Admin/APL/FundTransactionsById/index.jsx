import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import PaginationController from 'components/DashBoard/GeneralUse/PaginationController';
import TransactionsTable from './TransactionsTable';
import FilterOptions from 'components/DashBoard/GeneralUse/FilterOptions';
import NoMovements from 'components/DashBoard/GeneralUse/NoMovements';
import Loading from 'components/DashBoard/GeneralUse/Loading';
import { useTranslation } from 'react-i18next';
import { customFetch } from 'utils/customFetch';

const TransactionFundTable = ({ Id, UsersInfo, AccountInfo }) => {

    const { t } = useTranslation()

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
                        filterFund: Id,
                        take: Pagination.take,
                        skip: Pagination.skip,
                        filterState: Pagination.state
                    }
                ).filter(([_, v]) => v != null))
            );
            const response = await customFetch(url, {
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
            <div className='transaction-table box-shadow mb-2'>
                <h1 className="m-0 title pe-2">{t("Movements")}</h1>
                <FilterOptions keyword={"transactions"} Fund={Id} setPagination={setPagination} movsPerPage={Pagination.take} total={Transactions.content.total} />
                {
                    Transactions.fetching || UsersInfo.fetching ?
                        <Loading movements={Pagination.take} />
                        :
                        Transactions.content.total > 0 ?
                            <TransactionsTable
                                UsersInfo={UsersInfo} movements={Pagination.take < Transactions.content.total ? Pagination.take : Transactions.content.total} Transactions={Transactions} />
                            :
                            <NoMovements movements={Pagination.take} />
                }
                <PaginationController PaginationData={Pagination} setPaginationData={setPagination} total={Transactions.content.total} />
            </div>
    )
}

export default TransactionFundTable