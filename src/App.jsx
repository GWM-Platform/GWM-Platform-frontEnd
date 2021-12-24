import React from 'react'
import './App.css';
import Landing from './components/Landing';
import Containerlogin from './components/Containerlogin';
import ContainerForgotPassword from './components/ContainerForgotPassword';
import ContainerChangePassword from './components/ContainerChangePassword';
import ContainerVerifyAccount from './components/ContainerVerifyAccount';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import DashBoard from './components/DashBoard';
import NotFound from './components/NotFound';
import SetPassword from './components/SetPassword';

function App() {
  return (
    <div className="App"  style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/backGround/bgDashboard.svg)` }}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/">
              <Landing />
            </Route>
            <Route exact path="/login">
              <Containerlogin />
            </Route>
            <Route exact path="/forgotPassword">
              <ContainerForgotPassword />
            </Route>
            <Route exact path="/changePassword/:user/:token">
              <ContainerChangePassword />
            </Route>
            <Route exact path="/changePassword">
              <ContainerChangePassword />
            </Route>
            <Route exact path="/verifyAccount">
              <ContainerVerifyAccount />
            </Route>
            <Route exact path="/verifyAccount/:user/:token">
              <ContainerVerifyAccount />
            </Route>
            <Route exact path="/setPassword">
              <SetPassword />
            </Route>
            <Route path="/dashboard">
              <DashBoard />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </BrowserRouter>
    </div>
  );
}

export default App;
