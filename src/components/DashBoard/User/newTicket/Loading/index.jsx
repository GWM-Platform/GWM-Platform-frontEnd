import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Spinner } from 'react-bootstrap'

const Loading = () => {
    const { t } = useTranslation();

    return (
        <div className="h-100 d-flex align-items-center justify-content-center">
            <div className='d-flex align-items-center'>
                <Spinner className="me-2" animation="border" variant="primary" />
                <span className="loadingText">
                    {t("Loading")}
                    </span>
            </div>
        </div>
    )
}
export default Loading