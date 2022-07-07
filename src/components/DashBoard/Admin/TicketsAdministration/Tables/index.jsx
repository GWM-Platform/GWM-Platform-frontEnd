import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css';
import Message from '../Message'
import TransactionsTable from './TransactionsTable'
import MovementsTable from './MovementsTable'
import TransfersTable from './TransfersTable'
import PaginationController from 'components/DashBoard/GeneralUse/PaginationController';
import Loading from 'components/DashBoard/GeneralUse/Loading';
import NoMovements from 'components/DashBoard/GeneralUse/NoMovements';
import TicketSearch from 'components/DashBoard/GeneralUse/TicketSearch'

import { useTranslation } from 'react-i18next';
import TimeDepositTable from './TimeDepositsTable';

const Tables = ({ state, messageVariants }) => {

    const token = sessionStorage.getItem('access_token')

    function useQuery() {
        const { search } = useLocation();

        return React.useMemo(() => new URLSearchParams(search), [search]);
    }

    const desiredId = useQuery().get("id")
    const desiredType = useQuery().get("type")

    /*--------------------------------------------------------------------------------OPERATIONS-------------------------------------------------------------------------------- */
    //Transactions
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

    //Movements
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

    //PendingSettlements
    const [PendingSettlements, setPendingSettlements] = useState({
        fetching: true,
        fetched: false,
        valid: false,
        values: {
            movements: [],
            total: 0
        }
    })

    const [PaginationPendingSettlements, setPaginationPendingSettlements] = useState({
        skip: 0,//Offset (in quantity of movements)
        take: 5,//Movements per page
        state: null
    })

    const [searchPendingSettlementById, setSearchPendingSettlementById] = useState({
        value: desiredId && desiredType ? desiredType === "m" ? desiredId : "" : "",
        search: desiredId && desiredType ? desiredType === "m" ? true : false : false
    })

    const handlePendingSettlementSearchChange = (event) => {
        setSearchPendingSettlementById((prevState) => ({ ...prevState, value: event.target.value }))
    }

    const cancelPendingSettlementSearch = () => {
        setSearchPendingSettlementById((prevState) => ({ ...prevState, value: "", search: false }))
    }

    const PendingSettlementById = async (id) => {
        var url = `${process.env.REACT_APP_APIURL}/movements/${id}`

        setSearchPendingSettlementById((prevState) => ({ ...prevState, search: true }))

        setPendingSettlements({
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
            setPendingSettlements({
                ...PendingSettlements,
                ...{
                    fetching: false,
                    fetched: true,
                    valid: true,
                    values: { movements: [data], total: 1 }
                }
            })
        } else {
            setPendingSettlements({
                ...PendingSettlements,
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

    //Transfers
    const [Transfers, setTransfers] = useState({
        fetching: true,
        fetched: false,
        valid: false,
        values: {
            movements: [],
            total: 0
        }
    })

    const [PaginationTransfers, setPaginationTransfers] = useState({
        skip: 0,//Offset (in quantity of movements)
        take: 5,//Movements per page
        state: null
    })

    const [searchTransferById, setSearchTransferById] = useState({
        value: desiredId && desiredType ? desiredType === "t" ? desiredId : "" : "",
        search: desiredId && desiredType ? desiredType === "t" ? true : false : false
    })

    const handleTransferSearchChange = (event) => {
        setSearchTransferById((prevState) => ({ ...prevState, value: event.target.value }))
    }

    const cancelTransferSearch = () => {
        setSearchTransferById((prevState) => ({ ...prevState, value: "", search: false }))
    }

    const TransferById = async (id) => {
        var url = `${process.env.REACT_APP_APIURL}/transfers/${id}`

        setSearchTransferById((prevState) => ({ ...prevState, search: true }))

        setTransfers({
            ...Transfers,
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
            setTransfers({
                ...Transfers,
                ...{
                    fetching: false,
                    fetched: true,
                    valid: true,
                    values: { transfers: [data], total: 1 }
                }
            })
        } else {
            setTransfers({
                ...Transfers,
                ...{
                    fetching: false,
                    fetched: true,
                    valid: true,
                    values: { transfers: [], total: 0 }
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

    //Time-deposits
    const [TimeDeposits, setTimeDeposits] = useState({
        fetching: true,
        fetched: false,
        valid: false,
        values: {
            timeDeposits: [],
            total: 0
        }
    })

    const [PaginationTimeDeposits, setPaginationTimeDeposits] = useState({
        skip: 0,//Offset (in quantity of movements)
        take: 5,//Movements per page
        state: null
    })

    const [searchTimeDepositById, setSearchTimeDepositById] = useState({
        value: "",
        search: false
    })

    const handleTimeDepositsSearchChange = (event) => {
        setSearchTimeDepositById((prevState) => ({ ...prevState, value: event.target.value }))
    }

    const cancelTimeDepositSearch = () => {
        setSearchTimeDepositById((prevState) => ({ ...prevState, value: "", search: false }))
    }

    const TimeDepositById = async (id) => {
        var url = `${process.env.REACT_APP_APIURL}/fixed-deposits/${id}`

        setSearchTimeDepositById((prevState) => ({ ...prevState, search: true }))

        setTimeDeposits({
            ...TimeDeposits,
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
            setTimeDeposits({
                ...TimeDeposits,
                ...{
                    fetching: false,
                    fetched: true,
                    valid: true,
                    values: { deposits: [data], total: 1 }
                }
            })
        } else {
            setTimeDeposits({
                ...TimeDeposits,
                ...{
                    fetching: false,
                    fetched: true,
                    valid: true,
                    values: { deposits: [], total: 0 }
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

    /*---------------------------------------------------------------------------------------- */
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

    const movementsPendingSettlement = async () => {
        var url = `${process.env.REACT_APP_APIURL}/movements/?` + new URLSearchParams({
            filterState: 2,//Only search for approved
            take: 100,//Does not have pagination, take as much as possible
            skip: 0,//Does not have pagination
        });
        setPendingSettlements({
            ...PendingSettlements,
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
            setPendingSettlements(
                prevState => {
                    //only withdrawals
                    const withdrawals = data.movements.filter(movement => movement.motive === "WITHDRAWAL")
                    return ({
                        ...prevState,
                        ...{
                            fetching: false,
                            fetched: true,
                            valid: true,
                            values: {
                                movements: withdrawals,
                                total: withdrawals.length,
                            }
                        }
                    })
                }
            )
        } else {
            setPendingSettlements({
                ...PendingSettlements,
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

    const transfersInState = async () => {
        var url = `${process.env.REACT_APP_APIURL}/transfers/?` + new URLSearchParams({
            filterState: state,
            take: PaginationTransfers.take,
            skip: PaginationTransfers.skip,
        });
        setTransfers(prevState => ({
            ...prevState,
            ...{
                fetching: true,
                fetched: false,
                valid: false,
            }
        }))
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
            setTransfers(prevState => ({
                ...prevState,
                ...{
                    fetching: false,
                    fetched: true,
                    valid: true,
                    values: data
                }
            }))
        } else {
            setTransfers(prevState => ({
                ...prevState,
                ...{
                    fetching: false,
                    fetched: true,
                    valid: false,
                }
            }))
            switch (response.status) {
                case 500:
                    break;
                default:
                    console.error(response.status)
            }
        }
    }

    const timeDepositsInState = async () => {
        var url = `${process.env.REACT_APP_APIURL}/fixed-deposits/?` + new URLSearchParams({
            filterState: state,
            take: PaginationTimeDeposits.take,
            skip: PaginationTimeDeposits.skip,
        });
        setTimeDeposits(prevState => ({
            ...prevState,
            ...{
                fetching: true,
                fetched: false,
                valid: false,
            }
        }))
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
            setTimeDeposits(prevState => ({
                ...prevState,
                ...{
                    fetching: false,
                    fetched: true,
                    valid: true,
                    values: data
                }
            }))
        } else {
            setTimeDeposits(prevState => ({
                ...prevState,
                ...{
                    fetching: false,
                    fetched: true,
                    valid: false,
                }
            }))
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
        if (searchPendingSettlementById.search) PendingSettlementById(searchTimeDepositById.value)
        if (searchTransferById.search) TransferById(searchTransferById.value)
        if (searchTimeDepositById.search) TimeDepositById(searchTimeDepositById.value)
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
        setPaginationPendingSettlements((prevState) => ({
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
        setPaginationTransfers(
            (prevState) => ({
                ...prevState, ...{
                    skip: 0,//Offset (in quantity of movements)
                    take: 5,//Movements per page
                    state: null
                }
            })
        )
        setPaginationTimeDeposits(
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
    }, [PaginationMovements, state, searchMovementById.search])

    useEffect(() => {
        if (!searchTransactionById.search) transactionsInState()
        // eslint-disable-next-line
    }, [PaginationTransactions, state, searchTransactionById.search])

    useEffect(() => {
        if (!searchTransferById.search) transfersInState()
        // eslint-disable-next-line
    }, [PaginationTransfers, state, searchTransferById.search])

    useEffect(() => {
        if (!searchTimeDepositById.search) timeDepositsInState()
        // eslint-disable-next-line
    }, [PaginationTimeDeposits, state, searchTimeDepositById.search])

    useEffect(() => {
        if (!searchPendingSettlementById.search) movementsPendingSettlement()
        // eslint-disable-next-line
    }, [PaginationPendingSettlements, searchPendingSettlementById.search])

    const reloadData = () => {
        transactionsInState()
        movementsInState()
        transfersInState()
        timeDepositsInState()
    }

    const ticketSearchPropsTransfers = {
        fetching: Transactions.fetching,
        keyWord: "purchase or sale ticket",
        SearchText: searchTransactionById.value,
        handleSearchChange: handleTransactionSearchChange,
        cancelSearch: cancelTransactionSearch,
        Search: () => transactionById(searchTransactionById.value),
    }

    const ticketSearchPropsMovements = {
        fetching: Movements.fetching,
        keyWord: "withdrawal or deposit ticket",
        SearchText: searchMovementById.value,
        handleSearchChange: handleMovementSearchChange,
        cancelSearch: cancelMovementSearch,
        Search: () => movementById(searchMovementById.value)
    }

    const ticketSearchPropsPendingSettlement = {
        fetching: PendingSettlements.fetching,
        keyWord: "withdrawal pending settlement",
        SearchText: searchPendingSettlementById.value,
        handleSearchChange: handlePendingSettlementSearchChange,
        cancelSearch: cancelPendingSettlementSearch,
        Search: () => PendingSettlementById(searchPendingSettlementById.value)
    }

    const ticketSearchPropsTransfer = {
        fetching: Transfers.fetching,
        keyWord: "transfer ticket",
        SearchText: searchTransferById.value,
        handleSearchChange: handleTransferSearchChange,
        cancelSearch: cancelTransferSearch,
        Search: () => TransferById(searchTransferById.value)
    }

    const ticketSearchPropsTimeDeposits = {
        fetching: TimeDeposits.fetching,
        keyWord: "Time deposit ticket",
        SearchText: searchTimeDepositById.value,
        handleSearchChange: handleTimeDepositsSearchChange,
        cancelSearch: cancelTimeDepositSearch,
        Search: () => TimeDepositById(searchTimeDepositById.value)
    }

    return (
        Transactions.fetching && Movements.fetching && TimeDeposits.fetching && Transfers.fetching ?
            <Message selected={0} messageVariants={messageVariants} />
            :
            <>
                {/*-------------------------------Purchase and sale-------------------------- */}
                <h1 className="title">{t("Purchase and sale tickets")}:</h1>
                <TicketSearch
                    props={ticketSearchPropsTransfers}
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
                {/*-------------------------------Withdrawal and deposit-------------------------- */}
                <h1 className="title">{t("Withdrawal and deposit tickets")}:</h1>
                <TicketSearch
                    props={ticketSearchPropsMovements}
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
                {/*-------------------------------Approved tickets pending settlement-------------------------- */}
                <h1 className="title">{t("Approved tickets pending settlement")}:</h1>
                <TicketSearch
                    props={ticketSearchPropsPendingSettlement}
                />
                {
                    PendingSettlements.fetching ?
                        <Loading movements={PaginationPendingSettlements.take} />
                        :
                        !PendingSettlements.valid ?
                            <Message selected={5} messageVariants={messageVariants} />
                            :
                            PendingSettlements.values.total === 0 ?
                                <NoMovements movements={PaginationPendingSettlements.take} />
                                :
                                <>
                                    <MovementsTable AccountInfo={AccountInfo} UsersInfo={UsersInfo}
                                        reloadData={reloadData} state={state} take={PaginationPendingSettlements.take} movements={PendingSettlements.values.movements} />

                                </>
                }
                {/*-------------------------------Transfers-------------------------- */}
                <h1 className="title">{t("Transfer tickets")}:</h1>
                <TicketSearch
                    props={ticketSearchPropsTransfer}
                />
                {
                    Transfers.fetching ?
                        <Loading movements={PaginationTransfers.take} />
                        :
                        !Transfers.valid ?
                            <Message selected={5} messageVariants={messageVariants} />
                            :
                            Transfers.values.total === 0 ?
                                <NoMovements movements={PaginationTransfers.take} />
                                :
                                <>
                                    <TransfersTable AccountInfo={AccountInfo} UsersInfo={UsersInfo}
                                        reloadData={reloadData} state={state} take={PaginationTransfers.take} movements={Transfers.values.transfers} />

                                </>
                }
                {
                    Transfers.values.total > 0 ?
                        <PaginationController PaginationData={PaginationTransfers} setPaginationData={setPaginationTransfers} total={Transfers.values.total} />
                        :
                        null
                }

                {/*-------------------------------Time Deposits-------------------------- */}
                <h1 className="title">{t("Time deposits")}:</h1>
                <TicketSearch
                    props={ticketSearchPropsTimeDeposits}
                />
                {
                    TimeDeposits.fetching ?
                        <Loading movements={PaginationTimeDeposits.take} />
                        :
                        !TimeDeposits.valid ?
                            <Message selected={5} messageVariants={messageVariants} />
                            :
                            TimeDeposits.values.total === 0 ?
                                <NoMovements movements={PaginationTimeDeposits.take} />
                                :
                                <>
                                    <TimeDepositTable AccountInfo={AccountInfo} UsersInfo={UsersInfo}
                                        reloadData={reloadData} state={state} take={PaginationTimeDeposits.take} movements={TimeDeposits.values.deposits} />
                                </>
                }
                {
                    TimeDeposits.values.total > 0 ?
                        <PaginationController PaginationData={PaginationTimeDeposits} setPaginationData={setPaginationTimeDeposits} total={TimeDeposits.values.total} />
                        :
                        null
                }
            </>


    )
}
export default Tables


