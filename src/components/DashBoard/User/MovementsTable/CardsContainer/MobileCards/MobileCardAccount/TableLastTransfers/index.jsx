import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container, Collapse, Spinner, Button } from 'react-bootstrap';
import Transfer from './Transfer';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';
import MoreAndLess from '../../MoreAndLess';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import FilterOptionsMobile from '../../FilterOptionsMobile';
import { customFetch } from 'utils/customFetch';

const TableLastTransfers = ({ account }) => {

    const { t } = useTranslation();
    const { token, toLogin, ClientSelected } = useContext(DashBoardContext);

    const [open, setOpen] = useState(false);
    const [transfers, setTransfers] = useState({ transfers: [], total: 0 })
    const [fetchingTransfers, setFetchingTransfers] = useState(true)

    const [show, setShow] = useState(false);

    const [Options, setOptions] = useState({
        skip: 0,//Offset (in quantity of movements)
        take: 5,//Movements per page
        state: null
    })

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const getTransfers = async () => {
        var url = `${process.env.REACT_APP_APIURL}/transfers/?` + new URLSearchParams(
            Object.fromEntries(Object.entries(
                {
                    client: ClientSelected.id,
                    filterAccount: account.id,
                    take: Options.take,
                    skip: Options.skip,
                    filterState: Options.state
                }
            ).filter(([_, v]) => v != null))
        );
        setFetchingTransfers(true)
        const response = await customFetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 200) {
            const data = await response.json()
            setTransfers(data ? { ...data } : { ...{ transfers: [], total: 0 } })
            setFetchingTransfers(false)
        } else {
            switch (response.status) {
                default:
                    console.error("Error ", response.status, " account Transfers")
                    toLogin()
            }
        }
    }

    useEffect(() => {
        const getTransfers = async () => {
            var url = `${process.env.REACT_APP_APIURL}/transfers/?` + new URLSearchParams(
                Object.fromEntries(Object.entries(
                    {
                        client: ClientSelected.id,
                        filterAccount: account.id,
                        take: Options.take,
                        skip: Options.skip,
                        filterState: Options.state
                    }
                ).filter(([_, v]) => v != null))
            );
            setFetchingTransfers(true)
            const response = await customFetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                const data = await response.json()
                setTransfers(data ? { ...data } : { ...{ transfers: [], total: 0 } })
                setFetchingTransfers(false)
            } else {
                switch (response.status) {
                    default:
                        console.error("Error ", response.status, " account Transfers")
                        toLogin()
                }
            }
        }

        getTransfers()
        // eslint-disable-next-line 
    }, [account, Options])

    return (
        <Col md="12" className="p-0 mt-0">
            {fetchingTransfers && (transfers.transfers.length === 0 || transfers === null) ?
                <h2 className='my-2 p-0'>{t("Loading transfers")}</h2> :
                <div>
                    <Container fluid className="p-0"
                        onClick={() => setOpen(!open)}
                        aria-expanded={open}>
                        <Row className="d-flex justify-content-end">

                            <Col className={fetchingTransfers ? "d-flex justify-content-between align-items-center" : ""}>
                                <h2 className={`my-2 toggler-mobile ${!!(fetchingTransfers) ? "loading" : ""} ${open ? "toggled" : ""} flex-grow-1`}>
                                    {t("Last transfers")}

                                    <Button className="buttonFilter no-style me-1 ms-auto" variant="info" onClick={(e) => { handleShow(); e.stopPropagation() }}>
                                        <FontAwesomeIcon icon={faFilter} />
                                    </Button>
                                </h2>
                                {!!(fetchingTransfers) && <Spinner style={{ marginLeft: ".35em" }} animation="border" size="sm" />}
                            </Col>
                        </Row>
                    </Container>
                    <Collapse in={open}>
                        <div className="movementsTable mb-3">
                            {
                                transfers.transfers.length === 0 || transfers === null ?
                                    <h2 className="text-center">{t("There are no records in the selected state")}</h2>
                                    :
                                    <>{
                                        transfers.transfers.map((u, i) => <Transfer getTransfers={getTransfers} key={i} content={u} />)}
                                    </>
                            }
                            <MoreAndLess InScreen={Options.take} total={transfers.total} setOptions={setOptions} />
                        </div>
                    </Collapse>
                    <FilterOptionsMobile show={show} handleClose={handleClose} setOptions={setOptions} />
                </div>
            }
        </Col>
    )
}
export default TableLastTransfers
