import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, InputGroup, Button } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from 'react-i18next';

const NotesSearch = ({ FilteredNotes, SearchText, handleSearch, cancelSearch }) => {
    const { t } = useTranslation()

    return (
        <div className="mb-3">
            <Form>
                <InputGroup>
                    <InputGroup.Text>
                        <FontAwesomeIcon icon={faSearch} />
                    </InputGroup.Text>
                    <Form.Control
                        type="text"
                        placeholder={t("Search by name")}
                        value={SearchText}
                        onChange={handleSearch}
                    />
                    {SearchText.length > 0 && (
                        <Button variant="outline-secondary" onClick={cancelSearch}>
                            <FontAwesomeIcon icon={faTimes} />
                        </Button>
                    )}
                </InputGroup>
            </Form>
        </div>
    )
}

export default NotesSearch

