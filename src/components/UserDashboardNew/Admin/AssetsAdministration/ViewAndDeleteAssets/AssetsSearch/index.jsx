import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { InputGroup, Form } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'

const AssetsSearch = ({ SearchText, handleSearch,FilteredAssets,cancelSearch }) => {

    const { t } = useTranslation();

    return (
        <InputGroup className={`my-3 searchBar ${FilteredAssets.length>0 || SearchText.length===0 ? "" : "notfound"} ${SearchText.length === 0 ? "" : "search"} `}>
            <InputGroup.Text className="left" id="basic-addon1">
                <FontAwesomeIcon className="icon" icon={faSearch} />
            </InputGroup.Text>
            <Form.Control
                onChange={handleSearch}
                value={SearchText}
                placeholder={t("Search Asset by name")}
                aria-label="Search"
            />
            {SearchText.length > 0 ?
                <InputGroup.Text onClick={()=>{cancelSearch()}} className="right" id="basic-addon1">
                    <FontAwesomeIcon className="icon" icon={faTimes}/>
                </InputGroup.Text>
                :
                null
            }

        </InputGroup>
    )
}
export default AssetsSearch
