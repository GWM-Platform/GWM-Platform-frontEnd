import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, FloatingLabel, Spinner } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'
//import FundAssets from './FundAssets'

const EditFunds = ({ data, EditRequest, handleChange, Funds, Action, setAction, validated, handleSubmit, AssetTypes }) => {
    const { t } = useTranslation();
    return (
        <div className="editForm">
            <div className="header">
                <h1 className="title">
                    {t("Fund edit form for")}{" \""}{Funds[Action.fund].name}{"\""}
                </h1>
                <FontAwesomeIcon className="button icon" onClick={() => { setAction({ ...Action, ...{ action: -1, fund: -1 } }) }} icon={faChevronCircleLeft} />
            </div>
            <Form noValidate validated={validated} onSubmit={handleSubmit}>

                {/*------------------------------------------------------------------------------------------------------------------------------------------ */}

                <FloatingLabel label={t("Name")} className="mb-3">
                    <Form.Control required onChange={handleChange} id="name" value={data.name} type="text" placeholder={t("Name")} />
                    <Form.Control.Feedback type="invalid">
                        {t("You must provide a name for the fund")}
                    </Form.Control.Feedback>
                </FloatingLabel>

                {/*------------------------------------------------------------------------------------------------------------------------------------------ */}

                <FloatingLabel
                        label={t("Google SpreadSheet Id")}
                        className="mb-3"
                    >
                        <Form.Control required onChange={handleChange} id="spreadsheetId" value={data.spreadsheetId} type="number" placeholder={t("Google SpreadSheet Id")} />
                        <Form.Control.Feedback type="valid">
                            {t("Looks good")}!
                        </Form.Control.Feedback>
                    </FloatingLabel>

                {/*------------------------------------------------------------------------------------------------------------------------------------------ */}

                <FloatingLabel className="mb-3" label={t("Asset Types")}>
                    <Form.Select readonly disabled required id="typeId" onChange={handleChange} value={data.typeId}>
                        {AssetTypes.map((Asset, key) => {
                            return <option key={key} value={Asset.id}>{Asset.name}</option>
                        })}
                    </Form.Select>
                </FloatingLabel>

                {/*------------------------------------------------------------------------------------------------------------------------------------------ */}

                <FloatingLabel
                    label={t("FeeParts")}
                    className="mb-3"
                >
                    <Form.Control readonly disabled onChange={handleChange} id="shares" value={data.shares} min="0.01" step="0.01" type="number" placeholder={t("FeeParts")} />
                    <Form.Control.Feedback type="invalid">
                        {t("The shares must be more than 0")}
                    </Form.Control.Feedback>
                </FloatingLabel>

                <div className="d-flex justify-content-end">
                    <Button variant="danger" type="submit" className="mb-3">
                        <Spinner animation="border" variant="light"
                            className={`${EditRequest.fetching ? "d-inline-block" : "d-none"} littleSpinner ms-1`} />
                        {t("Submit")}
                    </Button>
                </div>
            </Form>
        </div>

    )
}

export default EditFunds