import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { InputGroup, Form/*, DropdownButton, Dropdown */} from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons'

const FundsSearch = ({/* CategorySearched, setCategorySearched, Categories,*/
    SearchText, handleSearch, FilteredFunds, cancelSearch }) => {

    const { t } = useTranslation();
    return (
        <InputGroup className={`my-3 searchBar ${FilteredFunds.length > 0 || SearchText.length === 0 ? "" : "notfound"} ${SearchText.length === 0 ? "" : "search"} `}>
            <InputGroup.Text className="left" id="basic-addon1">
                <FontAwesomeIcon className="icon" icon={faSearch} />
            </InputGroup.Text>
            <Form.Control
                onChange={handleSearch}
                value={SearchText}
                placeholder={t("Search fund by name")}
                aria-label="Search"
            />
            {SearchText.length > 0 ?
                <InputGroup.Text onClick={() => { cancelSearch() }} className="right" id="basic-addon1">
                    <FontAwesomeIcon className="icon" icon={faTimes} />
                </InputGroup.Text>
                :
                null
            }
            {/*<DropdownButton
                variant="outline-secondary"
                title={CategorySearched}
                align="end"
            >
                {
                    Categories.map((category, key) =>
                        <Dropdown.Item active={category === CategorySearched} key={key}
                            onClick={()=>setCategorySearched(category)}>
                            {category}
                        </Dropdown.Item>
                    )
                }
            </DropdownButton>*/}
        </InputGroup>
    )
}
export default FundsSearch
