import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table } from 'react-bootstrap';
import Transfer from './Transfer';
import { useTranslation } from "react-i18next";

const TableLastMovements = ({ content, movements, getTransfers }) => {
    const { t } = useTranslation();

    const anyWithActions = () => Object.values(content).some((movement) => movement.stateId === 1)

    return (
        <div style={{ minHeight: `calc( ( 0.5rem * 2 + 25.5px ) * ${movements + 1} )` }}
            className={`tableMovements`}>
            <Table striped bordered hover className="mb-auto m-0  mt-2" data-table-name="cta-cte-transfers" >
                <thead >
                    <tr>
                        <th className="tableId text-nowrap">{t("Ticket")}</th>
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
                    {content.map((transfer, key) =>
                        <Transfer getTransfers={getTransfers} key={`transfer-${key}`} content={transfer} actions={anyWithActions()} />
                    )}
                </tbody>
            </Table>
        </div>
    )
}
export default TableLastMovements
