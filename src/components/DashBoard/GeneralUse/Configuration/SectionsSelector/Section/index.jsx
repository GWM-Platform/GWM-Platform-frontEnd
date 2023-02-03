import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useTranslation } from 'react-i18next'

const Section = ({ title, SectionSelected, selectSection, icon, setTabActive, enabled }) => {
  const { t } = useTranslation()

  return (
    enabled
      ? <button onClick={() => { selectSection(title); setTabActive(true) }} className={`Section ${SectionSelected === title ? 'selected' : ''}`}>
                <h1 className='Title'>
                    {icon
                      ? <FontAwesomeIcon className="me-1" icon={icon} />
                      : null
                    }
                    <span>{t(title)}</span>
                </h1>
            </button>
      : null
  )
}
export default Section
