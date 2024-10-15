import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import Movement from './Movement';
import { useTranslation } from "react-i18next";

const TableLastMovements = ({ content, movements, fundName }) => {
    const { t } = useTranslation();

    return (
        <div style={{ minHeight: `calc( ( 0.5rem * 2 + 25.5px ) * ${movements + 1} )` }}
            className={`tableMovements overflow-auto`}>
            <Table striped bordered hover className=" mb-auto m-0 mt-2" data-table-name="fund-movements" >
                <thead >
                    <tr>
                        <th className="tableHeader text-nowrap" data-column-name="ticket">{t("Ticket")}</th>
                        <th className="tableHeader">{t("Date")}</th>
                        <th className="d-none d-sm-table-cell">{t("Status")}</th>
                        <th className="d-none d-sm-table-cell">{t("Description")}</th>
                        <th className="tableDescription d-none d-sm-table-cell text-nowrap">{t("Share price")}</th>
                        <th className="tableAmount">{t("Amount")}</th>
                    </tr>
                </thead>
                <tbody>
                    {content.map((movement, key) =>
                        <Movement key={key} content={movement} fundName={fundName} />
                    )}
                </tbody>
            </Table>
        </div>

    )
}
export default TableLastMovements
