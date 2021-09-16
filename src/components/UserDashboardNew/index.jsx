import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, useRouteMatch, useHistory } from 'react-router-dom';

import './index.css'

import { urlContext } from '../../context/urlContext';
import TransactionRequest from './TransactionRequest';
import AccountsContainer from './AccountsContainer';
import NavBar from './NavBar';
import NavInfo from './NavInfo';
import Footer from './Footer';

import TransactionResult from './TransactionResult';
import MovementsTable from './MovementsTable';

const UserDashboard = () => {
    const { urlPrefix } = useContext(urlContext)

    const { path } = useRouteMatch()
    let history = useHistory();

    const [userData, setUserData] = useState({});
    const [width, setWidth] = useState(window.innerWidth);
    const [numberOfAccounts, setNumberOfAccounts] = useState(0);
    const [haveInternal, setHaveInternal] = useState(false);
    const [transactionInfo, setTransactionInfo] = useState("notDoneYet")//Transaction result depends of its value


    const [itemSelected, setItemSelected] = useState(
        history.location.pathname === "/dashboardNew/accounts" || history.location.pathname === "/dashboardNew/Accounts" ?
            "Accounts" :
            history.location.pathname === "/dashboardNew/transactionRequest/0/1" ?
                "internalTransaction" :
                history.location.pathname === "/dashboardNew/movementsTable" ?
                    "movementsTable" :
                    "otherTransaction");

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    let isMobile = (width <= 576);

    const toLogin = () => {
        sessionStorage.clear(); history.push(`/login`);
    }

    //When the user try to open this url it checks if the user has a valid token in their session storage,
    //if it is true, it is redirected to the dashboard, if not, it is redirected to login
    const getUserData = () => {
        setUserData({ "id": 4, "username": "marki", "email": "marcos.sk8.parengo@gmail.com", "externalId": "RL580035", "firstName": "Marcos", "lastName": "Parengo", "gender": "M", "birthdate": "2002-05-16", "customer": {} })
    }


    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        getUserData();
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, [])


    return (
        <div >
            <NavInfo userData={userData} />
            <NavBar setItemSelected={setItemSelected} setTransactionInfo={setTransactionInfo} haveInternal={haveInternal} itemSelected={itemSelected} />
            <Route path={`${path}/accounts`}>
                <AccountsContainer
                    isMobile={isMobile}
                    setItemSelected={setItemSelected}
                    numberOfAccounts={numberOfAccounts}
                    setNumberOfAccounts={setNumberOfAccounts}
                    setHaveInternal={setHaveInternal}
                />
            </Route>
            <Route path={`${path}/TransactionRequest/:sourceAccountId/:transactionType`}>
                <TransactionRequest
                    setItemSelected={setItemSelected}
                    transactionInfo={transactionInfo}
                    setTransactionInfo={setTransactionInfo}
                    type={itemSelected}
                    setHaveInternal={setHaveInternal} />
            </Route>
            <Route path={`${path}/TransactionResult`}>
                <TransactionResult transactionInfo={transactionInfo} setItemSelected={setItemSelected} />
            </Route>
            <Route path={`${path}/movementsTable`}>
                <MovementsTable
                    isMobile={isMobile}
                    setItemSelected={setItemSelected}
                    numberOfAccounts={numberOfAccounts}
                    setNumberOfAccounts={setNumberOfAccounts}
                />
            </Route>
            <Footer />
        </div>
    )
}
export default UserDashboard
