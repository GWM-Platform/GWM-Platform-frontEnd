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
  const [Some,setSome] = useState(false);

  const [data, setData] = useState({ email: "", password: "", api: false });

  const handleChange = (event) => {
    let aux = data;
    switch (event.target.id) {
      case 'api':
        aux[event.target.id] = event.target.checked;
        break
      case 'api1':
        aux[event.target.id] = event.target.checked;
        break
      case 'email1':
        aux.email = event.target.value
        break
      case 'password1':
        aux.password = event.target.value
        break
      default:
        aux[event.target.id] = event.target.value;
        break
    }
    setData(aux);
    setSome(!Some)
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
    if (data.email === "admin" && data.password === "1234") {
      sessionStorage.setItem("admin", true)
      toDashBoard("addAccount");
      setError("")
    } else if (data.email === "user" && data.password === "1234") {
      sessionStorage.setItem("admin", false)
      toDashBoard("accounts");
    } else {
      setError("Sorry, the login failed! Please Try again")
      setButtonContent("Login")
      setButtonDisabled(false)
      setLoading(false)
    }
  }

  const loginWithApi = async () => {
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
      sessionStorage.setItem("access_token", data.access_token)
      sessionStorage.setItem("admin", false)
      toDashBoard("accounts");
    } else {
      switch (response.status) {
        case 500://Unhandled (Por ahora lo tira cuando el mail no matchea con ninguno de los de la DB)
          setError("Error. Vefique los datos ingresados")
          break;
        case 401://Unauthorized, deberia saltar por el mail tambien
          setError("Error. Vefique los datos ingresados")
          break;
        default:
          console.log(response.status)
          setError("unhandled Message")
      }
      setButtonContent("Login")
      setButtonDisabled(false)
      setLoading(false)
    }
  }
  return (
    <div className="login" style={{backgroundImage:`url(${process.env.PUBLIC_URL}/images/layered-peaks-haikei.svg)`}}>
      <Container>
        <Row className="d-flex min-vh-100  justify-content-center align-items-start align-items-lg-center pt-3">
          <Col xs="11" sm="8" md="6" lg="5" xl="4">
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