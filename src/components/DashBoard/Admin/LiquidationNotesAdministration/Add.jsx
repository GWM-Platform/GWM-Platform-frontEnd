import React, { useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Form, Button } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import { DashBoardContext } from 'context/DashBoardContext';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { customFetch } from 'utils/customFetch';

export const Add = () => {
    const { token, toLogin } = useContext(DashBoardContext)
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        nombre: ""
    })

    const [message, setMessage] = useState()
    const [validated, setValidated] = useState(false);
    const [buttonDisabled, setButtonDisabled] = useState(false)
    
    const handleChange = (event) => {
        setFormData(prevState => ({ ...prevState, [event.target.id]: event.target.value }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            createNote()
        }
        setValidated(true);
    }

    const history = useHistory()

    const createNote = async () => {
        setButtonDisabled(true)
        const url = `${process.env.REACT_APP_APIURL}/liquidation-notes`;
        
        const response = await customFetch(url, {
            method: 'POST',
            body: JSON.stringify(formData),
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 201) {
            setMessage(t("Liquidation option created successfully"))
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
                <h1 className="title">{t("Create liquidation option")}</h1>
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

