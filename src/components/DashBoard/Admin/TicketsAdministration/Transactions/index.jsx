import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Message from '../Message'
import TransactionsTable from './TransactionsTable'

const Transactionslist = ({ state, messageVariants }) => {
    const [Transactions, setTransactions] = useState({
        fetching: true,
        fetched: false,
        valid: false,
        values: []
    })

    const transactionsInState = async () => {
        const token = sessionStorage.getItem('access_token')
        var url = `${process.env.REACT_APP_APIURL}/transactions/states/${state}/transactions`;
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

    useEffect(() => {
        transactionsInState()
        // eslint-disable-next-line
    }, [state])

    return (
        Transactions.fetching ?
            <Message selected={0} messageVariants={messageVariants} />
            :
            !Transactions.valid ?
                <Message selected={3} messageVariants={messageVariants} />
                :
                Transactions.values.length === 0 ?
                    <Message selected={4} messageVariants={messageVariants} />
                    :
                    <TransactionsTable reloadTransactions={transactionsInState} state={state} transactions={Transactions.values} />
    )
}
export default Transactionslist


