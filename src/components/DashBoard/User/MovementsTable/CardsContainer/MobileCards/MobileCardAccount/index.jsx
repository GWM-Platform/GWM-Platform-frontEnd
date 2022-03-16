import React, { useState, useEffect, useContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Col, Row } from 'react-bootstrap';
import TableLastMovements from './TableLastMovements';
import { useTranslation } from "react-i18next";
import { useHistory } from 'react-router-dom'
import { DashBoardContext } from 'context/DashBoardContext';

const MobileCard = ({ Fund }) => {
    // eslint-disable-next-line
    const { token, ClientSelected } = useContext(DashBoardContext);
    const { t } = useTranslation();
    let history = useHistory();
    const [movements, setMovements] = useState([])
    const [fetchingMovements, setFetchingMovements] = useState(true)

    const toLogin = () => {
        sessionStorage.clear();
        history.push(`/login`);
    }


    useEffect(() => {

        const getMovements = async () => {
            var url = `${process.env.REACT_APP_APIURL}/movements/?` + new URLSearchParams({
                client: ClientSelected.id,
                filterAccont: Fund.id
            });
            setFetchingMovements(true)
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
                setMovements(
                    data.movements ?
                        data.movements.sort((a, b) =>
                            (a.createdAt > b.createdAt) ? -1 : ((a.createdAt < b.createdAt) ? 1 : 0)
                        )
                        :
                        []
                )
                setFetchingMovements(false)
            } else {
                switch (response.status) {
                    default:
                        console.error("Error ", response.status, " account movements")
                        toLogin()
                }
            }
        }

        getMovements()
        // eslint-disable-next-line 
    }, [Fund])

    return (
        <Card className="movementsCardMobile">
            <Card.Header >
                <Container fluid className="px-3">
                    <Row className="d-flex justify-content-end align-items-center">
                        <Col className="p-0">
                            <Card.Title className="mb-0 py-1">{t("Cash")}</Card.Title>
                        </Col>
                    </Row>
                </Container>
            </Card.Header>
            <Card.Body className={`pb-0`}>
                <Container fluid className="p-0">
                    <Row className="m-1">
                        <Col xs="12" className="px-0">
                            <Card.Text>
                                <span>{t("Balance")}: <span style={{ fontWeight: "bolder" }}>$</span>{Fund.balance}</span>
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

