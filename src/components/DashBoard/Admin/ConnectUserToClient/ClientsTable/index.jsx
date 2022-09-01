import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ClientUsersAccordion from "./ClientUsersAccordion";

const ClientsTable = ({ clients }) => {
    const { t } = useTranslation()

    return (
        <Container>
            <Row>
                <Col xs="12">
                    <div className="growOpacity">
                        <h1>{t('Administration of users connected to clients')}</h1>
                        {clients.content.map(client => <ClientUsersAccordion client={client} key={`client-selector-${client.id}`} />)}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default ClientsTable