import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Col, Row, Container, Collapse, Spinner, Button } from 'react-bootstrap';
import Movement from './Movement';
import { useTranslation } from "react-i18next";
import { DashBoardContext } from 'context/DashBoardContext';
import MoreAndLess from '../../MoreAndLess';
import FilterOptionsMobile from '../../FilterOptionsMobile';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter, faPrint } from '@fortawesome/free-solid-svg-icons';
import TransactionTable from 'TableExport/TransactionTable';
import ReactPDF from '@react-pdf/renderer';
import axios from 'axios'

const TableLastMovements = ({ Fund }) => {
    const { t } = useTranslation();
    const { token, ClientSelected, toLogin, PendingTransactions, AccountSelected, sharesDecimalPlaces } = useContext(DashBoardContext);

    const pendingshares = PendingTransactions.value.filter((transaction) => transaction.fundId === Fund.fund.id && Math.sign(transaction.shares) === +1).map((transaction) => transaction.shares).reduce((a, b) => a + b, 0).toFixed(2)

    const [open, setOpen] = useState(false);
    const [movements, setMovements] = useState({ transactions: [], total: 0 })
    const [fetchingMovements, setFetchingMovements] = useState(true)

    const [show, setShow] = useState(false);

    const [Options, setOptions] = useState({
        skip: 0,//Offset (in quantity of movements)
        take: 100,//Movements per page
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

    const [rendering, setRendering] = useState(false)
    const balanceInCash = Fund.shares ? (Fund.shares * Fund.fund.sharePrice) : 0
    const [performance, setPerformance] = useState(0)
    useEffect(() => {
           axios.get(`/clients/${ClientSelected.id}/fundPerformance?fund=${Fund.fund.id}`)
               .then(response => {
                   setPerformance(response.data)
               })
               .catch(err => {
                   setPerformance(0)
               })
       }, [ClientSelected.id, Fund.fund.id])

    const renderAndDownloadTablePDF = async () => {
        setRendering(true)
        const blob = await ReactPDF.pdf(
            <TransactionTable
                transactions={movements.transactions}
                headerInfo={{
                    fundName: Fund.fund.name,
                    balance: Fund.shares ? Fund.shares : 0,
                    sharePrice: Fund.fund.sharePrice,
                    balanceInCash: balanceInCash.toFixed(2),
                    pendingshares: pendingshares ? pendingshares : 0,
                    performance: performance,
                    clientName:
                        `${ClientSelected?.firstName === undefined ? "" : ClientSelected?.firstName === "-" ? "" : ClientSelected?.firstName
                        }${ClientSelected?.lastName === undefined ? "" : ClientSelected?.lastName === "-" ? "" : ` ${ClientSelected?.lastName}`
                        }`,
                }}
                sharesDecimalPlaces={sharesDecimalPlaces}
                AccountSelected={AccountSelected}
            />).toBlob()
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${t("Fund {{fund}} movements", { fund: Fund.fund.name })}.pdf`)
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
                                <Button className="ms-1 buttonFilter" variant="danger" onClick={renderAndDownloadTablePDF} size='sm'>
                                    {
                                        rendering ?
                                            <Spinner animation="border" size="sm" />
                                            :
                                            <FontAwesomeIcon icon={faPrint} />
                                    }
                                </Button>
                                <Button className="buttonFilter ms-1" variant="danger" onClick={() => handleShow()}>
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
