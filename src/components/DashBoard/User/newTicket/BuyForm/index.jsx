import React, { useState, useEffect, useContext } from 'react'
import { useHistory, useLocation } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../operationsForm.css'

import { Container, Row, Col, Accordion } from 'react-bootstrap'
import FundSelector from './FundSelector'
import BuyData from './BuyData'
import Loading from '../Loading';
import NoFunds from '../NoFunds';
import { DashBoardContext } from 'context/DashBoardContext';
import ActionConfirmationModal from './ActionConfirmationModal';

const BuyForm = ({ NavInfoToggled, balanceChanged }) => {

    const { token, ClientSelected, contentReady, Accounts } = useContext(DashBoardContext);

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

    const buy = async () => {
        if (!fetching) {
            setFetching(true)
            var url = `${process.env.REACT_APP_APIURL}/funds/${data.FundSelectedId}/buy/?` + new URLSearchParams({
                client: ClientSelected.id,
            });

            const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({ amount: parseFloat(data.amount) }),
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
                        console.error(response.status)
                        break
                    default:
                        history.push(`/DashBoard/operationResult?result=failed`);
                        console.error(response.status)
                }
            }
            setFetching(false)
        }
    }

    useEffect(() => {
        const getFunds = async () => {
            var url = `${process.env.REACT_APP_APIURL}/funds`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    Accept: "*/*",
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
                        console.error("Error. Vefique los datos ingresados")
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
                                Funds.length > 0 ?
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
                                    <NoFunds />
                        }
                    </Row>
                </Container>
                {
                    data.FundSelected !== -1 && contentReady ?
                        <ActionConfirmationModal fetching={fetching} setShowModal={setShowModal} show={ShowModal} action={buy} data={data} Funds={Funds} Balance={Accounts[0].balance} />
                        :
                        null
                }
            </div>
        </div>

    )
}
export default BuyForm