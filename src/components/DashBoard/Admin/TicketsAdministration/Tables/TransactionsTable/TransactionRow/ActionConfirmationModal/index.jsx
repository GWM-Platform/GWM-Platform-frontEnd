import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamation, faCheck, faTimes, faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button, Form } from 'react-bootstrap'
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { customFetch } from 'utils/customFetch';


const ActionConfirmationModal = ({ transaction, setShowModal, action, show, reloadData }) => {
    const { t } = useTranslation();

    const [ActionFetch, setActionFetch] = useState({ fetched: false, fetching: false, valid: false })

    const [NoteActive, setNoteActive] = useState(false)

    const [data, setData] = useState({ note: "" })

    const handleChange = (event) => {
        let aux = data;
        aux[event.target.id] = event.target.value;
        setData(prevState => ({ ...prevState, ...aux }));
    }

    const handleClose = () => {
        setActionFetch({
            ...ActionFetch,
            fetching: false,
            fetched: false,
            valid: false
        })
        setShowModal(false)
    }


    const changeTransactionState = async () => {
        setActionFetch({
            ...ActionFetch,
            fetching: true,
            fetched: false,
            valid: false
        })

        const url = `${process.env.REACT_APP_APIURL}/${action === "revert" ? "share-transfers" : "transactions"}/${transaction.id}/${action}`;
        const token = sessionStorage.getItem("access_token")

        const response = await customFetch(url, {
            method: 'POST',
            body: JSON.stringify({ ...data.note !== "" ? { denialMotive: data.note !== "" ? data.note : null } : {} }),
            headers: {
                Authorization: `Bearer ${token}`,
                Accept: "*/*",
                'Content-Type': 'application/json'
            }
        })

        if (response.status >= 200 && response.status < 300) {
            setActionFetch({
                ...ActionFetch,
                fetching: false,
                fetched: true,
                valid: true
            })
        } else {
            setActionFetch({
                ...ActionFetch,
                fetching: false,
                fetched: true,
                valid: false
            })
            switch (response.status) {
                default:
                    console.error(response.status)
            }
        }
    }

    return (
        <Modal className="deleteModal" size="sm" show={show} onHide={handleClose}>
            <Modal.Body className="body">
                <div className={!ActionFetch.fetched && !ActionFetch.fetching ? "show" : "hidden"}>
                    <div className="d-flex justify-content-center align-items-center">
                        <h1 className='p-relative' style={{ fontSize: "4rem" }}>
                            <FontAwesomeIcon
                                className="p-absolute"
                                color="red"
                                icon={faExclamation}
                                style={{
                                    transform: "translate(-50%, -50%)",
                                    top: "50%",
                                    left: "50%"
                                }}
                            />
                            <FontAwesomeIcon

                                color="red"
                                icon={faCircle}
                                className="p-absolute"
                                style={{
                                    transform: "translate(-50%, -50%) scale(1.5)",
                                    top: "50%",
                                    left: "50%"
                                }}
                            />
                            <FontAwesomeIcon className="placeHolder" icon={faCircle} style={{ transform: "scale(1.5)" }} />
                        </h1>
                    </div>
                    <h1 className="title"> {t("Are you sure?")}</h1>
                    <h2 className="subTitle">{t("You are about to")} {t(action)} {t("the ticket with the id")} {t(transaction.id)}</h2>
                    <h3 className="heading">{t("This action cannot be undone")}</h3>
                    <div className={`px-3 mt-3 ${action !== "deny" ? "hidden" : ""}`}>
                        {
                            NoteActive ?
                                <div className="d-flex align-items-center">
                                    <Form.Control
                                        placeholder={t("Denial motive")} required
                                        value={data.note} type="text" id="note" maxLength="250"
                                        onChange={(e) => { handleChange(e); }}
                                    />

                                    <button
                                        type="button"
                                        onClick={
                                            () => {
                                                handleChange({ target: { id: "note", value: "" } })
                                                setNoteActive(false)
                                            }
                                        }
                                        className="noStyle ms-2" title={t("Remove note")}>
                                        <FontAwesomeIcon icon={faMinusCircle} />
                                    </button>
                                </div>
                                :
                                <div style={{ height: "38px" }} className="w-100 d-flex align-items-start">
                                    <Button type="button" className="ms-auto" size="sm" variant="danger" onClick={() => setNoteActive(true)}>
                                        <FontAwesomeIcon className="me-1" icon={faPlusCircle} />
                                        {t("Add note")}
                                    </Button>
                                </div>
                        }
                    </div>
                </div>
                <div className={ActionFetch.fetched && !ActionFetch.fetching ? "show" : "hidden"}>
                    {
                        ActionFetch.valid ?
                            <>
                                <div className="d-flex justify-content-center align-items-center">
                                    <h1 className='p-relative' style={{ fontSize: "4rem" }}>
                                        <FontAwesomeIcon
                                            className="p-absolute"
                                            color="green"
                                            icon={faCheck}
                                            style={{
                                                transform: "translate(-50%, -50%)",
                                                top: "50%",
                                                left: "50%"
                                            }}
                                        />
                                        <FontAwesomeIcon

                                            color="green"
                                            icon={faCircle}
                                            className="p-absolute"
                                            style={{
                                                transform: "translate(-50%, -50%) scale(1.5)",
                                                top: "50%",
                                                left: "50%"
                                            }}
                                        />
                                        <FontAwesomeIcon className="placeHolder" icon={faCircle} style={{ transform: "scale(1.5)" }} />
                                    </h1>
                                </div>
                                <h2 className="subTitle mt-4">{t("The ticket has been")} {t(action === "approve" ? "approved" : "denied")} {t("succesfully")}</h2>
                            </>
                            :
                            <>
                                <div className="d-flex justify-content-center align-items-center">
                                    <h1 className='p-relative' style={{ fontSize: "4rem" }}>
                                        <FontAwesomeIcon
                                            className="p-absolute"
                                            color="red"
                                            icon={faTimes}
                                            style={{
                                                transform: "translate(-50%, -50%)",
                                                top: "50%",
                                                left: "50%"
                                            }}
                                        />
                                        <FontAwesomeIcon

                                            color="red"
                                            icon={faCircle}
                                            className="p-absolute"
                                            style={{
                                                transform: "translate(-50%, -50%) scale(1.5)",
                                                top: "50%",
                                                left: "50%"
                                            }}
                                        />
                                        <FontAwesomeIcon className="placeHolder" icon={faCircle} style={{ transform: "scale(1.5)" }} />
                                    </h1>
                                </div>
                                <h2 className="subTitle mt-4">{t("Failed to")}{" "}{t(action)}{" "}{t("the ticket")}</h2>
                            </>
                    }

                </div>
                <div className="placeHolder">
                    <div className="d-flex justify-content-center align-items-center">
                        <h1 className='p-relative' style={{ fontSize: "4rem" }}>
                            <FontAwesomeIcon
                                className="p-absolute"
                                color="red"
                                icon={faExclamation}
                                style={{
                                    transform: "translate(-50%, -50%)",
                                    top: "50%",
                                    left: "50%"
                                }}
                            />
                            <FontAwesomeIcon

                                color="red"
                                icon={faCircle}
                                className="p-absolute"
                                style={{
                                    transform: "translate(-50%, -50%) scale(1.5)",
                                    top: "50%",
                                    left: "50%"
                                }}
                            />
                            <FontAwesomeIcon className="placeHolder" icon={faCircle} style={{ transform: "scale(1.5)" }} />
                        </h1>
                    </div>
                    <h1 className="title"> {t("Are you sure?")}</h1>
                    <h2 className="subTitle">{t("You are about to")} {t(action)} {t("the ticket with the id")} {t(transaction.id)}</h2>
                    <h3 className="heading">{t("This action cannot be undone")}</h3>
                    <div style={{ height: "38px" }} className="w-100 d-flex align-items-start">
                    </div>
                </div>
            </Modal.Body>

            <Modal.Footer className="footer justify-content-center">
                {
                    ActionFetch.fetched ?
                        <Button variant="outline-secondary" onClick={() => { reloadData(); handleClose() }}>
                            {t("Close")}
                        </Button>
                        :
                        <>

                            <Button variant="outline-secondary" onClick={() => handleClose()}>
                                {t("Cancel")}
                            </Button>
                            <Button variant="outline-success" onClick={() => { if (!ActionFetch.fetching) changeTransactionState() }}>
                                <div className="iconContainer green">
                                    {t("Confirm")}
                                </div>
                            </Button>
                        </>
                }

            </Modal.Footer>
        </Modal>
    )
}
export default ActionConfirmationModal
