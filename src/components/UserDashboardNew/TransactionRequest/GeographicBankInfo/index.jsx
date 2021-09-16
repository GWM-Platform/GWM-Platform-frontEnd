import React, { useContext } from 'react'
import { useEffect } from 'react';
import { Col, Form, Row, Popover, OverlayTrigger, Collapse, Accordion, Container, FloatingLabel } from 'react-bootstrap';
import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { urlContext } from '../../../../context/urlContext';

function GeographicBankInfo({ geoBankInfoActive, setGeoBankInfoActive, bankDataFetched, data, setData, transactionType }) {
    const { t } = useTranslation();
    const {urlPrefix}=useContext(urlContext)

    //Data fetched from the API
    const [countries, setCountries] = useState([])
    const [subDivisions, setsubDivisions] = useState([])
    const [cities, setCities] = useState([])
    const [citiesCopy, setCitiesCopy] = useState([])
    const [fetchingCities, setFetchingCities] = useState(false)
    const [active, setActive] = useState("")

    const [countryISO, setCountryISO] = useState("")
    const [subDivISO, setSubDivISO] = useState("")

    //Data fetched from the API filtered
    const [suggestions, setSuggestions] = useState([])
    const [subDivSuggestions, setSubDivSuggestions] = useState([])

    const getCountries = () => {
        var url = `${urlPrefix}/countries`;
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                if (response.stateCode === undefined) {
                    setCountries(response)
                } else {
                    setCountries([])
                }
            });
    }

    const getStates = (countryCode) => {
        var url = `${urlPrefix}/states?` + new URLSearchParams({
            countryCode: countryCode,
        });
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                if (response.statusCode !== undefined) {
                    setsubDivisions([])
                } else {
                    setsubDivisions(response)
                }
            });
    }

    const getCities = (subdivISO) => {
        setFetchingCities(true)
        var url = `${urlPrefix}/cities?` + new URLSearchParams({
            countryCode: countryISO,
            stateCode: subdivISO,
        });
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => {
                if (response.statusCode !== undefined) {
                    console.log(response)
                } else {
                    setCities(response)
                    setCitiesCopy(response)
                }
                setFetchingCities(false)
            });
    }

    const changeCountry = (e) => {
        let aux = data
        aux[e.target.id] = e.target.value
        aux.bankCity = ""
        aux.bankState = ""
        setCities([])
        setCitiesCopy([])
        setsubDivisions([])
        setSubDivSuggestions([])

        setCountryISO("")
        setSubDivISO("")
        setData(aux)
        if (e.target.value.length > 2) {
            const regex = new RegExp(`^${e.target.value}`, 'i')
            const suggestions = countries.sort().filter(v => regex.test(v.name))
            setSuggestions(suggestions)
        } else {
            const suggestions = []
            setSuggestions(suggestions)
        }
    }

    const changeState = (e) => {
        let aux = data
        setCities([])
        setCitiesCopy([])
        aux[e.target.id] = e.target.value
        aux.bankCity = ""
        setSubDivISO("")
        setData(aux)
        const regex = new RegExp(`^${e.target.value}`, 'i')
        const suggestions = subDivisions.sort().filter(v => regex.test(v.name))
        setSubDivSuggestions(suggestions)
    }

    const changeCity = (e) => {
        const regex = new RegExp(`${e.target.value}`, 'i')
        const suggestions = citiesCopy.sort().filter(v => regex.test(v.name))
        setCities(suggestions)
        let aux = data
        aux[e.target.id] = e.target.value
        setData(aux)
    }

    const handleChange = (e) => {
        let aux = data
        aux[e.target.id] = e.target.value
        setData(aux)
    }

    const handleBlur = () => {
        setTimeout(() => {
            setActive("")
        }, 250);
    }

    const handleFocus = (e) => {
        setActive(e.target.id)
    }

    useEffect(() => {
        getCountries()
        return () => {
        }
    }, [])

    return (
        <Accordion
            className={`mb-2 `}
            defaultActiveKey="0"
            activeKey={geoBankInfoActive}
            flush
        >
            <Accordion.Item eventKey="1">
                <Accordion.Header onClick={() => { setGeoBankInfoActive(geoBankInfoActive === "0" ? "1" : "0") }} className="ps-0">{t("Bank Geographic Info")}</Accordion.Header>
                <Accordion.Body className="py-1 mb-2" >
                    {/*-------------------------------------Country selector-----------------------------------------------*/}
                    <FloatingLabel label={t("Country")} className="mt-2">
                        <OverlayTrigger rootClose trigger={'click'} show={suggestions.length > 0 && active === "bankCountry"} placement="bottom-start" overlay={
                            <Popover id="popover-geoInfo" className="suggestionsPopover" >
                                {suggestions.map((u, i) => {
                                    ; return (
                                        <Popover.Header as="h3" className="mt-0"
                                            onClick={() => {
                                                let aux = data
                                                aux.bankCountry = u.name
                                                setData(aux)
                                                setSuggestions([])
                                                getStates(u.code)
                                                setCountryISO(u.code)
                                            }}>
                                            {u.name}
                                        </Popover.Header>
                                    )
                                })}
                            </Popover>
                        }>
                            <Form.Control
                                onFocus={(e) => { handleFocus(e) }}
                                onBlur={() => { handleBlur() }}
                                readOnly={bankDataFetched}
                                placeholder="Write at least 3 characters to search"
                                type="text"
                                value={data.bankCountry}
                                required={transactionType === "2" ? true : false}
                                id="bankCountry"
                                onChange={changeCountry}
                            />
                        </OverlayTrigger>
                    </FloatingLabel>
                    <Form.Text muted>
                        {t("Please, enter at least 3 characters to search and select the country of origin of the bank to which the target account belongs")}
                    </Form.Text>
                    <Container fluid className="py-0 px-2">
                        <Row>
                            <Row className="g-2">
                                <Col xs="12" sm="12" md="12" lg="6" xl="6">
                                    {/*-------------------------------------State selector-----------------------------------------------*/}
                                    <FloatingLabel label={t("State")}>
                                        <OverlayTrigger rootClose trigger='click' show={data.bankState !== "" && active === "bankState"} placement="bottom-start" overlay={
                                            <Popover id="popover-geoInfo" className="suggestionsPopover">
                                                {subDivSuggestions.map((u, i) => {
                                                    ; return (
                                                        <Popover.Header as="h3" className="mt-0"
                                                            onClick={() => {
                                                                setSubDivSuggestions([])
                                                                setSubDivISO(u.iso2)
                                                                let aux = data
                                                                aux.bankState = u.name
                                                                setData(aux)
                                                                getCities(u.iso2)
                                                            }}>
                                                            {u.name}
                                                        </Popover.Header>
                                                    )
                                                })}
                                            </Popover>
                                        }>
                                            <Form.Control
                                                disabled={countryISO === "" || subDivisions.length === 0 ? true : false}
                                                onFocus={(e) => { handleFocus(e) }}
                                                onBlur={() => { handleBlur() }}
                                                placeholder="Write at least 6 characters to search"
                                                type="text"
                                                value={data.bankState}
                                                required={/*transactionType === "2" ? true :*/ false}
                                                id="bankState"
                                                onChange={changeState}
                                                readOnly={bankDataFetched}
                                            />
                                        </OverlayTrigger>
                                    </FloatingLabel>
                                    <Form.Text muted>
                                        {t("Please, enter at least 6 characters to search and select the state of origin of the bank to which the target account belongs")}
                                    </Form.Text>
                                </Col>
                                {/*-------------------------------------City selector-----------------------------------------------*/}
                                <Col xs="12" sm="12" md="12" lg="6" xl="6">
                                    <FloatingLabel label={t("City")}>
                                        <OverlayTrigger rootClose trigger='click' show={data.bankCity !== "" && active === "bankCity"} placement="bottom-start" overlay={
                                            <Popover id="popover-geoInfo" className="suggestionsPopover" >
                                                {cities.map((u, i) => {
                                                    ; return (
                                                        <Popover.Header as="h3" className="mt-0"
                                                            onClick={() => {
                                                                setCities([])
                                                                let aux = data
                                                                aux.bankCity = u.name
                                                                setData(aux)
                                                            }}>
                                                            {u.name}
                                                        </Popover.Header>
                                                    )
                                                })}
                                            </Popover>
                                        }>
                                            <Form.Control
                                                disabled={subDivISO === "" || countryISO === "" || citiesCopy.length === 0 ? true : false}
                                                onFocus={(e) => { handleFocus(e) }}
                                                onBlur={() => { handleBlur() }}
                                                placeholder="Write at least 3 characters to search"
                                                type="text"
                                                value={data.bankCity}
                                                required={transactionType === "2" ? true : false}
                                                id="bankCity"
                                                onChange={changeCity}
                                                readOnly={bankDataFetched}
                                            />
                                        </OverlayTrigger>
                                    </FloatingLabel>
                                    <Form.Text muted>
                                        {t("Please, enter at least 3 characters to search and select the city of origin of the bank to which the target account belongs")}
                                    </Form.Text>
                                </Col>
                                {/*-------------------------------------Address-----------------------------------------------*/}
                                <Col xs="12" sm="12" md="12" lg="6" xl="6" className="pb-2">
                                    <FloatingLabel label={t("Address")}>
                                        <Form.Control
                                            value={data.bankAddress}
                                            placeholder=""
                                            autocomplete="off"
                                            required={transactionType === "2" ? true : false}
                                            type="text"
                                            id="bankAddress"
                                            onChange={handleChange}
                                            readOnly={bankDataFetched}
                                        ></Form.Control>
                                    </FloatingLabel>
                                    <Form.Text muted>
                                        {t("Please, enter the address from the bank to which the target account belongs")}
                                    </Form.Text>
                                </Col>
                                {/*-------------------------------------Zip code-----------------------------------------------*/}
                                <Col xs="12" sm="12" md="12" lg="6" xl="6" className="pb-2">
                                    <FloatingLabel label={t("Zip Code")}>
                                        <Form.Control
                                            value={data.bankZipCode}
                                            placeholder=""
                                            autocomplete="off"
                                            required={transactionType === "2" ? true : false}
                                            type="text"
                                            id="bankZipCode"
                                            onChange={handleChange}
                                            readOnly={bankDataFetched}
                                        >
                                        </Form.Control>
                                    </FloatingLabel>
                                    <Form.Text muted>
                                        {t("Please, enter the zip code from the bank to which the target account belongs")}
                                    </Form.Text>
                                </Col>
                            </Row>
                        </Row>
                    </Container>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default GeographicBankInfo;
