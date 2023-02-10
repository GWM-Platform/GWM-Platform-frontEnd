import React, { useContext, useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { Modal } from 'react-bootstrap'
import './index.css'
import MovementRow from './MovementRow';
import { DashBoardContext } from 'context/DashBoardContext';
import axios from 'axios';

const DetailModal = ({ setShowModal, ShowModal, Log, Users, Accounts,Clients }) => {

    const { t } = useTranslation();
    const { toLogin } = useContext(DashBoardContext)

    const handleClose = () => {
        setShowModal(false)
    }

    const [Movement, setMovement] = useState({ status: "idle", content: {} })

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        if (Log.movementId && ShowModal) {

            setMovement((prevState) => (
                {
                    ...prevState,
                    status: "loading",
                    content: []
                }))
            axios.get(`/movements/${Log.movementId}`, {
                signal: signal,
            }).then(function (response) {
                setMovement((prevState) => (
                    {
                        ...prevState,
                        status: "succeeded",
                        content: response?.data
                    }))
            }).catch((err) => {
                if (err.message !== "canceled") {
                    if (err.response.status === "401") toLogin()
                    else {
                        setMovement((prevState) => (
                            {
                                ...prevState,
                                status: "error",
                                content: []
                            }))

                    }
                }
            })

            return () => {
                controller.abort();
            };
        }

        // eslint-disable-next-line
    }, [ShowModal, Log])


    return (
        <Modal className="detailModal" size="md" show={ShowModal && Movement.status === "succeeded"} onHide={handleClose}>
            <Modal.Body className="body">
                <div>
                    <h1 className="title mt-0 mb-2">{t("Log")} #{Log?.id} {t("details")} </h1>
                    {
                        !!(Log.movementId ) &&
                        <MovementRow Accounts={Accounts} Clients={Clients} Movement={Movement.content} />
                    }
                </div>
            </Modal.Body>
        </Modal >
    )
}
export default DetailModal
