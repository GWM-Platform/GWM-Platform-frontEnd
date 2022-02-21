import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { Container, Row, Button, Col } from 'react-bootstrap'

const TableControls = ({ showMore, showLess, InScreen, content }) => {
    const { t } = useTranslation();
    return (
        <Container fluid className="px-0 mb-1">
            <Row className="mx-0 w-100 d-flex justify-content-between">
                <Col>
                    <Button disabled={content.length<=5 ||  5 >= InScreen}
                        onClick={() => showLess(5)} variant="link">{t("Show less")}</Button>
                </Col>
                <Col className="d-flex justify-content-end">
                    <Button disabled={ content.length < InScreen}
                        onClick={() => showMore(5)} variant="link">{t("Show more")}</Button>
                </Col>
            </Row>
        </Container>
    )
}
export default TableControls

