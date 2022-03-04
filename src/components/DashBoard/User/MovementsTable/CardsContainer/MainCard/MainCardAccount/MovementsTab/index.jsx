import React, { useState, useEffect, useContext } from 'react'

import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import TableLastMovements from './TableLastMovements';
//import MovementsPagination from './MovementsPagination';
import NoMovements from './NoMovements';
import Loading from './Loading';
import { useHistory } from 'react-router-dom';
import { dashboardContext } from '../../../../../../../../context/dashboardContext';
import PaginationController from '../../../../../../PaginationController'
import FilterOptions from '../../../../../../FilterOptions'

const MovementsTab = ({ Fund, NavInfoToggled }) => {
    const { token, ClientSelected } = useContext(dashboardContext);
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

        <div className="p-0 mb-2">
            <div className="d-flex align-items-start justify-content-center flex-column MovementsTableContainer">
                <div className={NavInfoToggled ? "movementsTable-navInfoToggled growAnimation" : "movementsTable growAnimation"}>
                <FilterOptions Fund={Fund} setPagination={setPagination} movsPerPage={Pagination.take} total={Movements.total} />
                    {
                        FetchingMovements ?
                            <Loading NavInfoToggled={NavInfoToggled} />
                            :
                            Movements.total > 0 ?
                                <TableLastMovements
                                    NavInfoToggled={NavInfoToggled}
                                    content={Movements.movements} />
                                :
                                <NoMovements NavInfoToggled={NavInfoToggled} />
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

