import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    html: '',
    title: '',
    bodyClass: '',
    printActive: false
}

const PrintHtmlSlice = createSlice({
    name: 'PrintHtml',
    initialState,
    reducers: {
        resetHtmlPrint: () => ({ ...initialState }),
        setHtmlPrint: (state, action) => ({ ...action?.payload }),
        setPrintActive: (state, action) => ({ printActive: true })
    }
})
export const { resetHtmlPrint, setHtmlPrint, setPrintActive } = PrintHtmlSlice.actions

export default PrintHtmlSlice.reducer

export const selectPrintHtml = state => state.PrintHtml
export const isHtmlPrintActive = state => !!(state.PrintHtml.html || state.PrintHtml.printActive)
