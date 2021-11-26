import React, { useState, useEffect } from 'react'

import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import TableLastMovements from './TableLastMovements';
//import MovementsPagination from './MovementsPagination';
import NoMovements from './NoMovements';
import Loading from './Loading';
import {  useHistory } from 'react-router-dom';


const MovementsTab = ({ Fund, NavInfoToggled }) => {
    const history = useHistory();

    const [Movements, setMovements] = useState([])
    const [page, setPage] = useState(0)
    const [FetchingMovements, setFetchingMovements] = useState(true);

    const token = sessionStorage.getItem('access_token')

    const toLogin = () => {
        sessionStorage.clear(); history.push(`/login`);
    }

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
        if (token === null) toLogin()
        getMovements();
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
                                <NoMovements NavInfoToggled={NavInfoToggled}/>
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

