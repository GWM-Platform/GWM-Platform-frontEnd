import React from 'react'
import { createContext } from 'react';

export const urlContext = createContext();

export const UrlContext = ({ children }) => {
    const urlPrefix="http://nbanking-staging-alb-754633710.us-east-1.elb.amazonaws.com"
   
    return <urlContext.Provider value={{urlPrefix }}>
        {children}
    </urlContext.Provider>
}