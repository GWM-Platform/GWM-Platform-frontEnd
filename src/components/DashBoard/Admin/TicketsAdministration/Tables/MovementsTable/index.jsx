import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import MovementRow from './MovementRow'

const MovementsTable = ({ AccountInfo, UsersInfo, movements, state, reloadData, take }) => {
    const { t } = useTranslation();

    const anyWithActions = () => Object.values(movements).some((field) => field.stateId === 1)

    return (
        <Col xs="12">
            <div style={{ overflowX: "overlay", minHeight: `calc( .5rem + ( 0.5rem * 2 + 25.5px ) * ${take + 1} )` }}>
                <Table className="TicketsTable table table-striped table-bordered table-hover growAnimation mb-0 mt-2">
                    <thead className="tableHeader solid-bg">
                        <tr>
                            <th >{t("Client")}</th>
                            <th >{t("Amount")}</th>
                            <th >
                                <span className="d-inline d-md-none">{t("Date")}</span>
                                <span className="d-none d-md-inline">{t("Created at")}</span>
                            </th>
                            <th >{t("#id")}</th>
                            {!!anyWithActions() && <th className='Actions'>{t("Action")}</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            movements.map((movement, key) =>
                                <MovementRow AccountInfo={AccountInfo} UsersInfo={UsersInfo}
                                    reloadData={reloadData} key={key} Movement={movement} state={state} />
                            )
                        }
                    </tbody>
                </Table>
            </div>
        </Col>
    )
}
export default MovementsTable


