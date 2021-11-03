import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, useRouteMatch, useHistory } from 'react-router-dom';

import './index.css'

import { urlContext } from '../../context/urlContext';
import FoundsContainer from './FoundsContainer'
import NavBar from './NavBar';
import NavInfo from './NavInfo';
import Footer from './Footer';

import MovementsTable from './User/MovementsTable';
import AddAccount from './Admin/AddAccount';

import BuyForm from './User/BuyForm';
import SellForm from './User/SellForm';
import WithdrawForm from './User/WithdrawForm';
import DepositForm from './User/DepositForm';
import NavBarTotal from './NavBarTotal';
import OperationStatus from './User/OperationStatus';

const UserDashboard = () => {
    const admin = sessionStorage.getItem("admin")
    // eslint-disable-next-line 
    const { urlPrefix } = useContext(urlContext)

    const { path } = useRouteMatch()
    let history = useHistory();

    const [userData, setUserData] = useState({});
    const [width, setWidth] = useState(window.innerWidth);
    const [numberOfFounds, setNumberOfFounds] = useState(0);

    const [itemSelected, setItemSelected] = useState(
        {
            "/dashboardNew/accounts": "Accounts",
            "/dashboardNew/Accounts": "Accounts",
            "/dashboardNew/addAccount": "addAccount",
            "/dashboardNew/createTicket": "createTicket",
            "/dashboardNew/history": "movementsTable",
        }[history.location.pathname])

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    let isMobile = (width <= 576);

    // eslint-disable-next-line 

    //When the user try to open this url it checks if the user has a valid token in their session storage,
    //if it is true, it is redirected to the dashboard, if not, it is redirected to login
    const getUserData = () => {
        setUserData({ "id": 4, "username": "Marco", "email": "marcos.sk8.parengo@gmail.com", "externalId": "RL580035", "firstName": "Marco", "lastName": "Giangarelli", "gender": "M", "birthdate": "2002-05-16", "customer": {} })
    }


    useEffect(() => {
        if (admin === undefined) {
            sessionStorage.clear();
            history.push(`/login`)
        }
        window.addEventListener('resize', handleWindowSizeChange);
        getUserData();
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, [admin, history])


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
                    <NavBarTotal />
                    <Route path={`${path}/accounts`}>
                        <FoundsContainer
                            isMobile={isMobile}
                            setItemSelected={setItemSelected}
                            numberOfFounds={numberOfFounds}
                            setNumberOfFounds={setNumberOfFounds}
                        />
                    </Route>
                    <Route path={`${path}/history`}>
                        <MovementsTable
                            isMobile={isMobile}
                            setItemSelected={setItemSelected}
                            numberOfFounds={numberOfFounds}
                            setNumberOfFounds={setNumberOfFounds}
                        />
                    </Route>
                    <Route path={`${path}/buy`}>
                        <BuyForm />
                    </Route>
                    <Route path={`${path}/sell`}>
                        <SellForm />
                    </Route>
                    <Route path={`${path}/deposit`}>
                        <DepositForm />
                    </Route>
                    <Route path={`${path}/withdraw`}>
                        <WithdrawForm />
                    </Route>
                    <Route path={`${path}/operationResult`}>
                        <OperationStatus setItemSelected={setItemSelected} />
                    </Route>
                </>
            }
            <Footer />
        </div>
    )
}
export default UserDashboard
