import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, useRouteMatch, useHistory } from 'react-router-dom';

import './index.css'

import { urlContext } from '../../context/urlContext';
import AccountsContainer from './AccountsContainer';
import NavBar from './NavBar';
import NavInfo from './NavInfo';
import Footer from './Footer';
import CreateNewTicket from './CreateNewTicket';

import MovementsTable from './MovementsTable';
import AddAccount from './AddAccount';

const UserDashboard = () => {
    const admin = sessionStorage.getItem("admin")
    // eslint-disable-next-line 
    const { urlPrefix } = useContext(urlContext)

    const { path } = useRouteMatch()
    let history = useHistory();

    const [userData, setUserData] = useState({});
    const [width, setWidth] = useState(window.innerWidth);
    const [numberOfAccounts, setNumberOfAccounts] = useState(0);

    const [itemSelected, setItemSelected] = useState(
        history.location.pathname === "/dashboardNew/accounts" || history.location.pathname === "/dashboardNew/Accounts" ?
            "Accounts" :
            history.location.pathname === "/dashboardNew/addAccount" ?
                "addAccount" :
                history.location.pathname === "/dashboardNew/createTicket" ?
                    "createTicket" :
                    "movementsTable");

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    let isMobile = (width <= 576);

    // eslint-disable-next-line 
    const toLogin = () => {
        sessionStorage.clear();
        history.push(`/login`);
    }

    //When the user try to open this url it checks if the user has a valid token in their session storage,
    //if it is true, it is redirected to the dashboard, if not, it is redirected to login
    const getUserData = () => {
        setUserData({ "id": 4, "username": "Marcos", "email": "marcos.sk8.parengo@gmail.com", "externalId": "RL580035", "firstName": "Marcos", "lastName": "Giangarelli", "gender": "M", "birthdate": "2002-05-16", "customer": {} })
    }


    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        getUserData();
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, [])


    return (
        <div className="dashboard" >
            <NavInfo userData={userData} />
            <NavBar setItemSelected={setItemSelected} itemSelected={itemSelected} />
            {admin === "true" ?
                <>
                    <Route path={`${path}/addAccount`}>
                        <AddAccount />
                    </Route>
                </>
                :
                <>
                    <Route path={`${path}/accounts`}>
                        <AccountsContainer
                            isMobile={isMobile}
                            setItemSelected={setItemSelected}
                            numberOfAccounts={numberOfAccounts}
                            setNumberOfAccounts={setNumberOfAccounts}
                        />
                    </Route>
                    <Route path={`${path}/history`}>
                        <MovementsTable
                            isMobile={isMobile}
                            setItemSelected={setItemSelected}
                            numberOfAccounts={numberOfAccounts}
                            setNumberOfAccounts={setNumberOfAccounts}
                        />
                    </Route>
                    <Route path={`${path}/createTicket`}>
                        <CreateNewTicket />
                    </Route>
                    <Route path={`${path}/buy`}>
                        <CreateNewTicket />
                    </Route>
                    <Route path={`${path}/sell`}>
                        <CreateNewTicket />
                    </Route>
                    <Route path={`${path}/deposit`}>
                        <CreateNewTicket />
                    </Route>
                    <Route path={`${path}/withdraw`}>
                        <CreateNewTicket />
                    </Route>
                </>
            }
            <Footer />
        </div>
    )
}
export default UserDashboard
