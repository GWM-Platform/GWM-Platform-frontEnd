import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import Movement from './Movement';
import { useTranslation } from "react-i18next";

const TableLastMovements = ({ content, movements }) => {
    const { t } = useTranslation();

    return (
        <div style={{ minHeight: `calc( ( 0.5rem * 2 + 25.5px ) * ${movements + 1} )` }} className={`tableMovements`}>
            <Table striped bordered hover className="mb-auto m-0  mt-2" >
                <thead >
                    <tr>
                        <th className="tableId text-nowrap">{t("Ticket #")}</th>
                        <th className="tableId text-nowrap">{t("Details")}</th>
                        <th className="tableId d-none d-sm-table-cell">{t("Receipts")}</th>
                        <th className="tableHeader">{t("Date")}</th>
                        <th className="d-none d-sm-table-cell">{t("Status")}</th>
                        <th className="tableHeader">{t("Description")}</th>
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
