import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronCircleLeft,faTimes,faCheck } from '@fortawesome/free-solid-svg-icons'

const CreateAssets = ({ CreateRequest,ActionDispatch }) => {
    const { t } = useTranslation();
    return (
        <div className="editResult">
            <div className="header">
                <h1 className="title">
                   {t("Form create result")}
                </h1>
                <FontAwesomeIcon className="button icon" onClick={() => {ActionDispatch({type:"view"})}} icon={faChevronCircleLeft} />
            </div>
            {
                CreateRequest.valid ?
                    <>
                        <div className="descriptionIconContainer green mx-auto">
                            <h1 className="title"><FontAwesomeIcon className="icon green" icon={faCheck} /></h1>
                        </div>
                        <h2 className="subTitle mt-4">{t("The rule has been created succesfully")}</h2>
                    </>
                    :
                    <>
                        <div className="descriptionIconContainer red mx-auto">
                            <h1 className="title"><FontAwesomeIcon className="icon red" icon={faTimes} /></h1>
                        </div>
                        <h2 className="subTitle mt-4">{t("Failed to create the rule")}</h2>
                        <h3 className="heading">{t("Try it again later")}</h3>
                    </>
            }
        </div>

    )
}

export default CreateAssets