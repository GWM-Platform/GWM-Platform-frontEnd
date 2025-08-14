import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { selectAllFunds } from './fundsSlice'

const initialState = {
    historicFunds: [],
    params: {},
    status: 'idle',
    error: null
}

const historicFundsSlice = createSlice({
    name: 'historicFunds',
    initialState,
    reducers: {
        reset: (state, action) => ({ ...initialState }),
        edit: (state, action) => {
            const { id, key, value } = action.payload
            const entry = state.historicFunds.find(entry => entry.id === id)
            if (entry) {
                entry[key] = value
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchHistoricFunds.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchHistoricFunds.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.historicFunds = action.payload
            })
            .addCase(fetchHistoricFunds.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})
export const { reset, markAsRead, toggleEnabled } = historicFundsSlice.actions

export default historicFundsSlice.reducer

export const fetchHistoricFunds = createAsyncThunk(
    'dashboardUtilities/fetchHistoricFunds',
    async (queryStrings) => {
        let params = { ...queryStrings }
        for (const key of Object.keys(params)) {
            if (params[key] === "") {
                delete params[key];
            }
        }
        const response = await axios.get('/funds/historicFunds', {
            params: {
                client: params.client,
            }
        })
        return response.data
    }
)

export const selectAllHistoricFundsIds = state => state.historicFunds.historicFunds
export const selectAllHistoricFunds = createSelector(
    [selectAllHistoricFundsIds, selectAllFunds],
    (historicFunds, funds) => [...historicFunds].map(
        historicFund => (funds.find(fund => fund.id === historicFund) || { id: historicFund })
    )
);
export const selectAllUsedParams = state => state.historicFunds.params

export const selectclientById = (state, clientId) =>
    state.historicFunds.historicFunds.find(client => client.id + "" === clientId + "")