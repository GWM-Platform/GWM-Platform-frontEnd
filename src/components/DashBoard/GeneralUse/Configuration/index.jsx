import 'bootstrap/dist/css/bootstrap.min.css'
import React, { useState, useContext } from 'react'

import { DashBoardContext } from 'context/DashBoardContext';
import { Row, Container } from 'react-bootstrap'
import { useLocation, useHistory } from 'react-router-dom'

import SectionContent from './SectionContent'
import PasswordAndAuthentication from './SectionContent/PasswordAndAuthentication'
import SectionsSelector from './SectionsSelector'

import './index.css'
import { useTranslation } from 'react-i18next';
import AccessAndPermissionsAdministration from './SectionContent/AccessAndPermissionsAdministration';

const Configuration = ({ admin = false }) => {

  const history = useHistory()
  const location = useLocation()
  const { t } = useTranslation()

  const useQuery = () => {
    const { search } = useLocation()
    return React.useMemo(() => new URLSearchParams(search), [search])
  }

  const sectionQuery = useQuery().get('section')
  const subSectionQuery = useQuery().get('subSection')

  const contentByName =
  {
    passwordandauthentication: <PasswordAndAuthentication desiredSubSection={subSectionQuery} />,
    ...(admin ?
      {}
      :
      { accessandpermissionsadministration: <AccessAndPermissionsAdministration desiredSubSection={subSectionQuery} /> })
  }
  const content = () => {
    const contentSelected = contentByName[SectionSelected.replace(/\s/g, '').toLowerCase()]
    if (contentSelected) { return contentSelected } else {
      return <h1 className="SectionTitle">{t(SectionSelected.replace(/\s/g, ''))}</h1>
    }
  }

  const sectionFirstValue = () => {
    if (sectionQuery) {
      const desiredSectionKey = sectionQuery.replace(/\s/g, '').toLowerCase()
      if (Object.keys(contentByName).includes(desiredSectionKey)) {
        return sectionQuery
      } else return isMobile ? '' : 'passwordandauthentication'
    } else return isMobile ? '' : 'passwordandauthentication'
  }

  const { isMobile } = useContext(DashBoardContext);
  const [SectionSelected, SetSectionSelected] = useState(sectionFirstValue())

  const [TabActive, setTabActive] = useState(sectionFirstValue().length > 0)

  const selectSection = (section) => {
    SetSectionSelected(section)
    const params = new URLSearchParams({ section })
    history.replace({ pathname: location.pathname, search: params.toString() })
  }

  return (
    <Container fluid="lg" className="Configuration tabContent growAnimation ">
      <Row className={`h-100 p-relative ConfigurationRow
              d-flex justify-content-center align-items-stretch`}>
        <SectionsSelector admin={admin} TabActive={TabActive} setTabActive={setTabActive} SectionSelected={SectionSelected} selectSection={selectSection} />
        <SectionContent  desiredSubSection={subSectionQuery} content={content} TabActive={TabActive} setTabActive={setTabActive} SectionSelected={SectionSelected} selectSection={selectSection} />
      </Row>
    </Container>
  )
}
export default Configuration
