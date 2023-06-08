import React, { useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, useRouteMatch } from 'react-router-dom';

import './index.css'

import NavBar from './NavBars/NavBar';
import NavInfo from './NavBars/NavInfo';
import NavBarMobile from './NavBars/NavBarMobile';
import NavBarTotal from './NavBars/NavBarTotal';
import Footer from './Footer';

//Context
import { DashBoardContext } from 'context/DashBoardContext';

//User
import FundsContainer from './User/FundsContainer'
import MovementsTable from './User/MovementsTable';
import BuyForm from './User/newTicket/BuyForm';
import SellForm from './User/newTicket/SellForm';
import WithdrawForm from './User/newTicket/WithdrawForm';
import DepositForm from './User/newTicket/DepositForm';
import FixedDepositClient from './User/newTicket/FixedDeposit';

import TransferForm from './User/newTicket/TransferForm';
import OperationStatus from './User/newTicket/OperationStatus';
import SelectClient from './User/SelectClient';

//Admin
import AddAccount from './Admin/AddAccount';
import FundsAdministration from './Admin/FundsAdministration';
import AssetsAdministration from './Admin/AssetsAdministration';
import TicketsAdministration from './Admin/TicketsAdministration';
import DepositCashToClient from './Admin/DepositCashToClient';
import WithdrawCashFromClient from './Admin/WithdrawCashFromClient';
import OperationStatusAdmin from './Admin/OperationStatus';
import Loading from './Loading';
import ClientsSupervision from './Admin/ClientsSupervision';
import APL from './Admin/APL'
import FixedDeposit from './Admin/FixedDeposit';


//General
import DashboardToast from './DashboardToast'
import axios from 'axios';
import NoClients from './GeneralUse/NoClients';
import Configuration from './GeneralUse/Configuration';
import NoPermissionOperation from './User/NoPermissionFeedback/NoPermissionOperation';
import Broadcast from './Admin/Broadcast';
import UserActionLogs from './Admin/UserActionLogs';
import NotificationsCenter from './GeneralUse/NotificationsCenter';
import { useSelector } from 'react-redux';

