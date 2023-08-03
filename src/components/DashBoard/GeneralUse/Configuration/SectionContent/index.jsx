import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'

import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const SectionContent = ({ SectionSelected, selectSection, TabActive, setTabActive, content }) => {
  const { t } = useTranslation()

  const returnToSelector = () => {
    setTabActive(false)
    setTimeout(() => selectSection(''), 500)
  }

  return (
        <Col className={`SectionContent ${SectionSelected !== '' && TabActive ? 'SectionSelected' : ''}`} sm={4} md={3}>
            <button type="button" className='sectionHeader d-block d-sm-none' onClick={() => returnToSelector()}>
                <FontAwesomeIcon icon={faChevronLeft} />
                <h1 className="sectionSelected">{t(SectionSelected)}</h1>
            </button>
            <div className="paddingMobile flex-grow-1">
                {
                    content()
                }
            </div>
        </Col>
  )
}
export default SectionContent
