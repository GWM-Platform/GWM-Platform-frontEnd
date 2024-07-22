import { configureStore } from '@reduxjs/toolkit'

import notificationsReducer from 'Slices/DashboardUtilities/notificationsSlice'
import performancesReducer from 'Slices/DashboardUtilities/performancesSlice'
import userReducer from 'Slices/DashboardUtilities/userSlice'
import clientsReducer from 'Slices/DashboardUtilities/clientsSlice'
import fundHistoryReducer from 'Slices/DashboardUtilities/fundHistorySlice'
import transactionsReducer from 'Slices/DashboardUtilities/transactionsSlice'
import usersReducer from 'Slices/DashboardUtilities/usersSlice'
import operationsReducer from 'Slices/DashboardUtilities/operationsSlice'
import fundsReducer from 'Slices/DashboardUtilities/fundsSlice'
import PrintHtmlReducer from 'Slices/DashboardUtilities/PrintHtmlSlice'
import movementsReduecer from 'Slices/DashboardUtilities/movementsSlice'


export default configureStore({
  reducer: {
    notifications: notificationsReducer,
    performances: performancesReducer,
    user: userReducer,
    fundHistory: fundHistoryReducer,
    transactions: transactionsReducer,
    users: usersReducer,
    clients: clientsReducer,
    operations: operationsReducer,
    funds: fundsReducer,
    PrintHtml: PrintHtmlReducer,
    movements: movementsReduecer
  },
}) 