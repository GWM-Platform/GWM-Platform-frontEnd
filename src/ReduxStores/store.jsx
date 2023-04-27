import { configureStore } from '@reduxjs/toolkit'

import notificationsReducer from 'Slices/DashboardUtilities/notificationsSlice'
import performancesReducer from 'Slices/DashboardUtilities/performancesSlice'

export default configureStore({
  reducer: {
    notifications: notificationsReducer,
    performances: performancesReducer
  },
}) 