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

const MovementsTab = ({ Fund, NavInfoToggled }) => {
    const { token, ClientSelected } = useContext(DashBoardContext);
    const history = useHistory();

    const [Movements, setMovements] = useState({ movements: 0, total: 0 })

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
        var url = `${process.env.REACT_APP_APIURL}/movements/?` + new URLSearchParams(
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
        setFetchingMovements(true)
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
        if (token === null) toLogin()
        getMovements();
        return () => {
        }
        // eslint-disable-next-line
    }, [Fund, Pagination])

    return (

        <div className="p-0 h-100">
            <div className="d-flex align-items-start justify-content-center flex-column MovementsTableContainer">
                <div className={`movementsTable growAnimation`}>
                    <FilterOptions Fund={Fund} setPagination={setPagination} movsPerPage={Pagination.take} total={Movements.total} />
                    {
                        FetchingMovements ?
                            <Loading movements={Pagination.take} />
                            :
                            Movements.total > 0 ?
                                <TableLastMovements 
                                movements={Pagination.take}
                                    content={Movements.movements} />
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

