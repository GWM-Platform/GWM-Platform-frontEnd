import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Message from '../Message'
import TransactionsTable from './TransactionsTable'
import MovementsTable from './MovementsTable'
import PaginationController from 'components/DashBoard/GeneralUse/PaginationController';
import Loading from 'components/DashBoard/GeneralUse/Loading';
import NoMovements from 'components/DashBoard/GeneralUse/NoMovements';
import TicketSearch from 'components/DashBoard/GeneralUse/TicketSearch'

import { useTranslation } from 'react-i18next';

const Transactionslist = ({ state, messageVariants }) => {

    const token = sessionStorage.getItem('access_token')

    function useQuery() {
        const { search } = useLocation();

        return React.useMemo(() => new URLSearchParams(search), [search]);
    }

    const desiredId = useQuery().get("id")
    const desiredType = useQuery().get("type")

    const [Transactions, setTransactions] = useState({
        fetching: true,
        fetched: false,
        valid: false,
        values: {
            movements: [],
            total: 0
        }
    })

    const [PaginationTransactions, setPaginationTransactions] = useState({
        skip: 0,//Offset (in quantity of movements)
        take: 5,//Movements per page
        state: null
    })

    const [searchTransactionById, setSearchTransactionById] = useState({
        value: desiredId && desiredType ? desiredType === "t" ? desiredId : "" : "",
        search: desiredId && desiredType ? desiredType === "t" ? true : false : false
    })

    const handleTransactionSearchChange = (event) => {
        setSearchTransactionById((prevState) => ({ ...prevState, value: event.target.value }))
    }

    const cancelTransactionSearch = () => {
        setSearchTransactionById((prevState) => ({ ...prevState, value: "", search: false }))
    }

    const transactionById = async (id) => {
        var url = `${process.env.REACT_APP_APIURL}/transactions/${id}`

        setSearchTransactionById((prevState) => ({ ...prevState, search: true }))

        setTransactions({
            ...Transactions,
            ...{
                fetching: true,
                fetched: false,
                valid: false,
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
                    values: { transactions: [data], total: 1 }
                }
            })
        } else {
            setTransactions({
                ...Transactions,
                ...{
                    fetching: false,
                    fetched: true,
                    valid: true,
                    values: { transactions: [], total: 0 }
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

    const [Movements, setMovements] = useState({
        fetching: true,
        fetched: false,
        valid: false,
        values: {
            movements: [],
            total: 0
        }
    })

    const [PaginationMovements, setPaginationMovements] = useState({
        skip: 0,//Offset (in quantity of movements)
        take: 5,//Movements per page
        state: null
    })

    const [searchMovementById, setSearchMovementById] = useState({
        value: desiredId && desiredType ? desiredType === "m" ? desiredId : "" : "",
        search: desiredId && desiredType ? desiredType === "m" ? true : false : false
    })

    const handleMovementSearchChange = (event) => {
        setSearchMovementById((prevState) => ({ ...prevState, value: event.target.value }))
    }

    const cancelMovementSearch = () => {
        setSearchMovementById((prevState) => ({ ...prevState, value: "", search: false }))
    }

    const movementById = async (id) => {
        var url = `${process.env.REACT_APP_APIURL}/movements/${id}`

        setSearchMovementById((prevState) => ({ ...prevState, search: true }))

        setMovements({
            ...Movements,
            ...{
                fetching: true,
                fetched: false,
                valid: false,
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
                    values: { movements: [data], total: 1 }
                }
            })
        } else {
            setMovements({
                ...Movements,
                ...{
                    fetching: false,
                    fetched: true,
                    valid: true,
                    values: { movements: [], total: 0 }
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

    const [UsersInfo, SetUsersInfo] = useState({ fetching: true, value: {} })
    const [FundInfo, SetFundInfo] = useState({ fetching: true, value: {} })
    const [AccountInfo, SetAccountInfo] = useState({ fetching: true, value: {} })

    const { t } = useTranslation()


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
            SetAccountInfo(prevState => ({ ...prevState, ...{ fetching: false, value: data } }))
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
            SetUsersInfo(prevState => ({ ...prevState, ...{ fetching: false, value: data } }))
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
            take: PaginationTransactions.take,
            skip: PaginationTransactions.skip,
        });
        setTransactions({
            ...Transactions,
            ...{
                fetching: true,
                fetched: false,
                valid: false,
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
        var url = `${process.env.REACT_APP_APIURL}/movements/?` + new URLSearchParams({
            filterState: state,
            take: PaginationMovements.take,
            skip: PaginationMovements.skip,
        });
        setMovements({
            ...Movements,
            ...{
                fetching: true,
                fetched: false,
                valid: false
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
        getUsersInfo()
        getFundsInfo()
        getAccounts()
        if (searchTransactionById.search) transactionById(searchTransactionById.value)
        if (searchMovementById.search) movementById(searchMovementById.value)
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        setPaginationMovements((prevState) => ({
            ...prevState, ...{
                skip: 0,//Offset (in quantity of movements)
                take: 5,//Movements per page
                state: null
            }
        }))
        setPaginationTransactions(
            (prevState) => ({
                ...prevState, ...{
                    skip: 0,//Offset (in quantity of movements)
                    take: 5,//Movements per page
                    state: null
                }
            })
        )
    }, [state])

    useEffect(() => {
        if (!searchMovementById.search) movementsInState()
        // eslint-disable-next-line
    }, [PaginationTransactions, state, searchMovementById.search])

    useEffect(() => {
        if (!searchTransactionById.search) transactionsInState()
        // eslint-disable-next-line
    }, [PaginationMovements, state, searchTransactionById.search])

    const reloadData = () => {
        transactionsInState()
        movementsInState()
    }

    const ticketSearchPropsPS = {
        fetching: Transactions.fetching,
        keyWord: "purchase and sale tickets",
        SearchText: searchTransactionById.value,
        handleSearchChange: handleTransactionSearchChange,
        cancelSearch: cancelTransactionSearch,
        Search: () => transactionById(searchTransactionById.value),
    }

    const ticketSearchPropsW = {
        fetching: Movements.fetching,
        keyWord: "withdrawal tickets",
        SearchText: searchMovementById.value,
        handleSearchChange: handleMovementSearchChange,
        cancelSearch: cancelMovementSearch,
        Search: () => movementById(searchMovementById.value)
    }

    return (
        Transactions.fetching && Movements.fetching ?
            <Message selected={0} messageVariants={messageVariants} />
            :
            <>
                <h1 className="title">{t("Purchase and sale tickets")}:</h1>
                <TicketSearch
                    props={ticketSearchPropsPS}
                />
                {
                    Transactions.fetching ?
                        <Loading movements={PaginationMovements.take} />
                        :
                        !Transactions.valid ?
                            <Message selected={3} messageVariants={messageVariants} />
                            :
                            Transactions.values.total === 0 ?
                                <NoMovements movements={PaginationMovements.take} />
                                :
                                <>
                                    <TransactionsTable UsersInfo={UsersInfo} FundInfo={FundInfo} take={PaginationMovements.take}
                                        reloadData={reloadData} state={state} transactions={Transactions.values.transactions} />
                                </>

                }
                {
                    Transactions.values.total > 0 ?
                        <PaginationController PaginationData={PaginationTransactions} setPaginationData={setPaginationTransactions} total={Transactions.values.total} />
                        :
                        null
                }
                <h1 className="title">{t("Withdrawal tickets")}:</h1>
                <TicketSearch
                    props={ticketSearchPropsW}
                />
                {
                    Movements.fetching ?
                        <Loading movements={PaginationMovements.take} />
                        :
                        !Movements.valid ?
                            <Message selected={5} messageVariants={messageVariants} />
                            :
                            Movements.values.total === 0 ?
                                <NoMovements movements={PaginationMovements.take} />
                                :
                                <>
                                    <MovementsTable AccountInfo={AccountInfo} UsersInfo={UsersInfo}
                                        reloadData={reloadData} state={state} take={PaginationMovements.take} movements={Movements.values.movements} />

                                </>
                }
                {
                    Movements.values.total > 0 ?
                        <PaginationController PaginationData={PaginationMovements} setPaginationData={setPaginationMovements} total={Movements.values.total} />
                        :
                        null
                }
            </>


    )
}
export default Transactionslist


