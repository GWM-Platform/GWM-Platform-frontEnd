import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { InputGroup, Form, Button, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'

const Search = ({ SearchText, handleSearchChange, cancelSearch, Search, keyWord, fetching }) => {

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
            <InputGroup className={`mb-2 searchBar  ${SearchText.length === 0 ? "" : "search"} `}>
                <Form.Control
                    onChange={handleSearchChange}
                    value={SearchText}
                    placeholder={t("Search") + t(" ") + t(keyWord ? keyWord : "") + t(" ") + t("by id")}
                    aria-label="Search"
                    type="number"
                    disabled={fetching}
                />
                {SearchText.length > 0 ?
                    <>
                        <Button className="btn-main" onClick={() => cancelSearch()} id="basic-addon1">
                            <FontAwesomeIcon className="icon" icon={faTimes} />
                        </Button>
                        <Button disabled={fetching} className="btn-main right" type="submit" id="basic-addon1">
                            {fetching?
                            <Spinner animation="border" size="sm" />
                            :
                            <FontAwesomeIcon className="icon" icon={faSearch} />}
                        </Button>
                    </>
                    :
                    null
                }
            </InputGroup>
        </Form>
    )
}
export default Search
