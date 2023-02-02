import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";

const NoSellFunds = () => {
    const { t } = useTranslation();

    return (
        <div className="h-100 d-flex align-items-center justify-content-center">
            <h1>
                {t("You don't have any share to sell")}
            </h1>
        </div>
    )
}
export default NoSellFunds