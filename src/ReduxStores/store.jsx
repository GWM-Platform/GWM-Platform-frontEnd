import { configureStore } from '@reduxjs/toolkit'

import notificationsReducer from 'Slices/DashboardUtilities/notificationsSlice'

export default configureStore({
  reducer: {
    notifications: notificationsReducer
  },
}) 