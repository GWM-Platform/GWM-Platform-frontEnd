import React from 'react'
import './App.css';
import Landing from './components/Landing';
import Containerlogin from './components/Containerlogin';
import ContainerForgotPassword from './components/ContainerForgotPassword';
import ContainerChangePassword from './components/ContainerChangePassword';
import ContainerWwcurrencyList from './components/ContainerWwcurrencyList';
import { CurrencyProvider } from './context/currencyContext.jsx'
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import UserDashboardNew from './components/UserDashboardNew';
import { UrlContext } from './context/urlContext';

function App() {
  return (
    <div className="App">
      <UrlContext>
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
            <Route exact path="/Wwcurrency">
              <CurrencyProvider>
                <ContainerWwcurrencyList />
              </CurrencyProvider>
            </Route>
            <Route path="/DashboardNew">
              <UserDashboardNew />
            </Route>
          </Switch>
        </BrowserRouter>
      </UrlContext>
    </div>
  );
}

export default App;
