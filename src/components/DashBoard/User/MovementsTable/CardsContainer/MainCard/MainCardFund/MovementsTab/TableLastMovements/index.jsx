import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import Movement from './Movement';
import { useTranslation } from "react-i18next";

const TableLastMovements = ({ content, Fund, movements, setPerformance }) => {
    const { t } = useTranslation();

    useEffect(() => {
        let actualMoney = Fund.shares ? Fund.shares * Fund.fund.sharePrice : 0
        let moneySpent = 0
        content.forEach((a) => {
            moneySpent += a.shares * a.sharePrice
        })
        setPerformance(Fund.shares ? (actualMoney * 100 / moneySpent - 100).toFixed(2) : 0)
    }, [Fund, content, setPerformance])

    return (
        <div style={{ minHeight: `calc( ( 0.5rem * 2 + 25.5px ) * ${movements + 1} )` }}
            className={`tableMovements`}>
            <Table striped bordered hover className=" mb-auto m-0 mt-2" >
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
