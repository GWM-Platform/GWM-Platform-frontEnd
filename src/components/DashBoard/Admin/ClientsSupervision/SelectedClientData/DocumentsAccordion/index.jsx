import axios from "axios";
import { DashBoardContext } from "context/DashBoardContext";
import React from "react";
import { useContext } from "react";
import { useState } from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { Accordion, Button, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import './index.scss'
import DocumentItem from "./DocumentItem";
import ReactSelect from "react-select";
import Loading from 'components/DashBoard/GeneralUse/Loading';
import NoMovements from "components/DashBoard/GeneralUse/NoMovements";

const DocumentsAccordion = ({ client,documents,setDocuments }) => {
    const { t } = useTranslation()

    const { toLogin } = useContext(DashBoardContext)

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
        //eslint-disable-next-line
    }, [])

    const [selectedOptions, setSelectedOptions] = useState([...document?.tags?.map(tag => ({ value: tag, label: tag })) || []])

    const handleChange = (selectedOption) => {
        setSelectedOptions([...selectedOption]);
    };

    const uniqueTagsOptions = () => [...new Set(documents.content.map(document => [document?.tags || []]).flat(2))].map(tag => ({ value: tag, label: tag }))

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
                    {
                        documents.fetching
                            ?
                            <Loading movements={4} />
                            :
                            <>
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
                                {
                                    documents.fetched && filteredDocuments().length === 0 ?
                                        <NoMovements movements={4} />
                                        :
                                        <Row className='g-2 mb-2'>
                                            {filteredDocuments().map(document => <DocumentItem client={client} getDocuments={getDocuments} Document={document} key={`document-item-${client.id}-${document.id}`} />)}
                                        </Row>
                                }
                                <div className="mt-2 d-flex justify-content-end">
                                    <Link to={`/DashBoard/clientsSupervision/${client.id}/document`}>
                                        <Button>{t("Add document")}</Button>
                                    </Link>
                                </div>
                            </>
                    }

                </Accordion.Body>
            </Accordion.Item>
        </Accordion>
    );
}

export default DocumentsAccordion