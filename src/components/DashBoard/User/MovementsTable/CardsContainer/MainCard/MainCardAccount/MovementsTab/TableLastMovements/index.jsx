import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import Movement from './Movement';
import { useTranslation } from "react-i18next";
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';

const TableLastMovements = ({ content, movements, reloadData }) => {


    const { t } = useTranslation();
    const { hasPermission } = useContext(DashBoardContext)

    const anyWithActions = () => Object.values(content).some(
        (movement) => (
            (movement.stateId === 5 && movement.motive !== "TRANSFER_RECEIVE")
            ||
            (movement.stateId === 1
                &&
                (
                    ((hasPermission("TRANSFER_DENY") || hasPermission("TRANSFER_APPROVE")) && movement.motive === "TRANSFER_RECEIVE")
                    ||
                    (hasPermission("TRANSFER_DENY") && movement.motive === "TRANSFER_SEND")
                )
            )
        )
    )

    return (
        <div style={{ minHeight: `calc( ( 0.5rem * 2 + 25.5px ) * ${movements + 1} )` }} className={`tableMovements overflow-auto`}>
            <Table striped bordered hover className="mb-auto m-0  mt-2" data-table-name="cta-cte-movements">
                <thead >
                    <tr>
                        <th className="tableId text-nowrap" data-column-name="ticket">{t("Ticket")}</th>
                        <th className="tableHeader">{t("Date")}</th>
                        <th className="d-none d-sm-table-cell">{t("Status")}</th>
                        <th className="tableHeader">{t("Description")}</th>
                        <th className="tableDescription d-none d-sm-table-cell">{t("Amount")}</th>
                        <th className="tableDescription d-none d-sm-table-cell">{t("Balance")}</th>
                        {
                            anyWithActions() && <th className='Actions' data-column-name="actions" >{t("Action")}</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        content.map((u, i) =>
                            <Movement key={i} content={u} actions={anyWithActions()} reloadData={reloadData} />
                        )
                    }
                </tbody>
            </Table>
        </div>
    )
}
export default TableLastMovements
