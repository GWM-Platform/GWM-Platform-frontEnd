import React, { useContext, useEffect, useState } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import TableLastMovements from './TableLastMovements';
import NoMovements from 'components/DashBoard/GeneralUse/NoMovements';
import Loading from 'components/DashBoard/GeneralUse/Loading';
import { DashBoardContext } from 'context/DashBoardContext';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import FilterOptions from 'components/DashBoard/GeneralUse/FilterOptions';
import PaginationController from 'components/DashBoard/GeneralUse/PaginationController';


const MovementsTab = () => {
    const history = useHistory();

    const { ClientSelected } = useContext(DashBoardContext)

    const [FixedDeposits, setFixedDeposits] = useState({ fetching: true, fetched: false, valid: false, content: { deposits: [], total: 0 } })

    const [Pagination, setPagination] = useState({
        skip: 0,//Offset (in quantity of movements)
        take: 100,//Movements per page
        state: null
    })

    const [SearchById, setSearchById] = useState({
        value: "",
        search: false
    })

    const resetSearchById = () => {
        setSearchById((prevState) => ({ ...prevState, ...{ value: "", search: false } }))
    }

    const handleMovementSearchChange = (event) => {
        setSearchById((prevState) => ({ ...prevState, value: event.target.value }))
    }

    const toLogin = () => {
        sessionStorage.clear(); history.push(`/login`);
    }

    const getFixedDeposits = () => {
        setFixedDeposits((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.get(`/fixed-deposits`, {
            params: {
                client: ClientSelected.id,
                take: Pagination.take,
                skip: Pagination.skip,
                filterState: Pagination.state //Pagination.state
            }
        }
        ).then(function (response) {
            if (response.status < 300 && response.status >= 200) {
                setFixedDeposits((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, content: response?.data || {} } }))
            } else {
                switch (response.status) {
                    case 401:
                        toLogin();
                        break;
                    default:
                        setFixedDeposits((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
                        break
                }
            }
        }).catch((err) => {
            if (err.message !== "canceled") {
                setFixedDeposits((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
            }
        });
    }

    const getFixedDepositsById = (id) => {
        setFixedDeposits((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.get(`/fixed-deposits/id`
        ).then(function (response) {
            if (response.status < 300 && response.status >= 200) {
                setFixedDeposits((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, content: { deposits: [...response?.data], total: 1 } } }))
            } else {
                switch (response.status) {
                    case 401:
                        toLogin();
                        break;
                    default:
                        setFixedDeposits((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, content: { deposits: [], total: 0 } } }))
                        break
                }
            }
        }).catch((err) => {
            if (err.message !== "canceled") {
                setFixedDeposits((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, content: { deposits: [], total: 0 } } }))
            }
        });
    }

    useEffect(() => {
        setPagination((prevState) => ({
            ...prevState, ...{
                skip: 0,
                take: 100,
                state: null
            }
        }))
    }, [])

    useEffect(() => {
        SearchById.search ? getFixedDepositsById(SearchById.value) : getFixedDeposits();
        // eslint-disable-next-line
    }, [Pagination, SearchById.search])

    const ticketSearchProps = {
        fetching: FixedDeposits.fetching,
        keyWord: "transaction",
        SearchText: SearchById.value,
        handleSearchChange: handleMovementSearchChange,
        cancelSearch: resetSearchById,
        Search: () => getFixedDepositsById(SearchById.value)
    }

    return (
        <div className="p-0 h-100">
            <div className="d-flex align-items-start justify-content-center flex-column MovementsTableContainer">
                <div className={`movementsTable growAnimation`}>
                    <FilterOptions keyword={"transactions"} ticketSearch ticketSearchProps={ticketSearchProps} disabled={SearchById.search} setPagination={setPagination} movsPerPage={Pagination.take} total={FixedDeposits.content.total} defaultMoves={100} />
                    {
                        FixedDeposits.fetching ?
                            <Loading movements="5"
                            />
                            :
                            FixedDeposits.content.total > 0 ?
                                <TableLastMovements
                                    content={FixedDeposits.content.deposits}
                                    movements=""
                                />
                                :
                                <NoMovements movements="5" />
                    }{
                        FixedDeposits?.content?.total > 0 ?
                            <PaginationController PaginationData={Pagination} setPaginationData={setPagination} total={FixedDeposits?.content?.total} />
                            :
                            null
                    }
                </div>

            </div>
        </div>
    )
}
export default MovementsTab

