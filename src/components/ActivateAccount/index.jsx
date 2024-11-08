import React from "react";
import { useEffect } from "react";
import { Col, Container, Row, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";
import { customFetch } from 'utils/customFetch';

const ActivateAccount = () => {
    const { t } = useTranslation()
    const history = useHistory()

    const useQuery = () => {
        const { search } = useLocation();
        return React.useMemo(() => new URLSearchParams(search), [search]);
    }
    const token = useQuery().get("token")

    useEffect(() => {
        const activateAccount = async () => {
            var url = `${process.env.REACT_APP_APIURL}/users/verify?` + new URLSearchParams({
                token: token,
            });

            const response = await customFetch(url, {
                method: 'GET',
                headers: {
                    Accept: "*/*",
                    'Content-Type': 'application/json'
                }
            })

            if (response.status === 200) {
                history.push(`/login`);
            } else {
                console.log("error")
                //history.push(`/login`);
            }
        }
        if (!token) {
            history.push(`/login`);
        } else {
            activateAccount()
        }
    }, [token, history])

    return (
        <Container>
            <Row className="d-flex justify-content-center align-items-center min-100vh ">
                <Col className="d-flex justify-content-center align-items-center">
                    <Spinner className="me-2" animation="border" variant="primary" />
                    <span className="loadingText">{t("Loading")}</span>
                </Col>
            </Row>
        </Container>);
}

export default ActivateAccount