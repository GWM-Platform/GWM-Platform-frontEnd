import axios from 'axios';
import React, { useReducer, useRef } from 'react'
import { createContext, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { userEmail } from 'utils/userEmail';


const DashboardToastInitialState = []

const reducerDashboardToast = (state, action) => {
    let aux = [...state]

    switch (action.type) {
        case 'create':
            aux = [...aux, ...[{ Content: action?.toastContent, Show: true }]]
            return aux
        case 'hide':
            aux[action.toastKey] = { ...aux[action?.toastKey], Show: false }
            return aux;
        default:
            throw new Error();
    }
}

export const DashBoardContext = createContext();

export const DashBoardProvider = ({ children }) => {
    const history = useHistory();
    let location = useLocation()
    const isMountedRef = useRef(null);

    function useQuery() {
        const { search } = useLocation();

        return React.useMemo(() => new URLSearchParams(search), [search]);
    }
    const allowedSymbols = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~"

    const desiredLocation = useQuery().get("loc")
    const desiredId = useQuery().get("id")
    const desiredType = useQuery().get("type")
    const desiredClient = useQuery().get("client")
    const desiredFundId = useQuery().get("fundId")

    const [token] = useState(sessionStorage.getItem("access_token"));
    const [admin] = useState(JSON.parse(sessionStorage.getItem("admin")));
    const [balanceChanged, setBalanceChanged] = useState(true)
    const [width, setWidth] = useState(window.innerWidth);

    const [UserClients, setUserClients] = useState({ fetching: true, content: [], fetched: false, valid: false })

    const [ClientSelected, setClientSelected] = useState({})
    const [IndexClientSelected, setIndexClientSelected] = useState(-1)

    const [contentReady, setContentReady] = useState(false);

    const [Funds, setFunds] = useState([]);
    const [FetchingFunds, setFetchingFunds] = useState(true);
    const [Accounts, setAccounts] = useState([])
    const [AccountSelected, setAccountSelected] = useState({})

    const [itemSelected, setItemSelected] = useState(location.pathname.split('/')[2])

    const [PendingTransactions, setPendingTransactions] = useState({
        value: [],
        fetched: false,
        fetching: false
    })

    const [PendingWithoutpossession, setPendingWithoutpossession] = useState([])

    const [TransactionStates, setTransactionStates] = useState({
        fetching: true,
        fetched: false,
        values: []
    })

    const [DashboardToast, DashboardToastDispatch] = useReducer(reducerDashboardToast, DashboardToastInitialState);

    const [ClientPermissions, setClientPermissions] = useState({
        fetching: true,
        fetched: false,
        valid: false,
        content: []
    })


    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    let isMobile = (width <= 576);

    useEffect(
        () => {
            const selected = location.pathname.split('/')[2]
            if (selected !== itemSelected) {
                setContentReady(false)
                setFunds([])
                setFetchingFunds(true)
                setAccounts([])
                setItemSelected(selected)
            }
        },
        //eslint-disable-next-line
        [location])

    useEffect(() => {
        const toLogin = () => {
            sessionStorage.clear();
            history.push(`/login`);
        }

        const getAccountsAndFunds = async () => {
            setFetchingFunds(true)
            setAccounts([])

            const [responseAccounts, responseFunds] = await Promise.all(
                [
                    hasPermission('VIEW_ACCOUNT') ? getAccounts() : null,
                    getFunds()
                ]
            );

            if (hasPermission('VIEW_ACCOUNT')) {
                setAccounts(responseAccounts)
                setAccountSelected(responseAccounts[0] ? responseAccounts[0] : {})
            } else {
                setAccounts([])
            }

            setFunds(responseFunds.filter(fund => hasPermission(`VIEW_FUND_${fund.fund.id}`)))
            setFetchingFunds(false)
            getPendingTransactions()
        }

        const getFunds = async () => {
            setFunds([])
            var url = `${process.env.REACT_APP_APIURL}/stakes/?` + new URLSearchParams({
                client: ClientSelected.id,
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
                return await response.json()
            } else {
                switch (response.status) {
                    default:
                        toLogin()
                }
            }
        }

        const getAccounts = async () => {
            setAccounts([])
            var url = `${process.env.REACT_APP_APIURL}/accounts/?` + new URLSearchParams({
                client: ClientSelected.id,
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
                return await response.json()
            } else {
                switch (response.status) {
                    default:
                        toLogin()
                }
            }
        }

        const getPendingTransactions = async () => {
            setPendingTransactions({
                ...PendingTransactions, ...{
                    fetched: false,
                    fetching: true
                }
            })
            var url = `${process.env.REACT_APP_APIURL}/transactions/?` + new URLSearchParams({
                client: ClientSelected.id,
                filterState: 1
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

                setPendingTransactions({
                    ...PendingTransactions, ...{
                        value: data.transactions ? data.transactions : [],
                        fetched: true,
                        fetching: false
                    }
                })
            } else {
                switch (response.status) {
                    default:
                        setPendingTransactions({
                            ...PendingTransactions, ...{
                                fetched: false,
                                fetching: false
                            }
                        })
                }
            }
        }

        if (ClientSelected.id && ClientPermissions.fetched) {
            setContentReady(false)
            setPendingWithoutpossession([])
            getAccountsAndFunds()
        }

        return () => {
        }
        // eslint-disable-next-line
    }, [ClientSelected, itemSelected, ClientPermissions])

    useEffect(() => {
        const toLogin = () => {
            sessionStorage.clear();
            history.push(`/login`);
        }

        const addPendingFundsWithoutPosesion = async () => {
            let FundsWithPendingTransactions = new Set(PendingTransactions.value.map(transaction => transaction.fundId))
            let FundsWithPosession = new Set(Funds.map(Funds => Funds.fundId))

            const FundsWithNoPosession = ([...FundsWithPendingTransactions].filter(x => !FundsWithPosession.has(x) && hasPermission('VIEW_FUND_' + x)))//Diference (All in pending that are not funds with posession) and has permission to view

            const getFund = async (id) => {
                var url = `${process.env.REACT_APP_APIURL}/funds/${id}`;
                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        Accept: "*/*",
                        'Content-Type': 'application/json'
                    }
                })

                if (response.status === 200) {
                    return await response.json()
                } else {
                    switch (response.status) {
                        default:
                            toLogin()
                    }
                }

            }

            const promises = FundsWithNoPosession.map((fund) => {
                return getFund(fund)
            });

            const responses = await Promise.all(promises);

            let aux = []

            responses.forEach((response) => {
                aux = [...aux, { fund: response }]
            })

            setPendingWithoutpossession([...aux])
            setContentReady(true)
        }

        if (!FetchingFunds && PendingTransactions.fetched > 0 && !contentReady && ClientSelected.id && ClientPermissions.fetched) {
            addPendingFundsWithoutPosesion()
        }

        //eslint-disable-next-line
    }, [Funds, PendingTransactions, ClientSelected, ClientPermissions.fetched]);

    useEffect(() => {
        isMountedRef.current = true;
        const toLogin = () => {
            sessionStorage.clear(); history.push(`/login`);
        }

        const transactionsStates = async () => {
            var url = `${process.env.REACT_APP_APIURL}/states`;
            if (isMountedRef) {

                setTransactionStates((prevState) => ({
                    ...prevState, ...{
                        fetching: true,
                        fetched: false,
                        valid: false,
                        values: []
                    }
                }))
            }
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
                if (isMountedRef) {
                    setTransactionStates((prevState) => ({
                        ...prevState, ...{
                            fetching: false,
                            fetched: true,
                            valid: true,
                            values: data
                        }
                    }))
                }
            } else {
                if (isMountedRef) {
                    setTransactionStates((prevState) => ({
                        ...prevState, ...{
                            fetching: false,
                            fetched: true,
                            valid: false,
                        }
                    }))
                }

                switch (response.status) {
                    case 500:
                        break;
                    default:
                        console.error(response.status)
                }
            }
        }

        const getUserData = async () => {
            setUserClients(prevState => ({ ...prevState, fetching: true, fetched: false }))
            var url = `${process.env.REACT_APP_APIURL}/clients`;
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
                const getClientIndexById = (id) => {
                    return data.findIndex(client => {
                        return client.id.toString() === id
                    })
                }
                if (data.length === 1 && !admin) {
                    setIndexClientSelected(0)
                }
                if (desiredClient) {
                    if (getClientIndexById(desiredClient) >= 0) {
                        setIndexClientSelected(getClientIndexById(desiredClient))
                    } else {
                        setIndexClientSelected(parseInt(localStorage.getItem(data[0].alias)))
                    }
                }
                else if (localStorage.getItem(data[0]?.alias)) {
                    setIndexClientSelected(parseInt(localStorage.getItem(data[0].alias)))
                }
                setUserClients(prevState => ({ ...prevState, fetching: false, fetched: true, valid: true, content: data }))
            } else {
                setUserClients(prevState => ({ ...prevState, fetching: false, fetched: true, valid: false, content: [] }))
                switch (response.status) {
                    default:
                        toLogin()
                }
            }
        }

        window.addEventListener('resize', handleWindowSizeChange);
        if (token === null) toLogin()
        getUserData();
        transactionsStates()

        return () => {
            isMountedRef.current = false;
            window.removeEventListener('resize', handleWindowSizeChange);
        }
        //eslint-disable-next-line
    }, [])

    //Fired when th client changed
    useEffect(() => {

        const userDashboardSelected = () => UserClients.content.length > 0 && IndexClientSelected >= 0

        const adminDashboardSelected = () => admin && IndexClientSelected === -1

        const manageUrlAdmin = () => {
            const validRedirectedSections = ["ticketsAdministration"]
            const validTypes = ["m", "t"]
            if (desiredLocation && desiredId && desiredType) {
                if (validRedirectedSections.includes(desiredLocation) && validTypes.includes(desiredType)) {
                    let destination = `/DashBoard/${desiredLocation}?loc=${desiredLocation}&id=${desiredId}&type=${desiredType}`
                    history.push(destination);
                } else {
                    history.push(`/DashBoard/FundsAdministration`);
                }
            } else {
                history.push(`/DashBoard/FundsAdministration`);
            }
        }

        const manageUrlUser = () => {
            const validRedirectedSections = ["history"]
            const validTypes = ["m", "t", "transfers"]
            if (desiredLocation && desiredId && desiredType && desiredClient) {
                if (validRedirectedSections.includes(desiredLocation) && validTypes.includes(desiredType)) {
                    let destination = ""
                    switch (desiredType) {
                        case "transfers":
                            destination = `/DashBoard/${desiredLocation}?loc=${desiredLocation}&id=${desiredId}&client=${desiredClient}&type=${desiredType}&SelectedTab=Transfers`
                            break;
                        case "m":
                            destination = `/DashBoard/${desiredLocation}?loc=${desiredLocation}&id=${desiredId}&client=${desiredClient}&type=${desiredType}`
                            break;
                        case "t":
                            if (desiredFundId) {
                                destination = `/DashBoard/${desiredLocation}?loc=${desiredLocation}&id=${desiredId}&client=${desiredClient}&fundId=${desiredFundId}&type=${desiredType}`
                            } else {
                                destination = "/DashBoard/Accounts"
                            }
                            break;
                        default:
                            destination = "/DashBoard/Accounts"
                            break
                    }
                    history.push(destination);
                } else {
                    history.push(`/DashBoard/Accounts`);
                }
            } else {
                history.push(`/DashBoard/Accounts`);
            }
        }


        if (UserClients.fetched) {
            if (userDashboardSelected()) {
                setClientSelected(UserClients.content[IndexClientSelected])
                manageUrlUser()
                setBalanceChanged(true)
            } else if (adminDashboardSelected()) {
                setClientSelected({})
                manageUrlAdmin()
            }
        }
        //eslint-disable-next-line
    }, [history, UserClients.content, IndexClientSelected, admin]);

    const getMoveStateById = (id) => {
        if (TransactionStates.fetched && TransactionStates.valid && !TransactionStates.fetching) {
            let index = TransactionStates.values.findIndex((state) => (state.id === id))
            if (index >= 0) {
                return TransactionStates.values[index]
            } else {
                return { name: "-" }
            }
        } else {
            return { name: "-" }
        }
    }

    const toLogin = () => {
        sessionStorage.clear(); history.push(`/login`);
    }


    // get permissions on selected client changes
    useEffect(() => {
        const getPermissions = () => {
            setClientPermissions((prevState) => ({
                ...prevState,
                fetching: true,
                fetched: false,
                valid: false,
                content: []
            }))
            axios.get(`/permissions`, {
                params: { clientId: ClientSelected.id },
            }).then(function (response) {
                const userId = parseInt(sessionStorage.getItem('session_userId' || -1))
                setClientPermissions((prevState) => (
                    {
                        ...prevState,
                        fetching: false,
                        fetched: true,
                        valid: true,
                        content: response?.data?.find(PermissionsSet => PermissionsSet.userId === userId) || [],
                    }))

            }).catch((err) => {
                if (err.message !== "canceled") {
                    if (err.response.status === "401") toLogin()
                    setClientPermissions((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
                }
            });
        }
        if (ClientSelected?.id) {
            getPermissions()
        } else {
            setClientPermissions((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
        }
        return () => {
            setClientPermissions((prevState) => ({ ...prevState, fetching: true, fetched: false, content: [] }))
        }
        //  eslint-disable-next-line
    }, [ClientSelected])

    const isOwner = () => ClientPermissions?.content?.permissions?.filter(permission => permission.action === "OWNER")?.length > 0

    const hasPermission = (Permission) => ClientPermissions?.content?.permissions?.filter(permission => permission.action === Permission)?.length > 0 || isOwner()




    const hasAnySellPermission = () => ClientPermissions?.content?.permissions?.map(permission => permission.action.split('_'))
        ?.filter(actionSplitted => actionSplitted?.includes('SELL') && actionSplitted?.includes('STAKES')).length > 0 || isOwner()

    const hasSellPermission = (fundId = -1) =>
        ClientPermissions?.content?.permissions?.map(permission => permission.action.split('_'))
            ?.filter(actionSplitted => actionSplitted?.includes('SELL') && actionSplitted?.includes('STAKES')) // Get all sell_stakes permissions
            ?.filter(sellPermission => sellPermission?.includes("" + fundId))?.length > 0 || // Verify that has a sell permission for the fund from parameter
        isOwner()

    const hasAnyBuyPermission = () => ClientPermissions?.content?.permissions?.map(permission => permission.action.split('_'))
        ?.filter(actionSplitted => actionSplitted?.includes('BUY') && actionSplitted?.includes('STAKES')).length > 0 || isOwner()

    const hasBuyPermission = (fundId = -1) =>
        ClientPermissions?.content?.permissions?.map(permission => permission.action.split('_'))
            ?.filter(actionSplitted => actionSplitted?.includes('BUY') && actionSplitted?.includes('STAKES')) // Get all sell_stakes permissions
            ?.filter(sellPermission => sellPermission?.includes("" + fundId))?.length > 0 ||// Verify that has a sell permission for the fund from parameter
        isOwner()

    const hasViewPermission = (fundId = -1) =>
        ClientPermissions?.content?.permissions?.map(permission => permission.action.split('_'))
            ?.filter(actionSplitted => actionSplitted?.includes('VIEW') && actionSplitted?.includes('STAKES')) // Get all sell_stakes permissions
            ?.filter(sellPermission => sellPermission?.includes("" + fundId))?.length > 0 ||// Verify that has a sell permission for the fund from parameter
        isOwner()

    const couldSign = (movement) => {
        const hasPermissionToSign = () => {
            switch (movement.motive) {
                case "FIXED_DEPOSIT_CREATE":
                    return hasPermission('FIXED_DEPOSIT_CREATE')
                case "STAKE_BUY":
                    return hasBuyPermission(movement?.fundId)
                case "STAKE_SELL":
                    return hasSellPermission(movement?.fundId)
                case "WITHDRAWAL":
                    return hasPermission('WITHDRAW')
                default:
                    return hasPermission('')
            }
        }
        //TODO: integrate outgoing transfer (incoming in transfer in "pending client" state cannot be signed, the sender should do it) 
        return movement?.userEmail !== userEmail() && hasPermissionToSign()
    }
    return <DashBoardContext.Provider
        value={{
            token, admin, UserClients, ClientSelected, IndexClientSelected, setIndexClientSelected, balanceChanged, setBalanceChanged, TransactionStates, getMoveStateById,
            FetchingFunds, contentReady, PendingWithoutpossession, PendingTransactions, Accounts, Funds, itemSelected, setItemSelected, isMobile, width, toLogin, setContentReady,
            DashboardToast, DashboardToastDispatch, AccountSelected, allowedSymbols,
            couldSign, ClientPermissions, hasPermission, hasSellPermission, hasBuyPermission, hasViewPermission, setClientPermissions, hasAnySellPermission, hasAnyBuyPermission
        }}>
        {children}
    </DashBoardContext.Provider>
}

