import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, useRouteMatch, useHistory, useLocation } from 'react-router-dom';

import './index.css'

import FundsContainer from './FundsContainer'
import NavBar from './NavBars/NavBar';
import NavInfo from './NavBars/NavInfo';
import NavBarMobile from './NavBars/NavBarMobile';
import NavBarTotal from './NavBars/NavBarTotal';
import Footer from './Footer';

//User
import MovementsTable from './User/MovementsTable';
import BuyForm from './User/newTicket/BuyForm';
import SellForm from './User/newTicket/SellForm';
import WithdrawForm from './User/newTicket/WithdrawForm';
import DepositForm from './User/newTicket/DepositForm';
import OperationStatus from './User/newTicket/OperationStatus';

//Admin
import AddAccount from './Admin/AddAccount';
import FundsAdministration from './Admin/FundsAdministration';
import AssetsAdministration from './Admin/AssetsAdministration';
import TicketsAdministration from './Admin/TicketsAdministration';

const UserDashboard = () => {
    // eslint-disable-next-line 
    let location = useLocation()

    const { path } = useRouteMatch()
    const history = useHistory();
    const [NavInfoToggled, setNavInfoToggled] = useState(false)
    const [userData, setUserData] = useState({});
    const [width, setWidth] = useState(window.innerWidth);
    const [numberOfFunds, setNumberOfFunds] = useState(0);
    const [itemSelected, setItemSelected] = useState(location.pathname.split('/')[2])
    const [balanceChanged, setBalanceChanged] = useState(true)


    const admin = sessionStorage.getItem("admin")

    useEffect(
        () => {
            const selected = location.pathname.split('/')[2]
            setItemSelected(selected)
        },
        [location]
    )

    function handleWindowSizeChange() {
        setWidth(window.innerWidth);
    }

    let isMobile = (width <= 576);

    //When the user try to open this url it checks if the user has a valid token in their session storage,
    //if it is true, it is redirected to the dashboard, if not, it is redirected to login
    const getUserData = () => {
        setUserData({ "id": 4, "username": "Marco", "email": "marcos.sk8.parengo@gmail.com", "externalId": "RL580035", "firstName": "Marco", "lastName": "Giangarelli", "gender": "M", "birthdate": "2002-05-16", "customer": {} })
    }



    useEffect(() => {
        const toLogin = () => {
            sessionStorage.clear(); history.push(`/login`);
        }

        const getAccounts = async () => {
            var url = `${process.env.REACT_APP_APIURL}/accounts`;
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
                if (data.length > 0) { sessionStorage.setItem('balance', data[0].balance) }
            } else {
                switch (response.status) {
                    default:
                        toLogin()
                }
            }
        }
        window.addEventListener('resize', handleWindowSizeChange);

        const admin = sessionStorage.getItem("admin")
        const token = sessionStorage.getItem('access_token')

        if (token === null || admin === undefined) toLogin()

        getUserData();
        getAccounts();
        return () => {
            window.removeEventListener('resize', handleWindowSizeChange);
        }
    }, [history])


    return (
        <div className="dashboard" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/backGround/bgDashboard.svg)` }}>
            <NavInfo NavInfoToggled={NavInfoToggled} userData={userData} />
            <NavBar NavInfoToggled={NavInfoToggled} setNavInfoToggled={setNavInfoToggled}
                setItemSelected={setItemSelected} itemSelected={itemSelected} />
            {JSON.parse(admin) ?
                <div className={`adminContainer ${NavInfoToggled ? "free-area-withoutNavInfo" : "free-area"}`}>
                    <Route path={`${path}/addAccount`}>
                        <AddAccount />
                    </Route>
                    <Route path={`${path}/fundsAdministration`}>
                        <FundsAdministration />
                    </Route>
                    <Route path={`${path}/assetsAdministration`}>
                        <AssetsAdministration />
                    </Route>
                    <Route path={`${path}/ticketsAdministration`}>
                        <TicketsAdministration />
                    </Route>
                </div>
                :
                <>
                    <NavBarTotal balanceChanged={balanceChanged} setBalanceChanged={setBalanceChanged} />
                    <Route path={`${path}/accounts`}>
                        <FundsContainer
                            NavInfoToggled={NavInfoToggled}
                            isMobile={isMobile}
                            setItemSelected={setItemSelected}
                            numberOfFunds={numberOfFunds}
                            setNumberOfFunds={setNumberOfFunds}
                        />
                    </Route>
                    <Route path={`${path}/history`}>
                        <MovementsTable
                            isMobile={isMobile}
                            setItemSelected={setItemSelected}
                            numberOfFunds={numberOfFunds}
                            setNumberOfFunds={setNumberOfFunds}
                            NavInfoToggled={NavInfoToggled}
                        />
                    </Route>
                    <Route path={`${path}/buy`}>
                        <BuyForm NavInfoToggled={NavInfoToggled} balanceChanged={() => setBalanceChanged(true)} />
                    </Route>
                    <Route path={`${path}/sell`}>
                        <SellForm NavInfoToggled={NavInfoToggled} balanceChanged={() => setBalanceChanged(true)} />
                    </Route>
                    <Route path={`${path}/deposit`}>
                        <DepositForm NavInfoToggled={NavInfoToggled} balanceChanged={() => setBalanceChanged(true)} />
                    </Route>
                    <Route path={`${path}/withdraw`}>
                        <WithdrawForm NavInfoToggled={NavInfoToggled} balanceChanged={() => setBalanceChanged(true)} />
                    </Route>
                    <Route path={`${path}/operationResult`}>
                        <OperationStatus setItemSelected={setItemSelected} NavInfoToggled={NavInfoToggled} />
                    </Route>
                </>
            }
            <Footer />
            <NavBarMobile setItemSelected={setItemSelected} itemSelected={itemSelected} />
        </div>
    )
}
export default UserDashboard
