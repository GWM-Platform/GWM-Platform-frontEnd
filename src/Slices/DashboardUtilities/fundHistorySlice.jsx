import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    fundHistory: [],
    status: 'idle',
    error: null
}

const fundHistorySlice = createSlice({
    name: 'fundHistory',
    initialState,
    reducers: {
        reset: () => {
            return { ...initialState }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchFundHistory.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchFundHistory.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.fundHistory = state.fundHistory = [...action.payload]
            })
            .addCase(fetchFundHistory.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})
export const { add, reset } = fundHistorySlice.actions

export default fundHistorySlice.reducer

export const fetchFundHistory = createAsyncThunk('fundHistory/fetchFundHistory', async () => {
    const response = await axios.get('/fundHistory')
    return response.data
})

export const selectAllFundHistory = state => state.fundHistory.fundHistory
export const selectFundHistoryByFundId = (state, fundId) => state.fundHistory.fundHistory.filter(history => history.fundId === fundId)