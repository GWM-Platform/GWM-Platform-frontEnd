import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faHashtag } from '@fortawesome/free-solid-svg-icons'
import { Form } from 'react-bootstrap'

const FundRow = ({ AssetTypes, setValidated,newFund,setNewFund }) => {

    const [some, setSome] = useState(false)

    const handleChange = (event) => {
        let aux = newFund
        aux[event.target.id] = parseInt(event.target.value) || event.target.value
        setNewFund(aux)
        setSome(!some)
    }

    return (
        <>
            <tr className="fundRow addFund">
                <td className="verticalCenter Id" >
                    <div className="h-100 d-flex align-items-center justify-content-around">
                        <div className="iconContainer green">
                            <FontAwesomeIcon className="icon" icon={faHashtag} />
                        </div>
                    </div>
                </td>
                <td className="cellWithoudPadding Name">
                    <Form.Control
                        onChange={handleChange} value={newFund.name} id="name" required className="h-100" type="text"
                    />
                </td>
                <td className="cellWithoudPadding Type">
                    <Form.Select id="typeId" required className="h-100" onChange={handleChange}>
                        {
                            AssetTypes.map((Asset, key) => {
                                return <option key={key} value={Asset.id} selected={newFund.typeId === Asset.Id}>{Asset.name}</option>
                            })
                        }
                    </Form.Select>
                </td>
                <td className="cellWithoudPadding Shares">
                    <Form.Control
                        onChange={handleChange} value={newFund.shares} min="0.01" step="0.01" id="shares" required className="h-100" type="number"
                    />
                </td>
                <td className="cellWithoudPadding FreeShares">
                    <Form.Control
                        onChange={handleChange} value={newFund.freeShares} min="0.01" max={newFund.shares} step="0.01" id="freeShares" required className="h-100" type="number"
                    />
                </td>
                <td className="cellWithoudPadding SharePrice">
                    <Form.Control
                        onChange={handleChange} value={newFund.sharePrice} min="0.01" step="0.01" id="sharePrice" required className="h-100" type="number"
                    />
                </td>
                <td className="verticalCenter Actions" >
                    <div className="h-100 d-flex align-items-center justify-content-around">
                        <div className="iconContainer green">
                            <button type="submit" className="noStyle">
                                <FontAwesomeIcon className="icon" icon={faPlusCircle} />
                            </button>
                        </div>
                    </div>
                </td>
            </tr>
        </>
    )
}
export default FundRow
