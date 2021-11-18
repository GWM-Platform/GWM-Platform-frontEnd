import React, { useState, useEffect } from 'react'
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
  const [Some, setSome] = useState(false);

  const [data, setData] = useState({ email: "", password: "", api: false });
  const [Background, setBackground] = useState("background1.png");
  const [width, setWidth] = useState(window.innerWidth);

  const handleChange = (event) => {
    let aux = data;
    switch (event.target.id) {
      case 'api':
        aux[event.target.id] = event.target.checked;
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
      setError("Sorry, the login failed! Pleasse Try again")
      setButtonContent("Login")
      setButtonDisabled(false)
      setLoading(false)
    }
  }

  const loginWithApi = async () => {
    var url = `${process.env.REACT_APP_APIURL}/auth/login`;
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

  const cycleBG = () => {
    let backgroundNumber = (Background.slice(10, -4))
    if (backgroundNumber <= 3) {
      setBackground(`background${parseInt(backgroundNumber) + 1}.png`)
    } else if (backgroundNumber <= 5) {
      setBackground(`background${parseInt(backgroundNumber) + 1}.svg`)
    } else {
      setBackground("background1.png")
    }
  }

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  let isMobile = (width <= 576);

  useEffect(() => {
    window.addEventListener('resize', handleWindowSizeChange);
    return () => {
      window.removeEventListener('resize', handleWindowSizeChange);
    }
  }, [])

  return (
    <div
      onClick={() => { cycleBG() }} className="login"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/background/${Background})` }}>
      <Container>
        <Row className="d-flex min-vh-100  justify-content-center align-items-start align-items-lg-center pt-3">
          <Col xs="11" sm="8" md="6" lg="5" xl="4">
            {isMobile ?
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
                :
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
            }
          </Col>
        </Row>
      </Container>
    </div>
  )
}
export default ContainerLogin