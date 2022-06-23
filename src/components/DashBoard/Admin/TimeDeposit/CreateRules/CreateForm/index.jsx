import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, FloatingLabel, Spinner } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'

const CreateForm = ({ data, fetchingCreateRequest, handleChange, ActionDispatch, validated, handleSubmit, AssetTypes }) => {
    const { t } = useTranslation();
    return (
        <div className="editForm">
            <div className="header">
                <h1 className="title">
                    {t("Rule creation")}
                </h1>
                <FontAwesomeIcon className="button icon" onClick={() => ActionDispatch({ type: "view" })} icon={faChevronCircleLeft} />
            </div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <FloatingLabel
                    label={t("Days")}
                    className="mb-3"
                >
                    <Form.Control required onChange={handleChange} min="1" step="1" id="days" value={data.days} type="number" placeholder={t("Days")} />
                    <Form.Control.Feedback type="invalid">
                        {t("The value must be greater than 0")}
                    </Form.Control.Feedback>
                </FloatingLabel>

                <FloatingLabel
                    label={t("Rate")}
                    className="mb-3"
                >
                    <Form.Control required onChange={handleChange} id="rate" value={data.rate} min="0.01" step="0.01" type="number" placeholder={t("Rate")} />
                    <Form.Control.Feedback type="invalid">
                        {t("The value must be greater than 0")}
                    </Form.Control.Feedback>
                </FloatingLabel>

                <div className="d-flex justify-content-end">
                    <Button variant="danger" type="submit" className="mb-3">
                        <Spinner animation="border" variant="light"
                            className={`${fetchingCreateRequest ? "d-inline-block" : "d-none"} littleSpinner ms-1`} />
                        {t("Submit")}
                    </Button>
                </div>
            </Form>
        </div>

    )
}

export default CreateForm