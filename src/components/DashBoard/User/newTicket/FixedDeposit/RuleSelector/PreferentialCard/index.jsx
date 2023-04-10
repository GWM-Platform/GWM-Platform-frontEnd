import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import { Col, Card } from 'react-bootstrap'
import { useTranslation } from "react-i18next";

const PreferentialCard = ({ data, setData, handleChange }) => {
    const { t } = useTranslation();


    return (
        <Col xs="10" sm="3"
            className={`py-1 pe-1 growAnimation RuleCardContainer${false ? " RuleDisabled" : ""}${data.preferential ? " RuleSelected" : ""}`}>
            <Card
                className="RuleCard h-100" onClick={() => {
                    setData(prevState => ({ ...prevState, preferential: true, ruleSelected: "" }))
                    handleChange({ target: { id: "days", value: "" } })
                }}>
                <Card.Header><strong className="title">{t("Preferential plan")}</strong></Card.Header>
                <Card.Body>
                    <Card.Title>
                        <strong>
                            {t("Propose a differential rate/duration")}
                        </strong>
                    </Card.Title>
                </Card.Body>
            </Card>
        </Col >
    )
}



export default PreferentialCard