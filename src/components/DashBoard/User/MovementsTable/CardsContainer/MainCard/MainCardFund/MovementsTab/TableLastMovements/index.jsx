import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import Movement from './Movement';
import { useTranslation } from "react-i18next";
import TableControls from '../../../../../../../TableControls';

const TableLastMovements = ({ page, setPage, movsShown, movementsCount, content, decimals, symbol, NavInfoToggled, Fund, setPerformance }) => {
    const { t } = useTranslation();

    useEffect(() => {
        let actualMoney = Fund.shares * Fund.fund.sharePrice
        let moneySpent = 0
        content.forEach((a) => {
            moneySpent += a.shares * a.sharePrice
        })
        setPerformance((actualMoney * 100 / moneySpent - 100).toFixed(2))
    }, [Fund, content, setPerformance])

    const [InScreenMovements, setInScreenMovements] = useState(5)

    useEffect(() => {
        setInScreenMovements(5)
    }, [content])

    return (
        <div className={NavInfoToggled ? "movementsTable-navInfoToggled growAnimation" : "movementsTable growAnimation"}>
            <Table id="tableMovements" striped bordered hover className="mb-auto m-0" >
                <thead >
                    <tr>
                        <th className="tableHeader">{t("Date")}</th>
                        <th className="d-none d-sm-table-cell">{t("Concept")}</th>
                        <th className="tableDescription d-none d-sm-table-cell">{t("Share value")}</th>
                        <th className="tableAmount">{t("Amount")}</th>
                    </tr>
                </thead>
                <tbody>
                    {content.map((u, i) => {
                        return i < InScreenMovements ?
                            <Movement key={i} content={u} symbol={symbol} decimals={decimals} />
                            :
                            null
                    })}
                </tbody>
            </Table>
            <TableControls InScreen={InScreenMovements} content={content}
                setInScreen={setInScreenMovements} />
        </div>
    )
}
export default TableLastMovements
