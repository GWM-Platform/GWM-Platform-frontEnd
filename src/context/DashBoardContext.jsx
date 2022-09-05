import React, { useReducer, useRef } from 'react'
import { createContext, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';


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

    const desiredLocation = useQuery().get("loc")
    const desiredId = useQuery().get("id")
    const desiredType = useQuery().get("type")
    const desiredClient = useQuery().get("client")
    const desiredFundId = useQuery().get("fundId")

    const [token] = useState(sessionStorage.getItem("access_token"));
    const [admin] = useState(JSON.parse(sessionStorage.getItem("admin")));
    const [balanceChanged, setBalanceChanged] = useState(true)
    const [width, setWidth] = useState(window.innerWidth);

    const [UserClients, setUserClients] = useState([])
    const [fetchingClients, setFetchingClients] = useState(true)

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
            const [resposponseAccounts, resposponseFunds] = await Promise.all([getAccounts(), getFunds()]);
            setAccounts(resposponseAccounts)
            setAccountSelected(resposponseAccounts[0] ? resposponseAccounts[0] : {})

            setFunds(resposponseFunds)
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
                //const data = await response.json()
                //setFunds(data)
                //getPendingTransactions()
                return await response.json()
            } else {
                switch (response.status) {
                    default:
                        toLogin()
                }
            }
        }

        const getAccounts = async () => {
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

        if (ClientSelected.id) {
            setContentReady(false)
            setPendingWithoutpossession([])
            getAccountsAndFunds()
        }

        return () => {
        }
        // eslint-disable-next-line
    }, [ClientSelected, itemSelected])

    useEffect(() => {
        const toLogin = () => {
            sessionStorage.clear();
            history.push(`/login`);
        }

        const addPendingFundsWithoutPosesion = async () => {
            let FundsWithPendingTransactions = new Set(PendingTransactions.value.map(transaction => transaction.fundId))
            let FundsWithPosession = new Set(Funds.map(Funds => Funds.fundId))

            const FundsWithNoPosession = ([...FundsWithPendingTransactions].filter(x => !FundsWithPosession.has(x)))//Diference (All in pending that are not funds with posession)

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
        if (!FetchingFunds && PendingTransactions.fetched && Accounts.length > 0 && !contentReady && ClientSelected.id) {
            addPendingFundsWithoutPosesion()
        }

        //eslint-disable-next-line
    }, [Funds, PendingTransactions, ClientSelected]);

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
            setFetchingClients(true)
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
                setFetchingClients(false)
                const data = await response.json()
                const getClientIndexById = (id) => {
                    return data.findIndex(client => {
                        return client.id.toString() === id
                    })
                }
                setUserClients(data)
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

            } else {
                setFetchingClients(false)
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

        const userDashboardSelected = () => UserClients.length > 0 && IndexClientSelected >= 0

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
            const validTypes = ["m", "t"]
            if (desiredLocation && desiredId && desiredType && desiredClient) {
                if (validRedirectedSections.includes(desiredLocation) && validTypes.includes(desiredType)) {
                    let destination = ""
                    switch (desiredType) {
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

        if (userDashboardSelected()) {
            setClientSelected(UserClients[IndexClientSelected])
            manageUrlUser()
            setBalanceChanged(true)
        } else if (adminDashboardSelected()) manageUrlAdmin()
        //eslint-disable-next-line
    }, [history, UserClients, IndexClientSelected, admin]);

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
    
    return <DashBoardContext.Provider
        value={{
            token, admin, UserClients, ClientSelected, IndexClientSelected, setIndexClientSelected, balanceChanged, setBalanceChanged, TransactionStates, getMoveStateById,
            FetchingFunds, contentReady, PendingWithoutpossession, PendingTransactions, Accounts, Funds, itemSelected, setItemSelected, isMobile, width, toLogin, setContentReady,
            DashboardToast, DashboardToastDispatch, AccountSelected,fetchingClients
        }}>
        {children}
    </DashBoardContext.Provider>
}

