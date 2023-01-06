import axios from "axios";
import { DashBoardContext } from "context/DashBoardContext";
import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { Accordion, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import './index.scss'
import DocumentItem from "./DocumentItem";
import ReactSelect from "react-select";

const DocumentsAccordion = ({ client }) => {
    const { t } = useTranslation()

    const { toLogin } = useContext(DashBoardContext)

    const [documents, setDocuments] = useState({ fetching: false, fetched: false, valid: false, content: [] })

    const getDocuments = useCallback((signal) => {
        setDocuments((prevState) => ({ ...prevState, fetching: true, fetched: false }))

        axios.get(`/documents`, {
            params: {
                client: client.id
            },
            signal: signal,
        }).then(function (response) {
            setDocuments((prevState) => (
                {
                    ...prevState,
                    fetching: false,
                    fetched: true,
                    valid: true,
                    content: response.data,
                }))
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") toLogin()
                setDocuments((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
            }
        });
    }, [toLogin, setDocuments, client]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        getDocuments(signal)

        return () => {
            controller.abort();
        };
    }, [getDocuments])

    const [selectedOptions, setSelectedOptions] = useState([...document?.tags?.map(tag => ({ value: tag, label: tag })) || []])

    const handleChange = (selectedOption) => {
        setSelectedOptions([...selectedOption]);
    };

    const uniqueTagsOptions = () => [...new Set(documents.content.map(document => [document.tags]).flat(2))].map(tag => ({ value: tag, label: tag }))

    const filteredDocuments = () => selectedOptions.length > 0
        ? documents.content.filter(
            document => selectedOptions.map(selectedOptions => selectedOptions.value).every(tag => document?.tags?.includes(tag))
        )
        : documents.content

    return (
        <Accordion flush>
            <Accordion.Item eventKey="0">
                <Accordion.Header>{t("Documentation")}</Accordion.Header>
                <Accordion.Body className="documentsList">
                    <ReactSelect
                        value={selectedOptions}
                        onChange={handleChange}
                        className="w-100 mb-2"
                        isMulti isClearable noOptionsMessage={() => t("No options")} placeholder={t("Filter documents by tags...")}
                        options={[...uniqueTagsOptions()]}
                        classNames={{
                            multiValue: () => ("multiValue"),
                            multiValueLabel: () => ("multiValueLabel"),
                            multiValueRemove: () => ("multiValueRemove"),
                        }}
                    />
                    {filteredDocuments().map(document => <DocumentItem document={document} key={`document-item-${client.id}-${document.id}`} />)}
                    <div className="mt-2 d-flex justify-content-end">
                        <Link to={`/DashBoard/clientsSupervision/${client.id}/addDocument`}>
                            <Button>{t("Add document")}</Button>
                        </Link>
                    </div>
                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default DocumentsAccordion