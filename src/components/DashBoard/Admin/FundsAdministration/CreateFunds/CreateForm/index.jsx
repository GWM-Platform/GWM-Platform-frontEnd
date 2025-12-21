import React, { useEffect, useRef, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, FloatingLabel, Spinner, Popover, InputGroup, Overlay, OverlayTrigger } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft, faEye, faSearch, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import CurrencyInput from '@osdiab/react-currency-input-field';
import { unMaskNumber } from 'utils/unmask';

const CreateFunds = ({ data, setData, CreateRequest, handleChange, Action, setAction, validated, handleSubmit, AssetTypes, ImageUrl, setImageUrl, checkImage, Funds }) => {
    const { t } = useTranslation();

    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);

    const [active, setActive] = useState(0)
    const [onFocus, setOnFocus] = useState(-1)

    const ref = useRef(null);
    //For scrolling
    const popover = useRef(null);
    const isNull = () => !popover.current

    const handleClick = (event) => {
        if (ImageUrl.fetched) {
            setShow(!show);
            setTarget(event.target);
        }
    };

    const handleBlur = () => {
        setActive("")
        setOnFocus(-1)
    }

    const handleFocus = (e) => {
        setActive(e.target.id)
    }

    const handleOnkeyDown = (event) => {
        switch (event.key) {
            case 'Enter':
                event.preventDefault();
                if (event.target.id === "imageUrl" && imageOptions().length >= onFocus && onFocus >= 0) {
                    setData(prevState => ({ ...prevState, imageUrl: imageOptions()[onFocus] }))
                    const form = event.target.form;
                    const index = [...form].indexOf(event.target);
                    form.elements[index + 1].focus();
                }
                event.target.blur()
                break
            case 'ArrowUp':
                event.preventDefault();
                if (event.target.id === "imageUrl" && onFocus > 0) {
                    if (!isNull()) {
                        popover.current.scrollTo({
                            top: (onFocus - 1) * 38,
                            left: 0,
                            behavior: 'smooth'
                        })
                    }
                    setData(prevState => ({ ...prevState, imageUrl: imageOptions()[onFocus - 1] }))
                    setOnFocus(onFocus - 1)
                }
                break;
            case 'ArrowDown':
                event.preventDefault();
                if (event.target.id === "imageUrl" && imageOptions().length > onFocus + 1) {
                    if (!isNull()) {
                        popover.current.scrollTo({
                            top: (onFocus + 1) * 38,
                            left: 0,
                            behavior: 'smooth'
                        })
                    }
                    setData(prevState => ({ ...prevState, imageUrl: imageOptions()[onFocus + 1] }))
                    setOnFocus(onFocus + 1)
                }
                break;
            default:
        }
    }

    const imageOptions = () => [...new Set([`${process.env.PUBLIC_URL}/images/FundsLogos/default.svg`, ...Funds.map(Fund => Fund.imageUrl)])].filter(e => e)

    const [inputValid, setInputValid] = useState(false)
    const [inputSharesValid, setInputSharesValid] = useState(false)

    const decimalSeparator = process.env.REACT_APP_DECIMALSEPARATOR ?? '.'
    const groupSeparator = process.env.REACT_APP_GROUPSEPARATOR ?? ','

    const inputRef = useRef()
    const inputSharesRef = useRef()

    const handleAmountChange = (value, name) => {
        const decimalSeparator = process.env.REACT_APP_DECIMALSEPARATOR ?? '.'

        let fixedValue = value || ""
        if (value) {
            let lastCharacter = value.slice(-1)
            if (lastCharacter === decimalSeparator) {
                fixedValue = value.slice(0, -1)
            }
        }
        const unMaskedValue = unMaskNumber({ value: fixedValue || "" })
        handleChange({
            target:
                { id: name ? name : 'amount', value: unMaskedValue }
        })
    }

    useEffect(() => {
        setInputValid(inputRef?.current?.checkValidity())
    }, [inputRef, data.initialSharePrice])

    useEffect(() => {
        setInputSharesValid(inputSharesRef?.current?.checkValidity())
    }, [inputRef, data.shares])

    return (
        <div className="editForm">
            <div className="header">
                <h1 className="title fw-normal">
                    {t("Fund Create form")}
                </h1>
                <FontAwesomeIcon className="button icon" onClick={() => { setAction({ ...Action, ...{ action: -1, fund: -1 } }) }} icon={faChevronCircleLeft} />
            </div>
            <Form noValidate ref={ref} validated={validated} onSubmit={handleSubmit}>

                <FloatingLabel
                    label={t("Name")}
                    className="mb-3"
                >
                    <Form.Control required onChange={handleChange} id="name" value={data.name} type="text" placeholder={t("Name")} />
                    <Form.Control.Feedback type="invalid">
                        {t("You must provide a name for the fund")}
                    </Form.Control.Feedback>
                </FloatingLabel>

                {/*------------------------------------------------------------------------------------------------------------------------------------------ */}

                <FloatingLabel className="mb-3" label={t("Asset Types")}>
                    <Form.Select required id="typeId" onChange={handleChange} value={data.typeId}>
                        <option disabled value="">{t("-- select an option --")}</option>
                        {AssetTypes.map((Asset, key) => {
                            return <option key={key} value={Asset.id}>{Asset.name}</option>
                        })}
                    </Form.Select>
                </FloatingLabel>

                {/*------------------------------------------------------------------------------------------------------------------------------------------ */}

                {/*Shown input formatted*/}
                <FloatingLabel
                    label={t("Shares")}
                >
                    <CurrencyInput
                        allowNegativeValue={false}
                        name="shares"
                        defaultValue={data.shares}
                        decimalsLimit={2}
                        decimalSeparator={decimalSeparator}
                        groupSeparator={groupSeparator}
                        onValueChange={(value, name) => handleAmountChange(value, name)}
                        placeholder={t("Shares")}
                        className={`form-control ${validated ? inputSharesValid ? 'hardcoded-valid' : 'hardcoded-invalid' : ""} `}
                    />
                </FloatingLabel>
                <FloatingLabel
                    label={t("Shares")}
                    className="mb-3 hideFormControl"
                >
                    <Form.Control ref={inputSharesRef} required onChange={handleChange} id="shares" value={data.shares} min="0.01" step="0.01" type="number" placeholder={t("Shares")} />
                    <Form.Control.Feedback type="invalid">
                        {t("The shares must be more than 0")}
                    </Form.Control.Feedback>
                </FloatingLabel>

                {/*------------------------------------------------------------------------------------------------------------------------------------------ */}

                {/*Shown input formatted*/}
                <FloatingLabel
                    label={t("Initial share price")}
                >
                    <CurrencyInput
                        allowNegativeValue={false}
                        name="initialSharePrice"
                        defaultValue={data.initialSharePrice}
                        decimalsLimit={2}
                        decimalSeparator={decimalSeparator}
                        groupSeparator={groupSeparator}
                        onValueChange={(value, name) => handleAmountChange(value, name)}
                        placeholder={t("Initial share price")}
                        className={`form-control ${validated ? inputValid ? 'hardcoded-valid' : 'hardcoded-invalid' : ""} `}
                    />
                </FloatingLabel>
                <FloatingLabel
                    label={t("Initial share price")}
                    className="mb-3 hideFormControl"
                >
                    <Form.Control
                        ref={inputRef}
                        required onChange={handleChange} id="initialSharePrice"
                        value={data.initialSharePrice} min="0" step="0.01" type="number"
                        placeholder={t("Initial share price")}
                    />
                </FloatingLabel>

                {/*------------------------------------------------------------------------------------------------------------------------------------------ */}

                <OverlayTrigger rootClose trigger='click'
                    show={imageOptions().length > 0 && active === "imageUrl"}
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
                        <Popover id="fundLogos" className="suggestionsPopover" onMouseOut={() => setOnFocus(-1)} >
                            <>
                                <div ref={popover} id="optionsContainer">
                                    {imageOptions().map((image, key) => {
                                        ; return (
                                            <Popover.Header as="h3" key={key} onMouseOver={() => setOnFocus(key)}
                                                className={`m-0 fundLogos ${onFocus === key ? "focus" : ""}`}
                                                onClick={() => { checkImage(image); setData(prevState => ({ ...prevState, imageUrl: image })) }}
                                            >
                                                <img height="20" src={image} alt="" />
                                            </Popover.Header>
                                        )
                                    })}
                                </div>

                            </>
                        </Popover>
                    }>

                    <InputGroup className="mb-3">
                        <FloatingLabel className="flex-grow-1"
                            label={t("Image url to use as fund logo")}
                        >
                            <Form.Control
                                onKeyDown={(e) => handleOnkeyDown(e)} onFocus={(e) => handleFocus(e)}
                                onBlur={() => {
                                    if (data.imageUrl !== "" && !ImageUrl.fetched) checkImage(data.imageUrl)
                                    handleBlur()
                                }}
                                placeholder={t("Image url to use as fund logo")} value={data.imageUrl} type="text" id="imageUrl" required
                                className={`${ImageUrl.fetched || validated ? ImageUrl.valid ? "hardcoded-valid" : "hardcoded-invalid" : "hardcoded-novalidate"}`}
                                onChange={(e) => {
                                    setShow(false);
                                    handleChange(e);
                                    setImageUrl(prevState => ({ ...prevState, ...{ fetching: false, fetched: false, valid: false } }))
                                }}
                            />
                        </FloatingLabel>
                        <Button className="p-relative" onBlur={() => setShow(false)} onClick={handleClick} variant="danger" disabled={ImageUrl.fetching || (ImageUrl.fetched && !ImageUrl.valid)}>
                            <FontAwesomeIcon className={`inputSearchLogo ${!ImageUrl.fetched ? "active" : "hidden"}`} icon={faSearch} />
                            <FontAwesomeIcon className={`inputSearchLogo ${ImageUrl.fetched ? "active" : "hidden"}`} icon={ImageUrl.valid ? faEye : faEyeSlash} />
                            <FontAwesomeIcon className={`inputSearchLogo placeholder`} icon={faEye} />
                        </Button>

                        <Overlay
                            show={show}
                            target={target}
                            placement="left"
                            container={ref}
                            containerPadding={20}
                        >
                            <Popover id="popover-contained">
                                <Popover.Header className="mt-0" as="h3">{t("Logo Preview")}</Popover.Header>
                                <Popover.Body className="d-flex justify-content-center">
                                    <div className="fundLogo">
                                        <div className="border">
                                            <img className="logo" alt="" src={data.imageUrl} />
                                        </div>
                                    </div>
                                </Popover.Body>
                            </Popover>
                        </Overlay>
                    </InputGroup >
                </OverlayTrigger>

                {/*------------------------------------------------------------------------------------------------------------------------------------------ */}

                <FloatingLabel
                    label={t("Google SpreadSheet url (from which the id will be extracted)")}
                    className="mb-3"
                >
                    <Form.Control
                        pattern="https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9_-]{1,}\/.*"
                        required onChange={handleChange} id="spreadsheetId"
                        value={data.spreadsheetId} type="text"
                        placeholder={t("Google SpreadSheet Id")}
                    />
                    <Form.Control.Feedback type="valid">
                        {t("Looks good")}!
                    </Form.Control.Feedback>
                <Form.Control.Feedback type="invalid">
                    {t("It seems that the url entered is not valid, please check if I copied it correctly")}
                </Form.Control.Feedback>
            </FloatingLabel>

                <Form.Check
                    checked={data.disabledBuy}
                    label={t("Fund disabled for buy operations")}
                    onChange={handleChange}
                    id="disabledBuy"
                    className="mb-2"
                />

                <Form.Check
                    checked={data.disabledSell}
                    label={t("Fund disabled for sell operations")}
                    onChange={handleChange}
                    id="disabledSell"
                    className="mb-3"
                />

                <Form.Check
                    checked={data.disabled}
                    label={t("Fund disabled for operations")}
                    onChange={handleChange}
                    id="disabled"
                />

                {/*------------------------------------------------------------------------------------------------------------------------------------------ */}

                <div className="d-flex justify-content-end">
                    <Button variant="danger" type="submit" className="mb-3" disabled={CreateRequest.fetching}>
                        <Spinner animation="border" variant="light"
                            className={`${CreateRequest.fetching ? "d-inline-block" : "d-none"} littleSpinner me-1`} />
                        {t("Submit")}
                    </Button>
                </div>

            </Form>
        </div>

    )
}

export default CreateFunds
