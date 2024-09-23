import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container, Collapse, Button, Spinner } from 'react-bootstrap';
import Movement from './Movement';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';
import FilterOptionsMobile from '../../FilterOptionsMobile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPrint } from '@fortawesome/free-solid-svg-icons';
import MoreAndLess from '../../MoreAndLess';
import MovementTable from 'TableExport/MovementTable';
import ReactPDF from '@react-pdf/renderer';

const TableLastMovements = ({ account }) => {

    const { token, toLogin, ClientSelected, getMoveStateById } = useContext(DashBoardContext);
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);
    const [movements, setMovements] = useState({ movements: [], total: 0 })
    const [fetchingMovements, setFetchingMovements] = useState(true)

    const [show, setShow] = useState(false);

    const [Options, setOptions] = useState({
        skip: 0,//Offset (in quantity of movements)
        take: 100,//Movements per page
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
    const [rendering, setRendering] = useState(false)

    const renderAndDownloadTablePDF = async (e) => {
        e.stopPropagation()
        setRendering(true)
        const blob = await ReactPDF.pdf(
            <MovementTable
                movements={movements.movements}
                headerInfo={{
                    clientName:
                        `${ClientSelected?.firstName === undefined ? "" : ClientSelected?.firstName === "-" ? "" : ClientSelected?.firstName
                        }${ClientSelected?.lastName === undefined ? "" : ClientSelected?.lastName === "-" ? "" : ` ${ClientSelected?.lastName}`
                        }`,
                    balance: account.balance
                }} getMoveStateById={getMoveStateById} />).toBlob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${t("Cash_movements")}.pdf`)
        // 3. Append to html page
        document.body.appendChild(link)
        // 4. Force download
        link.click()
        // 5. Clean up and remove the link
        link.parentNode.removeChild(link)
        setRendering(false)
    }

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
                                <h2 className={`my-2 toggler-mobile ${!!(fetchingMovements) ? "loading" : ""} ${open ? "toggled" : ""} flex-grow-1`}>
                                    {t("Last movements")}
                                    <Button className="ms-auto me-2 buttonFilter no-style" variant="info" onClick={renderAndDownloadTablePDF} size='sm'>
                                        {
                                            rendering ?
                                                <Spinner animation="border" size="sm" />
                                                :
                                                <FontAwesomeIcon icon={faPrint} />
                                        }
                                    </Button>
                                    <Button className="buttonFilter no-style me-1" variant="info" onClick={(e) => { handleShow(); e.stopPropagation() }}>
                                        <FontAwesomeIcon icon={faFilter} />
                                    </Button>
                                </h2>
                                {!!(fetchingMovements) && <Spinner style={{ marginLeft: ".35em" }} animation="border" size="sm" />}
                            </Col>
                        </Row>
                    </Container>
                    <Collapse in={open}>
                        <div className="movementsTable mb-3">
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
