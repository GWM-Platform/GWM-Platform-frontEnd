import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-regular-svg-icons'
import { Spinner } from 'react-bootstrap'
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import ActionConfirmationModal from './ActionConfirmationModal'

const MovementRow = ({ AccountInfo,UsersInfo,Movement, state, reloadData }) => {
   
    const { t } = useTranslation();

    var momentDate = moment(Movement.createdAt);

    const [ShowModal, setShowModal] = useState(false)
    const [Action, setAction] = useState("approve")

    const [ClientAccountInfo, SetClientAccountInfo] = useState({ fetching: true,valid:false, value: {} })

    const launchModalConfirmation = (action) => {
        setAction(action)
        setShowModal(true)
    }

    useEffect(() => {
        
        const userInfoById=(clientId)=>{
            let indexClientTransaction = UsersInfo.value.findIndex((client)=>client.id===clientId)
            if(indexClientTransaction>=0){
                SetClientAccountInfo((prevState)=>({
                    ...prevState,
                    valid:true,
                    fetching:false,
                    value:UsersInfo.value[indexClientTransaction]
                }))
            }else{
                SetClientAccountInfo((prevState)=>({
                    ...prevState,
                    valid:false,
                    fetching:false,
                }))
            }
        }
    
        const accountInfoById=(accountId)=>{
            let indexAccountTransaction = AccountInfo.value.findIndex((account)=>account.id===accountId)
            if(indexAccountTransaction>=0){
                userInfoById(AccountInfo.value[indexAccountTransaction].clientId)
            }else{
                SetClientAccountInfo((prevState)=>({
                    ...prevState,
                    valid:false,
                    fetching:false,
                }))
            }

        }

        if(!AccountInfo.fetching && !UsersInfo.fetching){
            accountInfoById(Movement.accountId)
        }
        //eslint-disable-next-line
    }, [Movement,state,AccountInfo,UsersInfo])
    
    return (
        <>
            <tr className="transactionRow">
                <td>{Movement.id}</td>
                <td>
                    {
                        ClientAccountInfo.fetching ?
                            <Spinner animation="border" size="sm" />
                            :
                            ClientAccountInfo.valid ?
                                ClientAccountInfo.value.alias
                                :
                                t("Undefined Client")
                    }
                </td>
                <td>${Movement.amount}</td>
                <td>{momentDate.format('MMMM Do YYYY, h:mm:ss a')}</td>
                {
                    state === 1 || state === "1" ?
                        <td className="Actions verticalCenter" >
                            <div className="h-100 d-flex align-items-center justify-content-around">
                                <div className="iconContainer red">
                                    <FontAwesomeIcon className="icon" icon={faCheckCircle} onClick={() => { launchModalConfirmation("approve") }} />
                                </div>
                                <div className="iconContainer green">
                                    <FontAwesomeIcon className="icon" icon={faTimesCircle} onClick={() => { launchModalConfirmation("deny") }} />
                                </div>
                            </div>
                        </td>
                        :
                        null
                }
            </tr>
            {state === 1 || state === "1" ?
                <ActionConfirmationModal reloadData={reloadData} movement={Movement} setShowModal={setShowModal} action={Action} show={ShowModal} />
                :
                null}
        </>
    )
}
export default MovementRow

