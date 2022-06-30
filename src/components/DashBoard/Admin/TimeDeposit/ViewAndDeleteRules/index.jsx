import React from "react";
import { useTranslation } from "react-i18next";
import RulesTable from "./RulesTable";

const ViewAndDeleteRules = ({ TimeDeposit, ActionDispatch ,getFixedDepositPlans}) => {
    const { t } = useTranslation()

    return (
        <div className="growOpacity">
            <h1>{t("Time deposit rules administration")}</h1>
            <RulesTable ActionDispatch={ActionDispatch} TimeDeposit={TimeDeposit}  getFixedDepositPlans={getFixedDepositPlans}/>
        </div>
    );
}

export default ViewAndDeleteRules