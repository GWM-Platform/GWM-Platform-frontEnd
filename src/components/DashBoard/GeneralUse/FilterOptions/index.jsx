import React, { useContext, useEffect, useMemo, useState } from 'react'

import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';

import { Accordion, Form, Row, Col, Button } from 'react-bootstrap';
import TicketSearch from 'components/DashBoard/GeneralUse/TicketSearch'

import 'bootstrap/dist/css/bootstrap.min.css';
import { motives } from 'components/DashBoard/Admin/TicketsAdministration';
import MultiSelectById from 'components/DashBoard/Admin/TicketsAdministration/MultiSelectById';

const FilterOptions = ({ keyword, Fund, movsPerPage, setPagination, disabled, ticketSearch, ticketSearchProps, movements, defaultMoves = 5, dateFilters = false, filterMotives = false }) => {
    const { t } = useTranslation();
    const { TransactionStates } = useContext(DashBoardContext)

    const [filterOptions, setFilterOptions] = useState({
        moves: movsPerPage,
        state: "",
        fromDate: "",
        toDate: "",
        filterMotives: []
    })

    const handleChange = (event, number = true) => {
        setFilterOptions((prevState) => ({
            ...prevState, ...{
                [event.target.id]: !number || isNaN(parseInt(event.target.value)) ? event.target.value : parseInt(event.target.value)
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
                    state: filterOptions.state === "" ? null : filterOptions.state,
                    ...dateFilters ? {
                        fromDate: filterOptions.fromDate,
                        toDate: filterOptions.toDate
                    } : {},
                    ...filterMotives ? {
                        filterMotives: filterOptions.filterMotives
                    } : {}
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
                <Accordion.Body className='px-0'>
                    <Form onSubmit={updateFilters}>
                        <Row className="align-items-stretch mb-2">
                            <Col xs="6">
                                <Form.Group>
                                    <Form.Label className="capitalizeFirstLetter">{t(keyword + " per page")}</Form.Label>
                                    <Form.Control disabled={disabled} required id="moves" onChange={e => handleChange(e)} value={filterOptions.moves} type="number" min="1" placeholder={t(keyword + " per page")} />
                                </Form.Group>
                            </Col>
                            {
                                !!(TransactionStates.fetched && TransactionStates.valid && !TransactionStates.fetching) &&
                                <Col xs="6">
                                    <Form.Group controlId="movesPerPage">
                                        <Form.Label className="capitalizeFirstLetter">{t(`status`)}</Form.Label>
                                        <Form.Select disabled={disabled} value={filterOptions.state} onChange={e => handleChange(e)} id="state">
                                            <option value="">{movements ? t("All except denied") : t("All")}</option>
                                            {!!(movements) && <option value="10">{t("All (including denied)")}</option>}
                                            {TransactionStates.values.map((state, key) => <option key={key} value={state.id}>{t(state.name)}</option>)}
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            }
                            {
                                filterMotives &&
                                <Col xs="6" className="mt-2">
                                    <MotiveMultiSelect handleChange={handleChange} FormData={filterOptions} />
                                </Col>
                            }
                            {
                                dateFilters &&
                                <>
                                    <Col xs="12" />
                                    <Col xs="6">
                                        <Form.Group className="mt-2">
                                            <Form.Label>{t("from_date")}</Form.Label>
                                            <Form.Control
                                                placeholder={t('from_date')}
                                                id="fromDate"
                                                type="date"
                                                value={filterOptions.fromDate}
                                                onChange={e => handleChange(e, false)}
                                            />
                                        </Form.Group>
                                    </Col>
                                    <Col xs="6">
                                        <Form.Group className="mt-2">
                                            <Form.Label>{t("to_date")}</Form.Label>
                                            <Form.Control
                                                placeholder={t('to_date')}
                                                id="toDate"
                                                type="date"
                                                value={filterOptions.toDate}
                                                onChange={e => handleChange(e, false)}
                                            />
                                        </Form.Group>
                                    </Col>
                                </>
                            }
                            <Col xs="12" />
                            <Col xs="auto" className="d-flex align-items-end ms-auto mt-4">
                                <Button
                                    type="button" onClick={() => {
                                        setFilterOptions((prevState) => ({
                                            ...prevState, ...{
                                                moves: defaultMoves,
                                                state: "",
                                                ...dateFilters ? { fromDate: "", toDate: "" } : {}
                                            }
                                        }))
                                    }}
                                    disabled={disabled} variant="outline-secondary">
                                    {t("Cancel")}
                                </Button>
                            </Col>
                            <Col xs="auto" className="d-flex align-items-end mt-4">
                                <Button type="submit" disabled={filterOptions.moves < 1 || disabled} variant="outline-secondary">
                                    {t("Update")}
                                </Button>
                            </Col>
                            <Col xs="12" className='mt-4'>
                                <div style={{ borderBottom: "1px solid #ced4da" }} />
                            </Col>
                        </Row>
                    </Form>
                    <Row className="align-items-stretch">
                        {
                            !!ticketSearch &&
                            <>
                                <Col> <TicketSearch props={ticketSearchProps} /> </Col>
                                <Col xs="12" className='mt-4'>
                                    <div style={{ borderBottom: "1px solid #ced4da" }} />
                                </Col>
                            </>
                        }
                    </Row>
                </Accordion.Body>

            </Accordion.Item>
        </Accordion>
    )
}
export default FilterOptions

export const MotiveMultiSelect = ({
    handleChange,
    FormData
}) => {
    const { t } = useTranslation()
    const options = useMemo(() => {
        const groupedMotives = motives.reduce((acc, motive) => {
            if (motive.group) {
                if (!acc[motive.group]) {
                    acc[motive.group] = {
                        label: t(motive.group),
                        options: []
                    }
                }
                acc[motive.group].options.push({
                    label: t(motive.labelKey),
                    group: t(motive.group),
                    value: motive.value
                })
            } else {
                if (!acc['others']) {
                    acc['others'] = {
                        label: t('Others'),
                        options: []
                    }
                }
                acc['others'].options.push({
                    label: t(motive.labelKey),
                    value: motive.value
                })
            }
            return acc
        }, {});

        return Object.values(groupedMotives).map(group => ({
            label: group.label,
            options: group.options.sort((a, b) => {
                const aSelected = FormData.filterMotives.includes(a.value);
                const bSelected = FormData.filterMotives.includes(b.value);
                // selected options should be sorted first, then the rest
                // both selected or both not selected, sort by label
                if (aSelected === bSelected) {
                    return a.label.localeCompare(b.label);
                } else {
                    return aSelected ? -1 : 1;
                }
            })
        }))
    }, [FormData.filterMotives, t]);

    const optionsAlternative = useMemo(() => {
        return motives.map(motive => ({
            label: `${t(motive.labelKey)} - ${t(motive.group)}`,
            groupLabel: t(motive.group),
            value: motive.value
        })).sort((a, b) => {
            const aSelected = FormData.filterMotives.includes(a.value);
            const bSelected = FormData.filterMotives.includes(b.value);
            if (aSelected === bSelected) {
                if (a.groupLabel === b.groupLabel) {
                    return a.label.localeCompare(b.label);
                } else {
                    return a.groupLabel.localeCompare(b.groupLabel);
                }
            } else {
                return aSelected ? -1 : 1;
            }
        })
    }, [FormData.filterMotives, t])

    const [mode, setMode] = useState(false);
    return (
        <>
            <Form.Label>
                {t("Concept")}&nbsp;-&nbsp;
                <span className="link-style" onClick={() => setMode(prevState => !prevState)}>
                    Modo {mode ? "normal" : "alternativo"}
                </span>
            </Form.Label>
            <MultiSelectById
                placeholder={t('All')}
                options={mode ? options : optionsAlternative}
                FormData={FormData}
                isClearable
                id="filterMotives"
                handleChange={handleChange}
            />

        </>
    )
}