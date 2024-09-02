import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {}

const annualStatementsSlice = createSlice({
    name: 'annualStatements',
    initialState,
    reducers: {
        reset: (state, action) => ({ ...initialState })
    },
    extraReducers(builder) {
        builder
            .addCase(fetchAnnualStatement.pending, (state, action) => {
                const year = action?.meta?.arg?.year || "total"
                state[year] = { status: 'loading', content: {} }
            })
            .addCase(fetchAnnualStatement.fulfilled, (state, action) => {
                const year = action?.payload?.year || "total"
                state[year] = { status: 'succeeded', annualStatement: action.payload.response }
            })
            .addCase(fetchAnnualStatement.rejected, (state, action) => {
                const year = action?.meta?.arg?.year || "total"
                state[year] = { status: 'error', annualStatement: {}, error: action.error.message }
            })
    }
})
export const { reset } = annualStatementsSlice.actions

export default annualStatementsSlice.reducer

export const fetchAnnualStatement = createAsyncThunk(
    'dashboardUtilities/fetchAnnualStatement',
    async (queryStrings) => {
        let params = { ...queryStrings }
        for (const key of Object.keys(params)) {
            if (params[key] === "") {
                delete params[key];
            }
        }

        const response = await axios.get(
            `/clients/${params.clientId}/annualStatement`, {
            params: {
                year: params.year,
            }
        })

        return { response: response.data, year: params.year }
    }
)

export const selectAnnualStatementById = (state, year) => {
    return state.annualStatements?.[year || "total"]
}