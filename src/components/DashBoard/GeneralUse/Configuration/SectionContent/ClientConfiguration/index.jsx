import React, { useContext } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'

import Loading from '../Loading'

import UpdateAlias from './UpdateAlias'
import { DashBoardContext } from 'context/DashBoardContext'

const ClientConfiguration = ({ desiredSubSection }) => {

  const UpdateAliasScrollIntoView = () => desiredSubSection?.toLowerCase() === 'updateAlias'
  const { contentReady } = useContext(DashBoardContext)

  return (
    <>
      {
        !contentReady
          ? <Loading />
          :
          <UpdateAlias scrollIntoView={UpdateAliasScrollIntoView()} />
      }
    </>
  )
}
export default ClientConfiguration
