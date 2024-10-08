import { configureStore } from '@reduxjs/toolkit'

import notificationsReducer from 'Slices/DashboardUtilities/notificationsSlice'
import performancesReducer from 'Slices/DashboardUtilities/performancesSlice'
import userReducer from 'Slices/DashboardUtilities/userSlice'
import fundHistoryReducer from 'Slices/DashboardUtilities/fundHistorySlice'
import transactionsReducer from 'Slices/DashboardUtilities/transactionsSlice'
import usersReducer from 'Slices/DashboardUtilities/usersSlice'
import operationsReducer from 'Slices/DashboardUtilities/operationsSlice'
import fundsReducer from 'Slices/DashboardUtilities/fundsSlice'


export default configureStore({
  reducer: {
    notifications: notificationsReducer,
    performances: performancesReducer,
    user: userReducer,
    fundHistory: fundHistoryReducer,
    transactions: transactionsReducer,
    users: usersReducer,
    operations: operationsReducer,
    funds: fundsReducer
  },
}) 