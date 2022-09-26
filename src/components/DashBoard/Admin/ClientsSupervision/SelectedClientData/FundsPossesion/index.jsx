import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Accordion, Table } from 'react-bootstrap'
import FundRow from './FundRow'

const FundsPossesion = ({ stakes }) => {
    const { t } = useTranslation();

    return (
        <Accordion.Item eventKey="1">
            <Accordion.Header>{t("Funds posession")}</Accordion.Header>
            <Accordion.Body>
                <Table className="ClientsTable mb-0" striped bordered hover>
                    <thead className="verticalTop tableHeader solid-bg">
                        <tr>
                            <th>{t("Fund name")}</th>
                            <th>{t("Shares")}</th>
                            <th>{t("Share price")}</th>
                            <th>{t("In Cash")}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            stakes.map((stake, key) =><FundRow key={`fund-${key}`} Fund={stake} />)
                        }
                    </tbody>
                </Table>
            </Accordion.Body>
        </Accordion.Item>
    )
}

export default FundsPossesion