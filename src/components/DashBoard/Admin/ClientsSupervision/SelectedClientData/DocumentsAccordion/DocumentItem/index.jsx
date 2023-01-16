import MoreButton from "components/DashBoard/GeneralUse/MoreButton";
import React from "react";
import { Fragment } from "react";
import { Badge, Dropdown, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const DocumentItem = ({ document }) => {
    const { t } = useTranslation()

    return (
        <div className="d-flex Actions py-2 align-items-center document" style={{ borderBottom: " 1px solid lightgray" }}>
            <div className="mb-0 pe-1 pe-md-2" >
                <h1 className="title d-flex align-items-center">{t("Document")}&nbsp;#{document.id}:&nbsp;
                    <a target="_blank" rel="noreferrer nofollow" href={document.link}>{document.name}</a>
                </h1>
                {
                    !!(document?.tags) &&
                    <>
                        <h2 className="tags">
                            {t("Tags")}:
                        </h2>
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
                    </>
                }
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
        </div>
    );
}

export default DocumentItem