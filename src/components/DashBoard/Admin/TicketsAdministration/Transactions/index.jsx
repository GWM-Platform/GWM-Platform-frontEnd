import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Message from '../Message'
import TransactionsTable from './TransactionsTable'
import MovementsTable from './MovementsTable'

const Transactionslist = ({ state, messageVariants }) => {
    const [Transactions, setTransactions] = useState({
        fetching: true,
        fetched: false,
        valid: false,
        values: []
    })

    const [Movements, setMovements] = useState({
        fetching: true,
        fetched: false,
        valid: false,
        values: []
    })

    const transactionsInState = async () => {
        const token = sessionStorage.getItem('access_token')
        var url = `${process.env.REACT_APP_APIURL}/transactions/byState/${state}`;
        setTransactions({
            ...Transactions,
            ...{
                fetching: true,
                fetched: false,
                valid: false,
                values: []
            }
        })
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
            setTransactions({
                ...Transactions,
                ...{
                    fetching: false,
                    fetched: true,
                    valid: true,
                    values: data
                }
            })
        } else {
            setTransactions({
                ...Transactions,
                ...{
                    fetching: false,
                    fetched: true,
                    valid: false,
                }
            })
            switch (response.status) {
                case 500:
                    break;
                default:
                    console.error(response.status)
            }
        }
    }

    const movementsInState = async () => {
        const token = sessionStorage.getItem('access_token')
        var url = `${process.env.REACT_APP_APIURL}/movements/bystate/${state}`;
        setMovements({
            ...Movements,
            ...{
                fetching: true,
                fetched: false,
                valid: false,
                values: []
            }
        })
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
            setMovements({
                ...Movements,
                ...{
                    fetching: false,
                    fetched: true,
                    valid: true,
                    values: data
                }
            })
        } else {
            setMovements({
                ...Movements,
                ...{
                    fetching: false,
                    fetched: true,
                    valid: false,
                }
            })
            switch (response.status) {
                case 500:
                    break;
                default:
                    console.error(response.status)
            }
        }
    }

    useEffect(() => {
        transactionsInState()
        movementsInState()
        // eslint-disable-next-line
    }, [state])

    const reloadData = () => {
        transactionsInState()
        movementsInState()
    }

    return (
        Transactions.fetching || Movements.fetching ?
            <Message selected={0} messageVariants={messageVariants} />
            :
            <>
                {!Transactions.valid ?
                    <Message selected={3} messageVariants={messageVariants} />
                    :
                    Transactions.values.length === 0 ?
                        <Message selected={4} messageVariants={messageVariants} />
                        :
                        <TransactionsTable reloadData={reloadData} state={state} transactions={Transactions.values} />
                }
                {
                    !Movements.valid ?
                        <Message selected={5} messageVariants={messageVariants} />
                        :
                        Movements.values.length === 0 ?
                            <Message selected={6} messageVariants={messageVariants} />
                            :
                            <MovementsTable reloadData={reloadData} state={state} movements={Movements.values} />
                }
            </>


    )
}
export default Transactionslist


