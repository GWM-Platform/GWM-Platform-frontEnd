import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import { useTranslation } from 'react-i18next';

const EditResult = ({ EditRequest, setAction, chargeNotes, Notes, Action }) => {
    const { t } = useTranslation()

    return (
        <Container>
            <Row>
                <Col sm="12">
                    <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '400px' }}>
                        {
                            EditRequest.valid ?
                                <>
                                    <div className="d-flex justify-content-center align-items-center mb-4">
                                        <h1 className='p-relative' style={{ fontSize: "4rem" }}>
                                            <FontAwesomeIcon
                                                className="p-absolute"
                                                color="green"
                                                icon={faCheck}
                                                style={{
                                                    transform: "translate(-50%, -50%)",
                                                    top: "50%",
                                                    left: "50%"
                                                }}
                                            />
                                            <FontAwesomeIcon
                                                color="green"
                                                icon={faCircle}
                                                className="p-absolute"
                                                style={{
                                                    transform: "translate(-50%, -50%) scale(1.5)",
                                                    top: "50%",
                                                    left: "50%"
                                                }}
                                            />
                                            <FontAwesomeIcon className="placeHolder" icon={faCircle} style={{ transform: "scale(1.5)" }} />
                                        </h1>
                                    </div>
                                    <h2 className="text-center mb-4">{t("Liquidation option updated successfully")}</h2>
                                </>
                                :
                                <>
                                    <div className="d-flex justify-content-center align-items-center mb-4">
                                        <h1 className='p-relative' style={{ fontSize: "4rem" }}>
                                            <FontAwesomeIcon
                                                className="p-absolute"
                                                color="red"
                                                icon={faTimes}
                                                style={{
                                                    transform: "translate(-50%, -50%)",
                                                    top: "50%",
                                                    left: "50%"
                                                }}
                                            />
                                            <FontAwesomeIcon
                                                color="red"
                                                icon={faCircle}
                                                className="p-absolute"
                                                style={{
                                                    transform: "translate(-50%, -50%) scale(1.5)",
                                                    top: "50%",
                                                    left: "50%"
                                                }}
                                            />
                                            <FontAwesomeIcon className="placeHolder" icon={faCircle} style={{ transform: "scale(1.5)" }} />
                                        </h1>
                                    </div>
                                    <h2 className="text-center mb-4">{t("Failed to update liquidation option")}</h2>
                                </>
                        }
                        <Button
                            variant="outline-secondary"
                            onClick={() => {
                                chargeNotes();
                                setAction({ ...Action, ...{ action: -1, note: -1 } })
                            }}
                        >
                            <FontAwesomeIcon className="me-2" icon={faArrowLeft} />
                            {t("Back to list")}
                        </Button>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default EditResult

