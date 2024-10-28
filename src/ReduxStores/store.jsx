import { combineReducers, configureStore } from '@reduxjs/toolkit'

import notificationsReducer from 'Slices/DashboardUtilities/notificationsSlice'
import performancesReducer from 'Slices/DashboardUtilities/performancesSlice'
import userReducer from 'Slices/DashboardUtilities/userSlice'
import clientsReducer from 'Slices/DashboardUtilities/clientsSlice'
import fundHistoryReducer from 'Slices/DashboardUtilities/fundHistorySlice'
import transactionsReducer from 'Slices/DashboardUtilities/transactionsSlice'
import usersReducer from 'Slices/DashboardUtilities/usersSlice'
import operationsReducer from 'Slices/DashboardUtilities/operationsSlice'
import fundsReducer from 'Slices/DashboardUtilities/fundsSlice'
import fundsWithUsersReducer from 'Slices/DashboardUtilities/fundsWithUsersSlice'
import PrintHtmlReducer from 'Slices/DashboardUtilities/PrintHtmlSlice'
import movementsreducer from 'Slices/DashboardUtilities/movementsSlice'
import annualStatementsReducer from 'Slices/DashboardUtilities/annualStatementsSlice'
import zoomReducer from 'Slices/DashboardUtilities/zoomSlice'

import storage from "redux-persist/lib/storage";
import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["zoom"]
};

const rootReducer = combineReducers({
  notifications: notificationsReducer,
  performances: performancesReducer,
  user: userReducer,
  fundHistory: fundHistoryReducer,
  transactions: transactionsReducer,
  users: usersReducer,
  clients: clientsReducer,
  operations: operationsReducer,
  funds: fundsReducer,
  fundsWithUsers: fundsWithUsersReducer,
  annualStatements: annualStatementsReducer,
  PrintHtml: PrintHtmlReducer,
  movements: movementsreducer,
  zoom: zoomReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export default function configureAppStore() {
  let store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: false,
      }),
  });
  let persistor = persistStore(store);
  return { store, persistor };
}