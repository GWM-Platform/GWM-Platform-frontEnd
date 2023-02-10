import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'

import { Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const Loading = () => {
  const { t } = useTranslation()
  return (
        <div className='LoadingContainer'>
            <div className="d-flex align-items-center justify-content-center">
                <Spinner className="me-2" animation="border" variant="primary" />
                <span className="loadingText">{t('Loading')}</span>
            </div>
        </div>
  )
}
export default Loading
