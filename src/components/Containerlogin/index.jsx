import React, { useState, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import FormDesktop from './FormDesktop';
import { Col, Row, Container } from 'react-bootstrap'
import FormMobile from './FormMobile';
import { useHistory } from 'react-router-dom';
import { urlContext } from '../../context/urlContext';

const ContainerLogin = () => {
  const { urlPrefix } = useContext(urlContext)
  let history = useHistory();
  const toDashBoard = (path) => {
    history.push(`/dashboardNew/${path}`);
  }

  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [error, setError] = useState("");
  const [buttonContent, setButtonContent] = useState("Login");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});

  const handleChange = (event) => {
    let aux = data;

    if (event.target.id === "api") {
      aux[event.target.id] = event.target.checked;
      console.log(event.target.checked)
    } else {
      aux[event.target.id] = event.target.value;
    }

    setData(aux);
    setButtonDisabled(((data.password !== undefined && data.password !== "") && (data.email !== undefined && data.email !== "")) ? false : true)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setButtonDisabled(true)
    setLoading(true)
    setButtonContent("Loading")
    if (data.api) {
      loginWithApi()
    } else {
      loginWithoutApi()
    }

  }
  const loginWithoutApi = () => {
    if (data.username === "admin" && data.password === "1234") {
      sessionStorage.setItem("admin", true)
      toDashBoard("addAccount");
      setError("")
    } else if (data.username === "user" && data.password === "1234") {
      sessionStorage.setItem("admin", false)
      toDashBoard("accounts");
      setError("")
    } else {
      setError("Sorry, the login failed! Please Try again")
      setButtonContent("Login")
      setButtonDisabled(false)
      setLoading(false)
    }
  }

  const loginWithApi = async() => {
    var url = `${urlPrefix}/auth/login`;
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify({ email: data.email, password: data.password }),
      headers: {
        Accept: "*/*",
        'Content-Type': 'application/json'
      }
    })
  
    if (response.status === 200) {
      const data = await response.json()
      sessionStorage.setItem("access_token",data.access_token)
      sessionStorage.setItem("admin", false)
      toDashBoard("accounts");
      setError("") 
    } else {
      console.log(response.json()) 
      setError("Sorry, the login failed! Please Try again")
      setButtonContent("Login")
      setButtonDisabled(false)
      setLoading(false)    }
  }
  return (
    <div className="login">
      <Container>
        <Row className="d-flex min-vh-100  justify-content-center align-items-start align-items-lg-center pt-3">
          <Col xs="11" sm="8" md="6" lg="4" xl="3">
            <FormDesktop
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              buttonDisabled={buttonDisabled}
              setButtonDisabled={setButtonDisabled}
              error={error}
              setError={setError}
              buttonContent={buttonContent}
              setButtonContent={setButtonContent}
              loading={loading}
              setLoading={setLoading}
              data={data}
              setData={setData} />
            <FormMobile
              handleChange={handleChange}
              handleSubmit={handleSubmit}
              buttonDisabled={buttonDisabled}
              setButtonDisabled={setButtonDisabled}
              error={error}
              setError={setError}
              buttonContent={buttonContent}
              setButtonContent={setButtonContent}
              loading={loading}
              setLoading={setLoading}
              data={data}
              setData={setData} />
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default ContainerLogin