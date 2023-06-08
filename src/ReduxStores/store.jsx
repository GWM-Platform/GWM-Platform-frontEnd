import { configureStore } from '@reduxjs/toolkit'

import notificationsReducer from 'Slices/DashboardUtilities/notificationsSlice'
import performancesReducer from 'Slices/DashboardUtilities/performancesSlice'
import userReducer from 'Slices/DashboardUtilities/userSlice'

export default configureStore({
  reducer: {
    notifications: notificationsReducer,
    performances: performancesReducer,
    user: userReducer,
  },
}) 