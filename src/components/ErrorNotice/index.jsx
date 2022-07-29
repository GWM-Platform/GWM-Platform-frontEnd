import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFrown } from '@fortawesome/free-regular-svg-icons'
import { Container } from 'react-bootstrap'
import './index.css'

const ErrorNotice = () => {
    const { t } = useTranslation();

    return (
        <Container className="ErrorBoundary">
            <div className="min-100vh d-flex justify-content-center align-items-center flex-column">
                                     
                    <FontAwesomeIcon icon={faFrown} className="icon"/>
                    <h2 className="title">{t("There was an error")}</h2>
            </div>
        </Container>
    )
}
export default ErrorNotice
