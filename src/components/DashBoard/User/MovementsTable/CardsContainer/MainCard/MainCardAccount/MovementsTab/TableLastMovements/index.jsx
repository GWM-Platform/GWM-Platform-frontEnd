import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import Movement from './Movement';
import { useTranslation } from "react-i18next";

const TableLastMovements = ({ content, NavInfoToggled }) => {
    const { t } = useTranslation();
   
    return (
        <div  className={`tableMovements ${NavInfoToggled ? "navInfoToggled" : ""}`}>
            <Table striped bordered hover className="mb-auto m-0" >
                <thead >
                    <tr>
                        <th className="tableHeader">{t("Date")}</th>
                        <th className="d-none d-sm-table-cell">{t("State")}</th>
                        <th className="tableHeader">{t("Concept")}</th>
                        <th className="tableDescription d-none d-sm-table-cell">{t("Amount")}</th>
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
