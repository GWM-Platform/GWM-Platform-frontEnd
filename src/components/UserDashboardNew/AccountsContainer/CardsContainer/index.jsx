import React, { useEffect } from 'react'
import { Row, Container } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AccountCard from './AccountCard';

const CardsContainer = ({ setItemSelected, accounts }) => {


    useEffect(() => {
        return () => {
        }
    }, [accounts])

    return (
            <Container className="d-flex align-items-center justify-content-center accountsContainerWidth">
                <Row className="w-100 d-flex align-items-center justify-content-center g-5 h-100">
                    {
                        accounts.map((j, k) => {
                            return (
                                <AccountCard key={k} setItemSelected={setItemSelected} accounts={accounts} account={j} />
                            )
                        }
                        )
                    }
                </Row>
            </Container>

    )
}
export default CardsContainer
