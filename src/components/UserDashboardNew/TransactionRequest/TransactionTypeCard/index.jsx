import React from 'react'
import { Col, Card } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

function TransactionTypeCard({ some, setSome, data, setData, ownKey, option, open,setOpen }) {
    const { t } = useTranslation();

    return (
        <Col xs={{order: option==="Wadiah Customer"? 'first' : 'last' } } sm="12" md="auto" className="pe-md-0 py-2 py-sm-2 py-md-0" onClick={() => {;setAccountSelectedInData(some, setSome, data, setData, ownKey) }}>
            <Card style={{cursor:"pointer"}}className={`${data.transactionType===(ownKey+1).toString() ? "selected" : "notSelected"} h-100`}>
                <Card.Body >
                    <Card.Text className="text-center" style={{textTransform:"capitalize"}}>
                        {t(option)}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    );
}

export default TransactionTypeCard;

const setAccountSelectedInData = (some, setSome, data, setData,ownKey) => {
    setSome(!some)
    let aux
    aux = data
    aux.transactionType=(ownKey+1).toString()
    setData(aux)
}
