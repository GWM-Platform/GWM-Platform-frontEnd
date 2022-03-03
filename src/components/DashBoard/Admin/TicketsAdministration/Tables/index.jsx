import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Message from '../Message'
import TransactionsTable from './TransactionsTable'
import MovementsTable from './MovementsTable'


const Transactionslist = ({ state, messageVariants }) => {
    const token = sessionStorage.getItem('access_token')

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

    const [UsersInfo, SetUsersInfo] = useState({ fetching: true, value: {} })
    const [FundInfo, SetFundInfo] = useState({ fetching: true, value: {} })
    const [AccountInfo, SetAccountInfo] = useState({ fetching: true, value: {} })

    const getAccounts = async () => {
        var url = `${process.env.REACT_APP_APIURL}/accounts/?all=true`

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
            SetAccountInfo({ ...AccountInfo, ...{ fetching: false, value: data } })
        } else {
            switch (response.status) {
                default:
                    console.log(response)
            }
        }
    }

    const getUsersInfo = async () => {
        var url = `${process.env.REACT_APP_APIURL}/clients/?` + new URLSearchParams({
            all: true,
        });

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
            SetUsersInfo({ ...UsersInfo, ...{ fetching: false, value: data } })
        } else {
            switch (response.status) {
                default:
                    console.log(response)
            }
        }
    }

    const getFundsInfo = async () => {
        var url = `${process.env.REACT_APP_APIURL}/funds`;
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
            SetFundInfo({ ...FundInfo, ...{ fetching: false, value: data } })
        } else {
            switch (response.status) {
                default:
                    console.log(response)
            }
        }
    }

    const transactionsInState = async () => {
        var url = `${process.env.REACT_APP_APIURL}/transactions/?` + new URLSearchParams({
            filterState: state,
        });
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
                    values: data.transactions
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
        var url = `${process.env.REACT_APP_APIURL}/movements/?` + new URLSearchParams({
            filterState: state,
        });
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
                    values: data.movements
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
        getUsersInfo()
        getFundsInfo()
        getAccounts()
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
                        <TransactionsTable UsersInfo={UsersInfo} FundInfo={FundInfo}
                            reloadData={reloadData} state={state} transactions={Transactions.values} />
                }
                {
                    !Movements.valid ?
                        <Message selected={5} messageVariants={messageVariants} />
                        :
                        Movements.values.length === 0 ?
                            <Message selected={6} messageVariants={messageVariants} />
                            :
                            <MovementsTable AccountInfo={AccountInfo} UsersInfo={UsersInfo} 
                            reloadData={reloadData} state={state} movements={Movements.values} />
                }
            </>


    )
}
export default Transactionslist


