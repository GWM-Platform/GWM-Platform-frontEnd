import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import {

} from '@coreui/react'
import './index.css';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from '@fortawesome/free-solid-svg-icons' 
import { faTrash } from '@fortawesome/free-solid-svg-icons' 

const WwcurrencyItem = ({ code,name,symbol,func,id,toggleForm,setPlaceHolderAndDisabled,deleteItem}) => {
  const [trclass,setTRClass]=useState("")
  const [icons,setIcons]=useState(false)

  const funcion=()=>{
    if(trclass==="selected"){
      setTRClass("")
      setIcons(false)
    }else{
      setTRClass("selected")
      setIcons(true)
    }
  }

  const editCurrency=()=>{
    setPlaceHolderAndDisabled(code,name,symbol);
    toggleForm();
  }

  const deleteCurrency=()=>{
    deleteItem({
      "code": code,
      "name": name,
      "symbol": symbol
    })
  }

  return (
    <tr onClick={funcion} className={trclass}>
      <td><FontAwesomeIcon icon={faEdit} className="icon me-2"  style={{visibility: icons ?   'visible' :'hidden'}}  onClick={editCurrency}/>
      <FontAwesomeIcon icon={faTrash} className="icon me-2"  style={{visibility: icons ?   'visible' :'hidden'}} onClick={deleteCurrency}/>
        {code}</td>
      <td>{name}</td>
      <td>{symbol}</td>
    </tr>
  )
}
export default WwcurrencyItem
