import React, { useState, useEffect } from 'react'

import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import TableLastMovements from './TableLastMovements';
//import MovementsPagination from './MovementsPagination';
import NoMovements from './NoMovements';
import Loading from './Loading';


const MovementsTab = ({ Fund, NavInfoToggled }) => {
    // eslint-disable-next-line 

    const [Movements, setMovements] = useState([])
    const [page, setPage] = useState(0)
    const [FetchingMovements, setFetchingMovements] = useState(false);

    const token = sessionStorage.getItem('access_token')

    const getMovements = async () => {
        var url = `${process.env.REACT_APP_APIURL}/Accounts/${Fund.id}/movements`;
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
            setMovements(data.sort(function (a, b) { return (a.createdAt > b.createdAt) ? -1 : ((a.createdAt < b.createdAt) ? 1 : 0); }))
        } else {
            switch (response.status) {
                default:
                    console.error("Error ", response.status, " account movements")
            }
        }
    }

    useEffect(() => {

        setFetchingMovements(true)
        getMovements();
        setFetchingMovements(false)

        return () => {
        }
        // eslint-disable-next-line
    }, [Fund])
    
    return (
        <>
            {/*Movements */}
            <div className="p-0 mb-2">
                <div className="d-flex align-items-start justify-content-center flex-column MovementsTableContainer">
                    {
                        FetchingMovements ?
                            <Loading NavInfoToggled={NavInfoToggled} />
                            :
                            Movements.length > 0 ?
                                <TableLastMovements
                                    NavInfoToggled={NavInfoToggled}
                                    content={Movements}
                                    page={page}
                                    setPage={setPage} />
                                :
                                <NoMovements />
                    }
                    {/*
                        <MovementsPagination
                        MovementsCount={100}
                        IsMobile={IsMobile}
                        movsShown={movsShown}
                        page={page}
                        setPage={setPage}
                        />
                    */}
                </div>
            </div>
        </>
    )
}
export default MovementsTab

