import React from 'react'
import { Col, Card } from 'react-bootstrap';

const Type = ({ ownKey, type, data, setData, some, setSome, setOpen, open }) => {
    return (
        <Col xs="auto" sm={3} style={{ cursor: "pointer" }} className="pt-1 typeContainer" onClick={() => setTypeSelected(data, setData, ownKey, some, setSome, setOpen, open)}>
            <Card className={`${data.type === ownKey ? "typeSelected" : "type"} h-100`}>
                <Card.Header className="header">
                    <img alt={type} src={process.env.PUBLIC_URL + '/images/newTicket/' + type + '.svg'} />
                </Card.Header>
                <Card.Footer className="footer">
                    <strong>
                        {type}
                    </strong>
                </Card.Footer>
            </Card>
        </Col>
    );
}

const setTypeSelected = (data, setData, ownKey, some, setSome, setOpen, open) => {
    if(data.type===undefined){
        setOpen(!open)

        let aux = data
        aux.type = ownKey
        setData(aux)
    }else{
        setOpen(!open)
        let aux = data
        aux.type = -1
        setData(aux)

        setTimeout(() => {
        let aux = data
        aux.type = ownKey
        setData(aux)
    }, 250);
    }
    
}

export default Type;

