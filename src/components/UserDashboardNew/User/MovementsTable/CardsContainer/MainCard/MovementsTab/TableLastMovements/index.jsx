import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import Movement from './Movement';
import { useTranslation } from "react-i18next";

const TableLastMovements = ({ page, setPage, movsShown, movementsCount, content, decimals, symbol }) => {
    const { t } = useTranslation();

    return (
        <div className="movementsTable">
            <Table id="tableMovements" striped bordered hover className="mb-auto m-0" >
                <thead >
                    <tr>
                        <th className="tableHeader">{t("Date")}</th>
                        <th className="d-none d-sm-table-cell tableDescription">{t("Description")}</th>
                        <th className="tableAmount">{t("Amount")}</th>
                    </tr>
                </thead>
                <tbody>
                    {content.map((u, i) => { ; return (<Movement key={i} content={u} symbol={symbol} decimals={decimals} />) })}
                </tbody>
            </Table>
        </div>
    )
}
export default TableLastMovements
