import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'

import Loading from '../Loading'
import { useEffect } from 'react'
import { useCallback } from 'react'
import { useState } from 'react'
import { DashBoardContext } from 'context/DashBoardContext'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import DocumentItem from './DocumentItem'
import ReactSelect from 'react-select'
import { Row } from 'react-bootstrap'
import NoMovements from 'components/DashBoard/GeneralUse/NoMovements'

const Documents = () => {

  const { t } = useTranslation()

  const { toLogin, ClientSelected } = useContext(DashBoardContext)

  const [documents, setDocuments] = useState({ fetching: false, fetched: false, valid: false, content: [] })

  const [selectedOptions, setSelectedOptions] = useState([...document?.tags?.map(tag => ({ value: tag, label: tag })) || []])

  const handleChange = (selectedOption) => {
    setSelectedOptions([...selectedOption]);
  };

  const uniqueTagsOptions = () => [...new Set(documents.content.map(document => [document?.tags || []]).flat(2))].map(tag => ({ value: tag, label: tag }))

  const getDocuments = useCallback((signal) => {
    setDocuments((prevState) => ({ ...prevState, fetching: true, fetched: false }))
    axios.get(`/documents`, {
      params: {
        client: ClientSelected.id
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
  }, [toLogin, setDocuments, ClientSelected]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    getDocuments(signal)

    return () => {
      controller.abort();
    };
    //eslint-disable-next-line
  }, [])

  const filteredDocuments = () => selectedOptions.length > 0
    ? documents.content.filter(
      document => selectedOptions.map(selectedOptions => selectedOptions.value).every(tag => document?.tags?.includes(tag))
    )
    : documents.content

  return (
    <>
      {
        documents.fetching
          ? <Loading />
          :
          <>
            <h1 className="SectionTitle">{t('Documents')}</h1>
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
                  {filteredDocuments().map(document => <DocumentItem uniqueTagsOptions={uniqueTagsOptions()} Document={document} key={`document-item-${document.id}`} getDocuments={getDocuments} />)}
                </Row>
            }
          </>
      }
    </>
  )
}
export default Documents
