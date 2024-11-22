import React, { Suspense, lazy, useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Route, useRouteMatch } from 'react-router-dom';

import './index.css'
import "components/DashBoard/Admin/TicketsAdministration/index.css"
import 'components/DashBoard/Admin/AssetsAdministration/index.css'
import 'components/DashBoard/Admin/FundsAdministration/index.css'
import 'components/DashBoard/Admin/OperationStatus/operationsForm.scss'
import 'components/DashBoard/Admin/OperationStatus/operationsForm.scss'
import 'components/DashBoard/User/MovementsTable/CardsContainer/MainCard/MainCardAccount/MovementsTab/index.css'
import 'components/DashBoard/User/FundsContainer/CardsContainer/FundCard/index.scss'
import 'components/DashBoard/User/newTicket/TransferForm/TargetAccountSelector/index.scss'
import 'components/DashBoard/User/newTicket/FixedDeposit/RuleSelector/RuleCard/index.css'
import 'components/DashBoard/User/newTicket/FixedDeposit/RuleSelector/PreferentialCard/index.css'
import 'components/DashBoard/User/newTicket/FixedDeposit/RuleSelector/PreferentialCard/index.css'
import 'components/DashBoard/User/newTicket/BuyForm/FundSelector/FundCard/index.css'

import NavBar from './NavBars/NavBar';
import NavInfo from './NavBars/NavInfo';
import NavBarMobile from './NavBars/NavBarMobile';
import NavBarTotal from './NavBars/NavBarTotal';
import Footer from './Footer';

//Context
import { DashBoardContext } from 'context/DashBoardContext';

import TransferForm from './User/newTicket/TransferForm';
import OperationStatus from './User/newTicket/OperationStatus';
import SelectClient from './User/SelectClient';
import Loading from './Loading';


