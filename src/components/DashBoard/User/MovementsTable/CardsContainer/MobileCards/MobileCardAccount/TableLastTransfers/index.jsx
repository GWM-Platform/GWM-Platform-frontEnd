import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Col, Row, Container, Collapse } from 'react-bootstrap';
import Transfer from './Transfer';
import { useTranslation } from "react-i18next";

const TableLastTransfers = ({ content, fetchingTransfers }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    return (
        <Col md="12" className="p-0 mt-2">
            {fetchingTransfers ?
                <h2 className='my-2 p-0'>{t("Loading transfers")}</h2> :
                content.length === 0 || content === null ?
                    <h2>{t("There are no records of any movement in this Account")}</h2> :
                    <div>
                        <Container fluid className="p-0"
                            onClick={() => setOpen(!open)}
                            aria-expanded={open}>
                            <Row className="d-flex justify-content-end">
                                <Col>
                                    <h2 className="my-2 toggler-mobile">{t("Last transfers")}</h2>
                                </Col>
                            </Row>
                        </Container>
                        <Collapse in={open}>
                            <div className="movementsTable mb-3">
                                {content.map((u, i) => { ; return (<Transfer key={i} content={u} />) })}
                            </div>
                        </Collapse>
                    </div>
            }
        </Col>
    )
}
export default TableLastTransfers
