import React,{createRef} from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row } from 'react-bootstrap'
import FoundCard from './FoundCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft,faChevronRight } from '@fortawesome/free-solid-svg-icons'
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

    },{
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
    }]
    const foundsContainer= createRef()

    const scrollFoundContainer=(right)=>{
        if(right){
            let scrollAmount = 0;
            let slideTimer = setInterval(function(){
                foundsContainer.current.scrollLeft += 10;
                scrollAmount += 10;
                if(scrollAmount >= 100){
                    window.clearInterval(slideTimer);
                }
            }, 25);
        }else{
            let scrollAmount = 0;
            let slideTimer = setInterval(function(){
                foundsContainer.current.scrollLeft -= 10;
                scrollAmount += 10;
                if(scrollAmount >= 100){
                    window.clearInterval(slideTimer);
                }
            }, 25);
        }
    }

    return (
        <div className="p-relative">
            <Row className="flex-row flex-nowrap overflow-auto" ref={foundsContainer}>
                {founds.map((found, key) => {
                    return (
                        <FoundCard key={key} ownKey={key} found={found} data={data} setData={setData} some={some} setSome={setSome}/>
                    )
                })}
            </Row>
            <div className="arrow right" onClick={()=>scrollFoundContainer(true)}>
                <FontAwesomeIcon icon={faChevronRight}/>
            </div>
            <div className="arrow left" onClick={()=>scrollFoundContainer(false)}>
                <FontAwesomeIcon icon={faChevronLeft}/>
            </div>
        </div>
    )
}
export default BuyForm