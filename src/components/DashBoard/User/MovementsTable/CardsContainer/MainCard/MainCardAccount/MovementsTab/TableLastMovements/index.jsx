import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import Movement from './Movement';
import { useTranslation } from "react-i18next";
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';
import { userEmail } from 'utils/userEmail';

const TableLastMovements = ({ content, movements, reloadData }) => {

    const { hasPermission } = useContext(DashBoardContext);

    const { t } = useTranslation();

    const anyWithActions = () => Object.values(content).some(
        (movement) => (
            movement.stateId === 5 && movement.userEmail !== userEmail()  && hasPermission(""))
        /*
        //TODO: approve transfers from movements table
        ||
        (movement.transferId !== null && movement.stateId === 1 && (hasPermission("TRANSFER_APPROVE") || hasPermission("TRANSFER_DENY")))
        */
    )

    return (
        <div style={{ minHeight: `calc( ( 0.5rem * 2 + 25.5px ) * ${movements + 1} )` }} className={`tableMovements`}>
            <Table striped bordered hover className="mb-auto m-0  mt-2" >
                <thead >
                    <tr>
                        <th className="tableId text-nowrap">{t("Ticket #")}</th>
                        <th className="tableId text-nowrap">{t("Details")}</th>
                        <th className="tableHeader">{t("Date")}</th>
                        <th className="d-none d-sm-table-cell">{t("Status")}</th>
                        <th className="tableHeader">{t("Description")}</th>
                        <th className="tableDescription d-none d-sm-table-cell">{t("Amount")}</th>
                        <th className="tableDescription d-none d-sm-table-cell">{t("Balance")}</th>
                        {
                            anyWithActions() && <th className='Actions'>{t("Action")}</th>
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
