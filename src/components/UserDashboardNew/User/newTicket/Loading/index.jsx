import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Spinner } from 'react-bootstrap'

const Loading = () => {
    const { t } = useTranslation();

    return (
        <div class="h-100 d-flex align-items-center justify-content-center">
            <h1>
                <Spinner className="me-2" animation="border" variant="danger" />
                {t("Loading")}
            </h1>
        </div>
    )
}
export default Loading