import React, { useContext, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion, Form, Row, Col, InputGroup, Button } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { dashboardContext } from '../../../../../../../../../context/dashboardContext';

const FilterOptions = ({ total, movsPerPage, setPagination }) => {
    const { t } = useTranslation();
    const { TransactionStates } = useContext(dashboardContext)
    const [filterOptions, setFilterOptions] = useState({
        moves: movsPerPage
    })

    const handleChange = (event) => {
        setFilterOptions((prevState) => ({
            ...prevState, ...{
                [event.target.id]: isNaN(parseInt(event.target.value)) ? event.target.value : parseInt(event.target.value)
            }
        }))
    }

    const changeMovesPerPage = () => {
        setPagination((prevState) => ({ ...prevState, ...{ take: filterOptions.moves,skip:0 } }))
    }

    return (
        <Accordion flush>
            <Accordion.Item eventKey="0">
                <Accordion.Header>{t("Filter Options")}</Accordion.Header>
                <Accordion.Body>
                    <Form>
                        <Row>
                            <Col xs={12} sm={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>{t("Moves per page")}</Form.Label>
                                    <InputGroup>
                                        <Form.Control id="moves" onChange={handleChange} value={filterOptions.moves} defaultValue={movsPerPage} type="number" min="1" max={total} placeholder="Moves per page" />
                                        <Button onClick={() => changeMovesPerPage()} disabled={filterOptions.moves > total || filterOptions.moves < 1} variant="outline-secondary" id="button-addon2">
                                            {t("Update")}
                                        </Button>
                                    </InputGroup>
                                </Form.Group>

                            </Col>
                            {
                                TransactionStates.fetched && TransactionStates.valid && !TransactionStates.fetching ?
                                    <Col xs={12} sm={6}>
                                        <Form.Group className="mb-3" controlId="movesPerPage">
                                            <Form.Label>{t("Moves State")}</Form.Label>
                                            <Form.Select aria-label="Default select example">
                                                <option>{t("All")}</option>
                                                {TransactionStates.values.map((state, key) => <option key={key} value={state.id}>{t(state.name)}</option>)}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    :
                                    null
                            }
                        </Row>
                    </Form>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}
export default FilterOptions
