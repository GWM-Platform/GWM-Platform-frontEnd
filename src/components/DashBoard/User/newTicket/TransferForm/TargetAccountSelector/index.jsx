import React, { useContext, useEffect, useRef, useState } from 'react'
import { DashBoardContext } from 'context/DashBoardContext';

import 'bootstrap/dist/css/bootstrap.min.css';

import { Row, Form, Accordion, Container, OverlayTrigger, Popover } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import axios from 'axios';
import { escapeRegex } from 'utils/escapeRegex';
import './index.scss'
import { customFetch } from 'utils/customFetch';

const TargetAccountSelector = ({ data, setData, TargetAccount, setTargetAccount, handleChange, validated, openAccordion, closeAccordion }) => {
    const { token, AccountSelected, toLogin } = useContext(DashBoardContext)
    const accountAlias = AccountSelected?.alias

    const { t } = useTranslation();

    const search = async () => {
        setTargetAccount(prevState => ({ ...prevState, ...{ fetching: true, fetched: false } }))

        var url = `${process.env.REACT_APP_APIURL}/accounts/byAlias?` + new URLSearchParams({
            alias: data.alias
        })
        const response = await customFetch(url, {
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

    const [Suggestions, setSuggestions] = useState({ status: "idle", content: [] })

    //suggestions controller 
    //Field on focus     
    const [active, setActive] = useState(0)
    //Suggestion on focus     
    const [onFocus, setOnFocus] = useState(-1)
    const [ShowPopover, setShowPopover] = useState(false)

    //popover ref (for scrolling suggestions)
    const popover = useRef(null);
    //function to check if the ref is null, used to avoid errors
    const isNull = () => !popover.current

    //options filtered
    const [opcionesFiltered, setOpcionesFiltered] = useState([])

    const filterAlias = (value) => {
        if (value.length >= 1) {
            const regex = new RegExp(escapeRegex(`${value}`), 'i')
            const suggestions = Suggestions.content.filter(opcion => testSuggestion(opcion.receiverAlias, regex))
            setOpcionesFiltered(suggestions)
        } else {
            setOpcionesFiltered(Suggestions.content)
        }
    }

    const selectAlias = (suggestion) => {
        setData(prevState => ({ ...prevState, alias: suggestion.receiverAlias }))
    }

    const handleOnkeyDown = (event) => {
        switch (event.key) {
            case 'Enter':
                event.preventDefault();
                if (event.target.id === "alias" && opcionesFiltered.length >= onFocus && onFocus >= 0) {
                    selectAlias(opcionesFiltered[onFocus])
                    const form = event.target.form;
                    const index = [...form].indexOf(event.target);
                    form.elements[index + 1].focus();
                }
                event.target.blur()
                break
            case 'ArrowUp':
                event.preventDefault();
                if (event.target.id === "alias" && onFocus > 0) {
                    if (!isNull()) {
                        popover.current.scrollTo({
                            top: (onFocus - 1) * 38,
                            left: 0,
                            behavior: 'smooth'
                        })
                    }
                    setOnFocus(onFocus - 1)
                }
                break;
            case 'ArrowDown':
                event.preventDefault();
                if (event.target.id === "alias" && opcionesFiltered.length > onFocus + 1) {
                    if (!isNull()) {
                        popover.current.scrollTo({
                            top: (onFocus + 1) * 38,
                            left: 0,
                            behavior: 'smooth'
                        })
                    }
                    setOnFocus(onFocus + 1)
                }
                break;
            default:
        }
    }

    const handleFocus = (e) => {
        setActive(e.target.id)
        filterAlias(e.target.value)
    }

    const handleBlur = () => {
        setActive("")
        setOnFocus(-1)
    }

    const testSuggestion = (option, regex) => regex.test(option)

    useEffect(() => {
        let timer = null;
        if (!(opcionesFiltered.length > 0 && active === "alias")) {
            timer = setTimeout(() => {
                setShowPopover(opcionesFiltered.length > 0 && active === "alias")
            }, 250);
        } else {
            setShowPopover(opcionesFiltered.length > 0 && active === "alias")
        }
        return () => clearTimeout(timer);
    }, [opcionesFiltered, active]);

    useEffect(() => {
        if (Suggestions.status === "succeeded") {
            setOpcionesFiltered(Suggestions.content)
        }
    }, [Suggestions]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        setSuggestions((prevState) => (
            {
                ...prevState,
                status: "loading",
            }))
        axios.get(`/accounts/${AccountSelected.id}/suggestions`, { signal: signal })
            .then(function (response) {
                setSuggestions((prevState) => (
                    {
                        ...prevState,
                        status: "succeeded",
                        content: response?.data?.filter(opcion => opcion.receiverAlias !== accountAlias) || []
                    }))
            }).catch((err) => {
                if (err.message !== "canceled") {
                    if (err.response.status === "401") toLogin()
                    else {
                        setSuggestions((prevState) => (
                            {
                                ...prevState,
                                status: "error",
                                content: []
                            }))

                    }
                }
            })
        return () => {
            controller.abort();
        };
        //eslint-disable-next-line
    }, [AccountSelected.id, accountAlias])

    useEffect(() => {
        let timer = null;
        if (data.alias !== "" && data.alias !== accountAlias) {
            timer = setTimeout(() => {
                search()
            }, 500);
        }
        return () => {
            clearTimeout(timer);
        }
        // eslint-disable-next-line
    }, [data.alias])

    return (
        <Accordion.Item eventKey="0">
            <Accordion.Header>
                <Container>
                    <Row className="d-flex justify-content-center">
                        <Form.Label className="pt-0 label d-flex align-items-center" column sm="auto">
                            <span>
                                <span className="d-inline-block numberContainer">
                                    <div className="d-flex justify-content-center align-items-center h-100 w-100">
                                        <span className="number">2</span>
                                    </div>
                                </span>
                                {t("To transfer to")}:
                            </span>
                        </Form.Label>
                    </Row>
                </Container>
            </Accordion.Header>
            <Accordion.Body>
                <OverlayTrigger rootClose trigger='click'
                    show={ShowPopover}
                    delay={{ show: 1000, hide: 1000 }}
                    popperConfig={{
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: [5, 0],
                                },
                            },
                        ],
                    }}

                    placement="bottom-start" overlay={
                        <Popover id="popoverAlias" className="suggestionsPopover" onMouseOut={() => setOnFocus(-1)} >
                            <>
                                <div ref={popover} className="optionsContainer" id="optionsContainer">
                                    {
                                        opcionesFiltered.map((option, key) =>
                                            <Popover.Header as="h3" key={`suggestionAlias-${key}`} onMouseOver={() => setOnFocus(key)}
                                                className={`m-0 option ${onFocus === key ? "focus" : ""}`}
                                                onClick={() => selectAlias(opcionesFiltered[key])}
                                            >
                                                {option.receiverAlias}
                                            </Popover.Header>
                                        )
                                    }
                                </div>
                            </>
                        </Popover>
                    }>
                    <Form.Control
                        onKeyDown={(e) => handleOnkeyDown(e)}
                        placeholder={t("Enter account alias")} value={data.alias} type="text" id="alias" required
                        className={`${TargetAccount.fetched || validated ? (TargetAccount.valid && !(data.alias === accountAlias)) ? "hardcoded-valid" : "hardcoded-invalid" : "hardcoded-novalidate"}`}
                        onChange={(e) => {
                            handleChange(e);
                            filterAlias(e.target.value)
                            setOnFocus(-1)
                            closeAccordion();
                            setTargetAccount(prevState => ({ ...prevState, ...{ fetching: false, fetched: false, valid: false } }))
                        }}
                        pattern={data.alias === accountAlias ? '()' : null}
                        onFocus={(e) => handleFocus(e)}
                        disabled={Suggestions.status === "loading" || Suggestions.status === "idle"}
                        onBlur={() => {
                            handleBlur()

                        }}
                    />
                </OverlayTrigger>

                <div className="mb-3">
                    {
                        <Form.Text className={!TargetAccount.valid ? TargetAccount.fetching ? "" : "text-red" : "text-green"}>
                            {
                                data.alias === accountAlias ?
                                    t("The target account cannot be your own account")
                                    :
                                    TargetAccount.fetched ?
                                        (TargetAccount.valid ?
                                            t("Looks good") + "!"
                                            :
                                            data.clientEnabled === false ?
                                                t("The client you are trying to transfer money to is not enabled")
                                                :
                                                t("The alias entered does not correspond to any GWMG account")
                                        )
                                        :
                                        TargetAccount.fetching && t("Verifying alias")
                            }

                        </Form.Text>
                    }
                </div>
            </Accordion.Body>
        </Accordion.Item >
    )
}
export default TargetAccountSelector