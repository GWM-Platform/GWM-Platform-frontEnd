import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';

const Message = ({ messageVariants, selected }) => {
    const { t } = useTranslation();

    return (
        <Col className="my-5 d-flex justify-content-center align-items-center fetchMessage">
            <h1 className="p-0 m-0 text d-flex align-items-center">
                {
                    messageVariants[selected].needSpinner ?
                        <Spinner className="me-2 " animation="border" variant="danger" />
                        :
                        null
                }
                {t(messageVariants[selected].message)}
            </h1>
        </Col>

    )
}
export default Message


