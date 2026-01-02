import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons'
//import { Form } from 'react-bootstrap'

const AddRuleRow = ({  ActionDispatch}) => {

    return (
        <>
            <tr className="add">
                <td className="verticalCenter Id" >            
                </td>
                <td className="cellWithoudPadding Name">
                </td>
                <td className="verticalCenter Actions solid-bg" >
                    <div className="h-100 d-flex align-items-center justify-content-around">
                        <div className="iconContainer green">
                            <button onClick={()=>  ActionDispatch({ type: "create"})} className="noStyle">
                                <FontAwesomeIcon className="icon" icon={faPlusCircle} />
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        </>
    )
}
export default AddRuleRow
