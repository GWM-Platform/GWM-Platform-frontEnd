import React, { useEffect } from 'react'
import { DashBoardProvider } from 'context/DashBoardContext';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { useTranslation } from "react-i18next";
import 'moment/locale/es'
import * as Sentry from "@sentry/react";
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
import './widtHeightBP.css'
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
      tracesSampleRate: 1.0,
      // This sets the sample rate to be 10%. You may want this to be 100% while
      // in development and sample at a lower rate in production
      replaysSessionSampleRate: 0.1,
      // If the entire session is not sampled, use the below sample rate to sample
      // sessions when an error occurs.
      replaysOnErrorSampleRate: 1.0,
      integrations: [new BrowserTracing(), new Sentry.Replay()],
    })
  }, [])

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

