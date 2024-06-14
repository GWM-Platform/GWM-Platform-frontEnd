import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    funds: [],
    params: {},
    status: 'idle',
    error: null
}

const fundsSlice = createSlice({
    name: 'funds',
    initialState,
    reducers: {
        reset: (state, action) => ({ ...initialState }),
        markAsRead: (state, action) => {
            const { id } = action.payload
            const fund = state.funds.funds.find(fund => fund.id === id)
            if (fund) {
                fund.read = true
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchFunds.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchFunds.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.funds = action.payload.data
                state.params = action.payload.params
            })
            .addCase(fetchFunds.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})
export const { reset, markAsRead } = fundsSlice.actions

export default fundsSlice.reducer

export const fetchFunds = createAsyncThunk(
    'dashboardUtilities/fetchFunds',
    async (queryStrings) => {
        let params = { ...queryStrings }
        for (const key of Object.keys(params)) {
            if (params[key] === "") {
                delete params[key];
            }
        }
        const response = await axios.get('/funds')
        return { data: response.data, params }
    }
)

export const selectAllFunds = state => state.funds.funds
export const selectAllUsedParams = state => state.funds.params

export const selectFundById = (state, fundId) =>
    state.funds.funds.find(fund => fund.id + "" === fundId + "")