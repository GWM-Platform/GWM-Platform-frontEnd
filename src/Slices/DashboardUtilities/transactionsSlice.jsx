import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    transactions: {
        transactions: [],
        total: 0
    },
    params: {},
    status: 'idle',
    error: null
}

const transactionsSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        reset: (state, action) => ({ ...initialState }),
        markAsRead: (state, action) => {
            const { id } = action.payload
            const transaction = state.transactions.transactions.find(transaction => transaction.id === id)
            if (transaction) {
                transaction.read = true
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchTransactions.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.transactions = action.payload.data
                state.params = action.payload.params
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})
export const { reset, markAsRead } = transactionsSlice.actions

export default transactionsSlice.reducer

export const fetchTransactions = createAsyncThunk(
    'dashboardUtilities/fetchTransactions',
    async (queryStrings) => {
        let params = { ...queryStrings }
        for (const key of Object.keys(params)) {
            if (params[key] === "") {
                delete params[key];
            }
        }
        const response = await axios.get('/transactions', {
            params: {
                client: params.client,
                filterFund: params.filterFund,
                take: params.take,
                skip: params.skip,
                filterState: params.state,
                sort: params.sort
                // startDate: params?.startDate ? moment(params.startDate).format(moment.HTML5_FMT.DATE) : null,
                // endDate: params?.endDate ? moment(params.endDate).add(1, "day").format(moment.HTML5_FMT.DATE) : null,
            }
        })
        return { data: response.data, params }
    }
)

export const selectAllTransactions = state => state.transactions.transactions
export const selectAllUsedParams = state => state.transactions.params

export const selectTransactionById = (state, transactionId) =>
    state.transactions.transactions.find(transaction => transaction.id + "" === transactionId + "")