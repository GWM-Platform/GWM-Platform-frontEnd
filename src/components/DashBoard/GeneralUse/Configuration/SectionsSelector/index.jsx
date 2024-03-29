import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useContext } from 'react'

import { faShieldAlt, faUserCog, faUsersCog } from '@fortawesome/free-solid-svg-icons'
import { Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

import Section from './Section'

import './index.css'
import { faAddressCard, faFile } from '@fortawesome/free-regular-svg-icons'
import { DashBoardContext } from 'context/DashBoardContext'

const SectionsSelector = ({ SectionSelected, selectSection, TabActive, setTabActive, admin = false }) => {
    const { t } = useTranslation()
    const { hasPermission } = useContext(DashBoardContext)

    return (
        <Col className={`SectionSelector p-0 ${TabActive ? 'SectionSelected' : ''}`} sm={4} md={3}>
            <button type="button" className='sectionHeader d-block d-sm-none mb-0' >
                <h1 className="sectionSelected">{t('Configuration')}</h1>
            </button>
            <div className="padding">
                <div className="SectionGroup d-none">
                    <Section setTabActive={setTabActive} SectionSelected={SectionSelected}
                        selectSection={selectSection} title={'Basic information'} icon={faAddressCard} enabled />
                </div>

                <div className="SectionGroup">
                    <Section setTabActive={setTabActive} SectionSelected={SectionSelected}
                        selectSection={selectSection} title={'Password and authentication'} icon={faShieldAlt} enabled />
                    <Section setTabActive={setTabActive} SectionSelected={SectionSelected}
                        selectSection={selectSection} title={'Personal information'} icon={faAddressCard} enabled />
                    {
                        !!(!admin && (hasPermission('VIEW_ACCOUNT') && hasPermission('EDIT_CLIENT'))) &&
                        <Section setTabActive={setTabActive} SectionSelected={SectionSelected}
                            selectSection={selectSection} title={'Client configuration'} icon={faUserCog} enabled />
                    }
                    {
                        !!(!admin && hasPermission('VIEW_ACCOUNT')) &&
                        <Section setTabActive={setTabActive} SectionSelected={SectionSelected}
                            selectSection={selectSection} title={'Access and permissions administration'} icon={faUsersCog} enabled />
                    }
                    {
                        !admin &&
                        <Section setTabActive={setTabActive} SectionSelected={SectionSelected}
                            selectSection={selectSection} title={'Documents'} icon={faFile} enabled />
                    }

                </div>
            </div>

        </Col>
    )
}
export default SectionsSelector
