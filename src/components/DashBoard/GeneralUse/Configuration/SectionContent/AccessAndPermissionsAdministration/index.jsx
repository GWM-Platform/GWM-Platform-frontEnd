import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'

import Loading from '../Loading'

import Content from './Content'
import { useState } from 'react'

const AccessAndPermissionsAdministration = ({ desiredSubSection }) => {
  const [users] = useState({
    "fetching": false,
    "fetched": true,
    "valid": true,
    "content": [
      {
        "id": 2,
        "email": "123@gmail.com",
        "changedPassword": false,
        "verified": false,
        "enabled": true,
        "isAdmin": false,
        "createdAt": "2021-11-18T01:05:48.957Z",
        "updatedAt": "2021-11-18T01:05:48.957Z"
      },
      {
        "id": 14,
        "email": "marcos.sk8.parengo+4@gmail.com",
        "changedPassword": false,
        "verified": true,
        "enabled": true,
        "isAdmin": false,
        "createdAt": "2022-06-02T18:22:36.828Z",
        "updatedAt": "2022-06-02T18:22:50.000Z"
      },
      {
        "id": 34,
        "email": "marcos.sk8.parengo+16@gmail.com",
        "changedPassword": true,
        "verified": true,
        "enabled": true,
        "isAdmin": false,
        "createdAt": "2022-07-21T20:50:47.168Z",
        "updatedAt": "2022-07-21T20:51:35.000Z"
      }
    ]
  })

  return (
    <>
      {
        users.fetching
          ? <Loading />
          :
          <Content users={users.content}/>
      }
    </>
  )
}
export default AccessAndPermissionsAdministration
