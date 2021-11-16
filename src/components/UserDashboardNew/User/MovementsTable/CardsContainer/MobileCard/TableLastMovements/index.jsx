import React,{useState} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Table, Col, Row, Container, Collapse } from 'react-bootstrap';
import Movement from './Movement';
import { useTranslation } from "react-i18next";

const TableLastMovements = ({ content, decimals, symbol }) => {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    return (
        <Col md="12" className="p-0 mt-2">
            {content === undefined ? <h2>{t("There is no record of any movement in this Fund")}</h2> :
                content.length===0 ? <h2>{t("There is no record of any movement in this Fund")}</h2> :
                <div>
                    <Container fluid className="p-0" 
                        onClick={() => setOpen(!open)}
                        aria-expanded={open}>
                        <Row className="d-flex justify-content-end">
                            <Col>
                                <h2 className="my-2 toggler-mobile">{t("Fund last movements")}</h2>
                            </Col>
                        </Row>
                    </Container>
                    <Collapse in={open}>
                        <div className="movementsTable">
                            <Table id="tableMovements" striped bordered hover className="mt-0" >
                                <thead >
                                    <tr>
                                        <th className="tableHeader">{t("Date")}</th>
                                        <th className="d-none d-sm-table-cell tableDescription">{t("Description")}</th>
                                        <th className="tableAmount">{t("Amount")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {content.map((u, i) => { ; return (<Movement key={i} content={u} symbol={symbol} decimals={decimals} />) })}
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
