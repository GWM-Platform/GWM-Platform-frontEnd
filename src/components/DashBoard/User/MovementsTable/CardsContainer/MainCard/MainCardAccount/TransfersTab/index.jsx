import React, { useState, useEffect, useContext } from 'react'
import { useHistory } from 'react-router-dom';
import { DashBoardContext } from 'context/DashBoardContext';

import TableLastTransfers from './TableLastTransfers';
import NoMovements from 'components/DashBoard/GeneralUse/NoMovements';
import Loading from 'components/DashBoard/GeneralUse/Loading';
import PaginationController from 'components/DashBoard/GeneralUse/PaginationController'
import FilterOptions from 'components/DashBoard/GeneralUse/FilterOptions'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../MovementsTab/index.css'

const TransfersTab = ({ Fund, SearchById, setSearchById, resetSearchById, handleTransferSearchChange }) => {
    const { token, ClientSelected } = useContext(DashBoardContext);
    const history = useHistory();

    const [Transfers, setTransfers] = useState({ Transfers: 0, total: 0 })

    const [FetchingTransfers, setFetchingTransfers] = useState(true);

    const [Pagination, setPagination] = useState({
        skip: 0,//Offset (in quantity of Transfers)
        take: 5,//Transfers per page
        state: null
    })

    const toLogin = () => {
        sessionStorage.clear(); history.push(`/login`);
    }

    const getTransfers = async () => {
        var url = `${process.env.REACT_APP_APIURL}/transfers/?` + new URLSearchParams(
            Object.fromEntries(Object.entries(
                {
                    client: ClientSelected.id,
                    filterAccount: Fund.id,
                    take: Pagination.take,
                    skip: Pagination.skip,
                    filterState: Pagination.state
                }
            ).filter(([_, v]) => v != null))
        );
        setFetchingTransfers(true)
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
            setTransfers(data)
            setFetchingTransfers(false)
        } else {
            switch (response.status) {
                default:
                    console.error("Error ", response.status, " account Transfers")
                    toLogin()
            }
        }
    }

    const getTransferById = async (id) => {
        setSearchById((prevState) => ({ ...prevState, search: true }))

        var url = `${process.env.REACT_APP_APIURL}/Transfers/${id}?` + new URLSearchParams(
            {
                client: ClientSelected.id,
            })

        setFetchingTransfers(true)
        setTransfers([])
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
            setTransfers(prevState => ({ ...prevState, ...{ transfers: [data], total: 1 } }))
            setFetchingTransfers(false)
        } else {
            setTransfers(prevState => ({ ...prevState, ...{ transfers: [], total: 0 } }))
            setFetchingTransfers(false)
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
        SearchById.search ? getTransferById(SearchById.value) : getTransfers();
        return () => {
        }
        // eslint-disable-next-line
    }, [Fund, Pagination, SearchById.search])

    const ticketSearchProps = {
        fetching: FetchingTransfers,
        keyWord: "transfer",
        SearchText: SearchById.value,
        handleSearchChange: handleTransferSearchChange,
        cancelSearch: resetSearchById,
        Search: () => getTransferById(SearchById.value)
    }

    return (

        <div className="p-0 h-100">
            <div className="d-flex align-items-start justify-content-center flex-column MovementsTableContainer">
                <div className={`movementsTable growAnimation`}>
                    <FilterOptions keyword={"transactions"} ticketSearch ticketSearchProps={ticketSearchProps} disabled={SearchById.search} Fund={Fund} setPagination={setPagination} movsPerPage={Pagination.take} total={Transfers.total} />
                    {
                        FetchingTransfers ?
                            <Loading movements={Pagination.take} />
                            :
                            Transfers.total > 0 ?
                                <TableLastTransfers
                                    movements={Pagination.take < Transfers.total ? Pagination.take : Transfers.total}
                                    content={Transfers.transfers} 
                                    getTransfers={getTransfers}/>
                                :
                                <NoMovements movements={Pagination.take} />
                    }
                    {
                        Transfers.total > 0 ?
                            <PaginationController PaginationData={Pagination} setPaginationData={setPagination} total={Transfers.total} />
                            :
                            null
                    }
                </div>
            </div>
        </div>
    )
}
export default TransfersTab

