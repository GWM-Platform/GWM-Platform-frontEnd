import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';

const NoNotes = ({ motive }) => {
    const { t } = useTranslation()

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
            <div className="text-center">
                <h3>{t("No liquidation options found")}</h3>
                <p className="text-muted">
                    {motive === 0 ? t("There are no liquidation options registered") : t("No results match your search")}
                </p>
            </div>
        </div>
    )
}

export default NoNotes

