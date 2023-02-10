import React, { useState, useRef, useEffect, useContext, useMemo } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import axios from 'axios'
import { DashBoardContext } from 'context/DashBoardContext';
import { Col, Row, Container, Form, Button, Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next'

const UpdateAlias = ({ scrollIntoView }) => {
  const { toLogin, AccountSelected, setAccountSelected } = useContext(DashBoardContext)
  const isMountedRef = useRef(null)

  console.log(AccountSelected)

  const [Patch, setPatch] = useState({ fetching: false, fetched: false, success: false })

  const { t } = useTranslation()

  const initialState = {
    alias: AccountSelected.alias,
    uniqueAlias: false,
    checkingAlias: false
  }

  const [data, setData] = useState(initialState)
  const currentAliasSelected = useMemo(() => data.alias === AccountSelected.alias, [data.alias, AccountSelected.alias])
  const aliasNotAvailable = !data.checkingAlias && !data.uniqueAlias && !currentAliasSelected

  const handleChange = (event) => {
    const aux = data
    aux[event.target.id] = event.target.value
    setData((prevState) => ({ ...prevState, ...aux }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    event.stopPropagation()

    const form = event.currentTarget
    if (form.checkValidity() && data.uniqueAlias && !data.checkingAlias && !currentAliasSelected) {
      putAccountInfo()
    }
  }

  const putAccountInfo = () => {
    setPatch((prevState) => ({ ...prevState, fetching: true, success: false, fetched: false }))
    axios.put(`/accounts/${AccountSelected.id}`,
      {
        alias: data.alias,
      }).then(function (response) {
        setPatch((prevState) => ({ ...prevState, fetching: false, success: true, fetched: true }))
        setAccountSelected(prevState => ({ prevState, alias: data.alias }))
      }).catch((err) => {
        if (err.message !== 'canceled') {
          setPatch((prevState) => ({ ...prevState, fetching: false, success: false, fetched: true }))
          switch (err.response.status) {
            case 401:
              toLogin()
              break
            default:
              console.error(err)
          }
        }
      })
  }

  useEffect(() => {
    isMountedRef.current = true
    return () => { isMountedRef.current = false }
  }, [])

  const myRef = useRef(null)

  const executeScroll = () => myRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })

  useEffect(() => {
    if (scrollIntoView) executeScroll()
  }, [scrollIntoView])



  useEffect(() => {

    const controller = new AbortController();
    const signal = controller.signal;

    if (!currentAliasSelected && data.alias !== "") {
      // check alias
      setData(prevState => ({ ...prevState, checkingAlias: true, uniqueAlias: false }))
      axios.get('/accounts/byAlias', { params: { alias: data.alias }, signal: signal })
        .then(function (response) {
          console.log(response)
          setData(prevState => ({ ...prevState, checkingAlias: false, uniqueAlias: false }))
        }).catch((err) => {
          if (err.message !== 'canceled') {
            setData(prevState => ({ ...prevState, checkingAlias: false, uniqueAlias: true }))
          }
        })
    }

    return () => {
      controller.abort();
    };
  }, [currentAliasSelected, data.alias])

  return (
    <Form ref={myRef} className="PasswordAndAuthentication" noValidate validated={true} onSubmit={handleSubmit}>
      <h1 className="SectionTitle">{t('Update account alias')}</h1>
      <Container className="mt-3 px-0" fluid>
        <Row className="gx-0">
          <Col lg="12" >
            <Container className="px-0" fluid>
              <Row>
                {Patch.fetched
                  ? <Col xs="12" className=" py-2 bg-light">
                    {Patch.success
                      ? <p className="textGreen mb-0 validation text-center">
                        <FontAwesomeIcon className="me-2" icon={faCheckCircle} />
                        {t('Account alias updated succesfully')}
                      </p>
                      : <p className="textRed mb-0 validation text-center">
                        <FontAwesomeIcon className="me-2" icon={faTimesCircle} />
                        {t('There was an error updating the account alias')}
                      </p>
                    }
                  </Col>
                  : null
                }
                <Col md={12} className=" mb-2">
                  <h1 className="label mt-0" >{t('Account alias')}</h1>
                  <Form.Control pattern={aliasNotAvailable ? '()' : null} required id="alias" onChange={(event) => { handleChange(event) }} value={data.alias} type="text" maxLength={20} />
                  <div className="mb-3">
                    {

                      <Form.Text className={aliasNotAvailable || data.alias === "" ? "text-red" : "text-green"}>
                        {
                          !currentAliasSelected ?
                            data.uniqueAlias ?
                              data.alias !== "" ?
                                t("Looks good") + "!"
                                :
                                t("This field is required")
                              :
                              data.checkingAlias ?
                                t("Checking if the alias is available")
                                :
                                t("The alias entered isn't available, try again with another")
                            :
                            t("The alias entered is the actual account alias")
                        }
                      </Form.Text>
                    }
                  </div>
                </Col>


                <Col xs="12" className="d-flex justify-content-end">
                  <Button
                    type="submit"
                    variant="danger"
                    className={'mainColor mb-2'}
                    disabled={Patch.fetching || data.checkingAlias || currentAliasSelected}
                  >
                    <span>
                      <Spinner
                        className={Patch.fetching ? 'd-inline-block' : 'd-none'}
                        variant="light"
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                      />
                    </span>
                    {' '}{t('Submit')}
                  </Button>
                </Col>
              </Row>
            </Container>
          </Col>
        </Row>
      </Container>
    </Form>
  )
}
export default UpdateAlias