import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container, Collapse, Button, Spinner } from 'react-bootstrap';
import Movement from './Movement';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';
import FilterOptionsMobile from '../../FilterOptionsMobile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import MoreAndLess from '../../MoreAndLess';

const TableLastMovements = ({ account }) => {

    const { token, toLogin, ClientSelected } = useContext(DashBoardContext);
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const [movements, setMovements] = useState({ movements: [], total: 0 })
    const [fetchingMovements, setFetchingMovements] = useState(true)

    const [show, setShow] = useState(false);

    const [Options, setOptions] = useState({
        skip: 0,//Offset (in quantity of movements)
        take: 5,//Movements per page
        state: null
    })

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getMovements = async () => {
        var url = `${process.env.REACT_APP_APIURL}/movements/?` + new URLSearchParams(
            Object.fromEntries(Object.entries(
                {
                    accountId: account.id,
                    client: ClientSelected.id,
                    filterAccount: account.id,
                    take: Options.take,
                    skip: Options.skip,
                    filterState: Options.state
                }
            ).filter(([_, v]) => v != null))
        );

        setFetchingMovements(true)
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
            setMovements(data ? { ...data } : { ...{ movements: [], total: 0 } })
            if (data && data.movements.length > 0 && !open) {
                setOpen(true)
            }
            setFetchingMovements(false)
        } else {
            switch (response.status) {
                default:
                    console.error("Error ", response.status, " account movements")
                    toLogin()
            }
        }
    }

    useEffect(() => {
        getMovements()
        // eslint-disable-next-line 
    }, [account, Options])

    return (
        <Col md="12" className="p-0 mt-2">
            {fetchingMovements && (movements.movements.length === 0 || movements === null) ?
                <h2 className='my-2 p-0'>{t("Loading movements")}</h2> :
                <div>
                    <Container fluid className="p-0"
                        onClick={() => setOpen(!open)}
                        aria-expanded={open}>
                        <Row className="d-flex justify-content-end">
                            <Col className={fetchingMovements ? "d-flex justify-content-between align-items-center" : ""}>
                                <h2 className={`my-2 toggler-mobile ${!!(fetchingMovements) ? "loading" : ""} ${open ? "toggled" : ""}`}>{t("Last movements")}</h2>
                                {!!(fetchingMovements) && <Spinner className="ms-2" animation="border" size="sm" />}
                            </Col>
                        </Row>
                    </Container>
                    <Collapse in={open}>
                        <div className="movementsTable mb-3">
                            <div className='py-1 d-flex justify-content-end'>
                                <Button className="ms-1 buttonFilter" variant="danger" onClick={() => handleShow()}>
                                    <FontAwesomeIcon icon={faFilter} />
                                </Button>
                            </div>
                            {
                                movements.movements.length === 0 || movements === null ?
                                    <h2 className="text-center">{t("There are no records in the selected state")}</h2>
                                    :
                                    <>
                                        {
                                            movements.movements.map((u, i) => <Movement key={i} content={u} reloadData={getMovements} />)
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
