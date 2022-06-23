import React from "react";
import { useTranslation } from "react-i18next";
import RulesTable from "./RulesTable";

const ViewAndEditRules = ({ rules, ActionDispatch }) => {
    const { t } = useTranslation()

    return (
        <div className="growOpacity">
            <h1>{t("Time deposit rules administration")}</h1>
             
                    <RulesTable ActionDispatch={ActionDispatch} rules={rules} />
        </div>
    );
}

export default ViewAndEditRules