import React, { useEffect } from 'react'
import { DashBoardProvider } from 'context/DashBoardContext';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { useTranslation } from "react-i18next";
import 'moment/locale/es'
import * as Sentry from "@sentry/react";
//import ReactGA from "react-ga4";
import { BrowserTracing } from "@sentry/tracing";

import Landing from 'components/Landing';
import Containerlogin from 'components/Containerlogin';
import ContainerForgotPassword from 'components/ContainerForgotPassword';
import ContainerChangePassword from 'components/ContainerChangePassword';
import ActivateAccount from 'components/ActivateAccount'
import DashBoard from 'components/DashBoard';
import NotFound from 'components/NotFound';
import SetPassword from 'components/SetPassword';
import RotateDevice from 'components/RotateDevice';
import ErrorNotice from 'components/ErrorNotice';

import './App.css';
import moment from 'moment';
import axios from 'axios';

function App() {
  const { i18n } = useTranslation();
  moment.locale(i18n.language)

  useEffect(() => {
    const prefferedLanguage = localStorage.getItem("language")
    i18n.changeLanguage(prefferedLanguage ? prefferedLanguage : "es");

    // eslint-disable-next-line
  }, [])

  axios.defaults.baseURL = process.env.REACT_APP_APIURL;
  axios.defaults.headers.post['Content-Type'] = '*/*';

  useEffect(() => {
    Sentry.init({
      dsn: process.env.REACT_APP_SENTRYDSN,
      integrations: [new BrowserTracing()],
      tracesSampleRate: 1.0,
    })
  }, [])

  /* TODO: Incorporate Google Analytics
  useEffect(() => {
    ReactGA.initialize(process.env.REACT_APP_GATAGID);
    ReactGA.send("pageview");
  }, [])
  */

  return (
    <div className="App" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/backGround/background.jpg)` }}>
      <Sentry.ErrorBoundary fallback={<ErrorNotice dialogOptions={{ lang: localStorage.getItem("language") || "En" }} />} >
        <>
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
        </>
      </Sentry.ErrorBoundary>
    </div >
  );
}

export default withTranslation('defaultNamespace')(App);

