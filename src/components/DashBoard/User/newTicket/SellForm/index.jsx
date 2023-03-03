import React, { useState, useEffect, useContext } from 'react'
import { useHistory, useLocation } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';

import { DashBoardContext } from 'context/DashBoardContext';
import { Container, Row, Col, Accordion } from 'react-bootstrap'
import FundSelector from './FundSelector'
import SellData from './SellData'
import Loading from '../Loading';
import ActionConfirmationModal from './ActionConfirmationModal';
import NoSellFunds from '../NoSellFunds';
import ReactGA from "react-ga4";
import axios from 'axios';

const SellForm = ({ balanceChanged }) => {
    const { toLogin, token, ClientSelected, contentReady, Accounts } = useContext(DashBoardContext);

    useEffect(() => {
        ReactGA.event({
            category: "acceso_seccion_generacion_tickets",
            action: "acceso_seccion_generacion_ticket_venta_cuotapartes",
            label: "Acceso a la seccion Generación De Venta de Cuotapartes",
        })
    }, [])

    function useQuery() {
        const { search } = useLocation();
        return React.useMemo(() => new URLSearchParams(search), [search]);
    }

    //If the user came from an specific fund, we use the query to auto select that one
    let fundId = parseInt(useQuery().get("fund"))

    const [data, setData] = useState({ shares: "", FundSelected: -1 })
    const [ShowModal, setShowModal] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [some, setSome] = useState(false)
    const [Funds, setFunds] = useState([])
    const [validated, setValidated] = useState(true);
    const [CollapsedFields, setCollapsedFields] = useState(true);
    const [FetchingFunds, setFetchingFunds] = useState(true)

    let history = useHistory();

    const sell = () => {
        if (!fetching) {
            setFetching(true)
            axios.post(`/funds/${Funds[data.FundSelected].fundId}/sell`, {
                shares: parseFloat(data.shares)
            }, {
                params: {
                    client: ClientSelected.id,
                }
            }).then(function (response) {
                ReactGA.event({
                    category: "generacion_ticket",
                    action: "generacion_ticket_venta_de_cuotapartes",
                    label: `Venta de ${data.shares} cuotapartes del fondo ${Funds[data.FundSelected]?.fund?.name}.`,
                    value: parseFloat(data.shares),
                    dimension1: `Fondo ${Funds[data.FundSelected]?.fund?.name}`
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
                    const fundSelected = dataFetched.findIndex(fund => fund.fundId === fundId)
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
            setShowModal(true)
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
            <Container className="h-100">
                <Row className="newTicket h-100 growAnimation">
                    {
                        FetchingFunds || !contentReady ?
                            <Loading />
                            :
                            Funds.length > 0 ?
                                <Col xs="12">
                                    <Accordion flush defaultActiveKey="0">
                                        <FundSelector openAccordion={openAccordion}
                                            Funds={Funds} data={data} some={some} setData={setData} setSome={setSome} />
                                    </Accordion>
                                    <Accordion flush activeKey={CollapsedFields ? "-1" : "0"}>
                                        <SellData fetching={fetching} toggleAccordion={toggleAccordion} handleSubmit={handleSubmit} validated={validated}
                                            handleChange={handleChange} Funds={Funds} data={data} setData={setData} />
                                    </Accordion>
                                </Col>
                                :
                                <NoSellFunds />
                    }
                </Row>
                {
                    !!(data.FundSelected !== -1 && contentReady) &&
                    <ActionConfirmationModal fetching={fetching} setShowModal={setShowModal} show={ShowModal} action={sell} data={data} Funds={Funds} Balance={Accounts[0]?.balance} />

                }
            </Container>
        </div>
    )
}
export default SellForm