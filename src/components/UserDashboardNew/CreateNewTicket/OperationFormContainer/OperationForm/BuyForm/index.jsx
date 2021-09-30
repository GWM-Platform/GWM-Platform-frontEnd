import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row } from 'react-bootstrap'
import FoundCard from './FoundCard';

const BuyForm = ({  data, setData, some, setSome}) => {

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

    },  {
        name: "CryptoCurrency found",
        totalFeeParts: 10000,
        feePartsAvalilable: 1000,
        feePartsValue: 6,
        composition: [{
            label: 'Bitcoin USD',
            value: 25
        },{
            label: 'Cardano USD',
            value: 5
        },{
            label: 'Ethereum USD',
            value: 75,
        }]

    },{
        name: "CryptoCurrency found",
        totalFeeParts: 10000,
        feePartsAvalilable: 1000,
        feePartsValue: 6,
        composition: [{
            label: 'Bitcoin USD',
            value: 25
        },{
            label: 'Cardano USD',
            value: 5
        },{
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
        },{
            label: 'Cardano USD',
            value: 5
        },{
            label: 'Ethereum USD',
            value: 75,
        }]

    },]

    return (
        <div>
            <Row className="flex-row flex-nowrap overflow-auto">
                {founds.map((found, key) => {
                    return (
                        <FoundCard key={key} ownKey={key} found={found} data={data} setData={setData} some={some} setSome={setSome}/>
                    )
                })}
            </Row>
        </div>
    )
}
export default BuyForm