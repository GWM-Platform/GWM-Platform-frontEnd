import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, FloatingLabel, Spinner } from 'react-bootstrap'
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft } from '@fortawesome/free-solid-svg-icons'

const CreateAssets = ({ data, CreateRequest,handleChange,Action,setAction,validated,handleSubmit,AssetTypes }) => {
    const { t } = useTranslation();
    return (
            <div className="editForm">
                <div className="header">
                    <h1 className="title">
                        {t("Asset Create form")}
                    </h1>
                    <FontAwesomeIcon className="button icon" onClick={() => {setAction({...Action,...{action:-1,Asset:-1}})}} icon={faChevronCircleLeft} />
                </div>
                <Form noValidate validated={validated} onSubmit={handleSubmit}>

                    <FloatingLabel
                        label={t("Name")}
                        className="mb-3"
                    >
                        <Form.Control required onChange={handleChange} id="name" value={data.name} type="text" placeholder={t("Name")} />
                        <Form.Control.Feedback type="invalid">
                            {t("You must provide a name for the Asset")}
                        </Form.Control.Feedback>
                    </FloatingLabel>

                    <FloatingLabel className="mb-3" label={t("Asset Types")}>
                        <Form.Select required id="typeId" onChange={handleChange} value={data.typeId}>
                            {AssetTypes.map((Asset, key) => {
                                return <option key={key} value={Asset.id}>{Asset.name}</option>
                            })}
                        </Form.Select>
                    </FloatingLabel>

                    <FloatingLabel
                        label={t("Symbol")}
                        className="mb-3"
                    >
                        <Form.Control required onChange={handleChange} id="symbol" value={data.symbol} type="text" placeholder={t("Symbol")} />
                    </FloatingLabel>

                    <FloatingLabel
                        label={t("Value")}
                        className="mb-3"
                    >
                        <Form.Control required onChange={handleChange} id="value" value={data.value} min="0.01" step="0.01" type="number" placeholder={t("Value")} />
                        <Form.Control.Feedback type="invalid">
                            {t("The value must be greater than 0")}
                        </Form.Control.Feedback>
                    </FloatingLabel>

                    <div className="d-flex justify-content-end">
                        <Button variant="danger" type="submit" className="mb-3">
                            <Spinner animation="border" variant="light"
                                className={`${CreateRequest.fetching ? "d-inline-block" : "d-none"} littleSpinner ms-1`} />
                            {t("Submit")}
                        </Button>
                    </div>
                </Form>
            </div>
        
    )
}

export default CreateAssets