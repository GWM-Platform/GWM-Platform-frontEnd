import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";

const NoPermissionOperation = () => {
    const { t } = useTranslation();

    return (
        <div className="h-100 d-flex align-items-center justify-content-center">
            <h1>
                {t("Apparently, your user does not have permissions to perform this operation")}
            </h1>
        </div>
    )
}
export default NoPermissionOperation