import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Accordion, Form, Row, Col, Button } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { dashboardContext } from '../../../context/dashboardContext';

const FilterOptions = ({ Fund, movsPerPage, setPagination }) => {
    const { t } = useTranslation();
    const { TransactionStates } = useContext(dashboardContext)
    const [filterOptions, setFilterOptions] = useState({
        moves: movsPerPage,
        state: ""
    })

    const handleChange = (event) => {
        setFilterOptions((prevState) => ({
            ...prevState, ...{
                [event.target.id]: isNaN(parseInt(event.target.value)) ? event.target.value : parseInt(event.target.value)
            }
        }))
    }

    const updateFilters = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            setPagination((prevState) => ({
                ...prevState, ...{
                    take: filterOptions.moves,
                    skip: 0,
                    state: filterOptions.state === "" ? null : filterOptions.state
                }
            }))
        }
    }

    useEffect(() => {
        setFilterOptions((prevState) => ({
            ...prevState, ...{
                moves: 5,
                state: ""
            }
        }))
    }, [Fund])


    return (
        <Accordion flush>
            <Accordion.Item eventKey="0">
                <Accordion.Header>{t("Filter Options")}</Accordion.Header>
                <Accordion.Body>
                    <Form onSubmit={updateFilters}>
                        <Row className="align-items-stretch">
                            <Col>
                                <Form.Group>
                                    <Form.Label>{t("Moves per page")}</Form.Label>
                                    <Form.Control required id="moves" onChange={handleChange} value={filterOptions.moves} type="number" min="1" placeholder="Moves per page" />
                                </Form.Group>
                            </Col>
                            {
                                TransactionStates.fetched && TransactionStates.valid && !TransactionStates.fetching ?
                                    <Col >
                                        <Form.Group controlId="movesPerPage">
                                            <Form.Label>{t("Moves state")}</Form.Label>
                                            <Form.Select value={filterOptions.state} onChange={handleChange} id="state">
                                                <option value="">{t("All")}</option>
                                                {TransactionStates.values.map((state, key) => <option key={key} value={state.id}>{t(state.name)}</option>)}
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                    :
                                    null
                            }
                            <Col xs="auto" className="d-flex align-items-end">
                                <Button type="submit" disabled={filterOptions.moves < 1} variant="outline-secondary">
                                    {t("Update")}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    )
}
export default FilterOptions
