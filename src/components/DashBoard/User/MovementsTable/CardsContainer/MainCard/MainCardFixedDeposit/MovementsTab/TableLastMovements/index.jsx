import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import Movement from './Movement';
import { useTranslation } from "react-i18next";

const TableLastMovements = ({ content, movements }) => {
    const { t } = useTranslation();

    return (
        <div style={{ minHeight: `calc( ( 0.5rem * 2 + 25.5px ) * ${movements + 1} )` }}
            className={`tableMovements`}>
            <Table striped bordered hover className=" mb-auto m-0 mt-2" >
                <thead >
                    <tr>
                        <th className="tableHeader text-nowrap">{t("Fixed deposit")} #</th>
                        <th className="tableHeader text-nowrap">{t("Status")}</th>
                        <th className="tableHeader text-nowrap">{t("Creation Date")}</th>
                        <th className="text-nowrap">{t("Initial investment")}</th>
                        <th className="tableAmount text-nowrap">{t("Anual rate")}</th>
                        <th className="tableAmount text-nowrap">{t("Elapsed")}</th>
                        <th className="d-none d-sm-table-cell text-nowrap">{t("Duration")}</th>
                        <th className="tableDescription text-nowrap">{t("Actual Profit")}</th>
                        <th className="tableDescription text-nowrap">{t("Profit at the end")}</th>
                        <th className="tableHeader text-nowrap">{t("Estado")}</th>
                        <th className="tableHeader text-nowrap">{t("Start Date")}</th>
                        <th className="tableHeader text-nowrap">{t("End Date")}</th>
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
