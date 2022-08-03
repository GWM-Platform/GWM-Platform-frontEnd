import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../operationsForm.css'

import { Container, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import './index.css'
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

const OperationStatus = ({ setItemSelected }) => {

    function useQuery() {
        const { search } = useLocation();

        return React.useMemo(() => new URLSearchParams(search), [search]);
    }

    //If the user came from an specific fund, we use the query to auto select that one
    let result = useQuery().get("result")

    const { t } = useTranslation()
    useEffect(() => {
        setItemSelected("")
    }, [setItemSelected])
    return (
        <Container className="OperationStatus h-100 growAnimation">
            <Row className={`h-100 d-flex align-items-center justify-content-center`}>
                <Col sm="auto">
                    {
                        result === "failed" ? 
                        <>
                                <h1 className="statusIcon"><FontAwesomeIcon icon={faTimesCircle} /></h1>
                                <h1 className="title">{t("There was an error, try again later")}</h1>
                            </>
                        :
                            <>
                                <h1 className="statusIcon"><FontAwesomeIcon icon={faClock} /></h1>
                                <h1 className="title">{t("Ticket created successfully")}</h1>
                            </>
                    }
                </Col>
            </Row>
        </Container>
    )
}
export default OperationStatus