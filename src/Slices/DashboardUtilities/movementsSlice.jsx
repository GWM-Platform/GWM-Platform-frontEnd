import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import moment from 'moment'

const initialState = {
    movements: {
        movements: [],
        total: 0
    },
    params: {},
    status: 'idle',
    error: null
}

const movementsSlice = createSlice({
    name: 'movements',
    initialState,
    reducers: {
        reset: (state, action) => ({ ...initialState }),
        markAsRead: (state, action) => {
            const { id } = action.payload
            const transaction = state.movements.movements.find(transaction => transaction.id === id)
            if (transaction) {
                transaction.read = true
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchMovements.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchMovements.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.movements = action.payload.data
                state.params = action.payload.params
            })
            .addCase(fetchMovements.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})
export const { reset, markAsRead } = movementsSlice.actions

export default movementsSlice.reducer

export const fetchMovements = createAsyncThunk(
    'dashboardUtilities/fetchMovements',
    async (queryStrings) => {
        let params = { ...queryStrings }
        for (const key of Object.keys(params)) {
            if (params[key] === "") {
                delete params[key];
            }
        }
        const response = await axios.get('/movements', {
            params: {
                client: params.client,
                filterFund: params.filterFund,
                take: params.take,
                skip: params.skip,
                filterState: params.state,
                sort: params.sort,
                fromDate: params?.fromDate ? moment(params.fromDate).format(moment.HTML5_FMT.DATE) : null,
                toDate: params?.toDate ? moment(params.toDate).add(1, "day").format(moment.HTML5_FMT.DATE) : null,
            }
        })
        return { data: response.data, params }
    }
)

export const selectAllMovements = state => state.movements.movements
export const selectAllUsedParams = state => state.movements.params

export const selectTransactionById = (state, transactionId) =>
    state.movements.movements.find(transaction => transaction.id + "" === transactionId + "")