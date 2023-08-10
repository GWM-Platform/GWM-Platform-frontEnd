import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";

const NoPermissionOperation = () => {
    const { t } = useTranslation();

    return (
        <div className="h-100 d-flex align-items-center justify-content-center">
            <span className='text-center'>
                {t("Apparently, your user does not have permissions to perform this operation")}
            </span>
        </div>
    )
}
export default NoPermissionOperation