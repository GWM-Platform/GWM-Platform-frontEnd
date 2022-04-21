import React, { useRef, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, FloatingLabel, Spinner, Popover, InputGroup, Overlay, OverlayTrigger } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'

const CreateFunds = ({ data, setData, CreateRequest, handleChange, Action, setAction, validated, handleSubmit, AssetTypes, ImageUrl, setImageUrl, checkImage, Funds }) => {
    const { t } = useTranslation();

    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);

    const [active, setActive] = useState(0)
    const [onFocus, setOnFocus] = useState(0)

    const ref = useRef(null);
    //For scrolling
    const popover = useRef(null);
    const isNull = () => !popover.current

    const handleClick = (event) => {
        setShow(!show);
        setTarget(event.target);
    };

    const handleBlur = () => {
        setActive("")
        setOnFocus(0)
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

    const imageOptions = () => [`${process.env.PUBLIC_URL}/images/FundsLogos/default.svg`, ...new Set(Funds.map(Fund => Fund.imageUrl ? Fund.imageUrl : null))].filter(e => e)

    return (
        <div className="editForm">
            <div className="header">
                <h1 className="title">
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

                <FloatingLabel
                    label={t("Shares")}
                    className="mb-3"
                >
                    <Form.Control required onChange={handleChange} id="shares" value={data.shares} min="0.01" step="0.01" type="number" placeholder={t("Shares")} />
                    <Form.Control.Feedback type="invalid">
                        {t("The shares must be more than 0")}
                    </Form.Control.Feedback>
                </FloatingLabel>

                {/*------------------------------------------------------------------------------------------------------------------------------------------ */}

                <FloatingLabel
                    label={t("Initial Share Price")}
                    className="mb-3"
                >
                    <Form.Control
                        required onChange={handleChange} id="initialSharePrice"
                        value={data.initialSharePrice} min="0" step="0.01" type="number"
                        placeholder={t("Initial Share Price")}
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
                                    if (data.imageUrl !== "") checkImage(data.imageUrl)
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
                        <Button onBlur={() => setShow(false)} onClick={handleClick} variant="danger" disabled={ImageUrl.fetching || !ImageUrl.fetched || (ImageUrl.fetched && !ImageUrl.valid)}>
                            {t("Preview")}
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
                                <Popover.Body>
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
                        pattern="https:\/\/docs\.google\.com\/spreadsheets\/d\/[a-zA-Z0-9_-]{1,}\/edit#gid=[0-9]{1,}"
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

                {/*------------------------------------------------------------------------------------------------------------------------------------------ */}

                <div className="d-flex justify-content-end">
                    <Button variant="danger" type="submit" className="mb-3">
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