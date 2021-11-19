import React, { useState, useEffect } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import TableLastMovements from './TableLastMovements';
//import MovementsPagination from './MovementsPagination';
import NoMovements from './NoMovements';
import Loading from './Loading';


const MovementsTab = ({ Fund,NavInfoToggled,setPerformance }) => {
    // eslint-disable-next-line 

    const [Movements, setMovements] = useState([])
    const [page, setPage] = useState(0)
    const [FetchingMovements, setFetchingMovements] = useState(false);

    const token = sessionStorage.getItem('access_token')

    const getMovements = async () => {
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
        } else {
            switch (response.status) {
                case 500:
                    console.error("Error. Vefique los datos ingresados")
                    break;
                default:
                    console.error(response.status)
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

