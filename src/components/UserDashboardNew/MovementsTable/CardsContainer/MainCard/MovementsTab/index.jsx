import React, { useContext } from 'react'
import moment from 'moment';
import { useTranslation } from "react-i18next";
import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'
import { urlContext } from '../../../../../../context/urlContext';

import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Col, Row, Form, Button, ButtonGroup } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch, faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import TableLastMovements from './TableLastMovements';
import Loading from './Loading';
import MovementsPagination from './MovementsPagination';
import NoMovements from './NoMovements';

const MovementsTab = ({ IsMobile, account }) => {
// eslint-disable-next-line 
        const { urlPrefix } = useContext(urlContext)
    const [Some, setSome] = useState(true)

    const [movements, setMovements] = useState([])
    const [fetchingMovements, setFetchingMovements] = useState(false)
    const [movsShown, setMovsShown] = useState(15)
    const [movsShownWanted, setMovsShownWanted] = useState(15)
    const [page, setPage] = useState(0)
    const [date, setDate] = useState({})
    const [useFilter, setUseFilter] = useState(false)

    const today = (moment().format("YYYY-MM-DD"))
    const minDate = "2021-06-28"

    const handleChange = (e) => {
        setMovsShownWanted(e.target.value)
    }

    const handleDateChange = (e) => {
        let aux = date
        aux[e.target.id] = e.target.value
        setDate(aux)
        setSome(!Some)
    }

    const cancelCourse = () => {
        document.getElementById("date").reset();
    }

    const { t } = useTranslation();
    let history = useHistory();

    const getMovements = () => {
        setMovements([{"date":"2021-09-08T13:07:28.000Z","number":"TR-00000313","description":"Descripcion 33","amount":-1},{"date":"2021-09-07T16:09:28.000Z","number":"TR-00000312","description":"Transferencia de algo","amount":-1},{"date":"2021-09-07T16:07:46.000Z","number":"TR-00000311","description":"descripcion","amount":-1},{"date":"2021-09-07T15:59:28.000Z","number":"TR-00000310","description":"Transferencia de algo","amount":-1},{"date":"2021-09-07T15:56:50.000Z","number":"TR-00000309","description":"Transferencia de algo","amount":-12},{"date":"2021-09-07T15:44:28.000Z","number":"TR-00000308","description":"Transferencia de algo","amount":-1},{"date":"2021-09-07T15:43:01.000Z","number":"TR-00000307","description":"descripcion","amount":-123},{"date":"2021-09-07T15:42:21.000Z","number":"TR-00000306","description":"descripcion","amount":-15},{"date":"2021-09-07T15:33:10.000Z","number":"TR-00000305","description":"descripcion","amount":-15},{"date":"2021-09-07T15:23:43.000Z","number":"TR-00000304","description":"Transferencia de algo","amount":-1},{"date":"2021-09-07T14:44:25.000Z","number":"TR-00000302","description":"000","amount":388},{"date":"2021-09-07T14:43:58.000Z","number":"TR-00000301","description":"Transferencia de algo","amount":-388},{"date":"2021-09-07T14:43:00.000Z","number":"TR-00000300","description":"descripcion","amount":-388},{"date":"2021-09-07T14:41:42.000Z","number":"TR-00000299","description":"Transferencia de algo","amount":-5000},{"date":"2021-09-07T14:31:58.000Z","number":"TR-00000298","description":"Transferencia de algo","amount":71.7}])            
    }

    useEffect(() => {
        getMovements();
        return () => {
        }
        // eslint-disable-next-line
    }, [page, movsShown, useFilter])

    useEffect(() => {
        getMovements();
        setPage(0)
        return () => {
        }
        // eslint-disable-next-line
    }, [ account])

    return (
        <>
            {/*Filters */}
            <Container fluid className="mt-1 px-0 filter">
                <Row>
                    <h1 className="fs-6 mt-4 text-success">Movements</h1>
                    <Col sm="8"><form id="date">
                        <Row className="mt-2 d-flex justify-content-between align-items-end" >

                            <Col sm={4}>
                                <Form.Group className="mb-3">
                                    <Form.Label className="ms-2" column="sm">
                                        {t("From")}
                                    </Form.Label>
                                    <Form.Control
                                        onChange={handleDateChange}
                                        value={date.from}
                                        id="from"
                                        size="sm"
                                        type="date"
                                        placeholder=""
                                        min={minDate || date.from}
                                        max={today}
                                    />
                                </Form.Group>
                            </Col>

                            <Col sm={4}>
                                <Form.Group className="mb-3" >
                                    <Form.Label className="ms-2" column="sm">
                                        {t("To")}
                                    </Form.Label>
                                    <Form.Control
                                        onChange={handleDateChange}
                                        value={date.to}
                                        id="to"
                                        size="sm"
                                        type="date"
                                        placeholder=""
                                        min={date.from || minDate}
                                        max={today}
                                    />
                                </Form.Group>
                            </Col>

                            <Col sm={4}>
                                <ButtonGroup>
                                    <Button
                                        disabled={
                                            (date.to === undefined && date.from === undefined) ||
                                            date.to < minDate ||
                                            date.to > today ||
                                            date.from < minDate ||
                                            date.from > today ||
                                            date.to < date.from
                                        }
                                        size="sm"
                                        variant="success button"
                                        className="mb-3 px-2"
                                        onClick={() => { setUseFilter(true) }}
                                    >
                                        <span className="d-none d-md-none d-lg-inline-block">
                                            Search
                                        </span>
                                        <FontAwesomeIcon icon={faSearch} className="icon ms-1" />
                                    </Button>
                                    <Button
                                        disabled={!useFilter}
                                        size="sm"
                                        variant="success button right"
                                        className="mb-3 px-2"
                                        onClick={() => { setUseFilter(false); setDate({}); setPage(0); cancelCourse() }}
                                    >
                                        <FontAwesomeIcon icon={faTimesCircle} className="icon ms-1" />
                                    </Button>
                                </ButtonGroup>
                            </Col>

                        </Row>
                    </form>
                    </Col>
                    <Col sm="4">
                        <Form.Group className="mt-2">
                            <Form.Label className="ms-2" column="sm">
                                {t("Movs per page")}
                            </Form.Label>
                            <Col sm="auto">
                                <Form.Control
                                    onChange={handleChange}
                                    onBlur={() => {
                                        setPage(0)
                                        if (movsShownWanted === '' || movsShownWanted < 1) {
                                            setMovsShown(15)
                                        } else {
                                            setMovsShown(movsShownWanted)
                                        }
                                    }}
                                    size="sm"
                                    type="number"
                                    placeholder="15"
                                    value={movsShownWanted}
                                />
                            </Col>
                        </Form.Group>
                    </Col>
                </Row>
            </Container>

            {/*Movements */}
            <div className="p-0 mb-2">
                <div className="d-flex align-items-start justify-content-center flex-column movementsTableContainer">
                    {
                        fetchingMovements ?
                            <Loading />
                            :
                            movements.length>0 ?
                            <TableLastMovements
                                movementsCount={account.movementsCount}
                                IsMobile={IsMobile}
                                content={movements}
                                decimals={account.decimals}
                                symbol={account.currency.symbol}
                                movsShown={movsShown}
                                page={page}
                                setPage={setPage} />
                            :
                            <NoMovements />

                    }
                    <MovementsPagination
                        useFilter={useFilter}
                        movementsCount={account.movementsCount}
                        IsMobile={IsMobile}
                        movsShown={movsShown}
                        page={page}
                        setPage={setPage}
                    />
                </div>
            </div>
        </>
    )
}
export default MovementsTab

