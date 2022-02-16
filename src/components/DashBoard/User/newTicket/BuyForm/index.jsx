import React, { useState, useEffect, useContext } from 'react'
import { useHistory, useLocation } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../operationsForm.css'

import { Container, Row, Col, Accordion } from 'react-bootstrap'
import FundSelector from './FundSelector'
import BuyData from './BuyData'
import Loading from '../Loading';
import NoFunds from '../NoFunds';
import { dashboardContext } from '../../../../../context/dashboardContext';
//import SourceAccount from './SourceAccount';

const BuyForm = ({ NavInfoToggled, balanceChanged }) => {

    const { token, ClientSelected,contentReady } = useContext(dashboardContext);

    function useQuery() {
        const { search } = useLocation();

        return React.useMemo(() => new URLSearchParams(search), [search]);
    }

    //If the user came from an specific fund, we use the query to auto select that one
    let fundId = parseInt(useQuery().get("fund"))

    const [data, setData] = useState({ amount: "", FundSelected: -1 })
    const [some, setSome] = useState(false)
    const [Funds, setFunds] = useState([])
    const [validated, setValidated] = useState(true);
    const [CollapsedFields, setCollapsedFields] = useState(true);
    const [Account, setAccount] = useState(0);
    const [FetchingFunds, setFetchingFunds] = useState(true)

    let history = useHistory();


    const buy = async () => {
        var url = `${process.env.REACT_APP_APIURL}/funds/${Funds[data.FundSelected].id}/buy/?` + new URLSearchParams({
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
            history.push(`/dashboard/operationResult`);
        } else {
            switch (response.status) {
                case 500:
                    console.error(response.status)
                    break
                default:
                    console.error(response.status)
            }
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
                    console.log(fundSelected > 0, fundSelected)
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

        const getAccount = async () => {
            var url = `${process.env.REACT_APP_APIURL}/accounts/?` + new URLSearchParams({
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
                const data = await response.json()
                setAccount(data[0])
                if (data.length > 0) sessionStorage.setItem('balance', data[0].balance)
            } else {
                switch (response.status) {
                    case 500:
                        console.error("Error ", response.status, " obteniendo stakes")
                        break;
                    default:
                        console.error("Error ", response.status, " obteniendo stakes")
                }
            }
        }

        setCollapsedFields(true)
        getAccount()
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
        if (form.checkValidity() === true) {
            if (token === null) {
                console.log("compra")
            } else {
                buy()
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
        <Container className={NavInfoToggled ? "free-area-withoutNavInfo" : "free-area"}>
            <Row className="newTicket h-100 growAnimation">
                {
                    FetchingFunds || !contentReady ?
                        <Loading />
                        :
                        Funds.length > 0 ?
                            <Col xs="12">
                                {/*<SourceAccount Account={Account}/>*/}
                                <Accordion flush defaultActiveKey="0">
                                    <FundSelector openAccordion={openAccordion} Account={Account}
                                        Funds={Funds} data={data} setData={setData} />
                                </Accordion>
                                <Accordion flush activeKey={CollapsedFields ? "-1" : "0"}>
                                    <BuyData
                                        handleSubmit={handleSubmit} validated={validated}
                                        handleChange={handleChange} Funds={Funds} data={data}
                                        toggleAccordion={toggleAccordion} Balance={Account.balance} />
                                </Accordion>
                            </Col>
                            :
                            <NoFunds />
                }
            </Row>
        </Container>
    )
}
export default BuyForm