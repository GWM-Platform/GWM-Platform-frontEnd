import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import Movement from './Movement';
import { useTranslation } from "react-i18next";

const TableLastMovements = ({ content, Fund, NavInfoToggled,setPerformance }) => {
    const { t } = useTranslation();

    useEffect(() => {
        let actualMoney = Fund.shares * Fund.fund.sharePrice
        let moneySpent = 0
        content.forEach((a) => {
            moneySpent += a.shares * a.sharePrice
        })
        setPerformance((actualMoney * 100 / moneySpent - 100).toFixed(2))
    }, [Fund, content, setPerformance])

    return (
        <div  className={`tableMovements ${NavInfoToggled ? "navInfoToggled" : ""}`}>
            <Table striped bordered hover className=" mb-auto m-0" >
                <thead >
                    <tr>
                        <th className="tableHeader">{t("Date")}</th>
                        <th className="d-none d-sm-table-cell">{t("State")}</th>
                        <th className="d-none d-sm-table-cell">{t("Concept")}</th>
                        <th className="tableDescription d-none d-sm-table-cell">{t("Share value")}</th>
                        <th className="tableAmount">{t("Amount")}</th>
                    </tr>
                </thead>
                <tbody>
                    {content.map((u, i) =>
                        <Movement key={i} content={u} />
                    )}
                </tbody>
            </Table>
        </div>

    )
}
export default TableLastMovements
