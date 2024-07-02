import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container, Collapse, Spinner, Button } from 'react-bootstrap';
import Movement from './Movement';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';
import MoreAndLess from '../../MoreAndLess';
import FilterOptionsMobile from '../../FilterOptionsMobile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const TableLastMovements = ({ Fund }) => {
    const { t } = useTranslation();
    const { token, ClientSelected, toLogin } = useContext(DashBoardContext);

    const [open, setOpen] = useState(false);
    const [movements, setMovements] = useState({ transactions: [], total: 0 })
    const [fetchingMovements, setFetchingMovements] = useState(true)

    const [show, setShow] = useState(false);

    const [Options, setOptions] = useState({
        skip: 0,//Offset (in quantity of movements)
        take: 5,//Movements per page
        state: null
    })

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    useEffect(() => {
        const getMovements = async () => {
            setFetchingMovements(true)
            var url = `${process.env.REACT_APP_APIURL}/transactions/?` + new URLSearchParams({
                client: ClientSelected.id,
                filterFund: Fund.fundId,
                take: Options.take,
                skip: Options.skip,
                filterState: Options.state
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
                setMovements(data ? { ...data } : { ...{ transactions: [], total: 0 } })
                if (data.transactions.length > 0 && !open) {
                    setOpen(true)
                }
            } else {
                switch (response.status) {
                    default:
                        console.error(response.status)
                        toLogin()
                }
            }
            setFetchingMovements(false)
        }
        getMovements()
        // eslint-disable-next-line 
    }, [Fund, Options])

    return (
        <Col md="12" className="p-0 mt-2">
            {fetchingMovements && (movements.transactions.length === 0 || movements === null) ?
                <h2 className='my-2 p-0'>{t("Loading transactions")}</h2>
                :
                <div>
                    <Container fluid className="p-0"
                        onClick={() => setOpen(!open)}
                        aria-expanded={open}>
                        <Row className="d-flex justify-content-end">
                            <Col className={fetchingMovements ? "d-flex justify-content-between align-items-center" : ""}>
                                <h2 className={`my-2 toggler-mobile ${!!(fetchingMovements) ? "loading" : ""} ${open ? "toggled" : ""}`}>{t("Last transactions")}</h2>
                                {!!(fetchingMovements) && <Spinner className="ms-2" animation="border" size="sm" />}
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
                                movements.transactions.length === 0 || movements === null ?
                                    <h2 className="text-center">{t("There are no records in the selected state")}</h2> :
                                    <>
                                        {
                                            movements.transactions.map((u, i) => <Movement key={i} content={u} fundName={Fund.fund.name} />)
                                        }
                                    </>
                            }
                            <MoreAndLess InScreen={Options.take} total={movements.total} setOptions={setOptions} />
                        </div>
                    </Collapse>
                    <FilterOptionsMobile show={show} handleClose={handleClose} setOptions={setOptions} />
                </div>
            }
        </Col>
    )
}
export default TableLastMovements
