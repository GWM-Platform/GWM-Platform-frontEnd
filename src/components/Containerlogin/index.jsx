import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

import { useHistory, useLocation } from 'react-router-dom';
import FormDesktop from './FormDesktop';
import { Col, Row, Container } from 'react-bootstrap'
import FormMobile from './FormMobile';
import LanguageSelector from 'components/LanguageSelector'
import axios from 'axios';
import { setDataFromLogin } from 'Slices/DashboardUtilities/userSlice';
import { useDispatch } from 'react-redux';
import { customFetch } from 'utils/customFetch';

const ContainerLogin = () => {

  const dispatch = useDispatch()

  function useQuery() {
    const { search } = useLocation();

    return React.useMemo(() => new URLSearchParams(search), [search]);
  }

  const desiredLocation = useQuery().get("loc")
  const desiredId = useQuery().get("id")
  const desiredType = useQuery().get("type")
  const desiredClient = useQuery().get("client")
  const transferId = useQuery().get("transferId")
  const shareTransferId = useQuery().get("shareTransferId")
  const desiredFundId = useQuery().get("fundId")

  let history = useHistory();

  const toDashBoard = (path) => {
    history.push(`/DashBoard/${path}`);
  }

  const toSetPassword = () => {
    history.push(`/setPassword`);
  }

  const toSetUserData = () => {
    history.push(`/setUserData`);
  }

  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [error, setError] = useState("");
  const [buttonContent, setButtonContent] = useState("Login");
  const [loading, setLoading] = useState(false);
  const [Some, setSome] = useState(false);

  const [FormData, setFormData] = useState({ email: "", password: "" });
  const [width, setWidth] = useState(window.innerWidth);

  const handleChange = (event) => {
    let aux = FormData;
    if (event.target.id === "admin") {
      aux[event.target.id] = event.target.checked
    } else {
      aux[event.target.id] = event.target.value;
    }
    setFormData(aux);
    setSome(!Some)
    setButtonDisabled(((FormData.password !== undefined && FormData.password !== "") && (FormData.email !== undefined && FormData.email !== "")) ? false : true)
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setButtonDisabled(true)
    setLoading(true)
    setButtonContent("Loading")
    Login()
  }

  const Login = async () => {
    var url = `${process.env.REACT_APP_APIURL}/auth/login`;
    const response = await customFetch(url, {
      method: 'POST',
      body: JSON.stringify({ email: FormData.email, password: FormData.password }),
      headers: {
        Accept: "*/*",
        'Content-Type': 'application/json'
      }
    })

    if (response.status === 200) {
      const data = await response.json()
      dispatch(setDataFromLogin({ prevState: {}, ...data }))
      axios.defaults.headers.common['Authorization'] = `Bearer ${data?.access_token}`
      sessionStorage.setItem("access_token", data.access_token)
      sessionStorage.setItem("admin", data.user.isAdmin)
      sessionStorage.setItem("session_userId", data.user.id)

      if (!data.user.changedPassword && !data.user.isAdmin) {
        toSetPassword()
      } else if (data?.user?.firstName === null || data?.user?.lastName === null || data?.user?.phone === null || data?.user?.address === null || data?.user?.dni === null) {
        toSetUserData()
      } else {
        let destination = ""
        if (data.user.isAdmin) {
          if (desiredClient) {
            if (desiredLocation && desiredId && desiredType) {
              destination = `Accounts?loc=${desiredLocation}&id=${desiredId}&type=${desiredType}&client=${desiredClient}${desiredFundId ? `&fundId=${desiredFundId}` : ""}`
            } else if (transferId) {
              destination = `Accounts?loc=history&client=${desiredClient}&id=${transferId}&type=transfers`
            } else if (shareTransferId && desiredFundId) {
              destination = `Accounts?loc=history&client=${desiredClient}&id=${shareTransferId}&type=share-transfers&fundId=${desiredFundId}`
            } else {
              destination = `TicketsAdministration`
            }
          } else {
            if (desiredLocation && desiredId && desiredType) {
              destination = `TicketsAdministration?loc=${desiredLocation}&id=${desiredId}&type=${desiredType}`
            } else {
              destination = `TicketsAdministration`
            }
          }
        } else {
          if (desiredLocation && desiredId && desiredType && desiredClient) {
            destination = `Accounts?loc=${desiredLocation}&id=${desiredId}&type=${desiredType}&client=${desiredClient}${desiredFundId ? `&fundId=${desiredFundId}` : ""}`
          } else if (transferId) {
            destination = `Accounts?loc=history&client=${desiredClient}&id=${transferId}&type=transfers`
          } else if (shareTransferId) {
            destination = `Accounts?loc=history&client=${desiredClient}&id=${shareTransferId}&type=share-transfers`
          } else {
            destination = `Accounts`
          }
        }
        toDashBoard(destination);
      }
    } else {
      switch (response.status) {
        case 500://Unhandled (Por ahora lo tira cuando el mail no matchea con ninguno de los de la DB)
          setError("Error. Verify the entered data")
          break;
        case 401://Unauthorized, deberia saltar por el mail tambien
          setError("Error. Verify the entered data")
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
    <div className="login p-relative"
      style={{ backgroundImage: `url(${process.env.PUBLIC_URL}/images/backGround/background.jpg)` }}>
      <div className="languageSelectorContainer">
        <LanguageSelector />
      </div>
      <Container>
        <Row className="d-flex min-vh-100  justify-content-center align-items-start align-items-sm-center pt-3">
          <Col xs="11" sm="8" md="6" lg="5" xl="4" className="growAnimation">
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
                data={FormData}
                setData={setFormData} />
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
                data={FormData}
                setData={setFormData} />
            }
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default ContainerLogin