import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { InputGroup, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'
import './index.css'
const ClientsSearch = ({ handleSearch, SearchText, cancelSearch, FilteredClients, Clients, search }) => {

    const { t } = useTranslation();

    return (
        <InputGroup className={`my-3 searchBar ${FilteredClients.length > 0 || SearchText.length === 0 ? "" : "notfound"} ${(SearchText.length === 0 && FilteredClients.length === Clients.length) ? "" : "search"} `}>
            <InputGroup.Text className="left" id="basic-addon1">
                <FontAwesomeIcon className="icon" icon={faSearch} />
            </InputGroup.Text>
            <Form.Control
                onChange={handleSearch}
                value={SearchText}
                placeholder={t("Search client")}
                aria-label="Search"
                onKeyDown={e => { if (e.key === 'Enter') search() }}
            />
            {
                FilteredClients.length !== Clients.length &&
                <InputGroup.Text title={t("Cancel")} onClick={() => { cancelSearch() }} className="right" id="basic-addon1">
                    <FontAwesomeIcon className="icon" icon={faTimes} />
                </InputGroup.Text>
            }
            {SearchText.length > 0 ?
                <InputGroup.Text title={t("Search")} onClick={() => { search() }} className="right" id="basic-addon1">
                    <FontAwesomeIcon className="icon" icon={faMagnifyingGlass} />
                </InputGroup.Text>
                :
                null
            }
        </InputGroup>
    )
}
export default ClientsSearch
