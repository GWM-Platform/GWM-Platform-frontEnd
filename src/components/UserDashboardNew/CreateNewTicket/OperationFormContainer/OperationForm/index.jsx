import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import BuyForm from './BuyForm';
import SellForm from './SellForm';
import DepositForm from './DepositForm';
import WithdrawForm from './WithdrawForm';

const OperationForm = ({data,setData,some,setSome}) => {
    switch(data.type){
        case 0:
            return (
                <BuyForm data={data} setData={setData} some={some} setSome={setSome}/>
            )
        case 1:
            return (
                <SellForm />
            )
        case 2:
            return (
                <DepositForm />
            )
        case 3:
            return (
                <WithdrawForm />
            )
        default:
            return (
                <h1>c.c</h1>
            )
    }
}
export default OperationForm