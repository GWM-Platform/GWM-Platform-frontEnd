import React, { useState } from 'react'
import { DashboardProvider } from './context/dashboardContext';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import i18n from './components/I18n';

import Landing from './components/Landing';
import Containerlogin from './components/Containerlogin';
import ContainerForgotPassword from './components/ContainerForgotPassword';
import ContainerChangePassword from './components/ContainerChangePassword';
import ContainerVerifyAccount from './components/ContainerVerifyAccount';
import DashBoard from './components/DashBoard';
import NotFound from './components/NotFound';
import SetPassword from './components/SetPassword';

import './App.css';

function App() {

  const [languages] = useState(
    [
      {
        "code": "es",
        "name": "Spanish"
      }, {
        "code": "gb",
        "name": "English"
      }
    ]
  );

  const [selected, setSelected] = useState(localStorage.getItem("language") === null ? 1 : languages.findIndex(x => x.code === localStorage.getItem("language")))

  const changeLanguage = (language) => {
    i18n.changeLanguage(languages[language].code);
    setSelected(language)
    localStorage.setItem("language", languages[language].code);
  }

  if (localStorage.getItem("language") === null) {
    localStorage.setItem("language", "es")
  }

  return (
    <div className="App" style={{ backgroundImage: `url(https://estudiotronica.net/gwm/wp-content/uploads/2021/11/dotted-worldmap1.png)` }}>
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

          <DashboardProvider>
            <Route path="/dashboard">
              <DashBoard selected={selected} changeLanguage={changeLanguage} languages={languages} />
            </Route>
          </DashboardProvider>

          <Route>
            <NotFound />
          </Route>

        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default withTranslation('defaultNamespace')(App);

