import React, { useContext, useEffect } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css'

import Loading from '../Loading'

import Content from './Content'
import { useState } from 'react'
import axios from 'axios'
import { DashBoardContext } from 'context/DashBoardContext'

const AccessAndPermissionsAdministration = ({ desiredSubSection }) => {

  const { ClientSelected, toLogin } = useContext(DashBoardContext);


  const [users, setUsers] = useState({
    fetching: true,
    fetched: false,
    valid: false,
    content: [
      // {
      //   "id": 10,
      //   "userId": 11,
      //   "clientId": 12,
      //   "isOwner": true,
      //   "permissions": [
      //     {
      //       "id": 28,
      //       "action": "OWNER",
      //       "createdAt": "2022-10-26T21:23:36.990Z"
      //     }
      //   ],
      //   "email": "marcos.sk8.parengo+1@gmail.com"
      // }
    ]
  })

  const getUsers = () => {
    setUsers((prevState) => ({ ...prevState, fetching: true }))
    axios.get(`/permissions`, {
      params: { clientId: ClientSelected.id },
    }).then(function (response) {
      setUsers((prevState) => (
        {
          ...prevState,
          fetching: false,
          fetched: true,
          valid: true,
          content: response.data,
        }))
    }).catch((err) => {
      if (err.message !== "canceled") {
        if (err.response.status === "401") toLogin()
        setUsers((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
      }
    });
  }
  
  useEffect(() => {
    getUsers()
    //eslint-disable-next-line
  }, [])

  const [Permissions, setPermissions] = useState({
    fetching: true,
    fetched: false,
    valid: false,
    content: []
  })

  useEffect(() => {
    axios.get(`/permissions`).then(function (response) {
      setPermissions((prevState) => (
        {
          ...prevState,
          fetching: false,
          fetched: true,
          valid: true,
          content: response.data,
        }))
    }).catch((err) => {
      if (err.message !== "canceled") {
        if (err.response.status === "401") toLogin()
        setPermissions((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
      }
    });
  }, [toLogin])

  const [Funds, setFunds] = useState({
    fetching: true,
    fetched: false,
    valid: false,
    content: []
  })

  useEffect(() => {
    axios.get(`/funds`).then(function (response) {
      setFunds((prevState) => (
        {
          ...prevState,
          fetching: false,
          fetched: true,
          valid: true,
          content: response.data,
        }))
    }).catch((err) => {
      if (err.message !== "canceled") {
        if (err.response.status === "401") toLogin()
        setFunds((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
      }
    });
  }, [toLogin])

  return (
    <>
      {
        users.fetching || Permissions.fetching || Funds.fetching
          ? <Loading />
          :
          <Content getUsers={getUsers} users={users.content} permissions={Permissions.content} funds={Funds.content} />
      }
    </>
  )
}
export default AccessAndPermissionsAdministration
