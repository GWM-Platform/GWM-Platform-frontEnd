import React, { useState, useEffect, useContext } from 'react'
import { useHistory, useLocation } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../operationsForm.css'

import { Container, Row, Col, Accordion } from 'react-bootstrap'
import FundSelector from './FundSelector'
import BuyData from './BuyData'
import Loading from '../Loading';
import { DashBoardContext } from 'context/DashBoardContext';
import ActionConfirmationModal from './ActionConfirmationModal';
import NoBuyFunds from '../NoBuyFunds';
import ReactGA from "react-ga4";
import axios from 'axios';

const BuyForm = ({ NavInfoToggled, balanceChanged }) => {

    useEffect(() => {
        ReactGA.event({
            category: "acceso_seccion_generacion_tickets",
            action: "acceso_seccion_generacion_ticket_compra_cuotapartes",
            label: "Acceso a la seccion Generación De Compra de Cuotapartes",
        })
    }, [])

    const { token, ClientSelected, contentReady, Accounts, hasBuyPermission, toLogin } = useContext(DashBoardContext);

    function useQuery() {
        const { search } = useLocation();

        return React.useMemo(() => new URLSearchParams(search), [search]);
    }

    //If the user came from an specific fund, we use the query to auto select that one
    let fundId = parseInt(useQuery().get("fund"))

    const [data, setData] = useState({
        amount: "",
        FundSelected: -1,
        FundSelectedId: -1,
    })
    const [ShowModal, setShowModal] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [some, setSome] = useState(false)
    const [Funds, setFunds] = useState([])
    const [validated, setValidated] = useState(true);
    const [CollapsedFields, setCollapsedFields] = useState(true);
    const [FetchingFunds, setFetchingFunds] = useState(true)

    let history = useHistory();

    const buy = () => {
        if (!fetching) {
            setFetching(true)
            axios.post(`/funds/${data.FundSelectedId}/buy`,
                {
                    amount: parseFloat(data.amount)
                },
                {
                    params: {
                        client: ClientSelected.id,
                    }
                }
            ).then(function (response) {
                ReactGA.event({
                    category: "generacion_ticket",
                    action: "generacion_ticket_compra_de_cuotapartes",
                    label: `Compra de $${data.amount} en cuotapartes del fondo ${Funds[data.FundSelected].name}.`,
                    value: parseFloat(data.amount),
                    dimension1: `Fondo ${Funds[data.FundSelected].name}`
                })
                balanceChanged()
                history.push(`/DashBoard/operationResult`);
            }).catch((err) => {
                console.log(err)
                if (err?.message !== "canceled") {
                    switch (err?.response?.status) {
                        case 401:
                            toLogin();
                            break;
                        default:
                            history.push(`/DashBoard/operationResult?result=failed`);
                            break
                    }
                }
            });
        }
    }

    useEffect(() => {
        const getFunds = async () => {
            var url = `${process.env.REACT_APP_APIURL}/funds`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: "*/*",
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                const dataFetched = await response.json()
                if (fundId) {
                    const fundSelected = dataFetched.findIndex(fund => fund.id === fundId && fund.freeShares > 0)
                    if (fundSelected >= 0) {
                        openAccordion()
                        setData({ ...data, ...{ FundSelected: fundSelected } })
                    }
                }
                setFunds(dataFetched)
                setFetchingFunds(false)
            } else {
                switch (response.status) {
                    case 500:
                        console.error("Error. Verify the entered data")
                        break;
                    default:
                        console.error(response.status)
                }
            }
        }

        setCollapsedFields(true)
        getFunds()

        let aux = data
        aux.FundSelected = -1
        setData(aux)
        return () => {
        }
        // eslint-disable-next-line
    }, [ClientSelected])

    const handleChange = (event) => {
        let aux = data;
        aux[event.target.id] = event.target.value;
        setData(aux);
        setSome(!some)
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() === true && !fetching) {
            if (token === null) {
                console.log("compra")
            } else {
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

    return (
        <div className="tabContent">
            <div className={`d-flex flex-column h-100`}>
                <Container className="h-100" >
                    <Row className="newTicket h-100 growAnimation">
                        {
                            FetchingFunds || !contentReady ?
                                <Loading />
                                :
                                Funds?.length > 0 && Funds?.filter(Fund => hasBuyPermission(Fund.id))?.length > 0 ?
                                    <Col xs="12">
                                        <Accordion flush defaultActiveKey="0">
                                            <FundSelector openAccordion={openAccordion} Account={Accounts[0]}
                                                Funds={Funds} data={data} setData={setData} />
                                        </Accordion>
                                        <Accordion flush activeKey={CollapsedFields ? "-1" : "0"}>
                                            <BuyData
                                                handleSubmit={handleSubmit} validated={validated}
                                                handleChange={handleChange} Funds={Funds} data={data}
                                                toggleAccordion={toggleAccordion} Balance={Accounts[0].balance} fetching={fetching} />
                                        </Accordion>
                                    </Col>
                                    :
                                    <NoBuyFunds />
                        }
                    </Row>
                </Container>
                {
                    !!(data.FundSelected !== -1 && contentReady) &&
                    <ActionConfirmationModal fetching={fetching} setShowModal={setShowModal} show={ShowModal} action={buy} data={data} Funds={Funds} Balance={Accounts[0].balance} />
                }
            </div>
        </div>

    )
}
export default BuyForm