//General
import DashboardToast from './DashboardToast'
import axios from 'axios';
import NoClients from './GeneralUse/NoClients';
import NoPermissionOperation from './User/NoPermissionFeedback/NoPermissionOperation';
import { useSelector } from 'react-redux';
import { Col, Container, Row, Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ExchangeTool from './ExchangeTool';
import PrintLoading from 'components/PrintLoading';
import ClientDisabled from './ClientDisabled';
import { selectZoomDesktop, selectZoomMobile } from 'Slices/DashboardUtilities/zoomSlice';

//User
const FundsContainer = lazy(() => import('./User/FundsContainer'))
const MovementsTable = lazy(() => import('./User/MovementsTable'));
const BuyForm = lazy(() => import('./User/newTicket/BuyForm'));
const SellForm = lazy(() => import('./User/newTicket/SellForm'));
const WithdrawForm = lazy(() => import('./User/newTicket/WithdrawForm'));
const DepositForm = lazy(() => import('./User/newTicket/DepositForm'));
const FixedDepositClient = lazy(() => import('./User/newTicket/FixedDeposit'));

//Admin
const AddAccount = lazy(() => import('./Admin/AddAccount'));
const FundsAdministration = lazy(() => import('./Admin/FundsAdministration'));
const AssetsAdministration = lazy(() => import('./Admin/AssetsAdministration'));
const TicketsAdministration = lazy(() => import('./Admin/TicketsAdministration'));
const DepositCashToClient = lazy(() => import('./Admin/DepositCashToClient'));
const WithdrawCashFromClient = lazy(() => import('./Admin/WithdrawCashFromClient'));
const OperationStatusAdmin = lazy(() => import('./Admin/OperationStatus'));
const ClientsSupervision = lazy(() => import('./Admin/ClientsSupervision'));
const APL = lazy(() => import('./Admin/APL'))
const FixedDeposit = lazy(() => import('./Admin/FixedDeposit'));
const Configuration = lazy(() => import('./GeneralUse/Configuration'));
const Broadcast = lazy(() => import('./Admin/Broadcast'));
const UserActionLogs = lazy(() => import('./Admin/UserActionLogs'));
const NotificationsCenter = lazy(() => import('./GeneralUse/NotificationsCenter'));
const Operations = lazy(() => import('./Admin/Operations'));

const UserDashBoard = () => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${sessionStorage.getItem("access_token")}`
    const userStatus = useSelector(state => state.user.status)

    const { isMobile, admin, ClientSelected, balanceChanged, setBalanceChanged, setItemSelected, IndexClientSelected, UserClients, ClientPermissions, hasPermission, hasAnyTransferFundPermission, setIndexClientSelected } = useContext(DashBoardContext);

    const { path } = useRouteMatch()
    const [NavInfoToggled, setNavInfoToggled] = useState(false)
    const [numberOfFunds, setNumberOfFunds] = useState(0);

    const { t } = useTranslation();

    useEffect(() => {
        if (((ClientSelected.enabled === false || ClientSelected.userToClientEnabled === false) && (UserClients.content.find(client => client.enabled && client.userToClientEnabled) || admin))) {
            setIndexClientSelected(-1)
        }
    }, [ClientSelected.enabled, ClientSelected.userToClientEnabled, UserClients, admin, setIndexClientSelected])

    const zoomMobile = useSelector(selectZoomMobile)
    const zoomDesktop = useSelector(selectZoomDesktop)

    useHorizontalMobileAction({
        matched: () => {
            setNavInfoToggled(true)
        },
        notMatched: () => {
            setNavInfoToggled(false)
        }
    })

    return (
        <div className="DashBoard growOpacity" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/backGround/background.jpg)` }}>
            <style>
                {`
                    // h1, h2, h3, h4, h5, h6 {
                    //     zoom: ${zoomDesktop}%;
                    // }
                    :root{
                       font-size: calc(1rem * ${zoomDesktop} / 100 );
                    }
                    .zoom-mobile{
                        display: none!important
                    }
                    .zoom-desktop{
                        display: block!important
                    }
                    @media (max-width: 1000px) and (min-aspect-ratio: 13/9) {
                        * {
                            // zoom: ${zoomMobile}%!important;
                            // overscroll-behavior-x: none;
                            // overscroll-behavior-y: none;
                        }
                        :root{
                            font-size: calc(1rem * ${zoomMobile} / 100 );
                        }       
                        // .container,
                        // .container-sm {
                        //     zoom: 100%;
                        //     max-width: 100vw;
                        // }
                        .zoom-mobile{
                            display: block!important
                        }
                        .zoom-desktop{
                            display: none!important
                        }
                    }
                `}
            </style>
            <Suspense fallback={<Loading />}>
                {
                    IndexClientSelected >= 0 || admin || UserClients.content.length === 1 ?
                        UserClients.content.length > 0 || admin ?
                            (ClientSelected.id || admin) && ClientPermissions.fetched && userStatus === "succeeded" ?
                                (
                                    (ClientSelected.enabled === false || ClientSelected.userToClientEnabled === false) ?
                                        <ClientDisabled />
                                        :
                                        <>
                                            <NavInfo NavInfoToggled={NavInfoToggled} />
                                            {
                                                admin && IndexClientSelected === -1 ?
                                                    /*----------------------------------------------------------Admin----------------------------------------------------------*/
                                                    <>
                                                        <div className="w-100">
                                                            <NavBar NavInfoToggled={NavInfoToggled} setNavInfoToggled={setNavInfoToggled}
                                                                setItemSelected={setItemSelected}
                                                            />
                                                        </div>
                                                        <div className={`adminContainer tabContent`}>
                                                            <Suspense fallback={
                                                                <Container className="h-100" fluid>
                                                                    <Row className="d-flex justify-content-center align-items-center h-100">
                                                                        <Col className="d-flex justify-content-center align-items-center">
                                                                            <Spinner className="me-2" animation="border" variant="primary" />
                                                                            <span className="loadingText">{t("Loading")}</span>
                                                                        </Col>
                                                                    </Row>
                                                                </Container>
                                                            }>
                                                                <Route path={`${path}/users`}>
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
                                                                <Route path={`${path}/operations`}>
                                                                    <Operations />
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
                                                                <ExchangeTool />
                                                            </Suspense>
                                                        </div>
                                                    </>
                                                    :
                                                    /*----------------------------------------------------------Client----------------------------------------------------------*/
                                                    <>
                                                        <div className="w-100">
                                                            <NavBar NavInfoToggled={NavInfoToggled} setNavInfoToggled={setNavInfoToggled}
                                                                setItemSelected={setItemSelected}
                                                            />
                                                            <NavBarTotal balanceChanged={balanceChanged} setBalanceChanged={setBalanceChanged} />
                                                        </div>
                                                        <Suspense fallback={
                                                            <Container className="h-100" fluid>
                                                                <Row className="d-flex justify-content-center align-items-center h-100">
                                                                    <Col className="d-flex justify-content-center align-items-center">
                                                                        <Spinner className="me-2" animation="border" variant="primary" />
                                                                        <span className="loadingText">{t("Loading")}</span>
                                                                    </Col>
                                                                </Row>
                                                            </Container>
                                                        }>
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
                                                                    hasAnyTransferFundPermission() || (hasPermission('VIEW_ACCOUNT') && hasPermission('TRANSFER_GENERATE')) ?
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
                                                        </Suspense>
                                                        <ExchangeTool />
                                                    </>
                                            }
                                            <DashboardToast />
                                            <Footer />
                                            <NavBarMobile setItemSelected={setItemSelected} />
                                            <PrintLoading />
                                        </>
                                )
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
            </Suspense>
        </div>
    )
}
export default UserDashBoard

export const useHorizontalMobileAction = ({ matched = () => { }, notMatched = () => { } }) => {

    // useEffect to fire an action when this mediaquery is matched
    //  @media (max-width: 1000px) and (min-aspect-ratio: 13/9) {
    useEffect(() => {
        const mediaQuery = window.matchMedia('(max-width: 1000px) and (min-aspect-ratio: 13/9)');
        const handleMediaQueryChange = (e) => {
            if (e.matches) {
                matched()
            } else {
                notMatched()
            }
        }
        // add a manual execution of the function to check if the mediaquery is matched at start
        handleMediaQueryChange(mediaQuery)
        mediaQuery.addEventListener('change', handleMediaQueryChange);
        return () => mediaQuery.removeEventListener('change', handleMediaQueryChange);
        // eslint-disable-next-line
    }, [])

}
