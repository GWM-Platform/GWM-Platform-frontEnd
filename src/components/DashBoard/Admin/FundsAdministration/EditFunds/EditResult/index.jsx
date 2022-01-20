import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft,faTimes,faCheck } from '@fortawesome/free-solid-svg-icons'

const EditFunds = ({ EditRequest, setAction, chargeFunds, Funds, Action }) => {
    const { t } = useTranslation();
    return (
        <div className="editResult">
            <div className="header">
                <h1 className="title">
                   {t("Form edit result for ")}{" \""}{Funds[Action.fund].name}{"\""}
                </h1>
                <FontAwesomeIcon className="button icon" onClick={() => {setAction({...Action,...{action:-1,fund:-1}});chargeFunds()}} icon={faChevronCircleLeft} />
            </div>
            {
                EditRequest.valid ?
                    <>
                        <div className="descriptionIconContainer green mx-auto">
                            <h1 className="title"><FontAwesomeIcon className="icon green" icon={faCheck} /></h1>
                        </div>
                        <h2 className="subTitle mt-4">{t("The fund")}{" \""}{Funds[Action.fund].name}{"\" "}{t("has been edited succesfully")}</h2>
                    </>
                    :
                    <>
                        <div className="descriptionIconContainer red mx-auto">
                            <h1 className="title"><FontAwesomeIcon className="icon red" icon={faTimes} /></h1>
                        </div>
                        <h2 className="subTitle mt-4">{t("Failed to edit the fund")}{" \""}{Funds[Action.fund].name}{"\" "}</h2>
                        <h3 className="heading">{t("It is probably due to a user owning feeParts")}</h3>
                    </>
            }
        </div>

    )
}

export default EditFunds