import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

const initialState = {
    clients: [],
    params: {},
    status: 'idle',
    error: null
}

const clientsSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {
        reset: (state, action) => ({ ...initialState }),
        markAsRead: (state, action) => {
            const { id } = action.payload
            const client = state.clients.find(client => client.id === id)
            if (client) {
                client.read = true
            }
        },
        toggleEnabled: (state, action) => {
            const { id } = action.payload
            const client = state.clients.find(client => client.id === id)
            if (client) {
                client.enabled = !client.enabled
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchclients.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchclients.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.clients = action.payload
            })
            .addCase(fetchclients.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
    }
})
export const { reset, markAsRead, toggleEnabled } = clientsSlice.actions

export default clientsSlice.reducer

export const fetchclients = createAsyncThunk(
    'dashboardUtilities/fetchclients',
    async (queryStrings) => {
        let params = { ...queryStrings }
        for (const key of Object.keys(params)) {
            if (params[key] === "") {
                delete params[key];
            }
        }
        const response = await axios.get('/clients', {
            params: {
                all: params.all,
                showUsers: params.showUsers
            }
        })
        return response.data
    }
)

export const selectAllclients = state => state.clients.clients
export const selectAllUsedParams = state => state.clients.params

export const selectclientById = (state, clientId) =>
    state.clients.clients.find(client => client.id + "" === clientId + "")