import React from 'react'
import { Col, Card } from 'react-bootstrap';
import { useTranslation } from "react-i18next";

function TargetAccountTypeCard({ some, setSome, data, setData, ownKey, option, open,setOpen }) {
    const { t } = useTranslation();

    return (
        <Col xs={{order: option==="New contact"? 'first' : 'last' } }sm="12" md="auto" className={`pe-md-0 py-2 py-sm-2 py-md-0`} onClick={() => {;setSelected( some,setSome,data, setData, ownKey,open,setOpen) }}>
            <Card style={{cursor:"pointer"}}className={`${data.targetAccountType===(ownKey+1).toString() ? "selected" : "notSelected"} h-100`}>
                <Card.Body className="d-flex align-items-center justify-content-center" >
                    <Card.Text className="text-center" style={{textTransform:"capitalize"}}>
                        {t(option)}
                    </Card.Text>
                </Card.Body>
            </Card>
        </Col>
    );
}

export default TargetAccountTypeCard;

const setSelected = (some,setSome,data, setData,ownKey,open,setOpen) => {
    setSome(!some)
    let aux = data
    if(aux.targetAccount!==undefined){
        delete aux.targetAccount
    }
    aux.targetAccountType=(ownKey+1).toString()
    aux.transactionType = "2"
    setData(aux)
    setOpen(!open)
}
