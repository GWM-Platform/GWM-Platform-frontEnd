import React, { useCallback, useState, useEffect } from 'react'

import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import TableLastMovements from './TableLastMovements';
//import MovementsPagination from './MovementsPagination';
import NoMovements from './NoMovements';
import Loading from './Loading';


const MovementsTab = ({ Fund, SwitchState, NavInfoToggled }) => {
    // eslint-disable-next-line 

    const [Movements, setMovements] = useState([])
    const [page, setPage] = useState(0)
    const [FetchingMovements, setFetchingMovements] = useState(false);

    const token = sessionStorage.getItem('access_token')
    const getMovementsWithApi = async () => {
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
            console.log(data)
            setMovements(data.sort(function (a, b) { return (a.createdAt > b.createdAt) ? -1 : ((a.createdAt < b.createdAt) ? 1 : 0); }))
        } else {
            switch (response.status) {
                default:
                    console.error("Error ", response.status, " account movements")
            }
            setFetchingMovements(false)
        }
    }

    const getMovements = useCallback(
        () => {
            setFetchingMovements(true)
            if (SwitchState) {
                getMovementsWithApi()
            } else {
                setMovements(
                    [
                        {
                            "id": 20,
                            "accountId": 1,
                            "amount": 10,
                            "createdAt": "2021-11-18T01:00:21.698Z"
                        },
                        {
                            "id": 19,
                            "accountId": 1,
                            "amount": 100,
                            "createdAt": "2021-11-18T00:57:06.065Z"
                        },
                        {
                            "id": 18,
                            "accountId": 1,
                            "amount": 5000,
                            "createdAt": "2021-11-18T00:31:07.427Z"
                        },
                        {
                            "id": 17,
                            "accountId": 1,
                            "amount": -3591,
                            "createdAt": "2021-11-18T00:29:09.752Z"
                        },
                        {
                            "id": 16,
                            "accountId": 1,
                            "amount": 500,
                            "createdAt": "2021-11-18T00:17:09.522Z"
                        },
                        {
                            "id": 15,
                            "accountId": 1,
                            "amount": 329,
                            "createdAt": "2021-11-18T00:07:59.001Z"
                        },
                        {
                            "id": 14,
                            "accountId": 1,
                            "amount": 500,
                            "createdAt": "2021-11-18T00:07:23.642Z"
                        },
                        {
                            "id": 13,
                            "accountId": 1,
                            "amount": 1500,
                            "createdAt": "2021-11-18T00:05:16.696Z"
                        }
                    ]
                )
            }
            setFetchingMovements(false)
            // eslint-disable-next-line
        }, [SwitchState, Fund]);

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
                            <Loading />
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

