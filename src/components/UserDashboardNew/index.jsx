import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, useRouteMatch, useHistory,useLocation } from 'react-router-dom';

import './index.css'

import { urlContext } from '../../context/urlContext';
import FundsContainer from './FundsContainer'
import NavBar from './NavBars/NavBar';
import NavInfo from './NavBars/NavInfo';
import NavBarMobile from './NavBars/NavBarMobile';
import NavBarTotal from './NavBars/NavBarTotal';
import Footer from './Footer';

import MovementsTable from './User/MovementsTable';
import AddAccount from './Admin/AddAccount';

import BuyForm from './User/BuyForm';
import SellForm from './User/SellForm';
import WithdrawForm from './User/WithdrawForm';
import DepositForm from './User/DepositForm';
import OperationStatus from './User/OperationStatus';

const UserDashboard = () => {
    const admin = sessionStorage.getItem("admin")
    // eslint-disable-next-line 
    const { urlPrefix } = useContext(urlContext)
    let location = useLocation()

    const { path } = useRouteMatch()
    const history = useHistory();
    const [NavInfoToggled, setNavInfoToggled] = useState(false)
    const [userData, setUserData] = useState({});
    const [width, setWidth] = useState(window.innerWidth);
    const [numberOfFunds, setNumberOfFunds] = useState(0);
    const [itemSelected, setItemSelected] = useState(location.pathname.split('/')[2])


    useEffect(
      () => {
        const selected=location.pathname.split('/')[2]
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
            <NavInfo NavInfoToggled={NavInfoToggled} userData={userData} />
            <NavBar NavInfoToggled={NavInfoToggled} setNavInfoToggled={setNavInfoToggled}
                setItemSelected={setItemSelected} itemSelected={itemSelected} />
            {JSON.parse(admin) ?
                <>
                    <Route path={`${path}/addAccount`}>
                        <AddAccount />
                    </Route>
                </>
                :
                <>
                    <NavBarTotal />
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
                        <BuyForm NavInfoToggled={NavInfoToggled}/>
                    </Route>
                    <Route path={`${path}/sell`}>
                        <SellForm NavInfoToggled={NavInfoToggled}/>
                    </Route>
                    <Route path={`${path}/deposit`}>
                        <DepositForm NavInfoToggled={NavInfoToggled}/>
                    </Route>
                    <Route path={`${path}/withdraw`}>
                        <WithdrawForm NavInfoToggled={NavInfoToggled}/>
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
