import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Button, Row, Col, Card, Form } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { useHistory } from 'react-router-dom';
import LanguageSelector from 'components/LanguageSelector';
import './index.scss'
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setDataFromLogin } from 'Slices/DashboardUtilities/userSlice';

const SetUserData = () => {

    const dispatch = useDispatch()
    const user = useSelector(selectUser)

    const [validated, setValidated] = useState(false)

    const toLogin = () => {
        sessionStorage.clear(); history.push(`/login`);
    }

    const toDashBoard = () => {
        user.isAdmin ?
            history.push(`/DashBoard/FundsAdministration`)
            :
            history.push(`/DashBoard/accounts`)
    }

    const history = useHistory();

    const token = sessionStorage.getItem('access_token')
    if (token === null) toLogin()

    const { t } = useTranslation();

    const [Data, setData] = useState({
        firstName: "",
        lastName: "",
        dni: "",
        phone: "",
        address: "",
        infoUpdated: false
    })

    const patchUser = async () => {
        var url = `${process.env.REACT_APP_APIURL}/users/me`;

        const response = await fetch(url, {
            method: 'PATCH',
            body: JSON.stringify({
                firstName: Data.firstName,
                lastName: Data.lastName,
                dni: Data.dni,
                phone: Data.phone,
                address: Data.address
            }),
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 200) {
            dispatch(setDataFromLogin({ prevState: user, user: Data }))
            setData({ ...Data, ...{ infoUpdated: true } })
        } else {
            switch (response.status) {
                case 500:
                    break;
                default:
                    console.log(response.status)
            }
        }
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        setValidated(true)
        if (form.checkValidity()) {
            patchUser()
        }
    };

    const handleChange = (event) => {
        let aux = Data
        aux[event.target.id] = event.target.value
        setData({ ...Data, ...aux })
    }

    return (
        <div className="setUserData growOpacity">
            <div className="languageSelectorContainer">
                <LanguageSelector />
            </div>
            <Container >
                <Row className="justify-content-center d-flex">
                    <Col xs="11" lg="8">
                        <Card className="Card">
                            <Card.Body className="growOpacity" >
                                {Data.infoUpdated ?
                                    <div className="result growOpacity">
                                        <h1 className="icon" >
                                            <FontAwesomeIcon icon={faCheckCircle} />
                                        </h1>
                                        <h2 className="label">
                                            {t("Your personal information has been updated successfully")}
                                        </h2>
                                        <Col xs="12" className="d-flex justify-content-center">
                                            <Button variant="danger" onClick={() => toDashBoard()} className='btn mainColor mt-4'>
                                                {t("To DashBoard")}
                                            </Button>
                                        </Col>
                                    </div>
                                    :
                                    <div className="growOpacity">

                                        <div className="d-flex align-items-center mb-2">
                                            <h1 className="mb-0" style={{ height: "1em" }}>
                                                <img className='d-block h-100' src={process.env.PUBLIC_URL + '/images/logo/logo.svg'} alt="" />
                                            </h1>
                                            <h1 className="mb-0" style={{ height: "1em" }}>
                                                <div style={{ height: "100%", width: "1px", margin: "0 10px", border: "1px solid gray" }}></div>
                                            </h1>
                                            <h1 className="mb-0">{t("Welcome back!")}</h1>
                                        </div>
                                        <h3>{t("In order to provide you with a better personalized experience, we would like to request your additional information. Please take a moment to complete the following fields with your personal information. You will have the option to edit this information later from your account settings.")}</h3>
                                        <Form noValidate validated={validated} onSubmit={handleSubmit}>
                                            <Row className="mb-2 gy-2">
                                                <Col xs="12" className='pt-2'>
                                                    <div className='w-100 m-0' style={{ borderBottom: "1px solid lightgray" }} />
                                                </Col>
                                                <Col xs="6">
                                                    <Form.Group>
                                                        <Form.Label className="ms-2 mb-1">{t("First name")}</Form.Label>
                                                        <Form.Control
                                                            id="firstName"
                                                            type="text"
                                                            value={Data.firstName}
                                                            required
                                                            maxLength={30}
                                                            onChange={handleChange}
                                                        />
                                                        <Form.Control.Feedback>{t("Looks good")}!</Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col xs="6">
                                                    <Form.Group>
                                                        <Form.Label className="ms-2 mb-1">{t("Last name")}</Form.Label>
                                                        <Form.Control
                                                            id="lastName"
                                                            type="text"
                                                            maxLength={30}
                                                            value={Data.lastName}
                                                            required
                                                            onChange={handleChange}
                                                        />
                                                        <Form.Control.Feedback>{t("Looks good")}!</Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col xs="6">
                                                    <Form.Group>
                                                        <Form.Label className="ms-2 mb-1">{t("DNI")}</Form.Label>
                                                        <Form.Control
                                                            id="dni"
                                                            type="text"
                                                            maxLength={30}
                                                            value={Data.dni}
                                                            required
                                                            onChange={handleChange}
                                                        />
                                                        <Form.Control.Feedback>{t("Looks good")}!</Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <div className='w-100 m-0' />
                                                <Col xs="6">
                                                    <Form.Group>
                                                        <Form.Label className="ms-2 mb-1">{t("Phone number")}</Form.Label>
                                                        <Form.Control
                                                            id="phone"
                                                            type="tel"
                                                            maxLength={30}
                                                            value={Data.phone}
                                                            required
                                                            onChange={handleChange}
                                                        />
                                                        <Form.Control.Feedback>{t("Looks good")}!</Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col xs="6">
                                                    <Form.Group>
                                                        <Form.Label className="ms-2 mb-1">{t("Address")}</Form.Label>
                                                        <Form.Control
                                                            id="address"
                                                            type="text"
                                                            maxLength={30}
                                                            value={Data.address}
                                                            required
                                                            onChange={handleChange}
                                                        />
                                                        <Form.Control.Feedback>{t("Looks good")}!</Form.Control.Feedback>
                                                    </Form.Group>
                                                </Col>
                                                <Col xs="12" className="d-flex justify-content-end">
                                                    <Button variant="danger" type="submit" className='btn mainColor mt-4'>
                                                        {t("Submit")}
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </Form>
                                    </div>
                                }
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>


    )
}

export default SetUserData