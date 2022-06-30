import React, { useContext } from 'react'
import { DashBoardContext } from 'context/DashBoardContext';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Row, Form, Accordion, Container, InputGroup, Button, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from "react-i18next";

const TargetAccountSelector = ({ data, TargetAccount, setTargetAccount, handleChange, validated, openAccordion, closeAccordion }) => {
    const { token, AccountSelected } = useContext(DashBoardContext)
    const accountAlias = AccountSelected?.alias

    const { t } = useTranslation();

    const handleOnkeyDown = (event) => {
        switch (event.key) {
            case 'Enter':
                event.preventDefault();
                if (data.alias !== "" && data.alias !== accountAlias) {
                    search()
                    event.target.blur()
                }
                break
            default:
                break;
        }
    }

    const search = async () => {
        setTargetAccount(prevState => ({ ...prevState, ...{ fetching: true, fetched: false } }))

        var url = `${process.env.REACT_APP_APIURL}/accounts/byAlias?`+new URLSearchParams({
            alias: data.alias
        })
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })
        if (response.status === 200) {
            let dataFetched = await response.json()
            setTargetAccount(prevState => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, content: dataFetched } }))
            openAccordion()
        } else {
            setTargetAccount(prevState => ({ ...prevState, ...{ fetching: false, fetched: true, valid: false } }))
            switch (response.status) {
                case 500:
                    console.error(response.status)
                    break
                default:
                    console.error(response.status)
                    break
            }
        }

    }
    
    return (
        <Accordion.Item eventKey="0">
            <Accordion.Header>
                <Container>
                    <Row className="d-flex justify-content-center">
                        <Form.Label className="pt-0 label d-flex align-items-center" column sm="auto">
                            <span>
                                <span className="d-inline-block numberContainer">
                                    <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                        <span className="number">1</span>
                                    </div>
                                </span>
                                {t("To transfer to")}:
                            </span>
                        </Form.Label>
                    </Row>
                </Container>
            </Accordion.Header>
            <Accordion.Body>

                <InputGroup >
                    <Form.Control
                        onKeyDown={(e) => handleOnkeyDown(e)}
                        placeholder={t("Enter account alias")} value={data.alias} type="text" id="alias" required
                        className={`${TargetAccount.fetched || validated ? TargetAccount.valid ? "hardcoded-valid" : "hardcoded-invalid" : "hardcoded-novalidate"}`}
                        onChange={(e) => {
                            handleChange(e);
                            closeAccordion();
                            setTargetAccount(prevState => ({ ...prevState, ...{ fetching: false, fetched: false, valid: false } }))
                        }}
                    />
                    <Button className="p-relative" onClick={() => search()} variant="danger" disabled={TargetAccount.fetching || TargetAccount.fetched}>
                        <FontAwesomeIcon className={`inputSearchLogo ${TargetAccount.fetching ? "hidden" : "active"}`} icon={faSearch} />

                        <div className={`inputSearchLogo ${TargetAccount.fetching ? "active" : "hidden"}`}>
                            <Spinner size="sm" animation="border" variant="light" className={`d-inline-block littleSpinner`} />
                        </div>
                        <FontAwesomeIcon className={`inputSearchLogo placeholder`} icon={faSearch} />
                    </Button>
                </InputGroup >
                <div className="mb-3">
                    {
                        TargetAccount.fetched ?
                            <Form.Text className={!TargetAccount.valid ? "text-red" : "text-green"}>
                                {
                                    TargetAccount.valid ?
                                        t("Looks good") + "!"
                                        :
                                        data.alias === accountAlias ?
                                            t("The target account cannot be your own account")
                                            :
                                            t("The alias entered does not correspond to any GWM account")
                                }
                            </Form.Text>
                            :
                            null
                    }
                </div>
            </Accordion.Body>
        </Accordion.Item >
    )
}
export default TargetAccountSelector