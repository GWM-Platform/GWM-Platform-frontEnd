import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {}

const performancesSlice = createSlice({
    name: 'performances',
    initialState,
    reducers: {
        reset: (state, action) => ({ ...initialState })
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPerformance.pending, (state, action) => {
                state[action?.meta?.arg?.fund] = { status: 'loading', performance: 0 }
            })
            .addCase(fetchPerformance.fulfilled, (state, action) => {
                state[action?.payload?.fund] = { status: 'succeeded', performance: action.payload.response }
            })
            .addCase(fetchPerformance.rejected, (state, action) => {
                state[action?.payload?.fund] = { status: 'error', performance: action.payload, error: action.error.message }
            })
    }
})
export const { reset } = performancesSlice.actions

export default performancesSlice.reducer

export const fetchPerformance = createAsyncThunk(
    'dashboardUtilities/fetchPerformance',
    async (queryStrings) => {
        let params = { ...queryStrings }
        for (const key of Object.keys(params)) {
            if (params[key] === "") {
                delete params[key];
            }
        }

        const response = await axios.get(`/clients/${params.clientId}/fundPerformance`, {
            params: {
                fund: params.fund,
            }
        })

        return { response: response.data, fund: params.fund }
    }
)

export const selectPerformanceById = (state, fundId) => state.performances?.[fundId]