import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
//import { Form } from 'react-bootstrap'

const AddFundRow = ({ Action,setAction }) => {

    return (
        <>
            <tr className="fundRow addFund">
                <td className="verticalCenter Id" >            
                </td>
                <td className="cellWithoudPadding Name">
                </td>
                <td className="cellWithoudPadding Type">
                </td>
                <td className="cellWithoudPadding Shares">
                </td>
                <td className="cellWithoudPadding FreeShares">
                </td>
                <td className="cellWithoudPadding SharePrice">
                </td>
                <td className="verticalCenter Actions solid-bg" >
                    <div className="h-100 d-flex align-items-center justify-content-around">
                        <div className="iconContainer green">
                            <button onClick={()=>setAction({...Action,...{action:1,fund:-1}})} className="noStyle">
                                <FontAwesomeIcon className="icon" icon={faPlusCircle} />
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        </>
    )
}
export default AddFundRow
