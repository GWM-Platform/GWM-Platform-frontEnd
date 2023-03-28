import React from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import './index.scss'
import NotificationsList from './NotificationsList';
import Tools from './Tools';
const NotificationsCenter = () => {

    return (
        <Container fluid="lg" className="NotificationsCenter tabContent growAnimation h-100">
            <Row className="h-100 p-relative NotificationsCenterRow d-flex justify-content-center align-items-stretch">
                <Col className="section growOpacity h-100 d-flex flex-column">
                    <Tools />
                    <NotificationsList />
                </Col>
            </Row>
        </Container>
    )
}
export default NotificationsCenter