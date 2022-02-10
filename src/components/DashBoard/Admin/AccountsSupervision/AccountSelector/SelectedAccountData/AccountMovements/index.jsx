import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Accordion,Table } from 'react-bootstrap'
import MovementRow from './MovementRow' 
const AccountMovements = ({Movements}) => {
    const { t } = useTranslation();

    return (
        <Accordion.Item eventKey="2">
            <Accordion.Header>{t("Account's movements")}</Accordion.Header>
            <Accordion.Body>
            <Table className="AccountsTable mb-0" striped bordered hover>
                    <thead className="verticalTop tableHeader solid-bg">
                        <tr>
                            <th>{t("Created at")}</th>
                            <th>{t("Amount")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            Movements.map((movement, key) => {
                                return <MovementRow key={key} Movement={movement} />
                            })
                        }
                    </tbody>
                </Table>
            </Accordion.Body>
        </Accordion.Item>
    )
}

export default AccountMovements