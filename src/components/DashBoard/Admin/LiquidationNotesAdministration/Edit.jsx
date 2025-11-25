import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Form, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { DashBoardContext } from 'context/DashBoardContext';
import { useHistory, useParams } from 'react-router-dom/cjs/react-router-dom.min';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { customFetch } from 'utils/customFetch';
import Loading from 'components/DashBoard/User/MovementsTable/CardsContainer/MainCard/MainCardFund/MovementsTab/Loading';

export const Edit = () => {
    const { token, toLogin } = useContext(DashBoardContext)
    const { t } = useTranslation();
    const { id } = useParams()
    const [formData, setFormData] = useState({
        nombre: ""
    })

    const [message, setMessage] = useState()
    const [validated, setValidated] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [loading, setLoading] = useState(true)
    
    const handleChange = (event) => {
        setFormData(prevState => ({ ...prevState, [event.target.id]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            updateNote()
        }
        setValidated(true);
    }

    const history = useHistory()

    useEffect(() => {
        const fetchNote = async () => {
            setLoading(true)
            const url = `${process.env.REACT_APP_APIURL}/liquidation-notes/${id}`;
            
            const response = await customFetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                const data = await response.json()
                setFormData({ nombre: data.nombre })
                setLoading(false)
            } else {
                if (response.status === 401) toLogin()
                setLoading(false)
            }
        }

        if (id) {
            fetchNote()
        }
        //eslint-disable-next-line
    }, [id])

    const updateNote = async () => {
        setButtonDisabled(true)
        const url = `${process.env.REACT_APP_APIURL}/liquidation-notes/${id}`;
        
        const response = await customFetch(url, {
            method: 'PUT',
            body: JSON.stringify(formData),
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 200) {
            setMessage(t("Liquidation option updated successfully"))
            setButtonDisabled(false)
            history.push("/DashBoard/liquidationNotesAdministration")
        } else {
            if (response.status === 401) toLogin()
            if (response.status === 501) {
                setMessage(t("Server error. Try it again later"))
            } else {
                setMessage(t("Error. Verify the entered data"))
            }
            setButtonDisabled(false)
        }
    }

    if (loading) {
        return <Loading className="h-100 mb-5" />
    }

    return (
        <Col className="growOpacity section editForm">
            <div className="header" style={{ borderBottomColor: "#b3b3b3" }}>
                <Button
                    variant="link"
                    className="noStyle p-0 mb-2"
                    onClick={() => history.push("/DashBoard/liquidationNotesAdministration")}
                >
                    <FontAwesomeIcon icon={faChevronCircleLeft} style={{ fontSize: "1.5rem", color: "#082044" }} />
                </Button>
                <h1 className="title">{t("Edit liquidation option")}</h1>
            </div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>{t("Name")} *</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        id="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        maxLength={255}
                        placeholder={t("Enter liquidation option name")}
                    />
                    <Form.Control.Feedback type="invalid">
                        {t("Please provide a name")}
                    </Form.Control.Feedback>
                </Form.Group>

                {message && (
                    <div className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"}`} role="alert">
                        {message}
                    </div>
                )}

                <div className="d-flex justify-content-end mt-4">
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={buttonDisabled}
                    >
                        {t("Send")}
                    </Button>
                </div>
            </Form>
        </Col>
    )
}

