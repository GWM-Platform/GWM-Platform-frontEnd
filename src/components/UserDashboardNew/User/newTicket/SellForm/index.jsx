import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Container, Row, Col, Accordion } from 'react-bootstrap'
import FundSelector from './FundSelector'
import SellData from './SellData'
import { useHistory } from 'react-router-dom';
import Loading from '../Loading';
import NoFunds from '../NoFunds';

const SellForm = ({ NavInfoToggled }) => {
    //HardCoded data (here we should request Funds that have available feeParts to sell)
    const [data, setData] = useState({ shares: 0.01, FundSelected: -1 })
    const [some, setSome] = useState(false)
    const [Funds, setFunds] = useState([])
    const [validated, setValidated] = useState(true);
    const [CollapsedFields, setCollapsedFields] = useState(true);
    const [FetchingFunds, setFetchingFunds] = useState(true)

    const token = sessionStorage.getItem('access_token')

    let history = useHistory();


    const sell = async () => {
        var url = `${process.env.REACT_APP_APIURL}/funds/${Funds[data.FundSelected].fundId}/sell`;
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ shares:  parseFloat(data.shares) }),
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status === 201) {
            return (true)
        } else {
            switch (response.status) {
                case 500:
                    console.error(response.status)
                    return (false)
                default:
                    console.error(response.status)
                    return (false)
            }
        }
    }

    useEffect(() => {
        const getFunds = async () => {
            var url = `${process.env.REACT_APP_APIURL}/funds/stakes`;
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
                setFunds(data)
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
    }, [])

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
            let success = sell()
            if (success) {
                history.push(`/dashboardnew/operationResult`);
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
            <Row className="newTicket h-100">
                {
                    FetchingFunds ?
                        <Loading />
                        :
                        Funds.length > 0 ?
                            <Col xs="12">
                                <Accordion flush defaultActiveKey="0">
                                    <FundSelector openAccordion={openAccordion}
                                        Funds={Funds} data={data} some={some} setData={setData} setSome={setSome} />
                                </Accordion>
                                <Accordion flush activeKey={CollapsedFields ? "-1" : "0"}>
                                    <SellData toggleAccordion={toggleAccordion} handleSubmit={handleSubmit} validated={validated}
                                        handleChange={handleChange} Funds={Funds} data={data} />
                                </Accordion>
                            </Col>
                            :
                            <NoFunds />
                }
            </Row>
        </Container>
    )
}
export default SellForm