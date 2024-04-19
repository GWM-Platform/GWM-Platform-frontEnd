import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Accordion, Spinner, Container, Row, Col, Button } from 'react-bootstrap'
import FormattedNumber from 'components/DashBoard/GeneralUse/FormattedNumber';
import axios from "axios";
import { DashBoardContext } from 'context/DashBoardContext';
import { faCheckCircle, faEdit, faTimesCircle } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import OverdraftPopover from '../OverdraftPopover';
import PerformanceComponent from 'components/DashBoard/GeneralUse/PerformanceComponent';

const AccountGeneralData = ({ Account, Client, setAccounts }) => {
    const { t } = useTranslation();
    const { toLogin, DashboardToastDispatch } = useContext(DashBoardContext)

    const [balanceTotal, setBalanceTotal] = useState({ fetching: true, fetched: true, value: 0 })
    const [Request, setRequest] = useState({ fetching: false, fetched: false, valid: false })
    const [overdraft, setOverdraft] = useState({ amount: Account.overdraft ?? "" })

    useEffect(() => {
        const token = sessionStorage.getItem('access_token')

        const getBalance = async () => {
            setBalanceTotal((prevState) => ({ fetching: true, fetched: true, value: 0 }))
            var url = `${process.env.REACT_APP_APIURL}/clients/${Client.id}/balance`
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: "*/*",
                }
            })

            if (response.status === 200) {
                const dataFetched = await response.json()
                setBalanceTotal((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false, value: dataFetched } }))
            } else {
                switch (response.status) {
                    case 500:
                        setBalanceTotal((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                        break;
                    default:
                        setBalanceTotal((prevState) => ({ ...prevState, ...{ fetching: false, fetched: false } }))
                        console.error(response.status)
                }
            }
        }
        getBalance()

    }, [Client])

    const setOverdraftApi = () => {
        setRequest((prevState) => ({ ...prevState, fetching: true, fetched: false }))
        axios.patch(`/accounts/${Account.id}/overdraft`, { overdraftAmount: overdraft.amount },
        ).then(function (response) {
            DashboardToastDispatch({ type: "create", toastContent: { Icon: faCheckCircle, Title: "Overdraft successfully set" } })
            setRequest((prevState) => (
                {
                    fetching: false,
                    fetched: true,
                    valid: true,
                }))
            setAccounts(prevState => ({ ...prevState, content: prevState.content.map(account => account.id === Account.id ? { ...account, overdraft: overdraft.amount } : { ...account }) }))
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (err.response.status === "401") {
                    toLogin()
                } else {
                    DashboardToastDispatch({ type: "create", toastContent: { Icon: faTimesCircle, Title: "An error occurred while setting the overdraft" } })
                    setRequest((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
                }
            }
        });
    }


    const handleSubmit = (event, clientId) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() === true) {
            handleClosePopover()
            setOverdraftApi()
        }
    }

    const handleClosePopover = () => {
        document.body.click()
    };

    return (
        <Accordion.Item eventKey="0">
            <Accordion.Header>{t("Client general data")}</Accordion.Header>
            <Accordion.Body>
                <Container fluid className="px-0">
                    <Row className="mx-0 w-100">
                        <Col className="ps-0" xs="auto">
                            <h1 className="Info">{t("Owner alias")}: <span className='emphasis'>{Client.alias}</span></h1>
                            <h1 className="Info">{t("Owner first name")}: <span className='emphasis'>{Client.firstName}</span></h1>
                            <h1 className="Info">{t("Owner last name")}: <span className='emphasis'>{Client.lastName}</span></h1>
                        </Col>
                        <Col className="pe-0">
                            <h1 className="totalBalance">{t("Total balance")}:&nbsp;{
                                balanceTotal.fetching ?
                                    <Spinner animation="border" size="sm" />
                                    :
                                    <FormattedNumber className="emphasis" value={balanceTotal.value} prefix="U$D " fixedDecimals={2} />
                            }
                            </h1>
                            <PerformanceComponent textAlign="text-end" numberFw={"fw-bold"} text={"Total performance"} clientId={Client.id} />
                            <h1 className="Info text-end">{t("Cash balance")}: <FormattedNumber className="emphasis" value={Account.balance} prefix="U$D " fixedDecimals={2} /></h1>
                            {
                                !!(Account.overdraft) &&
                                <h1 className="Info text-end">
                                    {t("Overdraft")}: <FormattedNumber className="emphasis" value={Account.overdraft} prefix="U$D " fixedDecimals={2} />
                                    <OverdraftPopover handleSubmit={handleSubmit} setOverdraft={setOverdraft} overdraft={overdraft}>
                                        <Button size="sm" style={{ outline: "unset", border: "unset" }} variant="Link" className='mb-1'>
                                            {

                                                Request.fetching ?
                                                    <Spinner
                                                        as="span"
                                                        animation="border"
                                                        size="sm"
                                                        role="status"
                                                        aria-hidden="true"
                                                        style={{ display: "inline-block" }}
                                                    />
                                                    :
                                                    <FontAwesomeIcon icon={faEdit} />
                                            }
                                        </Button>
                                    </OverdraftPopover>
                                </h1>

                            }
                            {
                                !(Account.overdraft) &&
                                <div className='d-flex mt-3'>
                                    <OverdraftPopover handleSubmit={handleSubmit} setOverdraft={setOverdraft} overdraft={overdraft}>
                                        <Button size="sm" className='ms-auto'>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                disabled={Request.fetching}
                                                style={{ display: Request.fetching ? "inline-block" : "none" }}
                                            />{' '}
                                            {t("Add overdraft")}
                                        </Button>
                                    </OverdraftPopover>
                                </div>
                            }
                        </Col>
                    </Row>
                </Container>
            </Accordion.Body>
        </Accordion.Item >
    )
}

export default AccountGeneralData