import { DashBoardContext } from "context/DashBoardContext";
import React, { useContext, useState } from "react";
import { Button, Form, Offcanvas } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const FilterOptionsMobile = ({ show, handleClose, disabled, setOptions }) => {
    const { t } = useTranslation();
    const { TransactionStates } = useContext(DashBoardContext)

    const [filterOptions, setFilterOptions] = useState({
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
            setOptions((prevState) => ({
                ...prevState, ...{
                    state: filterOptions.state === "" ? null : filterOptions.state
                }
            }))
            handleClose()
        }
    }

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
                            <Form.Select value={filterOptions.state} onChange={handleChange} id="state">
                                <option value="">{t("All")}</option>
                                {TransactionStates.values.map((state, key) => <option key={key} value={state.id}>{t(state.name)}</option>)}
                            </Form.Select>
                        </Form.Group>
                    }
                    <div className="d-flex justify-content-end">
                        <Button className="mt-2" type="submit" disabled={disabled} variant="outline-secondary">
                            {t("Update")}
                        </Button>
                    </div>

                </Form>
            </Offcanvas.Body>
        </Offcanvas >
    );
}

export default FilterOptionsMobile