import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { InputGroup, Form, Button, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'

const Search = ({ props }) => {

    const SearchText = props.SearchText
    const handleSearchChange = props.handleSearchChange
    const cancelSearch = props.cancelSearch
    const Search = props.Search
    const fetching = props.fetching

    const { t } = useTranslation();

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            Search()
        }
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Label>{t("Ticket N°")}</Form.Label>
            <InputGroup className={`searchBar  ${SearchText.length === 0 ? "" : "search"} `}>
                <Form.Control
                    onChange={handleSearchChange}
                    value={SearchText}
                    placeholder={t("Ticket N°")}
                    aria-label="Search"
                    type="number"
                    disabled={fetching}
                    required
                />
                <Button disabled={fetching || SearchText.length <= 0} style={{ borderColor: "#ced4da" }} className="btn-main d-flex align-items-center" variant="outline-secondary" onClick={() => cancelSearch()} id="basic-addon1">
                    <FontAwesomeIcon className="icon" icon={faTimes} />
                </Button>
                <Button disabled={fetching || SearchText.length <= 0} variant="outline-secondary" style={{ borderColor: "#ced4da" }} className="btn-main right d-flex align-items-center" type="submit" id="basic-addon1">
                    {fetching ?
                        <Spinner animation="border" size="sm" />
                        :
                        <FontAwesomeIcon className="icon" icon={faSearch} />}
                </Button>
            </InputGroup>
        </Form>
    )
}
export default Search
