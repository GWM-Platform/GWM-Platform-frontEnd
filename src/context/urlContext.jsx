import React from 'react'
import { createContext } from 'react';

export const urlContext = createContext();

export const UrlContext = ({ children }) => {
    const urlPrefix="http://localhost:3000"
   
    return <urlContext.Provider value={{urlPrefix }}>
        {children}
    </urlContext.Provider>
}