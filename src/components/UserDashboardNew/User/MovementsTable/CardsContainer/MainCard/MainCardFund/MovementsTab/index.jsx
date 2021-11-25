import React, { useState, useEffect } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import {  useHistory } from 'react-router-dom';
import TableLastMovements from './TableLastMovements';
//import MovementsPagination from './MovementsPagination';
import NoMovements from './NoMovements';
import Loading from './Loading';


const MovementsTab = ({ Fund,NavInfoToggled,setPerformance }) => {
    const history = useHistory();

    const [Movements, setMovements] = useState([])
    const [page, setPage] = useState(0)
    const [FetchingMovements, setFetchingMovements] = useState(true);

    const token = sessionStorage.getItem('access_token')

    const toLogin = () => {
        sessionStorage.clear(); history.push(`/login`);
    }

    const getMovements = async () => {
        setFetchingMovements(true)
        var url = `${process.env.REACT_APP_APIURL}/funds/${Fund.fundId}/transactions`;
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
                    console.error(response.status)
                    toLogin()

            }
        }
    }


    useEffect(() => {
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
                            <Loading NavInfoToggled={NavInfoToggled}/>
                            :
                            Movements.length > 0 ?
                                <TableLastMovements
                                setPerformance={setPerformance}
                                    Fund={Fund}
                                    NavInfoToggled={NavInfoToggled}
                                    MovementsCount={100}
                                    content={Movements}
                                    /*movsShown={movsShown}*/
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
