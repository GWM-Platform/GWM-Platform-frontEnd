import { faChevronDown, faChevronUp, faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import MoreButton from "components/DashBoard/GeneralUse/MoreButton";
import React, { useState } from "react";
import { Fragment } from "react";
import { Badge, Col, Dropdown, Spinner, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const DocumentItem = ({ document }) => {
    const { t } = useTranslation()

    const [TagsCollapsed, setTagsCollapsed] = useState(true)
    const expandTags = () => { setTagsCollapsed(false) }
    const collapseTags = () => { setTagsCollapsed(true) }

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
                                    title={t(`Document options`)}
                                    className="d-flex justify-content-end"
                                    disabled={Request.fetching}
                                >
                                    <Dropdown.Toggle as={MoreButton} id="dropdown-custom-components" />
                                    <Dropdown.Menu >

                                        <Dropdown.Item target="_blank" rel="noreferrer nofollow" href={document.link}>
                                            {t('Open in a new tab')}
                                        </Dropdown.Item>
                                        <Dropdown.Item disabled>
                                            {t('Download')}
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item disabled target="_blank" rel="noreferrer nofollow" href={document.link}>
                                            {t('Edit')}
                                        </Dropdown.Item>
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

                                            <Button as={Badge} bg="primary" title={t("Collapse tags")} type="button" className="noStyle d-inline-block" onClick={() => collapseTags()}>
                                                <FontAwesomeIcon icon={faChevronUp} />
                                            </Button>
                                        </>
                                }
                            </div>
                        }
                        {
                            TagsCollapsed &&
                            <Button as={Badge} bg="primary" title={t("Download")} type="button" className="noStyle d-inline-block ms-auto"><FontAwesomeIcon icon={faDownload} /></Button>
                        }
                    </div>
                </div>
            </div>

        </Col>
    );
}

export default DocumentItem