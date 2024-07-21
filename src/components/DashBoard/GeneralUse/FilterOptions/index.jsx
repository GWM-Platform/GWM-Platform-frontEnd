import React, { useContext, useEffect, useState } from 'react'

import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';

import { Accordion, Form, Row, Col, Button } from 'react-bootstrap';
import TicketSearch from 'components/DashBoard/GeneralUse/TicketSearch'

import 'bootstrap/dist/css/bootstrap.min.css';

const FilterOptions = ({ keyword, Fund, movsPerPage, setPagination, disabled, ticketSearch, ticketSearchProps, movements, defaultMoves = 5 }) => {
    const { t } = useTranslation();
    const { TransactionStates } = useContext(DashBoardContext)

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
                moves: defaultMoves,
                state: ""
            }
        }))
    }, [Fund, defaultMoves])

    return (
        <Accordion flush>
            <Accordion.Item eventKey="0">
                <Accordion.Header >
                    {t("Filters")} {disabled ? t("(Cancel the search to use them)") : ""}
                </Accordion.Header>
                <Accordion.Body >
                    <Form onSubmit={updateFilters}>
                        <Row className="align-items-stretch">
                            <Col>
                                <Form.Group>
                                    <Form.Label className="capitalizeFirstLetter">{t(keyword + " per page")}</Form.Label>
                                    <Form.Control disabled={disabled} required id="moves" onChange={handleChange} value={filterOptions.moves} type="number" min="1" placeholder={t(keyword + " per page")} />
                                </Form.Group>
                            </Col>
                            {
                                !!(TransactionStates.fetched && TransactionStates.valid && !TransactionStates.fetching) &&
                                <Col >
                                    <Form.Group controlId="movesPerPage">
                                        <Form.Label className="capitalizeFirstLetter">{t(`status`)}</Form.Label>
                                        <Form.Select disabled={disabled} value={filterOptions.state} onChange={handleChange} id="state">
                                            <option value="">{movements ? t("All except denied") : t("All")}</option>
                                            {!!(movements) && <option value="10">{t("All (including denied)")}</option>}
                                            {TransactionStates.values.map((state, key) => <option key={key} value={state.id}>{t(state.name)}</option>)}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            }

                            <Col xs="auto" className="d-flex align-items-end">
                                <Button type="submit" disabled={filterOptions.moves < 1 || disabled} variant="outline-secondary">
                                    {t("Update")}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                    <Row className="align-items-stretch">
                        {
                            !!ticketSearch && <Col> <TicketSearch props={ticketSearchProps} /> </Col>
                        }
                    </Row>
                </Accordion.Body>

            </Accordion.Item>
        </Accordion>
    )
}
export default FilterOptions