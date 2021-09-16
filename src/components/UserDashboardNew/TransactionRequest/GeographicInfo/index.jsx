import React, { useContext } from 'react'
import { useEffect } from 'react';
import { Col, Form, Row, InputGroup, Popover, OverlayTrigger, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { useState } from 'react';
import { useTranslation } from "react-i18next";
import { urlContext } from '../../../../context/urlContext';


function GeographicInfo({ data, setData }) {
    const {urlPrefix}=useContext(urlContext)
    const { t } = useTranslation();

    //Data fetched from the API
    const [countries, setCountries] = useState([])
    const [subDivisions, setSubDivisions] = useState([])
    const [cities, setCities] = useState([])

    const [citiesCopy, setCitiesCopy] = useState([])

    const [fetchingCities, setFetchingCities] = useState(false)
    const [fetchingStates, setFetchingStates] = useState(false)

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
        setFetchingStates(true)
        setCountryISO(countryCode)
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
                    setSubDivisions([])
                } else {
                    setSubDivisions(response)
                }
                setFetchingStates(false)
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
        setCountryISO("")
        setSubDivISO("")
        aux.subDivision_Name = ""
        aux.city = ""
        setData(aux)

        setCities([])
        setSubDivisions([])
        setSubDivSuggestions([])

        setCountryISO("")

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
        setSubDivISO("")
        setCities([])
        setCitiesCopy([])
        let aux = data
        aux[e.target.id] = e.target.value
        aux.city = ""
        setData(aux)
        const regex = new RegExp(`^${e.target.value}`, 'i')
        const suggestions = subDivisions.sort().filter(v => regex.test(v.name))
        setSubDivSuggestions(suggestions)
    }

    const changeStateSelector = (e) => {
        let aux = data
        aux.state = subDivisions[e.target.value].name
        setSubDivISO(subDivisions[e.target.value].iso2)
        getCities(subDivisions[e.target.value].iso2)
        setData(aux)
    }

    const changeCity = (e) => {
        const regex = new RegExp(`${e.target.value}`, 'i')
        const suggestions = citiesCopy.sort().filter(v => regex.test(v.name))
        setCities(suggestions)
        let aux = data
        aux[e.target.id] = e.target.value
        setData(aux)
    }

    const changeAddress = (e) => {
        let aux = data
        aux[e.target.id] = e.target.value
        setData(aux)
    }

    useEffect(() => {
        getCountries()
        return () => {
        }
    }, [])

    const handleBlur = () => {
        setTimeout(() => {
            setActive("")
        }, 250);
    }

    const handleFocus = (e) => {
        setActive(e.target.id)
    }

    return (
        <Col className={data.transactionType === "1" ? "d-none" : "d-block"}>
            {/*-------------------------------------Country selector-----------------------------------------------*/}
            <Form.Group as={Row} className="mt-2" autocomplete="off">
                <Form.Label column sm={3} xl={2}>{t("Country")}</Form.Label>
                <Col sm={9} xl={10} className="mb-2">
                    <OverlayTrigger rootClose trigger='click' show={suggestions.length > 0 && active === "country"} placement="bottom-start" overlay={
                        <Popover id="popover-geoInfo" className="suggestionsPopover" >
                            {suggestions.map((u, i) => {
                                ; return (
                                    <Popover.Header as="h3" className="mt-0" onClick={() => {
                                        getStates(u.code)
                                        setSuggestions([])
                                        let aux = data
                                        aux.country = u.name
                                        setData(aux)
                                    }}>
                                        {u.name}
                                    </Popover.Header>
                                )
                            })}
                        </Popover>
                    }>
                        <InputGroup className="mb-0" autocomplete="off">
                            <Form.Control
                                onFocus={(e) => { handleFocus(e) }}
                                onBlur={() => { handleBlur() }}
                                pattern="[A-Za-z]{3,}"
                                autoComplete="off"
                                value={data.country}
                                required={data.transactionType === "2" ? true : false}
                                type="text"
                                id="country"
                                onChange={changeCountry} />
                            <InputGroup.Text>
                                <FontAwesomeIcon icon={faSearch} />
                            </InputGroup.Text>
                        </InputGroup>
                    </OverlayTrigger>
                    <Form.Text muted>
                        {t("Please, enter at least 3 characters to search and select the country from the owner of the target account")}
                    </Form.Text>
                </Col>
            </Form.Group>
            {/*-------------------------------------State selector-----------------------------------------------*/}
            <div>
                {countryISO === ("CA") || countryISO === ("US") ?
                    <Form.Group as={Row} className={`mt-2 mb-2 `} autocomplete="off">
                        <Form.Label column sm={3} xl={2}>{t("State")}</Form.Label>
                        <Col sm={9} xl={10}>
                            <Form.Select
                                disabled={subDivisions.length === 0 ? true : false}
                                onChange={changeStateSelector}>
                                <option disabled selected>Default select</option>
                                {
                                    subDivisions.map((u, i) => {
                                        ; return (
                                            <option value={i}>
                                                {u.name}
                                            </option>
                                        )
                                    })}
                            </Form.Select>
                            <Form.Text muted>
                                {t("Please, select the state from the owner of the target account")}
                            </Form.Text>
                        </Col>
                    </Form.Group>
                    :
                    <Form.Group as={Row} className={`mt-2 mb-2 `} autocomplete="off">
                        <Form.Label column sm={3} xl={2}>{t("State")}</Form.Label>
                        <Col sm={9} xl={10}>
                            <InputGroup className="mb-0" autocomplete="off">
                                <OverlayTrigger rootClose trigger='click' show={data.subDivision_Name !== "" && active === "subDivision_Name"} placement="bottom-start" overlay={
                                    <Popover id="popover-geoInfo" className="suggestionsPopover" >
                                        {subDivSuggestions.map((u, i) => {
                                            ; return (
                                                <Popover.Header as="h3" className="mt-0" onClick={() => {
                                                    setSubDivSuggestions([])
                                                    let aux = data
                                                    aux.subDivision_Name = u.name
                                                    setSubDivISO(u.iso2)
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
                                        autocomplete="off"
                                        value={data.subDivision_Name}
                                        required={data.transactionType === "1" ? false : true}
                                        type="text"
                                        id="subDivision_Name"
                                        onChange={changeState}
                                    />

                                </OverlayTrigger>
                                <InputGroup.Text
                                    className={fetchingStates ? "d-inline-block" : "d-none"}>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                </InputGroup.Text>
                            </InputGroup>
                            <Form.Text muted>
                                {t("Please, enter the state from the owner of the target account")}
                            </Form.Text>
                        </Col>
                    </Form.Group>
                }

                {/*-------------------------------------Cities selector-----------------------------------------------*/}
                <Form.Group as={Row} className={`mt-0 `} autocomplete="off">
                    <Form.Label column sm={3} xl={2}>{t("City")}</Form.Label>
                    <Col sm={9} xl={10} className="mb-2">
                        <InputGroup autocomplete="off">
                            <OverlayTrigger rootClose trigger='click' show={data.city !== "" && active === "city"} placement="bottom-start" overlay={
                                <Popover id="popover-geoInfo" className="suggestionsPopover" >
                                    {cities.map((u, i) => {
                                        ; return (
                                            <Popover.Header as="h3" className="mt-0"
                                                onClick={() => {
                                                    setCities([])
                                                    let aux = data
                                                    aux.city = u.name
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
                                    onChange={changeCity}
                                    autocomplete="off"
                                    value={data.city}
                                    required={data.transactionType === "2" ? true : false}
                                    id="city"
                                />
                            </OverlayTrigger>
                            <InputGroup.Text
                                    className={fetchingCities ? "d-inline-block" : "d-none"}>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                    />
                                </InputGroup.Text>
                        </InputGroup>
                        <Form.Text muted>
                            {t("Please, enter the city from the owner of the target account")}
                        </Form.Text>
                    </Col>
                </Form.Group>

                <Form.Group as={Row}>
                    <Form.Label column sm={3} xl={2}>{t("Address")}</Form.Label>
                    <Col sm={9} xl={10}>
                        <Form.Control value={data.address} placeholder="" autocomplete="off" required={data.transactionType === "1" ? false : true} type="text" id="address" onChange={changeAddress} ></Form.Control>
                        <Form.Text muted>
                            {t("Please, enter the address from the owner of the target account")}
                        </Form.Text>
                    </Col>
                </Form.Group>
            </div>
        </Col>
    );
}

export default GeographicInfo;
