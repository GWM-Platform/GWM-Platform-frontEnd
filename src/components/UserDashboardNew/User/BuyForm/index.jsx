import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import '../operationsForm.css'

import { Container, Row, Col,  } from 'react-bootstrap'
import FoundSelector from './FoundSelector'
import BuyData from './BuyData'

const BuyForm = () => {
    const [data, setData] = useState({amount:1})
    const [some, setSome] = useState(false)

    const handleChange=(event)=>{
        let aux = data;
        aux[event.target.id] = event.target.value;
        setData(aux);
        console.log(aux)
        setSome(!some)
    }

     //HardCoded data (here we should request founds that have available feeParts to sell)
     const founds = [{
        name: "CryptoCurrency found",
        totalFeeParts: 1000,
        feePartsAvalilable: 37,
        feePartsValue: 30,
        composition: [{
            label: 'Bitcoin USD',
            value: 15
        }, {
            label: 'Ethereum USD',
            value: 5
        }, {
            label: 'HEX USD',
            value: 7
        }, {
            label: 'Tether USD',
            value: 0.2
        }, {
            label: 'Cardano USD',
            value: 5
        }, {
            label: 'BinanceCoin US',
            value: 15
        }]

    }, {
        name: "CryptoCurrency found",
        totalFeeParts: 10000,
        feePartsAvalilable: 1000,
        feePartsValue: 6,
        composition: [{
            label: 'Bitcoin USD',
            value: 25
        }, {
            label: 'Cardano USD',
            value: 5
        }, {
            label: 'Ethereum USD',
            value: 75,
        }]

    }, {
        name: "CryptoCurrency found",
        totalFeeParts: 10000,
        feePartsAvalilable: 1000,
        feePartsValue: 6,
        composition: [{
            label: 'Bitcoin USD',
            value: 25
        }, {
            label: 'Cardano USD',
            value: 5
        }, {
            label: 'Ethereum USD',
            value: 75,
        }]
    }, {
        name: "CryptoCurrency found",
        totalFeeParts: 10000,
        feePartsAvalilable: 1000,
        feePartsValue: 6,
        composition: [{
            label: 'Bitcoin USD',
            value: 25
        }, {
            label: 'Cardano USD',
            value: 5
        }, {
            label: 'Ethereum USD',
            value: 75,
        }]

    }, {
        name: "CryptoCurrency found",
        totalFeeParts: 1000,
        feePartsAvalilable: 37,
        feePartsValue: 30,
        composition: [{
            label: 'Bitcoin USD',
            value: 15
        }, {
            label: 'Ethereum USD',
            value: 5
        }, {
            label: 'HEX USD',
            value: 7
        }, {
            label: 'Tether USD',
            value: 0.2
        }, {
            label: 'Cardano USD',
            value: 5
        }, {
            label: 'BinanceCoin US',
            value: 15
        }]

    }, {
        name: "CryptoCurrency found",
        totalFeeParts: 10000,
        feePartsAvalilable: 1000,
        feePartsValue: 6,
        composition: [{
            label: 'Bitcoin USD',
            value: 25
        }, {
            label: 'Cardano USD',
            value: 5
        }, {
            label: 'Ethereum USD',
            value: 75,
        }]

    }, {
        name: "CryptoCurrency found",
        totalFeeParts: 10000,
        feePartsAvalilable: 1000,
        feePartsValue: 6,
        composition: [{
            label: 'Bitcoin USD',
            value: 25
        }, {
            label: 'Cardano USD',
            value: 5
        }, {
            label: 'Ethereum USD',
            value: 75,
        }]
    }]

    return (
        <Container >
            <Row className="min-free-area-total newTicket">
                <Col sm="auto">
                    <FoundSelector founds={founds} data={data} some={some} setData={setData} setSome={setSome} />
                    <BuyData handleChange={handleChange} founds={founds} data={data}/>
                </Col>
            </Row>
        </Container>
    )
}
export default BuyForm