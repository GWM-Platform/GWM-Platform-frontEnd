import React, { useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import Transfer from './Transfer';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';

const TableLastMovements = ({ content, movements,getTransfers }) => {
    const { t } = useTranslation();
    const {  Accounts } = useContext(DashBoardContext)

    const incomingTransfer = (movement) => movement.receiverId === Accounts[0]?.id

    const anyWithActions = () => Object.values(content).some((movement) => movement.stateId === 1 &&  incomingTransfer(movement))

    return (
        <div style={{ minHeight: `calc( ( 0.5rem * 2 + 25.5px ) * ${movements + 1} )` }}
            className={`tableMovements`}>
            <Table striped bordered hover className="mb-auto m-0  mt-2" >
                <thead >
                    <tr>
                        <th className="tableId">{t("Ticket #")}</th>
                        <th className="tableHeader">{t("Date")}</th>
                        <th className="d-none d-sm-table-cell">{t("Status")}</th>
                        <th className="tableHeader">{t("Description")}</th>
                        <th className="tableDescription d-none d-sm-table-cell">{t("Amount")}</th>
                        {
                            anyWithActions() && <th className='Actions'>{t("Action")}</th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {content.map((u, i) =>
                        <Transfer getTransfers={getTransfers} key={i} content={u} actions={anyWithActions()}  />
                    )}
                </tbody>
            </Table>
        </div>
    )
}
export default TableLastMovements
