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
import { useDispatch, useSelector } from 'react-redux';
import { fetchFunds, selectAllFunds } from 'Slices/DashboardUtilities/fundsSlice';

const APL = () => {
  const { token } = useContext(DashBoardContext)
  const dispatch = useDispatch()

  const [fullSettlement, setFullSettlement] = useState({ fetching: false, debt: {} })

  const [SelectedFund, setSelectedFund] = useState("")

  const [UsersInfo, SetUsersInfo] = useState({ fetching: true, value: [] })


  useEffect(() => {
    const abortController = new AbortController()   // creating an AbortController



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
    dispatch(fetchFunds())
    getUsersInfo()

    return () => {
      abortController.abort()// stop the query by aborting on the AbortController on unmount
    }
    //eslint-disable-next-line
  }, [])

  const funds = useSelector(selectAllFunds)
  const FundSelected = funds?.find(Fund => Fund.id === SelectedFund)

  return (
    funds.lenght ?
      <Loading />
      :
      <Container className="my-2 APL">
        <Row className="d-flex justify-content-center gy-3  py-1">
          <Col md="12">
            <GeneralInfo fullSettlement={fullSettlement} setFullSettlement={setFullSettlement} clients={UsersInfo.value} />
          </Col>
          <Col md="12">
            <FundSelector SelectedFund={SelectedFund} setSelectedFund={setSelectedFund} Funds={funds} />
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
                  <FundTransactionsById UsersInfo={UsersInfo} Id={FundSelected?.id} />
                </Col>
              :
              null
          }
        </Row>
      </Container>
  )
}
export default APL