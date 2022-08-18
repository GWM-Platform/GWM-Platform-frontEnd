import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Button, Container } from 'react-bootstrap'
import './index.scss'
import { faExclamation } from '@fortawesome/free-solid-svg-icons';
import { faCircle } from '@fortawesome/free-regular-svg-icons';

const ErrorNotice = () => {
    const { t } = useTranslation();
    function refreshPage() {
        window.location.reload(false);
    }
    return (
        <Container className="ErrorBoundary">
            <div className="min-100vh d-flex justify-content-center align-items-center flex-column">
                <h1 className='p-relative icon' >
                    <FontAwesomeIcon
                        className="p-absolute"
                        icon={faExclamation}
                        style={{
                            transform: "translate(-50%, -50%)",
                            top: "50%",
                            left: "50%"
                        }}
                    />
                    <FontAwesomeIcon
                        icon={faCircle}
                        className="p-absolute"
                        style={{
                            transform: "translate(-50%, -50%) scale(1.5)",
                            top: "50%",
                            left: "50%"
                        }}
                    />
                    <FontAwesomeIcon icon={faCircle} style={{ visibility: "hidden", transform: "scale(1.5)" }} />
                </h1>
                <h2 className="title mt-4">{t("Sorry, something went wrong")}</h2>
                <h3 className="subtitle mt-1" style={{maxWidth:"60ch"}}>{t("Our team has been notified. Reload the page or, if this keeps happening, try again later")}</h3>
                <Button type="button" onClick={() => refreshPage()}>{t("Reload page")}</Button>
            </div>
        </Container>
    )
}
export default ErrorNotice
