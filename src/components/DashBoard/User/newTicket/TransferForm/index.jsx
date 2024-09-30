import React, { useState, useContext, useEffect, useMemo } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import '../operationsForm.scss'

import { Container, Row, Col, Accordion, Form } from 'react-bootstrap'
import TargetAccountSelector from './TargetAccountSelector'
import TransferData from './TransferData'
import Loading from '../Loading';
import { DashBoardContext } from 'context/DashBoardContext';
import ActionConfirmationModal from './ActionConfirmationModal';
import { useHistory } from 'react-router-dom';
import ReactGA from "react-ga4";
import FundSelector from './FundSelector';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';
import enrichAccount from 'utils/enrichAccount';
import Decimal from 'decimal.js';

const TransferForm = ({ balanceChanged }) => {

    useEffect(() => {
        ReactGA.event({
            category: "Acceso a secciones para generar tickets",
            action: "Transferencias",
            label: "Transferencias",
        })
    }, [])

    const { token, contentReady, Accounts, AccountSelected, toLogin, ClientSelected, hasPermission } = useContext(DashBoardContext);
    const AccountSelectedEnriched = useMemo(() =>
        enrichAccount(AccountSelected), [AccountSelected])

    const history = useHistory()

    const [Funds, setFunds] = useState([])
    const [data, setData] = useState({
        alias: "",
        note: "",
        value: "",
        amount: "",
        usd_value: "",
        usd_amount: "",
        FundSelected: hasPermission("TRANSFER_GENERATE") ? 'cash' : ""
    })
    const share_transfer = useMemo(() => data.FundSelected !== "cash", [data.FundSelected])

    const [ShowModal, setShowModal] = useState(false)
    const [validated, setValidated] = useState(true);
    const [CollapsedFields, setCollapsedFields] = useState(true);

    const [TargetAccount, setTargetAccount] = useState({
        fetched: false,
        fetching: false,
        valid: false,
        content: {}
    })

    const [Transfer, setTransfer] = useState({ fetching: false, valid: false, fetched: false })
    const fund_selected = useMemo(() => share_transfer ? Funds?.find(fund => fund.fundId === data.FundSelected) : null, [Funds, data.FundSelected, share_transfer])

    const balance = Decimal((share_transfer ? fund_selected?.shares : AccountSelectedEnriched?.totalAvailable) || 0)
    const toTransfer = Decimal(data.amount || 0)
    const rest = Decimal(balance).minus(toTransfer)
    const restLowerThanMinStep = rest.lt(0.01)
    const transfer = async () => {
        setTransfer(prevState => ({ ...prevState, fetching: true }))
        var url = `${process.env.REACT_APP_APIURL}/${share_transfer ? "share-transfers" : "transfers"}`
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(
                {
                    ...share_transfer ?
                        {
                            shares: restLowerThanMinStep ? balance.toNumber() : data.amount,
                            fundId: data.FundSelected,
                            senderId: ClientSelected?.id,
                            receiverId: TargetAccount?.content?.clientId
                        }
                        :
                        {
                            amount: restLowerThanMinStep ? balance.toNumber() : data.amount,
                            senderId: AccountSelected?.id,
                            receiverId: TargetAccount?.content?.id
                        },
                    note: data.note
                }
            ),
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 201) {
            balanceChanged()
            history.push(`/DashBoard/operationResult`);
        } else {
            switch (response.status) {
                case 500:
                    history.push(`/DashBoard/operationResult?result=failed`);
                    break
                default:
                    history.push(`/DashBoard/operationResult?result=failed`);
                    break
            }
            setTransfer(prevState => ({ ...prevState, fetching: false, fetched: true, valid: false }))
        }
    }

    const handleChange = (event) => {
        let aux = data;
        aux[event.target.id] = event.target.value;
        setData(prevState => ({ ...prevState, ...aux }));
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity()) {
            if (token === null) {
                toLogin()
            } else if (TargetAccount?.content?.id && TargetAccount.fetched && TargetAccount.valid && !TargetAccount.fetching) {
                setShowModal(true)
            }
        }
        setValidated(true);
    }

    const toggleAccordion = () => {
        setCollapsedFields(!CollapsedFields)
    }
    const openAccordion = () => {
        setCollapsedFields(false)
    }
    const closeAccordion = () => {
        setCollapsedFields(true)
    }

    function useQuery() {
        const { search } = useLocation();
        return React.useMemo(() => new URLSearchParams(search), [search]);
    }

    //If the user came from an specific fund, we use the query to auto select that one
    let fundId = parseInt(useQuery().get("fund"))

    const [FetchingFunds, setFetchingFunds] = useState(true)

    useEffect(() => {
        const getFunds = async () => {
            var url = `${process.env.REACT_APP_APIURL}/stakes/?` + new URLSearchParams({
                client: ClientSelected.id,
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
                const dataFetched = await response.json()
                if (fundId) {
                    const FundSelected = dataFetched.findIndex(fund => fund.fundId === fundId)
                    if (FundSelected >= 0) {
                        openAccordion()
                        setData(prevSate => ({ ...prevSate, ...{ FundSelected: FundSelected } }))
                    } else {
                        openAccordion()
                        setData(prevSate => ({ ...prevSate, ...{ FundSelected: hasPermission("TRANSFER_GENERATE") ? 'cash' : "" } }))
                    }
                } else {
                    setData(prevSate => ({ ...prevSate, ...{ FundSelected: hasPermission("TRANSFER_GENERATE") ? 'cash' : "" } }))
                }
                setFunds(dataFetched)
                setFetchingFunds(false)
            } else {
                switch (response.status) {
                    case 500:
                        console.error("Error. Vefique los datos ingresados")
                        break;
                    default:
                        console.error(response.status)
                }
            }
        }

        getFunds()
        let aux = data
        aux.FundSelected = -1
        setData(aux)
        return () => {
        }
        // eslint-disable-next-line
    }, [ClientSelected])


    return (
        <div className="tabContent">
            <Form noValidate validated={validated} onSubmit={handleSubmit} className={`d-flex flex-column h-100`}>

                <Container className="h-100" >
                    <Row className="newTicket h-100 growAnimation">
                        {
                            (FetchingFunds || !contentReady || Accounts.length <= 0) ?
                                <Loading />
                                :
                                <Col xs="12">
                                    <Accordion flush defaultActiveKey="0">
                                        <FundSelector showPrice={false} openAccordion={openAccordion} Funds={Funds} data={data} setData={setData} showAccount />
                                    </Accordion>
                                    <Accordion flush defaultActiveKey="0">
                                        <TargetAccountSelector
                                            validated={validated} data={data} setData={setData} TargetAccount={TargetAccount} closeAccordion={closeAccordion}
                                            setTargetAccount={setTargetAccount} handleChange={handleChange} openAccordion={openAccordion} />
                                    </Accordion>
                                    <Accordion flush activeKey={CollapsedFields || TargetAccount.fetching || !TargetAccount.fetched || !TargetAccount.valid ? "-1" : "0"}>
                                        <TransferData
                                            Funds={Funds}
                                            TargetAccount={TargetAccount} handleChange={handleChange} data={data} toggleAccordion={toggleAccordion} Balance={AccountSelectedEnriched ? AccountSelectedEnriched.totalAvailable : 0} RealBalance={AccountSelectedEnriched ? AccountSelectedEnriched.balance : 0} />
                                    </Accordion>
                                </Col>
                        }
                    </Row>
                </Container>
                {
                    !!(contentReady && Accounts.length) >= 1 &&
                    <ActionConfirmationModal share_transfer={share_transfer} fund_selected={fund_selected} TargetAccount={TargetAccount} setShowModal={setShowModal} show={ShowModal} action={transfer} data={data} Balance={AccountSelectedEnriched.totalAvailable} Transfer={Transfer} />
                }
            </Form >
        </div >

    )
}
export default TransferForm