import 'bootstrap/dist/css/bootstrap.min.css'
import React from 'react'

import { faShieldAlt, faHeadset, faInfoCircle, faUsersCog } from '@fortawesome/free-solid-svg-icons'
import { Col } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

import Section from './Section'

import './index.css'
import { faAddressCard } from '@fortawesome/free-regular-svg-icons'

const SectionsSelector = ({ SectionSelected, selectSection, TabActive, setTabActive }) => {
    const { t } = useTranslation()
    return (
        <Col className={`SectionSelector p-0 ${TabActive ? 'SectionSelected' : ''}`} sm={4} md={3}>
            <button type="button" className='sectionHeader d-block d-sm-none mb-0' >
                <h1 className="sectionSelected">{t('Configuration')}</h1>
            </button>
            <div className="padding">
                <div className="SectionGroup">
                    <Section setTabActive={setTabActive} SectionSelected={SectionSelected}
                        selectSection={selectSection} title={'Basic information'} icon={faAddressCard} enabled />
                </div>

                <div className="SectionGroup">
                    <Section setTabActive={setTabActive} SectionSelected={SectionSelected}
                        selectSection={selectSection} title={'Password and authentication'} icon={faShieldAlt} enabled />
                    <Section setTabActive={setTabActive} SectionSelected={SectionSelected}
                        selectSection={selectSection} title={'Access and permissions administration'} icon={faUsersCog} enabled />
                </div>

                <div className="SectionGroup">
                    <Section setTabActive={setTabActive} SectionSelected={SectionSelected}
                        selectSection={selectSection} title={'Support'} icon={faHeadset} enabled />
                    <Section setTabActive={setTabActive} SectionSelected={SectionSelected}
                        selectSection={selectSection} title={'Information'} icon={faInfoCircle} enabled />
                </div>
            </div>

        </Col>
    )
}
export default SectionsSelector
