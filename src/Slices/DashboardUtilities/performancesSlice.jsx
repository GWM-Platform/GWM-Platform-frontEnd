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
                state[action?.meta?.arg?.fund || "totalPerformance"] = { status: 'loading', performance: 0 }
            })
            .addCase(fetchPerformance.fulfilled, (state, action) => {
                state[action?.payload?.fund || "totalPerformance"] = { status: 'succeeded', performance: action.payload.response }
            })
            .addCase(fetchPerformance.rejected, (state, action) => {
                state[action?.meta?.arg?.fund || "totalPerformance"] = { status: 'error', performance: 0, error: action.error.message }
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

        const response = await axios.get(`/clients/${params.clientId}/${params.totalPerformance ? "totalPerformance" : "fundPerformance"}`, {
            params: {
                fund: params.totalPerformance ? undefined : params.fund,
                year: params.year
            }
        })

        return { response: response.data, fund: params.fund }
    }
)

export const selectPerformanceById = (state, fundId) => {
    return state.performances?.[fundId]
}