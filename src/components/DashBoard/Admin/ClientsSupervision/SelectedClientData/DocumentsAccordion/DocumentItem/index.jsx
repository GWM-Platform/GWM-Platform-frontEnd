import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { faChevronDown, faChevronUp, faDownload, faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import MoreButton from "components/DashBoard/GeneralUse/MoreButton";
import PDFModal from "components/DashBoard/GeneralUse/PDFModal";
import React, { useContext, useState } from "react";
import { Fragment } from "react";
import { Badge, Col, Dropdown, Spinner, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { DashBoardContext } from "context/DashBoardContext";
import { Link } from "react-router-dom";
import OtherFileTypesModal from "components/DashBoard/GeneralUse/OtherFileTypesModal";

const DocumentItem = ({ Document, getDocuments, client }) => {
    const { t } = useTranslation()
    const { DashboardToastDispatch, } = useContext(DashBoardContext)

    const [TagsCollapsed, setTagsCollapsed] = useState(true)
    const expandTags = () => { setTagsCollapsed(false) }
    const collapseTags = () => { setTagsCollapsed(true) }

    const tagsAmount = Document?.tags?.length
    const hasTags = !!(Document?.tags?.length > 0)
    const hasMultipleTags = !!(Document?.tags?.length > 1)

    const [File, setFile] = useState({
        fetching: false, fetched: false, valid: true,
        content: {}, type: "",
        validPreview: true, pdfPreview: true
    })
    const [Request, setRequest] = useState({ fetching: false })

    const [show, setShow] = useState(false)

    const handleShow = () => setShow(!show)

    const download = (file) => {
        const alink = document.createElement('a')
        alink.href = `data:application/octet-stream;base64,${file.file}`
        alink.download = `${file.name}`
        alink.click()
    }

    const downloadFile = (type = "") => {
        if (!File.fetched) {
            setFile((prevState) => ({ ...prevState, fetching: true, fetched: false, valid: true, type }))
            axios.get(`/documents/${Document.id}/file/`,
            ).then(function (response) {
                setFile((prevState) => (
                    {
                        ...prevState,
                        fetching: false,
                        fetched: true,
                        valid: true,
                        content: response.data,
                        validPreview: !!(response?.data?.mimeType),
                        pdfPreview: response?.data?.name?.split(".")?.[1] === "pdf",
                    }))
                if (type === "preview") {
                    if (!!(response?.data?.mimeType)) {
                        handleShow()
                    } else {
                        DashboardToastDispatch({ type: "create", toastContent: { Icon: faTimesCircle, Title: "Sorry, this document cannot be previewed, please try downloading it" } });
                    }
                } else {
                    download(response.data)
                }
            }).catch((err) => {
                if (err.message !== "canceled") {
                    setFile((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: false } }))
                    if (type === "preview") {
                        DashboardToastDispatch({ type: "create", toastContent: { Icon: faTimesCircle, Title: "Sorry, this document cannot be previewed" } });
                    } else {
                        DashboardToastDispatch({ type: "create", toastContent: { Icon: faTimesCircle, Title: "Sorry, this document cannot be downloaded" } });
                    }
                }
            });
        } else {
            if (File.valid) {

                setFile((prevState) => ({ ...prevState, fetching: true, type }))
                if (type === "preview") {
                    if (!!(File?.content?.mimeType)) {
                        handleShow()
                    } else {
                        DashboardToastDispatch({ type: "create", toastContent: { Icon: faTimesCircle, Title: "Sorry, this document cannot be previewed" } });
                    }
                } else {
                    download(File.content)
                }
                setFile((prevState) => ({ ...prevState, fetching: false }))
            }
        }
    }

    const deleteFile = () => {
        setRequest((prevState) => ({ ...prevState, fetching: true }))
        axios.delete(`/documents/${Document.id}/`,
        ).then(function () {

            DashboardToastDispatch({ type: "create", toastContent: { Icon: faCheckCircle, Title: "The document was deleted successfully" } });
            getDocuments()
        }).catch((err) => {
            DashboardToastDispatch({ type: "create", toastContent: { Icon: faTimesCircle, Title: "There was an error deleting the document, please try again later" } });
            if (err.message !== "canceled") {
                setFile((prevState) => (
                    {
                        ...prevState,
                        fetching: false
                    }))
            }
        });
    }

    return (
        <Col xs="12" md="6" lg="4">
            <div className="p-2 document" >
                <div className="d-flex Actions justify-content-between mb-3">
                    <div className="mb-0 pe-1 pe-md-2" >
                        <div className="d-flex align-items-center">
                            <a className="title d-inline" target="_blank" rel="noreferrer nofollow" href={Document.link}>{Document.name}</a>
                        </div>
                        <h2 className="identifier d-flex align-items-center">
                            {t("Document")}&nbsp;#{Document.id}
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
                                        <Dropdown.Item disabled={!File.valid || File.fetching || !File.validPreview} onClick={() => downloadFile("preview")}>
                                            {t('Preview')}
                                        </Dropdown.Item>
                                        <Dropdown.Item disabled={!File.valid || File.fetching} onClick={downloadFile}>
                                            {t('Download')}
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item >
                                            <Link to={`/DashBoard/clientsSupervision/${client.id}/document?i=${Document.id}`}
                                                style={{ textDecoration: "none", color: "var(--bs-dropdown-link-color)" }}>
                                                {t('Edit')}
                                            </Link>
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={deleteFile}>
                                            {t('Delete')}
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
                                                {Document?.tags[0]}
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
                                            {Document?.tags.map(tag =>
                                                <Fragment key={`document-${Document.id}-tag-${tag}`}>
                                                    <Badge className="tag" bg="secondary">
                                                        {tag}
                                                    </Badge>
                                                </Fragment>
                                            )}

                                            <Button as={Badge} bg="primary" title={t("Collapse tags")} type="button" className="noStyle d-inline-block" onClick={() => collapseTags()}>
                                                <FontAwesomeIcon icon={faChevronUp} />
                                            </Button>
                                        </>
                                }
                            </div>
                        }
                        {
                            TagsCollapsed &&
                            <Button onClick={downloadFile} as={Badge} bg="primary" title={t("Download")} type="button" className={`noStyle d-inline-block ms-auto ${(!File.valid || File.fetching) ? "disabled" : ""}`}>
                                {
                                    File.fetching && File.type !== "preview" ?
                                        <span className="smaller">
                                            <Spinner as="span" size="sm" />
                                        </span>
                                        :
                                        <FontAwesomeIcon icon={faDownload} />
                                }
                            </Button>
                        }
                        {
                            TagsCollapsed &&
                            <Button onClick={() => downloadFile("preview")} as={Badge} bg="primary" title={t("Preview")} type="button" className={`noStyle d-inline-block ms-1 ${(!File.valid || File.fetching || !File.validPreview) ? "disabled" : ""}`}>
                                {
                                    File.fetching && File.type === "preview" ?
                                        <span className="smaller">
                                            <Spinner as="span" size="sm" />
                                        </span>
                                        :
                                        <FontAwesomeIcon
                                            icon={faMagnifyingGlass}
                                        />
                                }
                            </Button>
                        }
                    </div>
                </div>
            </div>
            {
                !!(File.fetched && show && File.valid) &&
                (
                    File.pdfPreview ?
                        <PDFModal download={download} show={show} handleShow={handleShow} file={File.content} />
                        :
                        <OtherFileTypesModal download={download} show={show} handleShow={handleShow} file={File.content} />
                )
            }
        </Col>
    );
}

export default DocumentItem