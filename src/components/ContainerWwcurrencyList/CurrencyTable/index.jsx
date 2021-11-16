import React from 'react'
import { useState,useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Table, InputGroup, FormControl, Button } from 'react-bootstrap';
import WwcurrencyItem from './WwcurrencyItem';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import './index.css';
import { useTranslation } from "react-i18next";

const CurrencyTable = ({ list, toggleForm, setPlaceHolderAndDisabled, deleteItem }) => {
  const { t } = useTranslation();
  const [result, setResult] = useState(list)
  const [searchTerm,setSearchTerm] = useState("")
  const handleChange = (event) => {
    let nameToFind = event.target.value
    setResult(filterResult(nameToFind,list))
    setSearchTerm(nameToFind)
  }

  useEffect(() => {
    setResult(filterResult(searchTerm,list))
  return () => {
  }
  },[list,searchTerm] )


  return (
    <Col md="12">
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search"
          aria-label="Search"
          aria-describedby="basic-addon2"
          onChange={handleChange}
        />
        <InputGroup.Append>
          <Button variant="danger" className="mainColor" style={{ borderTopLeftRadius: "0", borderBottomLeftRadius: "0" }}>
            <FontAwesomeIcon icon={faSearch} className="icon" />
          </Button>
        </InputGroup.Append>
      </InputGroup>
      {result.length===0 ? <h2>{t("No search results Fund")}</h2> :
             <Table striped bordered hover>
             <thead>
               <tr>
                 <th>{t("Currency Code")}</th>
                 <th>{t("Currency Name")}</th>
                 <th>{t("Currency Symbol")}</th>
               </tr>
             </thead>
             <tbody>
               {result.map((u, i) => { ; return (<WwcurrencyItem deleteItem={deleteItem} toggleForm={toggleForm} setPlaceHolderAndDisabled={setPlaceHolderAndDisabled} key={i} id={i} code={u.code} name={u.name} symbol={u.symbol} />) })}
             </tbody>
           </Table>   
      }
    </Col>
  )
}

export default CurrencyTable

const filterResult = (nameToFind,list) => {
  var results = []
  list.forEach((list) => {
    if (list.name.toLowerCase().includes(nameToFind.toLowerCase())) {
      results.push(list);
    }
  });
  return results
}
