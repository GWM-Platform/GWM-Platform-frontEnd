import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import Transfer from './Transfer';
import { useTranslation } from "react-i18next";

const TableLastMovements = ({ content, movements,getTransfers }) => {
    const { t } = useTranslation();

    const anyWithActions = () => Object.values(content).some((movement) => movement.stateId === 1)

    return (
        <div style={{ minHeight: `calc( ( 0.5rem * 2 + 25.5px ) * ${movements + 1} )` }}
            className={`tableMovements`}>
            <Table striped bordered hover className="mb-auto m-0  mt-2" >
                <thead >
                    <tr>
                        <th className="tableId">{t("#Id")}</th>
                        <th className="tableHeader">{t("Date")}</th>
                        <th className="d-none d-sm-table-cell">{t("Status")}</th>
                        <th className="tableHeader">{t("Description")}</th>
                        <th className="tableDescription d-none d-sm-table-cell">{t("Amount")}</th>
                        {
                            anyWithActions() && <th >{t("Action")}</th>
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
