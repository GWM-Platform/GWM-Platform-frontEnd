import React, { useEffect } from 'react'
import { Row, Container, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import AccountCard from './AccountCard';

const CardsContainer = ({ setItemSelected, accounts }) => {


    useEffect(() => {
        return () => {
        }
    }, [accounts])

    return (
        <div>
            <Navbar className="navBarTotal"bg="light">
                <Container>
                    <Navbar.Brand> Total Balance: $XXXX</Navbar.Brand>
                </Container>
            </Navbar>
            <Container className="py-5 mt-2 d-flex align-items-center justify-content-center min-free-area-total accountsContainerWidth">
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
        </div>

    )
}
export default CardsContainer
