import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next';

const CreateForm = ({ data, handleChange, handleSubmit, CreateRequest, Action, setAction, validated }) => {
    const { t } = useTranslation()

    return (
        <div className="editForm">
            <div className="header">
                <h1 className="title fw-normal">
                    {t("Create liquidation option")}
                </h1>
                <FontAwesomeIcon
                    className="button icon"
                    onClick={() => setAction({ ...Action, ...{ action: -1, note: -1 } })}
                    icon={faChevronCircleLeft}
                />
            </div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>{t("Name")} *</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        id="nombre"
                        value={data.nombre}
                        onChange={handleChange}
                        maxLength={255}
                        placeholder={t("Enter liquidation option name")}
                    />
                    <Form.Control.Feedback type="invalid">
                        {t("Please provide a name")}
                    </Form.Control.Feedback>
                </Form.Group>

                <div className="d-flex justify-content-end mt-4">
                    <Button
                        type="submit"
                        variant="danger"
                        className="mb-3"
                        disabled={CreateRequest.fetching}
                    >
                        {CreateRequest.fetching ? t("Creating...") : "Enviar"}
                    </Button>
                </div>
            </Form>
        </div>
    )
}

export default CreateForm

