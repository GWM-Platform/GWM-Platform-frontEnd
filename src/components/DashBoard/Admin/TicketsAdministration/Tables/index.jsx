import React, { useEffect, useRef, useState } from 'react'
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
import FixedDepositTable from './FixedDepositsTable';
import { Button, Col } from 'react-bootstrap';
import { customFetch } from 'utils/customFetch';

const Tables = ({ state, messageVariants, client }) => {

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
        const response = await customFetch(url, {
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
        const response = await customFetch(url, {
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
        const response = await customFetch(url, {
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
        const response = await customFetch(url, {
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
    const [FixedDeposits, setFixedDeposits] = useState({
        fetching: true,
        fetched: false,
        valid: false,
        values: {
            fixedDeposits: [],
            total: 0
        }
    })

    const [PaginationFixedDeposits, setPaginationFixedDeposits] = useState({
        skip: 0,//Offset (in quantity of movements)
        take: 5,//Movements per page
        state: null
    })

    const [searchFixedDepositById, setSearchFixedDepositById] = useState({
        value: "",
        search: false
    })

    const handleFixedDepositsSearchChange = (event) => {
        setSearchFixedDepositById((prevState) => ({ ...prevState, value: event.target.value }))
    }

    const cancelFixedDepositSearch = () => {
        setSearchFixedDepositById((prevState) => ({ ...prevState, value: "", search: false }))
    }

    const FixedDepositById = async (id) => {
        var url = `${process.env.REACT_APP_APIURL}/fixed-deposits/${id}`

        setSearchFixedDepositById((prevState) => ({ ...prevState, search: true }))

        setFixedDeposits({
            ...FixedDeposits,
            ...{
                fetching: true,
                fetched: false,
                valid: false,
            }
        })
        const response = await customFetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 200) {
            const data = await response.json()
            setFixedDeposits({
                ...FixedDeposits,
                ...{
                    fetching: false,
                    fetched: true,
                    valid: true,
                    values: { deposits: [data], total: 1 }
                }
            })
        } else {
            setFixedDeposits({
                ...FixedDeposits,
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
    // TODO: Replace with redux
    const [UsersInfo, SetUsersInfo] = useState({ fetching: true, value: [] })
    const [FundInfo, SetFundInfo] = useState({ fetching: true, value: [] })
    const [AccountInfo, SetAccountInfo] = useState({ fetching: true, value: [] })

    const { t } = useTranslation()


    const getAccounts = async () => {
        var url = `${process.env.REACT_APP_APIURL}/accounts/?all=true`

        const response = await customFetch(url, {
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

        const response = await customFetch(url, {
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
        const response = await customFetch(url, {
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
            onlyReverted: stateOnlyReverted ?? null,
            filterState: stateOnlyReverted ? null : state,
            take: PaginationTransactions.take,
            skip: PaginationTransactions.skip,
            client: client?.value
        });
        setTransactions({
            ...Transactions,
            ...{
                fetching: true,
                fetched: false,
                valid: false,
            }
        })
        const response = await customFetch(url, {
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
            client: client?.value,
            take: PaginationMovements.take,
            skip: PaginationMovements.skip,
            onlyDepositsWithdraws: true
        });
        setMovements({
            ...Movements,
            ...{
                fetching: true,
                fetched: false,
                valid: false
            }
        })
        const response = await customFetch(url, {
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
            client: client?.value
        });
        setPendingSettlements({
            ...PendingSettlements,
            ...{
                fetching: true,
                fetched: false,
                valid: false
            }
        })
        const response = await customFetch(url, {
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
                    const withdrawals = data.movements.filter(movement => movement.motive === "WITHDRAWAL" || movement.motive === "PENALTY_WITHDRAWAL")
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

    const stateOnlyReverted = state === "99"

    const transfersInState = async () => {
        var url = `${process.env.REACT_APP_APIURL}/transfers/?` + new URLSearchParams({
            filterState: stateOnlyReverted ? null : state,
            onlyReverted: stateOnlyReverted ?? null,
            take: PaginationTransfers.take,
            skip: PaginationTransfers.skip,
            client: client?.value
        });
        setTransfers(prevState => ({
            ...prevState,
            ...{
                fetching: true,
                fetched: false,
                valid: false,
            }
        }))
        const response = await customFetch(url, {
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

    const fixedDepositsInState = async () => {
        var url = `${process.env.REACT_APP_APIURL}/fixed-deposits/?` + new URLSearchParams({
            filterState: state,
            take: PaginationFixedDeposits.take,
            skip: PaginationFixedDeposits.skip,
            client: client?.value ? client?.value : "all"
        });
        setFixedDeposits(prevState => ({
            ...prevState,
            ...{
                fetching: true,
                fetched: false,
                valid: false,
            }
        }))
        const response = await customFetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 200) {
            const data = await response.json()
            setFixedDeposits(prevState => ({
                ...prevState,
                ...{
                    fetching: false,
                    fetched: true,
                    valid: true,
                    values: data
                }
            }))
        } else {
            setFixedDeposits(prevState => ({
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
        if (searchPendingSettlementById.search) PendingSettlementById(searchFixedDepositById.value)
        if (searchTransferById.search) TransferById(searchTransferById.value)
        if (searchFixedDepositById.search) FixedDepositById(searchFixedDepositById.value)
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
        setPaginationTransactions((prevState) => ({
            ...prevState, ...{
                skip: 0,//Offset (in quantity of movements)
                take: 5,//Movements per page
                state: null
            }
        })
        )
        setPaginationTransfers((prevState) => ({
            ...prevState, ...{
                skip: 0,//Offset (in quantity of movements)
                take: 5,//Movements per page
                state: null
            }
        })
        )
        setPaginationFixedDeposits((prevState) => ({
            ...prevState, ...{
                skip: 0,//Offset (in quantity of movements)
                take: 5,//Movements per page
                state: null
            }
        })
        )
    }, [state])

    useEffect(() => {
        if (!searchMovementById.search && !stateOnlyReverted) movementsInState()
        // eslint-disable-next-line
    }, [PaginationMovements, state, client, searchMovementById.search])

    useEffect(() => {
        if (!searchTransactionById.search) transactionsInState()
        // eslint-disable-next-line
    }, [PaginationTransactions, state, client, searchTransactionById.search])

    useEffect(() => {
        if (!searchTransferById.search) transfersInState()
        // eslint-disable-next-line
    }, [PaginationTransfers, state, client, searchTransferById.search])

    useEffect(() => {
        if (!searchFixedDepositById.search && !stateOnlyReverted) fixedDepositsInState()
        // eslint-disable-next-line
    }, [PaginationFixedDeposits, state, client, searchFixedDepositById.search])

    useEffect(() => {
        if (!searchPendingSettlementById.search && !stateOnlyReverted) movementsPendingSettlement()
        // eslint-disable-next-line
    }, [PaginationPendingSettlements, client, searchPendingSettlementById.search])

    const reloadData = () => {
        transactionsInState()
        movementsInState()
        transfersInState()
        fixedDepositsInState()
        movementsPendingSettlement()
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

    const ticketSearchPropsFixedDeposits = {
        fetching: FixedDeposits.fetching,
        keyWord: "Fixed deposit ticket",
        SearchText: searchFixedDepositById.value,
        handleSearchChange: handleFixedDepositsSearchChange,
        cancelSearch: cancelFixedDepositSearch,
        Search: () => FixedDepositById(searchFixedDepositById.value)
    }


    const PurchaseAndSale = useRef(null)
    const AccountMovementsRef = useRef(null)
    const PendingSettlementRef = useRef(null)
    const TransferRef = useRef(null)
    const FixedDepositsRef = useRef(null)

    const executeScroll = (ref) => ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

    return (
        Transactions.fetching && Movements.fetching && FixedDeposits.fetching && Transfers.fetching ?
            <Message selected={0} messageVariants={messageVariants} />
            :
            <>
                {
                    !stateOnlyReverted &&
                    <div className='d-flex justify-content-between overflow-auto'>
                        <Button variant="link" onClick={() => executeScroll(PurchaseAndSale)}>{t("Purchases, sales and share transfers")}</Button>
                        <Button variant="link" onClick={() => executeScroll(AccountMovementsRef)}>{t("Account movements")}</Button>
                        <Button variant="link" onClick={() => executeScroll(PendingSettlementRef)}>{t("Approved pending settlement")}</Button>
                        <Button variant="link" onClick={() => executeScroll(TransferRef)}>{t("Transfers")}</Button>
                        <Button variant="link" onClick={() => executeScroll(FixedDepositsRef)}>{t("Time deposits")}</Button>
                    </div>
                }
                <Col xs="12" >
                    <div className="w-100 my-3" style={{ borderBottom: "1px solid lightgray" }} />
                </Col>
                {/*-------------------------------Purchase sale-and transfers------------------------- */}
                {
                    <>
                        <h1 ref={PurchaseAndSale} className="title fw-normal">{t("Purchases, sales and share transfers")}:</h1>
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
                    </>
                }
                {/*-------------------------------Withdrawal and deposit-------------------------- */}
                {
                    !stateOnlyReverted &&
                    <>
                        <div className='mt-3 w-100 d-flex' style={{ borderBottom: "1px solid gray" }} />
                        <h1 className="title fw-normal" ref={AccountMovementsRef}>{t("Account movements")}:</h1>
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
                    </>
                }
                {
                    !stateOnlyReverted &&
                    <>
                        {/*-------------------------------Approved tickets pending settlement-------------------------- */}
                        <div className='mt-3 w-100 d-flex' style={{ borderBottom: "1px solid gray" }} />
                        <h1 className="title fw-normal" ref={PendingSettlementRef}>{t("Approved pending settlement")}:</h1>
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
                    </>
                }
                {/*-------------------------------Transfers-------------------------- */}
                {
                    !stateOnlyReverted &&
                    <div className='mt-3 w-100 d-flex' style={{ borderBottom: "1px solid gray" }} />
                }
                <h1 className="title fw-normal" ref={TransferRef}>{t("Transfers")}:</h1>
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
                {
                    !stateOnlyReverted &&
                    <>
                        {/*-------------------------------Fixed Deposits-------------------------- */}
                        <div className='mt-3 w-100 d-flex' style={{ borderBottom: "1px solid gray" }} />
                        <h1 className="title fw-normal" ref={FixedDepositsRef}>{t("Time deposits")}:</h1>
                        <TicketSearch
                            props={ticketSearchPropsFixedDeposits}
                        />
                        {
                            FixedDeposits.fetching ?
                                <Loading movements={PaginationFixedDeposits.take} />
                                :
                                !FixedDeposits.valid ?
                                    <Message selected={5} messageVariants={messageVariants} />
                                    :
                                    FixedDeposits.values.total === 0 ?
                                        <NoMovements movements={PaginationFixedDeposits.take} />
                                        :
                                        <>
                                            <FixedDepositTable AccountInfo={AccountInfo} UsersInfo={UsersInfo}
                                                reloadData={reloadData} state={state} take={PaginationFixedDeposits.take} movements={FixedDeposits.values.deposits} />
                                        </>
                        }
                        {
                            FixedDeposits.values.total > 0 ?
                                <PaginationController PaginationData={PaginationFixedDeposits} setPaginationData={setPaginationFixedDeposits} total={FixedDeposits.values.total} />
                                :
                                null
                        }
                    </>
                }
            </>


    )
}
export default Tables


