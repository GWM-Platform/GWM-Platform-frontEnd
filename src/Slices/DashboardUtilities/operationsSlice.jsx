import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    operations: {
        operations: [],
        total: 0
    },
    params: {},
    status: 'idle',
    error: null
}

const operationsSlice = createSlice({
    name: 'operations',
    initialState,
    reducers: {
        reset: (state, action) => ({ ...initialState }),
        markAsRead: (state, action) => {
            const { id } = action.payload
            const operation = state.operations.operations.find(operation => operation.id === id)
            if (operation) {
                operation.read = true
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchOperations.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchOperations.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.operations = action.payload.data
                state.params = action.payload.params
            })
            .addCase(fetchOperations.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})
export const { reset, markAsRead } = operationsSlice.actions

export default operationsSlice.reducer

export const fetchOperations = createAsyncThunk(
    'dashboardUtilities/fetchOperations',
    async (queryStrings) => {
        let params = { ...queryStrings }
        for (const key of Object.keys(params)) {
            if (params[key] === "") {
                delete params[key];
            }
        }
        const response = await axios.get('/operations', {
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

export const selectAllOperations = state => state.operations.operations
export const selectAllUsedParams = state => state.operations.params

export const selectOperationById = (state, operationId) =>
    state.operations.operations.find(operation => operation.id + "" === operationId + "")