import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    fundsWithUsers: [],
    params: {},
    status: 'idle',
    error: null
}

const fundsWithUsersSlice = createSlice({
    name: 'fundsWithUsers',
    initialState,
    reducers: {
        reset: (state, action) => ({ ...initialState }),
        markAsRead: (state, action) => {
            const { id } = action.payload
            const fundsWithUsers = state.fundsWithUsers.fundsWithUsers.find(fundsWithUsers => fundsWithUsers.id === id)
            if (fundsWithUsers) {
                fundsWithUsers.read = true
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchFundsWithUsers.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchFundsWithUsers.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.fundsWithUsers = action.payload.data
                state.params = action.payload.params
            })
            .addCase(fetchFundsWithUsers.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.mesage
            })
    }
})
export const { reset, markAsRead } = fundsWithUsersSlice.actions

export default fundsWithUsersSlice.reducer

export const fetchFundsWithUsers = createAsyncThunk(
    'dashboardUtilities/fetchFundsWithUsers',
    async (queryStrings) => {
        let params = { ...queryStrings }
        for (const key of Object.keys(params)) {
            if (params[key] === "") {
                delete params[key];
            }
        }
        const response = await axios.get('/funds/withUsers')
        return { data: response.data, params }
    }
)

export const selectAllFundsWithUsers = state => state.fundsWithUsers.fundsWithUsers
export const selectAllUsedParams = state => state.fundsWithUsers.params

export const selectFundsWithUsersById = (state, fundsWithUsersId) =>
    state.fundsWithUsers.fundsWithUsers.find(fundsWithUsers => fundsWithUsers.id + "" === fundsWithUsersId + "")