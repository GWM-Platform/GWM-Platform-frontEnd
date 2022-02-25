import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import MovementRow from './MovementRow'
import TableControls from '../../../../TableControls'

const MovementsTable = ({ AccountInfo, UsersInfo, movements, state, reloadData }) => {
    const { t } = useTranslation();
    const [InScreenMovements, setInScreenMovements] = useState(5)

    useEffect(() => {
        setInScreenMovements(5)
    }, [movements])

    return (
        <Col xs="12">
            <h1 className="title">{t("Withdrawal tickets")}:</h1>
            <div style={{ overflowX: "auto" }}>
                <Table className="TicketsTable table table-striped table-bordered table-hover growAnimation mb-0">
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
                                return key < InScreenMovements ?
                                    <MovementRow AccountInfo={AccountInfo} UsersInfo={UsersInfo}
                                        reloadData={reloadData} key={key} Movement={movement} state={state} />
                                    :
                                    null
                            })
                        }
                    </tbody>
                </Table>
                <TableControls InScreen={InScreenMovements} content={movements} state={state}
                            setInScreen={setInScreenMovements} />
            </div>

        </Col>
    )
}
export default MovementsTable


