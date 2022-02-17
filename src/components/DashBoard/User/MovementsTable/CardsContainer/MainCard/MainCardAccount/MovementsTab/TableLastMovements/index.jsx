import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import Movement from './Movement';
import { useTranslation } from "react-i18next";

const TableLastMovements = ({ content, symbol,NavInfoToggled }) => {
    const { t } = useTranslation();

    return (
        <div className={NavInfoToggled? "movementsTable-navInfoToggled" : "movementsTable" }>
            <Table id="tableMovements" striped bordered hover className="mb-auto m-0" >
                <thead >
                    <tr>
                        <th className="tableHeader">{t("Date")}</th>
                        <th className="tableHeader">{t("Concept")}</th>
                        <th className="tableDescription d-none d-sm-table-cell">{t("Amount")}</th>
                    </tr>
                </thead>
                <tbody>
                    {content.map((u, i) => { ; return (<Movement key={i} content={u} symbol={symbol} />) })}
                </tbody>
            </Table>
        </div>
    )
}
export default TableLastMovements
