import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col } from 'react-bootstrap'

import FixedDepositRow from './FixedDepositRow'
import { useEffect } from 'react';
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';
import { useState } from 'react';
import { useCallback } from 'react';
import axios from 'axios';

const FixedDepositsTable = ({ AccountInfo, UsersInfo, movements, state, reloadData, take }) => {
    const { toLogin } = useContext(DashBoardContext)

    const [users, setUsers] = useState({ fetching: true, fetched: false, valid: false, content: [] })

    const getUsers = useCallback((signal) => {
        setUsers((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.get(`/users`, {
            params: { all: true },
            signal: signal,
        }).then(function (response) {
            setUsers((prevState) => (
                {
                    ...prevState,
                    fetching: false,
                    fetched: true,
                    valid: true,
                    content: response.data,
                }))
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setUsers((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
            }
        });
    }, [toLogin, setUsers]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        getUsers(signal)

        return () => {
            controller.abort();
        };
    }, [getUsers])

    return (

        <Col xs="12" className="mt-2">
            <div style={{ overflowX: "overlay", minHeight: `calc( .5rem + ( 0.5rem * 2 + 25.5px ) * ${take + 1} )`, scrollSnapType: "both mandatory" }}>
                {
                    movements.map((movement, key) =>
                        <FixedDepositRow AccountInfo={AccountInfo} UsersInfo={UsersInfo}
                            reloadData={reloadData} key={key} Movement={movement} state={state} users={users.content} />
                    )
                }
            </div>
        </Col>
    )
}
export default FixedDepositsTable


