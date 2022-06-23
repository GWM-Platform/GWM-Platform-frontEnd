import React from "react";
import { Table } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import AddRuleRow from "./AddRuleRow";
import RuleRow from "./RuleRow";

const RulesTable = ({rules,ActionDispatch}) => {
    const {t}=useTranslation()
    return (
        <div style={{overflowX:"auto",scrollSnapType:"both mandatory"}}>
        <Table className="RulesTable" striped bordered hover>
            <thead className="verticalTop tableHeader solid-bg">
                <tr>
                    <th >{t("Days")}</th>
                    <th >{t("Rate")}</th> 
                    <th >{t("Actions")}</th> 
                </tr>
            </thead>
            <tbody>
                {rules.map((rule, key) => {
                    return <RuleRow ActionDispatch={ActionDispatch} key={key} rule={rule} />
                })}
            </tbody>
            <thead className="verticalTop">
                <AddRuleRow ActionDispatch={ActionDispatch} />
            </thead>
        </Table>
    </div>  
    );
}

export default RulesTable