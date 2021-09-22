import React,{useContext,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { currencyContext } from '../../context/currencyContext';
import {
  CButton,
} from '@coreui/react'
import './index.css';
import { useState } from 'react';
import FormNewCurrency from './FormNewCurrency';
import CurrencyTable from './CurrencyTable'
import { useTranslation } from "react-i18next";

const ContainerWwcurrencyList = () => {
  const { t } = useTranslation();

  const {  list,deleteItem } = useContext(currencyContext)
  const [showForm,setShowForm]=useState(false)

  const [placeholder,setPlaceholder]=useState("")
  const [placeholderName,setPlaceholderName]=useState("")
  const [placeholderSymbol,setPlaceholderSymbol]=useState("")

  const [disabled,setDisabled]=useState(false)
  
  const toggleForm = (placeholder) =>{
    if(showForm===true){
      setShowForm(false)
      setPlaceholder("");
      setPlaceholderName("");
      setPlaceholderSymbol("");
      setDisabled(false);
    }else{setShowForm(true)}
    if(placeholder===null){
      setPlaceholder("");
      setPlaceholderName("");
      setPlaceholderSymbol("");
      setDisabled(false);
    }
    
  }

  const setPlaceHolderAndDisabled = (code,name,symbol) =>{
    setPlaceholder(code);
    setPlaceholderName(name);
    setPlaceholderSymbol(symbol);
    setDisabled(true);
  }
  
  useEffect(() => {   
    return () => {  
    }
  }, [list])
  return (
    <Container>
      <Row className="mt-5">
        <h1>{t("Currencies")}</h1>
        {!showForm && <Col md="2">
          <CButton color="danger" className="mainColor block my-4" onClick={toggleForm}>
            {t("Add New")}
          </CButton>
        </Col>}
        {showForm && <FormNewCurrency toggleForm={toggleForm} disabled={disabled} placeholder={placeholder} placeholderName={placeholderName} placeholderSymbol={placeholderSymbol}/>}
        {!showForm &&<CurrencyTable list={list} setPlaceHolderAndDisabled={setPlaceHolderAndDisabled} toggleForm={toggleForm} deleteItem={deleteItem}/>}
      </Row>
    </Container>
  )
}
export default ContainerWwcurrencyList
