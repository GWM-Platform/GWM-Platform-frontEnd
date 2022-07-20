import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import FixedDepositRow from './FixedDepositRow'

const FixedDepositsTable = ({ AccountInfo, UsersInfo, movements, state, reloadData, take }) => {
    const { t } = useTranslation();

    //===1 pending, the admin could aprove or deny, ===2 aproved,if it isn't already the admin could close it
    const anyWithActions = () => Object.values(movements).some((field) => field.stateId === 1 || (field.stateId === 2 && !field.closed))
    const anyApproved = () => Object.values(movements).some((field) => field.stateId === 2)

    return (

        <Col xs="12">
            <div style={{ overflowX: "overlay", minHeight: `calc( .5rem + ( 0.5rem * 2 + 25.5px ) * ${take + 1} )`, scrollSnapType: "both mandatory" }}>
                <Table className="TicketsTable table table-striped table-bordered table-hover growAnimation mb-0 mt-2">
                    <thead className="tableHeader solid-bg">
                        <tr>
                            <th >
                                <span className="d-inline">{t("Client")}</span>
                            </th>
                            <th >
                                <span className="d-inline">{t("Investment")}</span>
                            </th>
                            <th >
                                <span className="d-inline">{t("Duration")}</span>
                            </th>
                            <th >
                                <span className="d-inline">{t("Profit")}</span>
                            </th>
                            {
                                anyApproved() &&
                                <th >
                                    <span className="d-inline">{t("Status")}</span>
                                </th>
                            }
                            <th >{t("Ticket #")}</th>
                            {
                                anyWithActions() ? <th className='Actions'>{t("Action")}</th> : null
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            movements.map((movement, key) =>
                                <FixedDepositRow AccountInfo={AccountInfo} UsersInfo={UsersInfo}
                                    reloadData={reloadData} key={key} Movement={movement} state={state} />
                            )
                        }
                    </tbody>
                </Table>
            </div>
        </Col>
    )
}
export default FixedDepositsTable


