import React, { useState, useEffect, useContext } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import { useHistory } from 'react-router-dom';
import { DashBoardContext } from 'context/DashBoardContext';
import TableLastMovements from './TableLastMovements';
import NoMovements from 'components/DashBoard/GeneralUse/NoMovements';
import Loading from 'components/DashBoard/GeneralUse/Loading';
import PaginationController from 'components/DashBoard/GeneralUse/PaginationController'
import FilterOptions from 'components/DashBoard/GeneralUse/FilterOptions'

const MovementsTab = ({ Fund, setPerformance, SearchById, setSearchById, resetSearchById, handleMovementSearchChange }) => {
    const history = useHistory();
    const { token, ClientSelected } = useContext(DashBoardContext)

    const [Movements, setMovements] = useState({
        transactions: 0,
        total: 0,//Total of movements with the filters applied
    })

    const [FetchingMovements, setFetchingMovements] = useState(true);

    const [Pagination, setPagination] = useState({
        skip: 0,//Offset (in quantity of movements)
        take: 5,//Movements per page
        state: null
    })

    const toLogin = () => {
        sessionStorage.clear(); history.push(`/login`);
    }

    const getMovements = async () => {
        setFetchingMovements(true)

        var url = `${process.env.REACT_APP_APIURL}/transactions/?` + new URLSearchParams(
            Object.fromEntries(Object.entries(
                {
                    client: ClientSelected.id,
                    filterFund: Fund.fund.id,
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
            setMovements(prevState => ({ ...prevState, ...data }))
            setFetchingMovements(false)
        } else {
            switch (response.status) {
                default:
                    console.error(response.status)
                    toLogin()

            }
        }
    }

    const getTransactionById = async (id) => {
        setSearchById((prevState) => ({ ...prevState, search: true }))

        var url = `${process.env.REACT_APP_APIURL}/transactions/${id}?` + new URLSearchParams(
            {
                filterFund: Fund.fund.id,
                client: ClientSelected.id,
            })

        setFetchingMovements(true)
        setMovements([])
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
            if (data.fundId === Fund.fund.id) {
                setMovements(prevState => ({ ...prevState, ...{ transactions: [data], total: 1 } }))
            } else {
                setMovements(prevState => ({ ...prevState, ...{ transactions: [], total: 0 } }))
            }
            setFetchingMovements(false)
        } else {
            setMovements(prevState => ({ ...prevState, ...{ transactions: [], total: 0 } }))
            setFetchingMovements(false)
            switch (response.status) {
                case 500:
                    break;
                default:
                    console.error(response.status)
            }
        }
    }

    useEffect(() => {
        setPagination((prevState) => ({
            ...prevState, ...{
                skip: 0,
                take: 5,
                state: null
            }
        }))
    }, [Fund])

    useEffect(() => {
        SearchById.search ? getTransactionById(SearchById.value) : getMovements();
        // eslint-disable-next-line
    }, [Fund, Pagination, SearchById.search])

    const ticketSearchProps = {
        fetching: FetchingMovements,
        keyWord: "transaction",
        SearchText: SearchById.value,
        handleSearchChange: handleMovementSearchChange,
        cancelSearch: resetSearchById,
        Search: () => getTransactionById(SearchById.value)
    }

    return (
        <div className="p-0 h-100">
            <div className="d-flex align-items-start justify-content-center flex-column MovementsTableContainer">
                <div className={`movementsTable growAnimation`}>
                    <FilterOptions keyword={"transactions"} ticketSearch ticketSearchProps={ticketSearchProps} disabled={SearchById.search} Fund={Fund} setPagination={setPagination} movsPerPage={Pagination.take} total={Movements.total} />
                    {
                        FetchingMovements ?
                            <Loading movements={Pagination.take}
                            />
                            :
                            Movements.total > 0 ?
                                <TableLastMovements
                                    content={Movements.transactions}
                                    movements={Pagination.take}
                                />
                                :
                                <NoMovements movements={Pagination.take} />
                    }
                    {
                        Movements.total > 0 ?
                            <PaginationController PaginationData={Pagination} setPaginationData={setPagination} total={Movements.total} />
                            :
                            null
                    }

                </div>

            </div>
        </div>
    )
}
export default MovementsTab

