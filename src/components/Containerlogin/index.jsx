import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import FormDesktop from './FormDesktop';
import { Col, Row, Container } from 'react-bootstrap'
import FormMobile from './FormMobile';
import { useHistory } from 'react-router-dom';

const ContainerLogin = () => {
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
    aux[event.target.id] = event.target.value;
    setData(aux);
    setButtonDisabled(((data.password !== undefined && data.password !== "") && (data.username !== undefined && data.username !== "")) ? false : true)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setButtonDisabled(true)
    setLoading(true)
    setButtonContent("Loading")
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