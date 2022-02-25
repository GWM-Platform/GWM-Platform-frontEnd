import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Accordion, Table } from 'react-bootstrap'
import MovementRow from './MovementRow'
import TableControls from '../../../../../TableControls';
const AccountMovements = ({ Movements }) => {
    const { t } = useTranslation();
    const [InScreenMovements, setInScreenMovements] = useState(5)

    useEffect(() => {
        setInScreenMovements(5)
    }, [Movements])

    return (
        <Accordion.Item eventKey="2">
            <Accordion.Header>{t("Account's movements")}</Accordion.Header>
            <Accordion.Body>
                <Table className="AccountsTable mb-0" striped bordered hover>
                    <thead className="verticalTop tableHeader solid-bg">
                        <tr>
                            <th className="tableDate">{t("Created at")}</th>
                            <th className="tableConcept">{t("Concept")}</th>
                            <th className="tableAmount">{t("Amount")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Movements.map((movement, key) => {
                                return key < InScreenMovements ?
                                    <MovementRow key={key} Movement={movement} /> :
                                    null
                            })
                        }
                    </tbody>
                </Table>
                <TableControls InScreen={InScreenMovements} content={Movements}
                    setInScreen={setInScreenMovements} />
            </Accordion.Body>
        </Accordion.Item>
    )
}

export default AccountMovements