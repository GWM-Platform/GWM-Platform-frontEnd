import React, { useRef, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, FloatingLabel, Spinner, Popover, InputGroup, Overlay } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'

const CreateFunds = ({ data, CreateRequest, handleChange, Action, setAction, validated, handleSubmit, AssetTypes, ImageUrl, setImageUrl, checkImage }) => {
    const { t } = useTranslation();

    const [show, setShow] = useState(false);
    const [target, setTarget] = useState(null);
    const ref = useRef(null);

    const handleClick = (event) => {
        setShow(!show);
        setTarget(event.target);
    };

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

                <FloatingLabel className="mb-3" label={t("Asset Types")}>
                    <Form.Select required id="typeId" onChange={handleChange} value={data.typeId}>
                        <option disabled value="">{t("-- select an option --")}</option>
                        {AssetTypes.map((Asset, key) => {
                            return <option key={key} value={Asset.id}>{Asset.name}</option>
                        })}
                    </Form.Select>
                </FloatingLabel>

                <FloatingLabel
                    label={t("Shares")}
                    className="mb-3"
                >
                    <Form.Control required onChange={handleChange} id="shares" value={data.shares} min="0.01" step="0.01" type="number" placeholder={t("Shares")} />
                    <Form.Control.Feedback type="invalid">
                        {t("The shares must be more than 0")}
                    </Form.Control.Feedback>
                </FloatingLabel>

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

                <InputGroup className="mb-3">
                    <FloatingLabel className="flex-grow-1"
                        label={t("Image url to use as fund logo")}
                    >
                        <Form.Control
                            onBlur={() => { if (data.imageUrl !== "") checkImage(data.imageUrl) }}
                            placeholder={t("Image url to use as fund logo")} value={data.imageUrl} type="url" id="imageUrl" required
                            className={`${ImageUrl.fetched || validated ? ImageUrl.valid ? "hardcoded-valid" : "hardcoded-invalid" : "hardcoded-novalidate"}`}
                            onChange={(e) => {
                                setShow(false);
                                handleChange(e);
                                setImageUrl(prevState => ({ ...prevState, ...{ fetching: false, fetched: false, valid: false } }))
                            }}
                        />
                    </FloatingLabel>
                    <Button onClick={handleClick} variant="danger" disabled={ImageUrl.fetching || !ImageUrl.fetched || (ImageUrl.fetched && !ImageUrl.valid)}>
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

                <Form.Control.Feedback type="valid">
                    {t("Looks good")}!
                </Form.Control.Feedback>


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