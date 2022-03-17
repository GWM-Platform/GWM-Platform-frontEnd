import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from 'react-bootstrap'
import Loading from 'components/DashBoard/Admin/Loading'
import FundSelector from './FundSelector'
import FundInfo from './FundInfo'
import FundTransactionsById from './FundTransactionsById';

const APL = () => {

  const [Funds, setFunds] = useState({ fetching: true, fetched: false, content: [] })
  const [SelectedFund, setSelectedFund] = useState("")

  useEffect(() => {
    const abortController = new AbortController()   // creating an AbortController
    const getFunds = async () => {
      var url = `${process.env.REACT_APP_APIURL}/funds`;
      setFunds((prevState) => ({ ...prevState, fetching: true, fetched: false }))
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: "*/*",
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

    getFunds()

    return () => {
      abortController.abort()// stop the query by aborting on the AbortController on unmount
    }
  }, [])

  return (
    Funds.fetching ?
      <Loading />
      :
      <Container className="my-2">
        <Row className="d-flex justify-content-center">
          <Col md="12" lg="10">
            <FundSelector SelectedFund={SelectedFund} setSelectedFund={setSelectedFund} Funds={Funds.content} />
            {SelectedFund !== "" ? <FundInfo Fund={Funds.content[SelectedFund]} /> : null}
            {SelectedFund !== "" ? <FundTransactionsById Id={Funds.content[SelectedFund].id} /> : null}
          </Col>
        </Row>
      </Container>
  )
}
export default APL