import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";

const NoFixedDeposit = () => {
    const { t } = useTranslation();

    return (
        <div className="h-100 d-flex align-items-center justify-content-center">
            <h1>
                {t("Apparently, there is no time deposit plan created")}
            </h1>
        </div>
    )
}
export default NoFixedDeposit