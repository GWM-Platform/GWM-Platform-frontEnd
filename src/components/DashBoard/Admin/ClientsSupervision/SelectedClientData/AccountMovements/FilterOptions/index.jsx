import React, { useContext, useEffect, useState } from 'react'

import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';

import { Form, Row, Col, Button } from 'react-bootstrap';
import CurrencyInput from '@osdiab/react-currency-input-field';

import 'bootstrap/dist/css/bootstrap.min.css';
import { MotiveMultiSelect } from 'components/DashBoard/GeneralUse/FilterOptions';
import { StatesSelector } from 'components/DashBoard/Admin/TicketsAdministration/StateSelector';
import { decimalSeparator, groupSeparator } from 'components/DashBoard/Admin/TicketsAdministration';

const FilterOptions = ({ keyword, Fund, movsPerPage, setPagination, disabled, total = 20 }) => {
    const { t } = useTranslation();
    const { TransactionStates } = useContext(DashBoardContext)

    const [filterOptions, setFilterOptions] = useState({
        moves: movsPerPage,
        filterStates: [],
        filterMotives: [],
        fromDate: "",
        toDate: "",
        fromAmount: "",
        toAmount: "",
    })

    useEffect(() => {
        if (TransactionStates?.values?.length > 0) {
            setFilterOptions((prevState) => ({
                ...prevState,
                filterStates: TransactionStates.values.map((state) => state.id).filter((id) => id !== 3),
            }))
        }
    }, [TransactionStates?.values])

    const handleChange = (event, shouldParseNumber = true) => {
        setFilterOptions((prevState) => ({
            ...prevState, ...{
                [event.target.id]: !shouldParseNumber || isNaN(parseInt(event.target.value)) ? event.target.value : parseInt(event.target.value)
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
                    filterStates: filterOptions.filterStates,
                    filterMotives: filterOptions.filterMotives,
                    fromDate: filterOptions.fromDate,
                    toDate: filterOptions.toDate,
                    fromAmount: filterOptions.fromAmount,
                    toAmount: filterOptions.toAmount,
                }
            }))
        }
    }

    useEffect(() => {
        setFilterOptions((prevState) => ({
            ...prevState, ...{
                moves: 100,
                filterStates: (TransactionStates?.values || []).map((state) => state.id).filter((id) => id !== 3),
                filterMotives: [],
                fromDate: "",
                toDate: "",
                fromAmount: "",
                toAmount: "",
            }
        }))
    }, [Fund, TransactionStates?.values])

    return (
        <Form onSubmit={updateFilters}>
            <Row className="align-items-end mb-3">
                <Col md="3">
                    <Form.Group>
                        <Form.Label className="capitalizeFirstLetter">{t(keyword + " per page")}</Form.Label>
                        <Form.Control
                            disabled={disabled}
                            required
                            id="moves"
                            onChange={handleChange}
                            value={filterOptions.moves}
                            type="number"
                            min="1"
                            placeholder={t(keyword + " per page")}
                        />
                    </Form.Group>
                </Col>
                {
                    !!(TransactionStates.fetched && TransactionStates.valid && !TransactionStates.fetching) &&
                    <Col md="4">
                        <StatesSelector
                            className="mb-0"
                            FormData={filterOptions}
                            handleChange={(event) => handleChange(event, false)}
                            TransactionStates={TransactionStates}
                        />
                    </Col>
                }

                <Col md="5">
                    <Form.Group>
                        <MotiveMultiSelect handleChange={handleChange} FormData={filterOptions} />
                    </Form.Group>
                </Col>

                <Col md="3" className="mt-2 mt-md-0">
                    <Form.Group>
                        <Form.Label>{t("from_amount")}</Form.Label>
                        <CurrencyInput
                            disabled={disabled}
                            decimalsLimit={2}
                            decimalSeparator={decimalSeparator}
                            groupSeparator={groupSeparator}
                            onValueChange={(value) => handleChange({ target: { id: "fromAmount", value: value || "" } }, false)}
                            id="fromAmount"
                            placeholder={t('from_amount')}
                            className="form-control"
                            value={filterOptions.fromAmount}
                        />
                    </Form.Group>
                </Col>

                <Col md="3" className="mt-2 mt-md-0">
                    <Form.Group>
                        <Form.Label>{t("to_amount")}</Form.Label>
                        <CurrencyInput
                            disabled={disabled}
                            decimalsLimit={2}
                            decimalSeparator={decimalSeparator}
                            groupSeparator={groupSeparator}
                            onValueChange={(value) => handleChange({ target: { id: "toAmount", value: value || "" } }, false)}
                            id="toAmount"
                            placeholder={t('to_amount')}
                            className="form-control"
                            value={filterOptions.toAmount}
                        />
                    </Form.Group>
                </Col>

                <Col md="3" className="mt-2 mt-md-0">
                    <Form.Group>
                        <Form.Label>{t("from_date")}</Form.Label>
                        <Form.Control
                            disabled={disabled}
                            id="fromDate"
                            type="date"
                            value={filterOptions.fromDate}
                            onChange={(event) => handleChange(event, false)}
                        />
                    </Form.Group>
                </Col>

                <Col md="3" className="mt-2 mt-md-0">
                    <Form.Group>
                        <Form.Label>{t("to_date")}</Form.Label>
                        <Form.Control
                            disabled={disabled}
                            id="toDate"
                            type="date"
                            value={filterOptions.toDate}
                            onChange={(event) => handleChange(event, false)}
                        />
                    </Form.Group>
                </Col>

                <Col xs="auto" className="d-flex align-items-end ms-auto mt-3">
                    <Button
                        type="button"
                        onClick={() => {
                            const resetFilters = {
                                moves: 100,
                                filterStates: (TransactionStates?.values || []).map((state) => state.id).filter((id) => id !== 3),
                                filterMotives: [],
                                fromDate: "",
                                toDate: "",
                                fromAmount: "",
                                toAmount: "",
                            }
                            setFilterOptions(resetFilters)
                            setPagination((prevState) => ({
                                ...prevState,
                                take: resetFilters.moves,
                                skip: 0,
                                filterStates: resetFilters.filterStates,
                                filterMotives: resetFilters.filterMotives,
                                fromDate: resetFilters.fromDate,
                                toDate: resetFilters.toDate,
                                fromAmount: resetFilters.fromAmount,
                                toAmount: resetFilters.toAmount,
                            }))
                        }}
                        disabled={disabled}
                        variant="outline-secondary"
                    >
                        {t("Cancel")}
                    </Button>
                </Col>

                <Col xs="auto" className="d-flex align-items-end mt-3">
                    <Button type="submit" disabled={filterOptions.moves < 1 || disabled} variant="outline-secondary">
                        {t("Update")}
                    </Button>
                </Col>
            </Row>
        </Form>
    )
}
export default FilterOptions
