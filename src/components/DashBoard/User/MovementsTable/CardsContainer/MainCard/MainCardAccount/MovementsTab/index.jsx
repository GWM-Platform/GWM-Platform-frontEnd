import React, { useState, useEffect, useContext } from 'react'

import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import TableLastMovements from './TableLastMovements';
//import MovementsPagination from './MovementsPagination';
import NoMovements from 'components/DashBoard/GeneralUse/NoMovements';
import Loading from 'components/DashBoard/GeneralUse/Loading';
import { useHistory } from 'react-router-dom';
import { DashBoardContext } from 'context/DashBoardContext';
import PaginationController from 'components/DashBoard/GeneralUse/PaginationController'
import FilterOptions from 'components/DashBoard/GeneralUse/FilterOptions'
import { customFetch } from 'utils/customFetch';

const MovementsTab = ({ Fund, SearchById, setSearchById, resetSearchById, handleMovementSearchChange, Movements, setMovements }) => {
    const { token, ClientSelected, AccountSelected } = useContext(DashBoardContext);
    const history = useHistory();

    const [FetchingMovements, setFetchingMovements] = useState(true);

    const [Pagination, setPagination] = useState({
        skip: 0,//Offset (in quantity of movements)
        take: 100,//Movements per page
        state: null,
        fromDate: "",
        toDate: "",
        filterMotives: []
    })

    const toLogin = () => {
        sessionStorage.clear(); history.push(`/login`);
    }

    const getMovements = async () => {
        var url = `${process.env.REACT_APP_APIURL}/movements/?` + new URLSearchParams(
            Object.fromEntries(Object.entries(
                {
                    accountId: AccountSelected.id,
                    client: ClientSelected.id,
                    filterAccount: Fund.id,
                    take: Pagination.take,
                    skip: Pagination.skip,
                    filterState: Pagination.state === 10 ? null : Pagination.state,
                    showDenied: Pagination.state === 10 ? true : null,
                    fromDate: Pagination.fromDate || null,
                    toDate: Pagination.toDate ? new Date(new Date(Pagination.toDate).setDate(new Date(Pagination.toDate).getDate() + 1)).toISOString() : null,
                    filterMotives: Pagination.filterMotives.length > 0 ? Pagination.filterMotives : null
                }
            ).filter(([_, v]) => v != null))
        );
        setFetchingMovements(true)
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
            setMovements(data)
            setFetchingMovements(false)
        } else {
            switch (response.status) {
                default:
                    console.error("Error ", response.status, " account movements")
                    toLogin()
            }
        }
    }

    const getMovementById = async (id) => {
        setSearchById((prevState) => ({ ...prevState, search: true }))

        var url = `${process.env.REACT_APP_APIURL}/movements/${id}?` + new URLSearchParams(
            {
                client: ClientSelected.id,
            })

        setFetchingMovements(true)
        setMovements([])
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
            setMovements(prevState => ({ ...prevState, ...{ movements: [data], total: 1 } }))
            setFetchingMovements(false)
        } else {
            setMovements(prevState => ({ ...prevState, ...{ movements: [], total: 0 } }))
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
                take: 100,
                state: null
            }
        }))
    }, [Fund])

    useEffect(() => {
        SearchById.search ? getMovementById(SearchById.value) : getMovements();
        return () => {
        }
        // eslint-disable-next-line
    }, [Fund, Pagination, SearchById.search])

    const ticketSearchProps = {
        fetching: FetchingMovements,
        keyWord: "movement",
        SearchText: SearchById.value,
        handleSearchChange: handleMovementSearchChange,
        cancelSearch: resetSearchById,
        Search: () => getMovementById(SearchById.value)
    }

    return (

        <div className="p-0 h-100">
            <div className="d-flex align-items-start justify-content-center flex-column MovementsTableContainer">
                <div className={`movementsTable growAnimation`}>
                    <FilterOptions filterMotives dateFilters keyword={"transactions"} ticketSearch ticketSearchProps={ticketSearchProps} disabled={SearchById.search} movements Fund={Fund} setPagination={setPagination} movsPerPage={Pagination.take} total={Movements.total} defaultMoves={100} />
                    {
                        FetchingMovements ?
                            <Loading movements={Pagination.take} />
                            :
                            Movements.total > 0 ?
                                <TableLastMovements
                                    movements={Pagination.take < Movements.total ? Pagination.take : Movements.total}
                                    content={Movements.movements}
                                    reloadData={getMovements}
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

