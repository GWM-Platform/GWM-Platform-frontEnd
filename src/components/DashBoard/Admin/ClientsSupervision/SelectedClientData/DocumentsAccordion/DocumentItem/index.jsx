import { faChevronDown, faChevronUp, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import MoreButton from "components/DashBoard/GeneralUse/MoreButton";
import React, { useState } from "react";
import { Fragment } from "react";
import { Badge, Col, Dropdown, Spinner, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const DocumentItem = ({ Document }) => {
    const { t } = useTranslation()

    const [TagsCollapsed, setTagsCollapsed] = useState(true)
    const expandTags = () => { setTagsCollapsed(false) }
    const collapseTags = () => { setTagsCollapsed(true) }

    const tagsAmount = Document?.tags?.length
    const hasTags = !!(Document?.tags?.length > 0)
    const hasMultipleTags = !!(Document?.tags?.length > 1)

    const [File, setFile] = useState({ fetching: false, fetched: false, content: {} })

    const downloadFile = () => {

        const download = (file) => {
            const alink = document.createElement('a')
            alink.href = `data:application/octet-stream;base64,${file.file}`
            alink.download = `${file.name}`
            alink.click()
        }


        if (!File.fetched) {

            setFile((prevState) => ({ ...prevState, fetching: true, fetched: false }))
            axios.get(`/documents/${Document.id}/file/`,
            ).then(function (response) {
                setFile((prevState) => (
                    {
                        ...prevState,
                        fetching: false,
                        fetched: true,
                        content: response.data
                    }))
                download(response.data)
            }).catch((err) => {
                if (err.message !== "canceled") {
                    setFile((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true } }))
                }
            });
        } else {
            setFile((prevState) => ({ ...prevState, fetching: true, fetched: false }))
            download(File.content)
            setFile((prevState) => ({ ...prevState, fetching: false, fetched: false }))

        }
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
                                        <Dropdown.Item onClick={downloadFile}>
                                            {t('Download')}
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item disabled>
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
                            <Button onClick={downloadFile} as={Badge} bg="primary" title={t("Download")} type="button" className="noStyle d-inline-block ms-auto">
                                {
                                    File.fetching ?
                                        <span className="smaller">
                                            <Spinner as="span" size="sm" />
                                        </span>
                                        :
                                        <FontAwesomeIcon icon={faDownload} />
                                }
                            </Button>
                        }
                    </div>
                </div>
            </div>

        </Col>
    );
}

export default DocumentItem