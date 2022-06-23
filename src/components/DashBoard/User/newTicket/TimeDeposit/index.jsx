import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../operationsForm.css'

import { Container, Row, Col, Accordion, Form } from 'react-bootstrap'
import DurationData from './DurationData'
import InvestmentData from './InvestmentData'
import Loading from '../Loading';
import NoFunds from '../NoFunds';
import { DashBoardContext } from 'context/DashBoardContext';
import ActionConfirmationModal from './ActionConfirmationModal';
import moment from 'moment';
import InvestmentPreview from './InvestmentPreview';

const TimeDeposit = ({ NavInfoToggled, balanceChanged }) => {

    const { token, contentReady, Accounts } = useContext(DashBoardContext);


    //If the user came from an specific fund, we use the query to auto select that one

    const [data, setData] = useState({
        amount: "",
        days: "",
        until: ""
    })

    const [ShowModal, setShowModal] = useState(false)
    const [fetching, setFetching] = useState(false)
    const [validated, setValidated] = useState(true);
    const [CollapsedFields, setCollapsedFields] = useState(true);

    const [TimeDeposit] = useState({ fetching: false, fetched: true, content: { rules: [{ id: 1, days: 365, rate: 2 }, { id: 2, days: 730, rate: 4 }] } })

    let history = useHistory();

    const invest = async () => {
        if (!fetching) {
            setFetching(true)

            if (true) {
                setFetching(false)
                balanceChanged()
                history.push(`/DashBoard/operationResult`);
            }
        }
    }

    const handleChange = (event) =>
        setData(
            prevState => {
                let aux = { ...prevState }
                aux[event?.target?.id] = event?.target?.value
                switch (event.target.id) {
                    case "until":
                        aux.days = moment(event.target.value, "YYYY-MM-DD").diff(moment().startOf('day'), 'days');
                        break;
                    case "days":
                        aux.until = moment().add(event.target.value, 'days').format("YYYY-MM-DD")
                        break
                    default:
                }
                return { ...prevState, ...aux }
            }
        );


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

    return (
        <div className="tabContent">
            <div className={`d-flex flex-column h-100`}>
                <Container className="h-100" >
                    <Row className="newTicket h-100 growAnimation">
                        {
                            TimeDeposit.fetching || !contentReady ?
                                <Loading />
                                :
                                Object.keys(TimeDeposit.content).length > 0 ?
                                    <Col xs="12">
                                        <Form noValidate validated={validated} onSubmit={handleSubmit}>

                                            <Accordion flush defaultActiveKey="0">
                                                <InvestmentData
                                                    handleSubmit={handleSubmit} validated={validated}
                                                    handleChange={handleChange} data={data}
                                                    Balance={Accounts[0].balance} fetching={fetching} />
                                            </Accordion>
                                            <Accordion flush >
                                                <DurationData handleChange={handleChange} data={data} setData={setData} Account={Accounts[0]} />
                                            </Accordion>
                                            {
                                                false &&
                                                <Accordion flush activeKey={CollapsedFields || !(data.days >= 1 && data.amount >= 1 && data.amount <= Accounts[0].balance) ? "-1" : "0"}>
                                                    <InvestmentPreview toggleAccordion={toggleAccordion} data={data} />
                                                </Accordion>
                                            }
                                        </Form>
                                    </Col>
                                    :
                                    <NoFunds />
                        }
                    </Row>
                </Container>
                {
                    data.FundSelected !== -1 && contentReady ?
                        <ActionConfirmationModal fetching={fetching} setShowModal={setShowModal} show={ShowModal} action={invest} data={data} Balance={Accounts[0].balance} />
                        :
                        null
                }
            </div>
        </div >

    )
}
export default TimeDeposit