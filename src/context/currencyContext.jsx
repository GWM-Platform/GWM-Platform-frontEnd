import React from 'react'
import { createContext, useState } from 'react';

export const currencyContext = createContext();

export const CurrencyProvider = ({ children }) => {
    const [list, setList] = useState(
        [{
            "code": "53",
            "name": "Bitcoin",
            "symbol": "3"
        },
        {
            "code": "21",
            "name": "Ethereum",
            "symbol": "12"
        },
        {
            "code": "51",
            "name": "Shiba inu",
            "symbol": "434"
        },
        {
            "code": "11",
            "name": "Algo",
            "symbol": "99"
        }])

    const isInListName = (name) => {
        return list.some(function (el) {
            return el.name === name;
        });
    }
    const isInListCode = (code) => {
        return list.some(function (el) {
            return el.code === code;
        });
    }
    const getIndex = (codeToFind) => {
        var index = list.findIndex(x => x.code === codeToFind);
        return index;
    }

    const addItem = (currency) => {
        if(!isInListName(currency.name)&&!isInListCode(currency.code)){
            setList([...list, currency]);
            return(true)
        }else{
            return(false)
        }
    }
    const editItem = (currency) => {
        const newIds = list.slice()
        isInListCode(currency.code)
        var index=getIndex(currency.code)
        newIds[index].name=currency.name
        newIds[index].symbol=currency.symbol
        setList(newIds);
    }

    const deleteItem = (currency) =>{
        var index=getIndex(currency.code)
        const newIds = list.slice()
        newIds.splice(index,1)
        setList(newIds);
    }
    return <currencyContext.Provider value={{ list, setList, isInListName,isInListCode, addItem,editItem,deleteItem }}>
        {children}
    </currencyContext.Provider>
}