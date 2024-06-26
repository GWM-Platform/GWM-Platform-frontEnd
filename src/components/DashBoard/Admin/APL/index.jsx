import React, { useState, useEffect, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap'
import Loading from 'components/DashBoard/Admin/Loading'
import FundSelector from './FundSelector'
import FundInfo from './FundInfo'
import FundTransactionsById from './FundTransactionsById';
import { DashBoardContext } from 'context/DashBoardContext';
import GeneralInfo from './GeneralInfo';
import './index.scss'
import FixedDepositInfo from './FixedDepositInfo';
import FixedDepositsGraphic from './FixedDepositsGraphic';

const APL = () => {
  const { token } = useContext(DashBoardContext)

  const [fullSettlement, setFullSettlement] = useState({ fetching: false, debt: {} })

  const [Funds, setFunds] = useState({ fetching: true, fetched: false, content: [] })
  const [SelectedFund, setSelectedFund] = useState("")

  const [UsersInfo, SetUsersInfo] = useState({ fetching: true, value: {} })
  const [AccountInfo, SetAccountInfo] = useState({ fetching: true, value: {} })


  useEffect(() => {
    const abortController = new AbortController()   // creating an AbortController

    const getFunds = async () => {
      var url = `${process.env.REACT_APP_APIURL}/funds`;
      setFunds((prevState) => ({ ...prevState, fetching: true, fetched: false }))
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: "*/*",
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          signal: abortController.signal
        }
      })

      if (response.status === 200) {
        const data = await response.json()
        setFunds((prevState) => ({ ...prevState, content: data, fetching: false, fetched: true }))
      } else {
        switch (response.status) {
          default:
            console.error(response.status)
        }
      }
    }

    const getAccounts = async () => {
      var url = `${process.env.REACT_APP_APIURL}/accounts/?all=true`

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 200) {
        const data = await response.json()
        SetAccountInfo(prevState => ({ ...prevState, ...{ fetching: false, value: data } }))
      } else {
        switch (response.status) {
          default:
            console.log(response)
        }
      }
    }

    const getUsersInfo = async () => {
      var url = `${process.env.REACT_APP_APIURL}/clients/?` + new URLSearchParams({
        all: true,
      });

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "*/*",
          'Content-Type': 'application/json'
        }
      })

      if (response.status === 200) {
        const data = await response.json()
        SetUsersInfo(prevState => ({ ...prevState, ...{ fetching: false, value: data } }))
      } else {
        switch (response.status) {
          default:
            console.log(response)
        }
      }
    }
    getFunds()
    getAccounts()
    getUsersInfo()

    return () => {
      abortController.abort()// stop the query by aborting on the AbortController on unmount
    }
    //eslint-disable-next-line
  }, [])

  const FundSelected = Funds?.content?.find(Fund => Fund.id === SelectedFund)

  return (
    Funds.fetching ?
      <Loading />
      :
      <Container className="my-2 APL">
        <Row className="d-flex justify-content-center gy-3  py-1">
          <Col md="12">
            <GeneralInfo fullSettlement={fullSettlement} setFullSettlement={setFullSettlement} clients={UsersInfo.value} />
          </Col>
          <Col md="12">
            <FundSelector SelectedFund={SelectedFund} setSelectedFund={setSelectedFund} Funds={Funds.content} />
          </Col>
          {
            SelectedFund !== "" ?
              SelectedFund === "fixed-deposit" ?
                <Col md="12">
                  <FixedDepositInfo fullSettlement={fullSettlement} Fund={FundSelected} />
                </Col>
                :
                <Col md="12">
                  <FundInfo Fund={FundSelected} clients={UsersInfo.value} />
                </Col>
              :
              null
          }
          {
            SelectedFund !== "" ?
              SelectedFund === "fixed-deposit" ?
                <Col md="12">
                  <FixedDepositsGraphic data={fullSettlement?.debt?.fixedDeposits?.graphicData} />
                </Col>
                :
                <Col md="12">
                  <FundTransactionsById UsersInfo={UsersInfo} AccountInfo={AccountInfo} Id={FundSelected?.id} />
                </Col>
              :
              null
          }
        </Row>
      </Container>
  )
}
export default APL