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
                const key = (
                    action?.meta?.arg?.fixedDepositId ?
                        "fixedDeposit"
                        :
                        (action?.meta?.arg?.fund || "totalPerformance")
                )
                const year = action?.meta?.arg?.year || "total"
                if (!state[key]) {
                    state[key] = {}
                }
                state[key][year] = { ...state[key][year], status: 'loading' }
            })
            .addCase(fetchPerformance.fulfilled, (state, action) => {
                const key = (
                    action?.payload?.fixedDepositId ?
                        "fixedDeposit"
                        :
                        (action?.payload?.fund || "totalPerformance")
                )
                const year = action?.payload?.year || "total"
                if (!state[key]) {
                    state[key] = {}
                }
                state[key][year] = { status: 'succeeded', performance: action.payload.response }
            })
            .addCase(fetchPerformance.rejected, (state, action) => {
                const key = (
                    action?.meta?.arg?.fixedDepositId ?
                        "fixedDeposit"
                        :
                        (action?.meta?.arg?.fund || "totalPerformance")
                )
                const year = action?.meta?.arg?.year || "total"
                if (!state[key]) {
                    state[key] = {}
                }
                state[key][year] = { status: 'error', performance: 0, error: action.error.message }
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

        const response = await axios.get(
            `/clients/${params.clientId}/${params.fixedDepositId ?
                "fixedDepositsPerformance"
                :
                (params.totalPerformance ?
                    "totalPerformance"
                    :
                    "fundPerformance")
            }`, {
            params: {
                fixedDepositId: params.fixedDepositId,
                fund: params.totalPerformance ? undefined : params.fund,
                year: params.year,
                month: params.month,
            }
        })

        return { response: response.data, fund: params.fund, fixedDepositId: params.fixedDepositId, year: params.year }
    }
)

export const selectPerformanceById = (state, key, year) => {
    return state.performances?.[key]?.[year || "total"]
}