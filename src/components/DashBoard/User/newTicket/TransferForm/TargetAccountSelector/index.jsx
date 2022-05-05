import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Row, Form, Accordion, Container, InputGroup, Button, Spinner } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useTranslation } from "react-i18next";

const TargetAccountSelector = ({ data, TargetAccount, setTargetAccount, handleChange, validated, openAccordion, closeAccordion }) => {
    const { t } = useTranslation();
    const handleOnkeyDown = (event) => {
        switch (event.key) {
            case 'Enter':
                event.preventDefault();
                searchAccount()
                event.target.blur()
                break
            default:
                break;
        }
    }

    const searchAccount = () => {
        setTargetAccount(prevState => ({ ...prevState, ...{ fetching: true, fetched: false, valid: false } }))
        search()
    }
    const search = async () => {
        await new Promise(resolve => {
            setTimeout((() => {
                setTargetAccount(prevState => ({ ...prevState, ...{ fetching: false, fetched: true, valid: data.TargetAccountID === "1234" } }))
                if (data.TargetAccountID === "1234") {
                    openAccordion()
                } else {
                    closeAccordion()
                }
            }), 2000);
        });

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
                                {t("Specify the target account")}
                            </span>
                        </Form.Label>
                    </Row>
                </Container>
            </Accordion.Header>
            <Accordion.Body>

                <InputGroup >

                    <Form.Control
                        onKeyDown={(e) => handleOnkeyDown(e)}
                        placeholder={t("Target account ID")} value={data.TargetAccountID} type="number" id="TargetAccountID" required
                        className={`${TargetAccount.fetched || validated ? TargetAccount.valid ? "hardcoded-valid" : "hardcoded-invalid" : "hardcoded-novalidate"}`}
                        onChange={(e) => {
                            handleChange(e);
                            closeAccordion();
                            setTargetAccount(prevState => ({ ...prevState, ...{ fetching: false, fetched: false, valid: false } }))
                        }}
                    />
                    <Button className="p-relative" onClick={() => searchAccount()} variant="danger" disabled={TargetAccount.fetching || TargetAccount.fetched}>
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
                                        t("The account id entered does not correspond to any GWM account")
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