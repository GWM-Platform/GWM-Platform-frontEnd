import React from "react";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import AddRuleRow from "./AddRuleRow";
import RuleRow from "./RuleRow";

const RulesTable = ({  ActionDispatch,TimeDeposit,getFixedDepositPlans }) => {
    const { t } = useTranslation()
    return (
        <div style={{ overflowX: "auto", scrollSnapType: "both mandatory" }}>
            <Table className="RulesTable" striped bordered hover>
                <thead className="verticalTop tableHeader solid-bg">
                    <tr>
                        <th >{t("Days")}</th>
                        <th >{t("Rate")}</th>
                        <th >{t("Actions")}</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        Object.keys(TimeDeposit?.interest).map((rule, key) =>
                            <RuleRow ActionDispatch={ActionDispatch} key={key} TimeDeposit={TimeDeposit} getFixedDepositPlans={getFixedDepositPlans}
                                rule={{
                                    days: rule,
                                    rate: TimeDeposit?.interest[rule]
                                }} />
                        )
                    }
                </tbody>
                <thead className="verticalTop">
                    <AddRuleRow ActionDispatch={ActionDispatch} />
                </thead>
            </Table>
        </div>
    );
}

export default RulesTable