import MoreButton from "components/DashBoard/GeneralUse/MoreButton";
import React, { useState } from "react";
import { Badge, Button, Dropdown, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import './index.scss'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-regular-svg-icons";
import CreatableSelect from 'react-select/creatable';
import axios from "axios";
import { useContext } from "react";
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { DashBoardContext } from "context/DashBoardContext";
import { Fragment } from "react";

const DocumentItem = ({ document, getDocuments, uniqueTagsOptions }) => {
    const { t } = useTranslation()
    const { toLogin, DashboardToastDispatch, ClientSelected } = useContext(DashBoardContext)

    const [editTags, setEditTags] = useState(false)

    const showEditTags = () => setEditTags(true)
    const hideEditTags = () => setEditTags(false)

    const [selectedOptions, setSelectedOptions] = useState([...document?.tags?.map(tag => ({ value: tag, label: tag })) || []])

    const handleChange = (selectedOption) => {
        setSelectedOptions([...selectedOption]);
    };

    const [Request, setRequest] = useState({ fetching: false, fetched: false, valid: false })

    const addTagsToDocument = () => {
        setRequest((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.post(`/documents/${ClientSelected.id}/tags/`, { docId: document.id, tags: selectedOptions.map(selectedOption => selectedOption.value) },
        ).then(function (response) {
            setRequest((prevState) => (
                {
                    ...prevState,
                    fetching: false,
                    fetched: true,
                    valid: true,
                }))
            DashboardToastDispatch({ type: "create", toastContent: { Icon: faCheckCircle, Title: "Document's tags edited successfully" } })
            getDocuments()
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setRequest((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
                DashboardToastDispatch({ type: "create", toastContent: { Icon: faTimesCircle, Title: "There was an error while editing the document's tags" } })
            }
        });
    }

    return (
        <div className="py-2 document" style={{ borderBottom: " 1px solid lightgray" }}>
            <div className="d-flex Actions align-items-center">
                <div className="mb-0 pe-1 pe-md-2" >
                    <h1 className="title d-flex align-items-center">{t("Document")}&nbsp;#{document.id}:&nbsp;
                        <a target="_blank" rel="noreferrer nofollow" href={document.link}>{document.name}</a>
                    </h1>
                </div>
                {
                    false &&
                    <div className="ms-auto">
                        {
                            Request.fetching ?
                                <Spinner
                                    as="span"
                                    animation="border"
                                    size="sm"
                                    role="status"
                                    aria-hidden="true"
                                />
                                :
                                <Dropdown
                                    id={`dropdown-button-drop-start`}
                                    drop="start"
                                    variant="secondary"
                                    title={t(`Document options`)}
                                    className="d-flex justify-content-end"
                                    disabled={Request.fetching}
                                >
                                    <Dropdown.Toggle as={MoreButton} id="dropdown-custom-components" />
                                    <Dropdown.Menu >
                                        <Dropdown.Item disabled>
                                            {t('Delete')}
                                        </Dropdown.Item>
                                        <Dropdown.Item disabled>
                                            {t('Edit')}
                                        </Dropdown.Item>
                                    </Dropdown.Menu >
                                </Dropdown>
                        }
                    </div>
                }
            </div>

            <div>
                <h2 className="tags mb-2">
                    {t("Tags")}:
                </h2>
                {
                    editTags ?
                        <>
                            <CreatableSelect
                                value={selectedOptions}
                                onChange={handleChange}
                                className="w-100 mb-2"
                                isMulti isClearable noOptionsMessage={() => t("No options")} placeholder={t("Select or create tags...")}
                                formatCreateLabel={(inputValue) => t("Create tag \"{{tagName}}\"", { tagName: inputValue })}
                                options={[...uniqueTagsOptions]}
                                classNames={{
                                    multiValue: () => ("multiValue"),
                                    multiValueLabel: () => ("multiValueLabel"),
                                    multiValueRemove: () => ("multiValueRemove"),
                                }}
                            />
                            <div className="d-flex justify-content-end">
                                <Button disabled={Request.fetching} onClick={() => hideEditTags()} className="me-1">
                                    {t("Cancel")}
                                </Button>
                                <Button disabled={Request.fetching} onClick={() => addTagsToDocument()}>
                                    <Spinner
                                        as="span"
                                        animation="border"
                                        size="sm"
                                        role="status"
                                        aria-hidden="true"
                                        style={{ display: Request.fetching ? "inline-block" : "none" }}
                                    />{' '}
                                    {t("Confirm")}
                                </Button>
                            </div>
                        </>
                        :
                        <>

                            {
                                document?.tags &&
                                <>
                                    {document?.tags.map(tag =>
                                        <Fragment key={`document-${document.id}-tag-${tag}`}>
                                            <Badge bg="primary">
                                                {tag}
                                            </Badge>
                                            &nbsp;
                                        </Fragment>
                                    )}
                                </>
                            }
                            <Button as={Badge} bg="success" type="button" className="noStyle d-inline-block" onClick={() => showEditTags()}>{t("Edit tags")} <FontAwesomeIcon icon={faEdit} /></Button>
                        </>
                }
            </div>
        </div>
    );
}

export default DocumentItem