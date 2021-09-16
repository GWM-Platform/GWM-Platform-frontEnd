import React from 'react'
import { Col, Container, Row, Accordion } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle,faClock,faTimesCircle } from '@fortawesome/free-solid-svg-icons'
import moment from 'moment';
import { useTranslation } from "react-i18next";

const TransactionResult = ({ transactionInfo,setItemSelected }) => {
    const { t } = useTranslation();
    let history = useHistory();

    if (transactionInfo === "notDoneYet") {
        history.push(`/dashboardNew/accounts`);
        setItemSelected("accounts")
    }

    var momentDate = moment(transactionInfo.date);
    return (
        <Container style={{ minHeight: "calc( 100vh - 64px )" }} className={`transactionInfo ${transactionInfo === "notDoneYet" ? "d-block" : "d-block"}`}>
            <Row>
                <Col className="justify-content-center mt-5">
                    <h1 className="icon"><FontAwesomeIcon icon={statusKeyTranslated(transactionInfo.statusKey)[1]} /></h1>
                    <h1 className="title text-center" >
                        {t(statusKeyTranslated(transactionInfo.statusKey)[0])}
                    </h1>
                    <h2 className="date text-center mb-5">{t(momentDate.format("MMMM"))} {momentDate.format("DD, YYYY")}</h2>
                    <Accordion flush>
                        <Accordion.Item eventKey="0">
                            <Accordion.Header>{t("Summary")}</Accordion.Header>
                            <Accordion.Body className="mb-5 pb-5">
                                <h3 className="textWithBottomDivider" >{t("Transaction status")}: {t(statusKeyTranslated(transactionInfo.statusKey)[0])}</h3>
                                <h3 className="listedInfo">{t("Description")}: {transactionInfo.description}</h3>
                                <h3 className="listedInfo">{t("Date")}: {t(momentDate.format("MMMM"))} {momentDate.format("DD YYYY")} {t("at")} {momentDate.format("HH:MM:SS")}</h3>
                                <h3 className="listedInfo">{t("Currency")}: {transactionInfo.currency !== undefined ? transactionInfo.currency.name : ""}</h3>
                                <h3 className="textWithBottomDivider" >
                                   {t("Amount")}: {
                                        transactionInfo.currency !== undefined ?
                                            transactionInfo.currency.symbol : ""
                                    }
                                    {transactionInfo.amount}
                                </h3>
                                <h3 className="listedInfo">{t("Transaction from")}:</h3>
                                <h3 className="listedInfo">
                                    {
                                        transactionInfo.sourceAccount !== undefined ?
                                            transactionInfo.sourceAccount.beneficiaryName : ""
                                    }, {
                                        transactionInfo.sourceAccount !== undefined ?
                                            transactionInfo.sourceAccount.description : ""}
                                </h3>
                                <h3 className="listedInfo">
                                    {t("Account Number")}: {transactionInfo.sourceAccount !== undefined ?
                                        transactionInfo.sourceAccount.externalNumber : ""}
                                </h3>
                                <h3 className="textWithBottomDivider">
                                    {t("Balance")}: {
                                        transactionInfo.currency !== undefined ?
                                            transactionInfo.currency.symbol : ""
                                    }{
                                        transactionInfo.sourceAccount !== undefined ?
                                            transactionInfo.sourceAccount.balance - transactionInfo.amount : ""
                                    }
                                </h3>
                                <h3 className="listedInfo">{t("Transaction to")}:</h3>
                                <h3 className="listedInfo">{transactionInfo.targetExternalBeneficiary}</h3>
                                <h3 className="listedInfo">{t("Account Number")}: {transactionInfo.targetExternalNumber}</h3>
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                </Col>
            </Row>
        </Container >

    )
}
export default TransactionResult

const statusKeyTranslated=(statusKey)=>{
    switch(statusKey){
        case "PENDING_AUTHORIZATION":
            return(["Pending Authorization",faClock]) 
        case "PENDING":
            return(["Transaction Pending",faClock]) 
        case "CONFIRMED":
            return(["Transaction Confirmed",faCheckCircle]) 
        case "ERROR_REPORTED_BY_BANK":
            return(["There was an error reported by the bank",faTimesCircle]) 
        case "ERROR":
            return(["There was an error",faTimesCircle]) 
        case "CANCELLED":
            return(["Transaction cancelled",faTimesCircle]) 
        case "VOIDED":
            return(["Transaction voided",faTimesCircle]) 
        default:
            return(["Unhandled error",faTimesCircle]) 
    }
}

