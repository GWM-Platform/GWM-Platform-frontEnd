import MoreButton from "components/DashBoard/GeneralUse/MoreButton";
import React, { useState } from "react";
import { Badge, Button, Col, Dropdown, Form, Modal, Spinner } from "react-bootstrap";
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
import { faChevronDown, faChevronUp, faDownload, faPlus } from "@fortawesome/free-solid-svg-icons";

const DocumentItem = ({ document, getDocuments, uniqueTagsOptions }) => {
    const { t } = useTranslation()
    const { toLogin, DashboardToastDispatch, ClientSelected } = useContext(DashBoardContext)

    const [TagsCollapsed, setTagsCollapsed] = useState(true)
    const expandTags = () => { setTagsCollapsed(false) }
    const collapseTags = () => { setTagsCollapsed(true) }

    const [show, setShow] = useState(false);

    const handleClose = () => {
        if (!Request.fetching) {
            setShow(false);
        }
    }
    const handleShow = () => setShow(true);

    const [selectedOptions, setSelectedOptions] = useState([...document?.tags?.map(tag => ({ value: tag, label: tag })) || []])

    const handleChange = (selectedOption) => {
        setSelectedOptions([...selectedOption]);
    };

    const [Request, setRequest] = useState({ fetching: false, fetched: false, valid: false })

    const addTagsToDocument = () => {
        setRequest((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.post(`/documents/${ClientSelected.id}/tags/`, { docId: document.id, tags: selectedOptions.map(selectedOption => selectedOption.value) },
        ).then(function () {
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

    const tagsAmount = document?.tags?.length
    const hasTags = !!(document?.tags?.length > 0)
    const hasMultipleTags = !!(document?.tags?.length > 1)


    return (
        <Col xs="12" md="6" lg="4">
            <div className="p-2 document" >
                <div className="d-flex Actions justify-content-between mb-3">

                    <div className="mb-0 pe-1 pe-md-2" >
                        <div className="d-flex align-items-center">
                            <a className="title d-inline" target="_blank" rel="noreferrer nofollow" href={document.link}>{document.name}</a>
                        </div>
                        <h2 className="identifier d-flex align-items-center">
                            {t("Document")}&nbsp;#{document.id}
                        </h2>
                    </div>

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
                                    variant="secondary"
                                    className="d-flex justify-content-end"
                                    disabled={Request.fetching}
                                >
                                    <Dropdown.Toggle title={t(`Document options`)} as={MoreButton} id="dropdown-custom-components" />
                                    <Dropdown.Menu >
                                        <Dropdown.Item onClick={handleShow}>
                                            {t('Edit tags')}
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item target="_blank" rel="noreferrer nofollow" href={document.link}>
                                            {t('Open in a new tab')}
                                        </Dropdown.Item>
                                        <Dropdown.Item disabled>
                                            {t('Download')}
                                        </Dropdown.Item>
                                    </Dropdown.Menu >
                                </Dropdown>
                        }
                    </div>

                </div>

                <div>
                    <div className={`d-flex w-100 overflow-hidden align-items-end`}>

                        {!!(hasTags) &&
                            <div className={`d-flex overflow-hidden ${TagsCollapsed ? "" : "flex-wrap"} me-1`}
                                style={{
                                    rowGap: "4px",
                                    columnGap: "4px"
                                }}
                            >
                                {
                                    TagsCollapsed ?
                                        <>
                                            <Badge className="tag overview" bg="secondary">
                                                {document?.tags[0]}
                                            </Badge>
                                            {
                                                hasMultipleTags &&
                                                <>
                                                    <Badge className="tag" bg="secondary">
                                                        +{tagsAmount - 1}
                                                    </Badge>
                                                    <Button
                                                        onClick={() => expandTags()}
                                                        type="button" as={Badge}
                                                        className="tag text-nowrap" bg="primary"
                                                        title={t("Show more tags")}>
                                                        <FontAwesomeIcon icon={faChevronDown} />
                                                    </Button>
                                                </>
                                            }
                                        </>
                                        :
                                        <>
                                            {document?.tags.map(tag =>
                                                <Fragment key={`document-${document.id}-tag-${tag}`}>
                                                    <Badge className="tag" bg="secondary">
                                                        {tag}
                                                    </Badge>
                                                </Fragment>
                                            )}
                                            <Button onClick={handleShow} as={Badge} bg="primary" title={t("Edit tags")} type="button" className="noStyle d-inline-block">
                                                <FontAwesomeIcon icon={faEdit} />
                                            </Button>

                                            <Button as={Badge} bg="primary" title={t("Collapse tags")} type="button" className="noStyle d-inline-block" onClick={() => collapseTags()}>
                                                <FontAwesomeIcon icon={faChevronUp} />
                                            </Button>
                                        </>
                                }
                            </div>
                        }


                        {
                            !hasMultipleTags &&

                            <Button onClick={handleShow} as={Badge} bg="primary" title={t("Edit tags")} type="button" className="noStyle d-inline-block me-1" >
                                {!hasTags && <>{t("Add tags")} </>}<FontAwesomeIcon icon={hasTags ? faEdit : faPlus} />
                            </Button>
                        }
                        {
                            TagsCollapsed &&
                            <Button as={Badge} bg="primary" title={t("Download")} type="button" className="noStyle d-inline-block ms-auto"><FontAwesomeIcon icon={faDownload} /></Button>
                        }
                    </div>
                </div>
            </div>
            <Modal className="editTags" show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>{t("Edit tags of \"{{documentName}}\"", { documentName: document.name })}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Label>{t("Tags")}</Form.Label>
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
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        size="sm" type="button"
                        variant="secondary" onClick={handleClose}>
                        {t("Cancel")}
                    </Button>
                    <Button size="sm" disabled={Request.fetching} onClick={() => addTagsToDocument()}>
                        <Spinner
                            as="span"
                            type="button"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            style={{ display: Request.fetching ? "inline-block" : "none" }}
                        />{' '}
                        {t("Confirm")}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Col>

    );
}

export default DocumentItem