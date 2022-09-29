import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'

import Loading from '../Loading'

import ChangePassword from './ChangePassword'

const PasswordAndAuthentication = ({ desiredSubSection }) => {

  const ChangePasswordScrollIntoView = () => desiredSubSection?.toLowerCase() === 'changepassword'

  return (
    <>
      {
        false
          ? <Loading />
          :
          <ChangePassword scrollIntoView={ChangePasswordScrollIntoView()} />
      }
    </>
  )
}
export default PasswordAndAuthentication
