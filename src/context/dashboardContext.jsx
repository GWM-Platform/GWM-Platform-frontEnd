import React from 'react'
import { createContext, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export const dashboardContext = createContext();

export const DashboardProvider = ({ children }) => {
    const history = useHistory();

    const [token] = useState(sessionStorage.getItem("access_token"));
    const [admin] = useState(JSON.parse(sessionStorage.getItem("admin")));
    const [balanceChanged, setBalanceChanged] = useState(true)

    const [UserClients, setUserClients] = useState([])
    const [ClientSelected, setClientSelected] = useState({})
    const [IndexClientSelected, setIndexClientSelected] = useState(0)

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
            } else {
                switch (response.status) {
                    default:
                        toLogin()
                }
            }
        }

        if (token === null) toLogin()
        if (!admin) {
            getUserData();
        }
        //eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (UserClients.length > 0) {
            setClientSelected(UserClients[IndexClientSelected])
            setBalanceChanged(true)
        }

    }, [UserClients, IndexClientSelected]);


    return <dashboardContext.Provider value={{ token, admin, UserClients, ClientSelected, IndexClientSelected, setIndexClientSelected, balanceChanged, setBalanceChanged }}>
        {children}
    </dashboardContext.Provider>
}

