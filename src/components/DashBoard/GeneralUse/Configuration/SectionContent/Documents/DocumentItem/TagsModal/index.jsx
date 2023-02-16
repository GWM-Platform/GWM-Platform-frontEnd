import React from "react";
import { Button, Form, Modal, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import CreatableSelect from 'react-select/creatable';

const TagsModal = ({ Document, uniqueTagsOptions, addTagsToDocument, show, handleClose, selectedOptions, handleChange,Request }) => {
    
    const { t } = useTranslation()
    
    return (
        <Modal className="editTags" show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{t("Edit tags of \"{{documentName}}\"", { documentName: Document.name })}</Modal.Title>
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
        </Modal>)
}

export default TagsModal