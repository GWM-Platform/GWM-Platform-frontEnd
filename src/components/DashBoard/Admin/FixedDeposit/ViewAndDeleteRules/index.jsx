import React from "react";
import { useTranslation } from "react-i18next";
import RulesTable from "./RulesTable";

const ViewAndDeleteRules = ({ FixedDeposit, ActionDispatch, getFixedDepositPlans }) => {
    const { t } = useTranslation()

    return (
        <div className="growOpacity">
            <div className="header-with-border">
                <h1 className="title">{t("Time deposit rules administration")}</h1>
            </div>
            <RulesTable ActionDispatch={ActionDispatch} FixedDeposit={FixedDeposit} getFixedDepositPlans={getFixedDepositPlans} />
        </div>
    );
}

export default ViewAndDeleteRules