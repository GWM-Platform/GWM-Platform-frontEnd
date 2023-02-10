import React, { useState, useEffect, useContext } from 'react'

import { DashBoardContext } from 'context/DashBoardContext'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Col, Container, Modal, Ratio, Row, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5'

import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import './index.scss'

const PDFModal = (props) => {
  console.log(props.handleShow)
  const { t } = useTranslation()
  const { isMobile } = useContext(DashBoardContext)

  const [width, setWidth] = useState(null)
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
    setPageNumber(1)
  }

  function nextPage() {
    if (numPages > pageNumber) setPageNumber(pageNumber + 1)
  }

  function prevPage() {
    if (pageNumber > 1) setPageNumber(pageNumber - 1)
  }

  useEffect(() => {
    function handleResize() {
      setWidth(document.getElementsByClassName('PdfDiv')[0]?.clientWidth ?? 150)
    }

    window.addEventListener('resize', handleResize)

    return _ => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  useEffect(() => {
    setWidth(document.getElementsByClassName('PdfDiv')[0]?.clientWidth ?? 150)
  }, [props.show])

  return (
    <Modal className="helpModal" size="md" show={props.show} onHide={() => props.handleShow()} >
      <Modal.Body className='d-flex'>
        <Container fluid style={{ minHeight: '100%' }}>
          <Row className='h-100 align-items-stretch' style={isMobile ? { flexDirection: 'column' } : {}}>
            <Col lg="12" style={
              isMobile
                ? {
                  flexGrow: '1',
                  display: 'flex',
                  flexDirection: 'column'
                }
                : {}}>
              <Ratio aspectRatio={45 / 80} style={isMobile ? { height: '100%', overflow: 'overlay', borderRadius: "5px" } : { height: '100%' }}>

                <div className='w-100 h-100 PdfDiv' >
                  <Document
                    loading={
                      <div className="w-100 h-100 d-flex justify-content-center align-items-center" style={{ background: "white" }}>
                        <div className="d-flex justify-content-center align-items-center h-100">
                          <Spinner className="me-2" animation="border" variant="primary" />
                          <span className="loadingText">{t('Loading')}</span>
                        </div>
                      </div>
                    }
                    error={
                      <div className="w-100 h-100 d-flex justify-content-center align-items-center">
                        <div className="d-flex justify-content-center align-items-center">
                          <span className="loadingText">{t('Not found')}</span>
                        </div>
                      </div>
                    }
                    file={`data:application/pdf;base64,${props.file.file}`}
                    onLoadSuccess={onDocumentLoadSuccess} >
                    <Page width={width} pageNumber={pageNumber}>
                      <div className='page-controls d-none d-sm-block'>
                        {
                          numPages > 1 &&
                          <>
                            <button onClick={() => prevPage()} title={t('Previous page')} data-cy="btn-previous-page-pdf">‹</button>
                            <span>{pageNumber} {t('of')} {numPages}</span>
                            <button onClick={() => nextPage()} title={t('Next page')} data-cy="btn-next-page-pdf">›</button>
                          </>
                        }{
                          <button onClick={() => props.download(props.file)} data-cy="btn-download-pdf" title={t('Download this pdf')}>
                            <FontAwesomeIcon icon={faDownload} />
                          </button>
                        }
                      </div>
                    </Page>
                  </Document>
                </div>
              </Ratio>
              <Col className='page-controls d-block d-sm-none'>
                {
                  numPages > 1 &&
                  <>
                    <button onClick={() => prevPage()} title={t('Previous page')} data-cy="btn-previous-page-pdf">‹</button>
                    <span>{pageNumber} {t('of')} {numPages}</span>
                    <button onClick={() => nextPage()} title={t('Next page')} data-cy="btn-next-page-pdf">›</button>
                  </>
                }{
                  <button onClick={() => props.download(props.file)} data-cy="btn-download-pdf" title={t('Download this pdf')}>
                    <FontAwesomeIcon icon={faDownload} />
                  </button>
                }
              </Col>
            </Col>
          </Row>
        </Container>
      </Modal.Body>
    </Modal >
  )
}

export default PDFModal
