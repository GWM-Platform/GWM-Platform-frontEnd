import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'

import Loading from '../Loading'

import UpdatePersonalInfo from './UpdatePersonalInfo'

const PersonalInformation = ({ desiredSubSection }) => {


  return (
    <>
      {
        false
          ? <Loading />
          :
          <UpdatePersonalInfo />
      }
    </>
  )
}
export default PersonalInformation
