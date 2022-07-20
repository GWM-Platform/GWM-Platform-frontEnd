import React from "react";
import { useTranslation } from "react-i18next";
import RulesTable from "./RulesTable";

const ViewAndDeleteRules = ({ FixedDeposit, ActionDispatch ,getFixedDepositPlans}) => {
    const { t } = useTranslation()

    return (
        <div className="growOpacity">
            <h1>{t("Fixed deposit rules administration")}</h1>
            <RulesTable ActionDispatch={ActionDispatch} FixedDeposit={FixedDeposit}  getFixedDepositPlans={getFixedDepositPlans}/>
        </div>
    );
}

export default ViewAndDeleteRules