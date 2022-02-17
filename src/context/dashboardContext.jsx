import React from 'react'
import { createContext, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export const dashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
    const history = useHistory();
    let location = useLocation()

    const [token] = useState(sessionStorage.getItem("access_token"));
    const [admin] = useState(JSON.parse(sessionStorage.getItem("admin")));
    const [balanceChanged, setBalanceChanged] = useState(true)

    const [UserClients, setUserClients] = useState([])
    const [ClientSelected, setClientSelected] = useState({})
    const [IndexClientSelected, setIndexClientSelected] = useState(-1)

    const [contentReady, setContentReady] = useState(false);

    const [Funds, setFunds] = useState([]);
    const [FetchingFunds, setFetchingFunds] = useState(true);
    const [Accounts, setAccounts] = useState([])

    const [itemSelected, setItemSelected] = useState(location.pathname.split('/')[2])



    const [PendingTransactions, setPendingTransactions] = useState({
        value: [],
        fetched: false,
        fetching: false
    })

    const [PendingWithoutpossession, setPendingWithoutpossession] = useState([])

    useEffect(
        () => {
            setContentReady(false)
            setFunds([])
            setAccounts([])
            const selected = location.pathname.split('/')[2]
            setItemSelected(selected)
        },
        [location]
    )

    useEffect(() => {
        const toLogin = () => {
            sessionStorage.clear();
            history.push(`/login`);
        }
        const getAccountsAndFunds = async () => {
            setFetchingFunds(true)
            const [resposponseAccounts, resposponseFunds] = await Promise.all([getAccounts(), getFunds()]);
            setAccounts(resposponseAccounts)
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
            var url = `${process.env.REACT_APP_APIURL}/transactions/byState/1/?` + new URLSearchParams({
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
                const data = await response.json()
                setPendingTransactions({
                    ...PendingTransactions, ...{
                        value: data,
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
            setPendingWithoutpossession([])
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

            responses.forEach((response) => {
                setPendingWithoutpossession(prevState => [...prevState, { fund: response }])
            })

            setContentReady(true)
        }
        if (!FetchingFunds && PendingTransactions.fetched && Accounts.length>0 &&!contentReady && ClientSelected.id) {
            addPendingFundsWithoutPosesion()
        }

        //eslint-disable-next-line
    }, [Funds, PendingTransactions, ClientSelected]);

    useEffect(() => {

        const toLogin = () => {
            sessionStorage.clear(); history.push(`/login`);
        }

        const getUserData = async () => {
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
                setUserClients(data)
                if (data.length === 1) {
                    setIndexClientSelected(0)
                }
                if (localStorage.getItem(data[0].alias)) {
                    setIndexClientSelected(parseInt(localStorage.getItem(data[0].alias)))
                }

            } else {
                switch (response.status) {
                    default:
                        toLogin()
                }
            }
        }

        if (token === null) toLogin()
        getUserData();
        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (UserClients.length > 0 && IndexClientSelected >= 0) {
            setClientSelected(UserClients[IndexClientSelected])
            history.push(`/dashboard/Accounts`);
            setBalanceChanged(true)
        }else if(admin && IndexClientSelected === -1 ){
            history.push(`/dashboard/FundsAdministration`);
        }

    }, [history,UserClients, IndexClientSelected,admin]);


    return <dashboardContext.Provider
        value={{
            token, admin, UserClients, ClientSelected, IndexClientSelected, setIndexClientSelected, balanceChanged, setBalanceChanged,
            FetchingFunds, contentReady, PendingWithoutpossession, PendingTransactions, Accounts, Funds, itemSelected, setItemSelected
        }}>
        {children}
    </dashboardContext.Provider>
}

