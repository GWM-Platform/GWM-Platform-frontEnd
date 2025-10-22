import React, { useMemo } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import Movement from './Movement';
import { useTranslation } from "react-i18next";
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

const TableLastMovements = ({ content, movements, reloadData, linkToOtherHistory }) => {

    const { t } = useTranslation();
    const { hasPermission } = useContext(DashBoardContext)

    const anyWithActions = () => Object.values(content).some(
        (movement) => movement && (
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

    const filteredContent = content?.filter(u => u?.createdAt)

    const minHeight = `max(calc((0.5rem * 2 + 25.5px) * ${(movements ?? 0) + 1}), 300px)`;

    return (
        <div className='tableMovements overflow-auto' style={{ minHeight }}>
            <Table striped bordered hover className="mb-auto m-0  mt-2" data-table-name="cta-cte-movements">
                <thead >
                    <tr>
                        <th className="tableId text-nowrap" data-column-name="ticket">{t("Ticket")}</th>
                        <th className="tableHeader">{t("Date")}</th>
                        <th className="d-none d-sm-table-cell">{t("Status")}</th>
                        <th className="tableHeader">{t("Description")}</th>
                        <th className="tableDescription d-none d-sm-table-cell">{t("Amount")}</th>
                        <th className="tableDescription d-none d-sm-table-cell">{t("Balance")}</th>
                        <th className='Actions' data-column-name="actions" >
                            <button className="noStyle" style={{ pointerEvents: "none" }}>
                                <FontAwesomeIcon icon={faDownload} style={{fontSize: ".85rem"}} />
                            </button>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        filteredContent.map((u, i) =>
                            <Movement linkToOtherHistory={linkToOtherHistory} key={i} content={u} actions={anyWithActions()} reloadData={reloadData} />
                        )
                    }
                </tbody>
            </Table>
        </div>
    )
}
export default TableLastMovements
