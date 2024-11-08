import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
// eslint-disable-next-line
import './components/I18n';
import ReactGA from "react-ga4";
import { BrowserTracing } from '@sentry/tracing';
import * as Sentry from "@sentry/react";

ReactGA.initialize(process.env.REACT_APP_GATAGID);
Sentry.init({
  dsn: process.env.REACT_APP_SENTRYDSN,
  environment: process.env.REACT_APP_SENTRYENVIROMENT || "uknown enviroment",
  tracesSampleRate: 1.0,
  // This sets the sample rate to be 10%. You may want this to be 100% while
  // in development and sample at a lower rate in production
  replaysSessionSampleRate: 0.1,
  // If the entire session is not sampled, use the below sample rate to sample
  // sessions when an error occurs.
  replaysOnErrorSampleRate: 1.0,
  integrations: [new BrowserTracing(), new Sentry.Replay()],
})

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
