import { configureStore } from '@reduxjs/toolkit'

import notificationsReducer from 'Slices/DashboardUtilities/notificationsSlice'
import performancesReducer from 'Slices/DashboardUtilities/performancesSlice'
import userReducer from 'Slices/DashboardUtilities/userSlice'
import fundHistoryReducer from 'Slices/DashboardUtilities/fundHistorySlice'

export default configureStore({
  reducer: {
    notifications: notificationsReducer,
    performances: performancesReducer,
    user: userReducer,
    fundHistory: fundHistoryReducer
  },
}) 