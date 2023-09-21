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
                state[key] = { status: 'loading', performance: 0 }
            })
            .addCase(fetchPerformance.fulfilled, (state, action) => {
                const key = (
                    action?.payload?.fixedDepositId ?
                        "fixedDeposit"
                        :
                        (action?.payload?.fund || "totalPerformance")
                )
                state[key] = { status: 'succeeded', performance: action.payload.response }
            })
            .addCase(fetchPerformance.rejected, (state, action) => {
                const key = (
                    action?.meta?.arg?.fixedDepositId ?
                        "fixedDeposit"
                        :
                        (action?.meta?.arg?.fund || "totalPerformance")
                )
                state[key] = { status: 'error', performance: 0, error: action.error.message }
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
                year: params.year
            }
        })

        return { response: response.data, fund: params.fund, fixedDepositId: params.fixedDepositId }
    }
)

export const selectPerformanceById = (state, key) => {
    return state.performances?.[key]
}