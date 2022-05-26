import React, { useEffect } from 'react'
import { DashBoardProvider } from 'context/DashBoardContext';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import Landing from 'components/Landing';
import Containerlogin from 'components/Containerlogin';
import ContainerForgotPassword from 'components/ContainerForgotPassword';
import ContainerChangePassword from 'components/ContainerChangePassword';
import ActivateAccount from 'components/ActivateAccount'
import DashBoard from 'components/DashBoard';
import NotFound from 'components/NotFound';
import SetPassword from 'components/SetPassword';
import { useTranslation } from "react-i18next";
import './App.css';
import RotateDevice from 'components/RotateDevice';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    let prefferedLanguage = localStorage.getItem("language")
    i18n.changeLanguage(prefferedLanguage ? prefferedLanguage : "es");
    // eslint-disable-next-line
  }, [])

  return (
    <div className="App" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/backGround/background.jpg)` }}>
      <div className="appContainer">
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

            <Route exact path="/activate">
              <ActivateAccount />
            </Route>

            <Route exact path="/setPassword">
              <SetPassword />
            </Route>

            <DashBoardProvider>
              <Route path="/DashBoard">
                <DashBoard />
              </Route>
            </DashBoardProvider>

            <Route>
              <NotFound />
            </Route>

          </Switch>
        </BrowserRouter>
      </div>
      <RotateDevice />
    </div>
  );
}

export default withTranslation('defaultNamespace')(App);

