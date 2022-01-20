import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import MovementRow from './MovementRow'
const MovementsTable = ({ movements, state, reloadData }) => {
    const { t } = useTranslation();

    return (
        <Col xs="12">
            <h1 className="title">{t("Withdrawal tickets")}:</h1>
            <div style={{ overflowX: "auto" }}>
                <Table className="TicketsTable table table-striped table-bordered table-hover growAnimation">
                    <thead className="tableHeader solid-bg">
                        <tr>
                            <th >{t("#id")}</th>
                            <th >{t("Client")}</th>
                            <th >{t("Amount")}</th>
                            <th >{t("Created at")}</th>
                            {
                                state === 1 || state === "1" ? <th >{t("Action")}</th> : null
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {
                            movements.map((movement, key) => {
                                return <MovementRow reloadData={reloadData} key={key} Movement={movement} state={state} />
                            })
                        }
                    </tbody>
                </Table>
            </div>

        </Col>
    )
}
export default MovementsTable


