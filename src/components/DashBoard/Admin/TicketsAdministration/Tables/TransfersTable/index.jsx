import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import TransferRow from './TransferRow'

const TransfersTable = ({ AccountInfo, UsersInfo, movements, state, reloadData, take }) => {
    const { t } = useTranslation();

    const anyWithActions = () => Object.values(movements).some((field) => field.stateId === 1) && false

    return (
        <Col xs="12">
            <div style={{ overflowX: "overlay", minHeight: `calc( .5rem + ( 0.5rem * 2 + 25.5px ) * ${take + 1} )`, scrollSnapType: "both mandatory" }}>
                <Table className="TicketsTable table table-striped table-bordered table-hover growAnimation mb-0 mt-2">
                    <thead className="tableHeader solid-bg">
                        <tr>
                            <th >
                                <span className="d-inline d-md-none">{t("Sender")}</span>
                                <span className="d-none d-md-inline">{t("Source account")}</span>
                            </th>
                            <th >
                                <span className="d-inline d-md-none">{t("Receiver")}</span>
                                <span className="d-none d-md-inline">{t("Target account")}</span>
                            </th>
                            <th >{t("Amount")}</th>
                            <th >
                                <span className="d-inline d-md-none">{t("Date")}</span>
                                <span className="d-none d-md-inline">{t("Created at")}</span>
                            </th>
                            <th >{t("Ticket #")}</th>
                            {
                                anyWithActions() ? <th className='Actions'>{t("Action")}</th> : null
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            movements.map((movement, key) =>
                                <TransferRow AccountInfo={AccountInfo} UsersInfo={UsersInfo}
                                    reloadData={reloadData} key={key} Movement={movement} state={state} />
                            )
                        }
                    </tbody>
                </Table>
            </div>
        </Col>
    )
}
export default TransfersTable


