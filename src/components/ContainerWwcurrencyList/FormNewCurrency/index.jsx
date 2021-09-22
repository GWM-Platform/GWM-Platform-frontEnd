import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useContext,useState,useEffect} from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

import { currencyContext } from '../../../context/currencyContext';
import {
  CButton,
} from '@coreui/react'
import './index.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons' 
import './index.css';
import { useTranslation } from "react-i18next";

const FormNewCurrency = ({toggleForm,disabled,placeholder,placeholderName,placeholderSymbol}) => {
  const {  addItem,editItem } = useContext(currencyContext)
  const [data,setData] = useState({})
  const { t } = useTranslation();

  const handleSubmit = (event) => {
    if(placeholder===""){
      if(!addItem(data)){
        alert("!!Error!!: La moneda que pretende agregar ya esta en la lista")
      }else{
        setData([])
        toggleForm();
      }
    }else{
      editItem(data);
      setData([])
      toggleForm();
    }
  };

  const handleChange = (event) => {
    data[event.target.id] = event.target.value
  }

  useEffect(() => {
    if(!(placeholder==="")){
      data.code=placeholder;
      data.name=placeholderName;
      data.symbol=placeholderSymbol;
    }
  })

  return (
    <div>
      <Col md="2">
        <CButton color="danger" className="mainColor my-4 block" onClick={toggleForm} >
        <FontAwesomeIcon icon={faChevronLeft} className="me-2" />
        {t("Return")}
        </CButton> 
      </Col>
      <div>
      <Col md="12">
        <Form className="border p-3" onSubmit={handleSubmit} action="#">
          <Form.Group as={Col} controlId="code">
            <Form.Label className="f-left">{t("Currency Code")}</Form.Label>
            <Form.Control required onChange={handleChange} defaultValue={placeholder} disabled={disabled}/>
          </Form.Group>
          <Form.Group as={Col} controlId="name">
            <Form.Label className="f-left">{t("Currency Name")}</Form.Label>
            <Form.Control required onChange={handleChange} defaultValue={placeholderName} />
          </Form.Group>
          <Form.Group as={Col} controlId="symbol">
            <Form.Label className="f-left">{t("Currency Symbol")}</Form.Label>
            <Form.Control required onChange={handleChange} defaultValue={placeholderSymbol}/>
          </Form.Group>
          <CButton color="danger"  type="submit"className="mainColor mt-4">
            {t("Submit")}
          </CButton>          
        </Form>
      </Col>
      </div>
    </div>
  )
}
export default FormNewCurrency
