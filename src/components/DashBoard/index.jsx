import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, useRouteMatch } from 'react-router-dom';

import './index.css'

import NavBar from './NavBars/NavBar';
import NavInfo from './NavBars/NavInfo';
import NavBarMobile from './NavBars/NavBarMobile';
import NavBarTotal from './NavBars/NavBarTotal';
import Footer from './Footer';

//Context
import { dashboardContext } from '../../context/dashboardContext';

//User
import FundsContainer from './User/FundsContainer'
import MovementsTable from './User/MovementsTable';
import BuyForm from './User/newTicket/BuyForm';
import SellForm from './User/newTicket/SellForm';
import WithdrawForm from './User/newTicket/WithdrawForm';
import DepositForm from './User/newTicket/DepositForm';
import OperationStatus from './User/newTicket/OperationStatus';
import SelectClient from './User/SelectClient';

//Admin
import AddAccount from './Admin/AddAccount';
import FundsAdministration from './Admin/FundsAdministration';
import AssetsAdministration from './Admin/AssetsAdministration';
import TicketsAdministration from './Admin/TicketsAdministration';
import DepositCashToClient from './Admin/DepositCashToClient';
import OperationStatusAdmin from './Admin/OperationStatus';
import Loading from './Loading';
import AccountsSupervision from './Admin/AccountsSupervision';

const UserDashboard = () => {

    const { isMobile,admin, ClientSelected, balanceChanged, setBalanceChanged, itemSelected, setItemSelected, IndexClientSelected, UserClients } = useContext(dashboardContext);

    const { path } = useRouteMatch()
    const [NavInfoToggled, setNavInfoToggled] = useState(false)
    const [numberOfFunds, setNumberOfFunds] = useState(0);

    useEffect(() => {
    }, [ClientSelected])

    return (
        <div className="dashboard" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/backGround/background.jpg)` }}>
            {
                IndexClientSelected >= 0 || admin || UserClients.length === 1  ?
                    UserClients.length > 0 || admin ?
                        ClientSelected.id || admin ?
                            <div className="growOpacity">
                                <NavInfo NavInfoToggled={NavInfoToggled} />
                                <NavBar NavInfoToggled={NavInfoToggled} setNavInfoToggled={setNavInfoToggled}
                                    setItemSelected={setItemSelected} itemSelected={itemSelected}
                                     />
                                {
                                    admin && IndexClientSelected === -1 ?
                                        <div className={`adminContainer ${NavInfoToggled ? "free-area-withoutNavInfo" : "free-area"}`}>
                                            <Route path={`${path}/addAccount`}>
                                                <AddAccount />
                                            </Route>
                                            <Route path={`${path}/accountsSupervision`}>
                                                <AccountsSupervision />
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
                                            <Route path={`${path}/depositCash`}>
                                                <DepositCashToClient />
                                            </Route>
                                            <Route path={`${path}/operationResult`}>
                                                <OperationStatusAdmin setItemSelected={setItemSelected} NavInfoToggled={NavInfoToggled} />
                                            </Route>
                                        </div>
                                        :
                                        <>
                                            <NavBarTotal balanceChanged={balanceChanged} setBalanceChanged={setBalanceChanged} />
                                            {
                                                <Route path={`${path}/accounts`}>
                                                    <FundsContainer
                                                        NavInfoToggled={NavInfoToggled}
                                                        isMobile={isMobile}
                                                        setItemSelected={setItemSelected}
                                                        numberOfFunds={numberOfFunds}
                                                        setNumberOfFunds={setNumberOfFunds}
                                                    />
                                                </Route>
                                            }
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
                            :
                            <Loading />
                        :
                        <Loading />
                    :
                    UserClients.length > 1 ?
                        <SelectClient />
                        :
                        <Loading />
            }
        </div>
    )
}
export default UserDashboard
