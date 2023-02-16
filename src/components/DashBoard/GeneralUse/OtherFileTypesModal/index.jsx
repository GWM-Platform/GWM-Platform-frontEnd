import React, { useContext } from 'react'

import { DashBoardContext } from 'context/DashBoardContext'
import { faDownload } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { CloseButton, Col, Container, Modal, Row } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'
import FilePreviewer from 'react-file-previewer';

import 'bootstrap/dist/css/bootstrap.min.css'
import './index.scss'

const OtherFileTypesModal = (props) => {

  const { t } = useTranslation()
  const { isMobile } = useContext(DashBoardContext)

  return (
    <Modal className="helpModal2" size="md" show={props.show} onHide={() => props.handleShow()} >
      <Modal.Body className='d-flex pt-0'>
        <Container fluid style={{ minHeight: '100%', position: 'relative' }} className='px-0'>
          <CloseButton  variant="white" onClick={() => props.handleShow()} style={{ position: 'absolute', top: "10px", right: "10px", zIndex: 1 }} />
          <Row className='h-100 align-items-stretch' style={{ flexDirection: 'column' }}>
            <Col lg="12"
              style={{
                flexGrow: '1',
                display: 'flex',
                flexDirection: 'column'
              }}>
              {isMobile ?
                <div className='w-100 h-100 PdfDiv' >
                   <FilePreviewer
                      file={{
                        data: props?.file?.file,
                        mimeType: props?.file?.mimeType,
                        name: props?.file?.name
                      }}
                      hideControls
                    />
                </div>
                :


                  <div className='w-100 h-100 PdfDiv' >
                    <FilePreviewer
                      file={{
                        data: props?.file?.file,
                        mimeType: props?.file?.mimeType,
                        name: props?.file?.name
                      }}
                      hideControls
                    />
                  </div>
              }
              <Col className='page-controls'>
                {
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

export default OtherFileTypesModal
