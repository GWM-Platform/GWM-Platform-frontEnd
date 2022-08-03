import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container, Collapse, Spinner, Button } from 'react-bootstrap';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';
import MoreAndLess from '../../MoreAndLess';
import FilterOptionsMobile from '../../FilterOptionsMobile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import FixedDeposit from './FixedDeposit';

const TableLastFixedDeposits = () => {
    const { t } = useTranslation();
    const { ClientSelected, toLogin } = useContext(DashBoardContext);

    const [open, setOpen] = useState(false);
    const [FixedDeposits, setFixedDeposits] = useState({ fetching: true, fetched: false, valid: false, content: { deposits: [], total: 0 } })

    const [show, setShow] = useState(false);

    const [Options, setOptions] = useState({
        skip: 0,//Offset (in quantity of movements)
        take: 5,//Movements per page
        state: null
    })

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const getFixedDeposits = () => {
            setFixedDeposits((prevState) => ({ ...prevState, fetching: true, fetched: false }))
            axios.get(`/fixed-deposits`, {
                params: {
                    client: ClientSelected.id,
                    take: Options.take,
                    skip: Options.skip,
                    filterState: Options.state
                }
            }
            ).then(function (response) {
                if (response.status < 300 && response.status >= 200) {
                    setFixedDeposits((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, content: response?.data || {} } }))
                } else {
                    switch (response.status) {
                        case 401:
                            toLogin();
                            break;
                        default:
                            setFixedDeposits((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
                            break
                    }
                }
            }).catch((err) => {
                if (err.message !== "canceled") {
                    setFixedDeposits((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
                }
            });
        }


        getFixedDeposits()
        // eslint-disable-next-line 
    }, [Options])

    return (
        <Col md="12" className="p-0 mt-2">
            {FixedDeposits.fetching && (FixedDeposits.content.length === 0 || FixedDeposits.content.deposits === null) ?
                <h2 className='my-2 p-0'>{t("Loading fixed deposits")}</h2> :

                <div>
                    <Container fluid className="p-0"
                        onClick={() => setOpen(!open)}
                        aria-expanded={open}>
                        <Row className="d-flex justify-content-end">
                            <Col className={FixedDeposits.fetching ? "d-flex justify-content-between align-items-center" : ""}>
                                <h2 className={`my-2 toggler-mobile ${!!(FixedDeposits.fetching) ? "loading" : ""} ${open ? "toggled" : ""}`}>{t("Time deposits")}</h2>
                                {!!(FixedDeposits.fetching) && <Spinner className="ms-2" animation="border" size="sm" />}
                            </Col>
                        </Row>
                    </Container>
                    <Collapse in={open}>
                        <div className="movementsTable mb-3">
                            <div className='py-1 d-flex justify-content-end'>
                                <Button className="buttonFilter" variant="danger" onClick={() => handleShow()}>
                                    <FontAwesomeIcon icon={faFilter} />
                                </Button>
                            </div>
                            {
                                FixedDeposits.content.deposits.length === 0 || FixedDeposits.content.deposits === null ?
                                    <h2 className="text-center">{t("There are no records in the selected state")}</h2> :
                                    <>
                                        {
                                            FixedDeposits.content.deposits.map((FixedTermInfo, key) => <FixedDeposit key={key} content={FixedTermInfo} />)
                                        }
                                    </>
                            }
                            <MoreAndLess InScreen={Options.take} total={FixedDeposits.content.total} setOptions={setOptions} />
                        </div>
                    </Collapse>
                    <FilterOptionsMobile show={show} handleClose={handleClose} setOptions={setOptions} />
                </div>
            }
        </Col>
    )
}
export default TableLastFixedDeposits
