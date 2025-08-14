import { MotiveMultiSelect } from "components/DashBoard/GeneralUse/FilterOptions";
import { DashBoardContext } from "context/DashBoardContext";
import React, { useContext, useState } from "react";
import { Button, Form, Offcanvas } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const FilterOptionsMobile = ({ show, handleClose, disabled, setOptions, dateFilters, filterMotives }) => {
    const { t } = useTranslation();
    const { TransactionStates } = useContext(DashBoardContext)

    const [filterOptions, setFilterOptions] = useState({
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
            setOptions((prevState) => ({
                ...prevState, ...{
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
            handleClose()
        }
    }
    const movements = true
    return (
        <Offcanvas show={show} onHide={handleClose} placement="bottom" name="filters mobile">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>
                    {t("Filters")} {disabled ? t("(Cancel the search to use them)") : ""}
                </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                <Form onSubmit={updateFilters}>
                    {
                        !!(TransactionStates.fetched && TransactionStates.valid && !TransactionStates.fetching) &&
                        <Form.Group controlId="movesPerPage">
                            <Form.Label className="capitalizeFirstLetter">{t(`status`)}</Form.Label>
                            <Form.Select disabled={disabled} value={filterOptions.state} onChange={e => handleChange(e)} id="state">
                                <option value="">{movements ? t("All except denied") : t("All")}</option>
                                {!!(movements) && <option value="10">{t("All (including denied)")}</option>}
                                {TransactionStates.values.map((state, key) => <option key={key} value={state.id}>{t(state.name)}</option>)}
                            </Form.Select>
                        </Form.Group>
                    }
                    {
                        filterMotives &&
                        <Form.Group className="mt-2">
                            <MotiveMultiSelect handleChange={handleChange} FormData={filterOptions} />
                        </Form.Group>}
                    {
                        dateFilters &&
                        <>
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
                        </>
                    }
                    <div className="d-flex justify-content-end mt-4">
                        <Button
                            type="button" onClick={() => {
                                setFilterOptions((prevState) => ({
                                    ...prevState, ...{
                                        state: "",
                                        ...dateFilters ? { fromDate: "", toDate: "" } : {}
                                    }
                                }))
                            }}
                            disabled={disabled} variant="outline-secondary">
                            {t("Cancel")}
                        </Button>
                        <Button className="ms-2" type="submit" disabled={disabled} variant="outline-secondary">
                            {t("Update")}
                        </Button>
                    </div>

                </Form>
            </Offcanvas.Body>
        </Offcanvas >
    );
}

export default FilterOptionsMobile