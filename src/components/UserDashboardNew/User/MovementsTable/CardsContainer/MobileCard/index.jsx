import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Col, Row } from 'react-bootstrap';
import TableLastMovements from './TableLastMovements';
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom'

const MobileCard = ({ setItemSelected, isMobile, className, Fund }) => {
    // eslint-disable-next-line

    const { t } = useTranslation();
    let history = useHistory();
    const [movements, setMovements] = useState([])
    const [fetchingMovements, setFetchingMovements] = useState(true)

    const toLogin = () => {
        sessionStorage.clear();
        history.push(`/login`);
    }


    useEffect(() => {
        const token = sessionStorage.getItem('access_token')

        const getMovements = async () => {
            setFetchingMovements(true)
            var url = `${process.env.REACT_APP_APIURL}/funds/${Fund.fundId}/transactions`;
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
                setMovements(data.sort(function (a, b) { return (a.createdAt > b.createdAt) ? -1 : ((a.createdAt < b.createdAt) ? 1 : 0); }))
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
    }, [Fund])

    return (
        <Card border="danger" className="movementsCardMobile">
            <Card.Header >
                <Container fluid className="px-3">
                    <Row className="d-flex justify-content-end align-items-center">
                        <Col className="p-0">
                            <Card.Title className="mb-0 py-1">{t(Fund.fund.name)}</Card.Title>
                        </Col>
                    </Row>
                </Container>
            </Card.Header>
            <Card.Body className={`pb-0`}>
                <Container fluid className="p-0">
                    <Row className="m-1">
                        <Col xs="12">
                            <Card.Title >
                                <span>
                                    {Fund.shares} FeeParts in possession
                                </span>
                            </Card.Title>
                            <Card.Title >
                                <span>
                                    FeePart price (Now)
                                    <span className="ps-3" style={{ fontWeight: "bolder" }}>
                                        ${Fund.fund.sharePrice}
                                    </span>
                                </span>
                            </Card.Title>
                            <Card.Text>
                                <span>{t("Balance")}: <span style={{ fontWeight: "bolder" }}>$</span>balanceInCash</span>
                            </Card.Text>
                        </Col>
                        <TableLastMovements
                            content={movements} fetchingMovements={fetchingMovements} />
                    </Row>
                </Container>
            </Card.Body>
        </Card>
    )
}
export default MobileCard