const UserDashBoard = () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem("access_token")}`
    const userStatus = useSelector(state => state.user.status)

    const { isMobile, admin, ClientSelected, balanceChanged, setBalanceChanged, setItemSelected, IndexClientSelected, UserClients, ClientPermissions, hasPermission } = useContext(DashBoardContext);

    const { path } = useRouteMatch()
    const [NavInfoToggled, setNavInfoToggled] = useState(false)
    const [numberOfFunds, setNumberOfFunds] = useState(0);

    return (
        <div className="DashBoard growOpacity" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/backGround/background.jpg)` }}>
            {
                IndexClientSelected >= 0 || admin || UserClients.content.length === 1 ?
                    UserClients.content.length > 0 || admin ?
                        (ClientSelected.id || admin) && ClientPermissions.fetched && userStatus === "succeeded" ?
                            <>
                                <NavInfo NavInfoToggled={NavInfoToggled} />
                                <NavBar NavInfoToggled={NavInfoToggled} setNavInfoToggled={setNavInfoToggled}
                                    setItemSelected={setItemSelected}
                                />
                                {
                                    admin && IndexClientSelected === -1 ?
                                        /*----------------------------------------------------------Admin----------------------------------------------------------*/
                                        <div className={`adminContainer tabContent`}>
                                            <Route path={`${path}/addAccount`}>
                                                <AddAccount />
                                            </Route>
                                            <Route path={`${path}/broadcast`}>
                                                <Broadcast />
                                            </Route>
                                            <Route path={`${path}/APL`}>
                                                <APL />
                                            </Route>
                                            <Route path={`${path}/clientsSupervision`}>
                                                <ClientsSupervision />
                                            </Route>
                                            <Route path={`${path}/userActionLogs`}>
                                                <UserActionLogs />
                                            </Route>
                                            <Route path={`${path}/fundsAdministration`}>
                                                <FundsAdministration />
                                            </Route>
                                            <Route path={`${path}/assetsAdministration`}>
                                                <AssetsAdministration />
                                            </Route>
                                            <Route path={`${path}/TimeDeposit`}>
                                                <FixedDeposit />
                                            </Route>
                                            <Route path={`${path}/ticketsAdministration`}>
                                                <TicketsAdministration />
                                            </Route>
                                            <Route path={`${path}/depositCash`}>
                                                <DepositCashToClient />
                                            </Route>
                                            <Route path={`${path}/withdrawCash`}>
                                                <WithdrawCashFromClient />
                                            </Route>
                                            <Route path={`${path}/operationResult`}>
                                                <OperationStatusAdmin />
                                            </Route>

                                            <Route exact path={`${path}/configuration`}>
                                                <Configuration admin />
                                            </Route>
                                            <Route exact path={`${path}/notificationsCenter`}>
                                                <NotificationsCenter />
                                            </Route>
                                        </div>
                                        :
                                        /*----------------------------------------------------------Client----------------------------------------------------------*/
                                        <>
                                            <NavBarTotal balanceChanged={balanceChanged} setBalanceChanged={setBalanceChanged} />
                                            <Route path={`${path}/accounts`}>
                                                <FundsContainer
                                                    NavInfoToggled={NavInfoToggled}
                                                    isMobile={isMobile}
                                                    setItemSelected={setItemSelected}
                                                    setNumberOfFunds={setNumberOfFunds}
                                                />
                                            </Route>
                                            <Route path={`${path}/history`}>
                                                <MovementsTable
                                                    isMobile={isMobile}
                                                    numberOfFunds={numberOfFunds}
                                                    setNumberOfFunds={setNumberOfFunds}
                                                    NavInfoToggled={NavInfoToggled}
                                                />
                                            </Route>
                                            <Route path={`${path}/buy`}>
                                                {
                                                    hasPermission('VIEW_ACCOUNT') ?
                                                        <BuyForm balanceChanged={() => setBalanceChanged(true)} />
                                                        :
                                                        <NoPermissionOperation />
                                                }
                                            </Route>
                                            <Route path={`${path}/sell`}>
                                                <SellForm balanceChanged={() => setBalanceChanged(true)} />

                                            </Route>
                                            <Route path={`${path}/deposit`}>
                                                {
                                                    hasPermission('VIEW_ACCOUNT') ?
                                                        <DepositForm balanceChanged={() => setBalanceChanged(true)} /> :
                                                        <NoPermissionOperation />
                                                }
                                            </Route>
                                            <Route path={`${path}/withdraw`}>
                                                {
                                                    hasPermission('VIEW_ACCOUNT') && hasPermission('WITHDRAW') ?
                                                        <WithdrawForm balanceChanged={() => setBalanceChanged(true)} /> :
                                                        <NoPermissionOperation />
                                                }
                                            </Route>
                                            <Route path={`${path}/transfer`}>
                                                {
                                                    hasPermission('VIEW_ACCOUNT') && hasPermission('TRANSFER_GENERATE') ?
                                                        <TransferForm balanceChanged={() => setBalanceChanged(true)} /> :
                                                        <NoPermissionOperation />
                                                }
                                            </Route>
                                            <Route path={`${path}/TimeDeposit`}>
                                                {
                                                    hasPermission('VIEW_ACCOUNT') && hasPermission('FIXED_DEPOSIT_CREATE') ?
                                                        <FixedDepositClient balanceChanged={() => setBalanceChanged(true)} /> :
                                                        <NoPermissionOperation />
                                                }
                                            </Route>
                                            <Route path={`${path}/operationResult`}>
                                                <OperationStatus setItemSelected={setItemSelected} />
                                            </Route>
                                            <Route exact path={`${path}/configuration`}>
                                                <Configuration />
                                            </Route>
                                            <Route exact path={`${path}/notificationsCenter`}>
                                                <NotificationsCenter />
                                            </Route>
                                        </>
                                }
                                <DashboardToast />
                                <Footer />
                                <NavBarMobile setItemSelected={setItemSelected} />
                            </>
                            :
                            <Loading />
                        :
                        <Loading />
                    :
                    UserClients.content.length > 1 ?
                        <SelectClient />
                        :
                        UserClients.fetching ?
                            <Loading />
                            :
                            <NoClients />
            }
        </div>
    )
}
export default UserDashBoard
