import React, { useEffect } from 'react'
import { DashBoardProvider } from 'context/DashBoardContext';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { useTranslation } from "react-i18next";
import 'moment/locale/es'
import * as Sentry from "@sentry/react";

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
import './App.scss';
import './widtHeightBP.css'
import moment from 'moment';
import axios from 'axios';
import { Provider } from 'react-redux';
import store from 'ReduxStores/store';
import SetUserData from 'components/SetUserData';
import TestPDF from 'components/TestPDF';
// import { PersistGate } from 'redux-persist/integration/react';
// import configureAppStore from 'ReduxStores/store';
import { eliminarNoSerializable } from 'utils/eliminarNoSerializable';

// const { store, persistor } = configureAppStore()

function App() {

  const { i18n } = useTranslation();
  moment.locale(i18n.language)

  useEffect(() => {
    const prefferedLanguage = localStorage.getItem("language")
    i18n.changeLanguage(prefferedLanguage ? prefferedLanguage : "es");
    document.documentElement.setAttribute('lang', prefferedLanguage ? prefferedLanguage : "es")
    // eslint-disable-next-line
  }, [])

  axios.defaults.baseURL = process.env.REACT_APP_APIURL;
  axios.defaults.headers.post['Content-Type'] = '*/*';
  useEffect(() => {
    const captureException = axios.interceptors.response.use(function (response) {
      return response;
    }, function (error) {
      if (process.env.REACT_APP_SENTRYDSN) {
        const errorObj = eliminarNoSerializable(error)
        Sentry.captureException(new Error(`Network error${error?.response?.status ? `: ${error?.response?.status}` : ""}`, { extra: { ...errorObj, responseData: errorObj?.response?.data } }))
      }
      return Promise.reject(error);
    });

    return () => {
      axios.interceptors.request.eject(captureException);
    }
  }, [])

  return (
    <div className="App" style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/backGround/background.jpg)` }}>
      <Sentry.ErrorBoundary fallback={<ErrorNotice dialogOptions={{ lang: localStorage.getItem("language") || "En" }} />} >
        <>
          <div className="appContainer">
            <Provider store={store}>
              <BrowserRouter>
                <Switch>
                  <Route exact path="/">
                    <Landing />
                  </Route>
                  <Route exact path="/test-pdf">
                    <TestPDF />
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
                  <Route exact path="/setUserData">
                    <SetUserData />
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
            </Provider>
          </div>
          <RotateDevice />
        </>
      </Sentry.ErrorBoundary>
    </div >
  );
}

export default withTranslation('defaultNamespace')(App);

