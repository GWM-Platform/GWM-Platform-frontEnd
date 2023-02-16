import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";

const NoTimeDeposits = () => {
    const { t } = useTranslation();

    return (
        <div className="h-100 d-flex align-items-center justify-content-center">
            <h1>
                {t("There are no time deposit plans, try again later")}
            </h1>
        </div>
    )
}
export default NoTimeDeposits