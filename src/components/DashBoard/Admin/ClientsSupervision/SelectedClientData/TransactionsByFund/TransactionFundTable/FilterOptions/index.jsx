import React, { useContext, useEffect, useState } from 'react'

import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';

import { Form, Row, Col, Button } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';

const FilterOptions = ({ keyword, Fund, movsPerPage, setPagination, disabled, total = 20 }) => {
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
        if (form.checkValidity()) {
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
        <Form onSubmit={updateFilters}>
            <Row className="align-items-stretch mb-3">
                <Col>
                    <Form.Group>
                        <Form.Label className="capitalizeFirstLetter">{t(keyword + " per page")}</Form.Label>
                        <Form.Select disabled={disabled} required id="moves" onChange={handleChange} value={filterOptions.moves} placeholder={t(keyword + " per page")} >
                            {!!(total > 5) && <option>5</option>}
                            {!!(total > 10) && <option>10</option>}
                            {!!(total > 25) && <option>25</option>}
                            {!!(total > 50) && <option>50</option>}
                            {!!(total > 100) && <option>100</option>}
                            <option value={total}>{t("Maximum ({{maximum}})", { maximum: total })}</option>
                        </Form.Select>
                    </Form.Group>
                </Col>
                {
                    !!(TransactionStates.fetched && TransactionStates.valid && !TransactionStates.fetching) &&
                    <Col >
                        <Form.Group controlId="movesPerPage">
                            <Form.Label className="capitalizeFirstLetter">{t(`status`)}</Form.Label>
                            <Form.Select disabled={disabled} value={filterOptions.state} onChange={handleChange} id="state">
                                <option value="">{t("All")}</option>
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
    )
}
export default FilterOptions