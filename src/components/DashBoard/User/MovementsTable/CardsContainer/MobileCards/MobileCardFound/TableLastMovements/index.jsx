import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {  Col, Row, Container, Collapse } from 'react-bootstrap';
import Movement from './Movement';
import { useTranslation } from "react-i18next";

const TableLastMovements = ({ content, fetchingMovements }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    return (
        <Col md="12" className="p-0 mt-2">
            {fetchingMovements ?
                <h2 className='my-2 p-0'>{t("Loading transactions")}</h2> :
                content.length === 0 || content === null ?
                    <h2>{t("There are no records of any movement in this fund")}</h2> :
                    <div>
                        <Container fluid className="p-0"
                            onClick={() => setOpen(!open)}
                            aria-expanded={open}>
                            <Row className="d-flex justify-content-end">
                                <Col>
                                    <h2 className="my-2 toggler-mobile">{t("Last transactions")}</h2>
                                </Col>
                            </Row>
                        </Container>
                        <Collapse in={open}>
                        <div className="movementsTable mb-3">
                                {content.map((u, i) => { ; return (<Movement key={i} content={u} />) })}
                            </div>
                        </Collapse>
                    </div>
            }
        </Col>
    )
}
export default TableLastMovements
