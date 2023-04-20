import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import moment from 'moment'

const initialState = {
    notifications: {
        notifications: [],
        total: 0
    },
    status: 'idle',
    error: null
}

const notificationsSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        reset: (state, action) => ({ ...initialState }),
        markAsRead: (state, action) => {
            const { id } = action.payload
            const notification = state.notifications.notifications.find(notification => notification.id === id)
            if (notification) {
                notification.read = true
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchNotifications.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.notifications = action.payload
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})
export const { reset, markAsRead } = notificationsSlice.actions

export default notificationsSlice.reducer

export const fetchNotifications = createAsyncThunk(
    'dashboardUtilities/fetchNotifications',
    async (queryStrings) => {
        let params = { ...queryStrings }
        for (const key of Object.keys(params)) {
            if (params[key] === "") {
                delete params[key];
            }
        }

        const response = await axios.get('/notifications', {
            params: {
                skip: params.skip || 0,
                take: params.take || 50,
                client: params.client,
                startDate: params?.startDate ? moment(params.startDate).format(moment.HTML5_FMT.DATE) : null,
                endDate: params?.endDate ? moment(params.endDate).add(1,"day").format(moment.HTML5_FMT.DATE) : null,
            }
        })
        return response.data
    }
)

export const selectAllNotifications = state => state.notifications.notifications

export const selectNotificationById = (state, notificationId) =>
    state.notifications.notifications.find(notification => notification.id + "" === notificationId + "")