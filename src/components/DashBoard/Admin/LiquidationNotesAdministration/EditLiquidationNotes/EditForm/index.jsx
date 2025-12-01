import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Container, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faCheck } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next';

const EditForm = ({ data, setData, handleChange, handleSubmit, EditRequest, Notes, Action, setAction, validated }) => {
    const { t } = useTranslation()

    return (
        <Container>
            <Row>
                <Col sm="12">
                    <div className="header-with-border mb-4">
                        <h1 className="title">{t("Edit liquidation option")}</h1>
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

                        <div className="d-flex justify-content-between mt-4">
                            <Button
                                variant="outline-secondary"
                                onClick={() => setAction({ ...Action, ...{ action: -1, note: -1 } })}
                            >
                                <FontAwesomeIcon className="me-2" icon={faArrowLeft} />
                                {t("Back")}
                            </Button>
                            <Button
                                type="submit"
                                variant="success"
                                disabled={EditRequest.fetching}
                            >
                                {EditRequest.fetching ? t("Updating...") : (
                                    <>
                                        <FontAwesomeIcon className="me-2" icon={faCheck} />
                                        {t("Update")}
                                    </>
                                )}
                            </Button>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    )
}

export default EditForm

