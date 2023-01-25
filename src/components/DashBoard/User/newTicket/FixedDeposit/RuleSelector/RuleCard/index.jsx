import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { Col, Card } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';

const RuleCard = ({ Rule, data, setData, index, Rules, RulesObject,handleChange }) => {
    const { t } = useTranslation();

    const minDuration = Rule
    const maxDuration = index < Rules.length - 1 ? Rules[index + 1] - 1 : null
    const anualRate = RulesObject?.interest?.[Rule]

    return (
        <Col xs="10" sm="4"
            className={`py-1 pe-1 growAnimation RuleCardContainer${false ? " RuleDisabled" : ""}${data.ruleSelected === Rule ? " RuleSelected" : ""}`}>
            <Card
                className="RuleCard h-100" onClick={() => {
                    setData(prevState => ({ ...prevState, ruleSelected: Rule }))
                    handleChange({ target: { id: "days", value: maxDuration ? maxDuration : minDuration } })
                }}>
                <Card.Header><strong className="title">{t("Plan")} #{index + 1}</strong></Card.Header>
                <Card.Body>
                    <Card.Title>{t("Anual rate")}: <strong><FormattedNumber className="emphasis" value={anualRate} suffix="%" fixedDecimals={2} /></strong></Card.Title>

                    <Card.Title>
                        {
                            maxDuration ? t("Minimum duration") : t("Duration")
                        }:&nbsp;
                        <strong>{t("{{days}} days", { days: minDuration })}</strong>
                    </Card.Title>
                    {
                        maxDuration &&
                        <Card.Title>
                            {t("Maximum duration")}:&nbsp;
                            <strong>{t("{{days}} days", { days: maxDuration })}</strong>
                        </Card.Title>
                    }
                </Card.Body>
            </Card>
        </Col >
    )
}



export default RuleCard