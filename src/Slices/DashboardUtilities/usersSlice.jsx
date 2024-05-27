import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    users: [],
    params: {},
    status: 'idle',
    error: null
}

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        reset: (state, action) => ({ ...initialState }),
        markAsRead: (state, action) => {
            const { id } = action.payload
            const user = state.users.users.find(user => user.id === id)
            if (user) {
                user.read = true
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchusers.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchusers.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.users = action.payload
            })
            .addCase(fetchusers.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})
export const { reset, markAsRead } = usersSlice.actions

export default usersSlice.reducer

export const fetchusers = createAsyncThunk(
    'dashboardUtilities/fetchusers',
    async (queryStrings) => {
        let params = { ...queryStrings }
        for (const key of Object.keys(params)) {
            if (params[key] === "") {
                delete params[key];
            }
        }
        const response = await axios.get('/users', {
            params: {
                all: params.all,
            }
        })
        return response.data
    }
)

export const selectAllusers = state => state.users.users
export const selectAllUsedParams = state => state.users.params

export const selectuserById = (state, userId) =>
    state.users.users.find(user => user.id + "" === userId + "")