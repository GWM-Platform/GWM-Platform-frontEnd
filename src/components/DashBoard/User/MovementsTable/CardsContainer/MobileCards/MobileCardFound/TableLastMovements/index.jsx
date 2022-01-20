import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Col, Row, Container, Collapse } from 'react-bootstrap';
import Movement from './Movement';
import { useTranslation } from "react-i18next";

const TableLastMovements = ({ content,fetchingMovements }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    console.log(fetchingMovements)

    return (
        <Col md="12" className="p-0 mt-2">
            {fetchingMovements ?
                <h2>{t("Loading movements")}</h2> :
                content.length === 0 || content === null ?
                    <h2>{t("There are no records of any movement in this Fund")}</h2> :
                    <div>
                        <Container fluid className="p-0"
                            onClick={() => setOpen(!open)}
                            aria-expanded={open}>
                            <Row className="d-flex justify-content-end">
                                <Col>
                                    <h2 className="my-2 toggler-mobile">{t("Last movements")}</h2>
                                </Col>
                            </Row>
                        </Container>
                        <Collapse in={open}>
                            <div className="movementsTable">
                                <Table id="tableMovements" striped bordered hover className="mt-0" >
                                    <thead >
                                        <tr>
                                            <th className="tableHeader">{t("Date")}</th>
                                            <th className="tableDescription d-sm-table-cell">{t("Value of the share")}</th>
                                        </tr>
                                        <tr>
                                            <th className="d-sm-table-cell">{t("in FeeParts")}</th>
                                            <th className="tableAmount">{t("In Cash")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {content.map((u, i) => { ; return (<Movement key={i} content={u} />) })}
                                    </tbody>
                                </Table>
                            </div>
                        </Collapse>
                    </div>
            }
        </Col>
    )
}
export default TableLastMovements
