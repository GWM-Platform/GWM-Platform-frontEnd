import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamation, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Modal, Button, Form, Row, Container } from 'react-bootstrap'
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import Decimal from 'decimal.js';
import { useEffect } from 'react';
import { useCallback } from 'react';
import { useContext } from 'react';
import { DashBoardContext } from 'context/DashBoardContext';
import { editedDuration, editedInterestRate, getEditedAnualRate, getEditedDuration, getOriginalAnualRate, getOriginalDuration } from 'utils/fixedDeposit';


const EditModal = ({ movement, setShowModal, show, reloadData }) => {
    const { t } = useTranslation();
    const { toLogin } = useContext(DashBoardContext);

    const [ActionFetch, setActionFetch] = useState({ fetched: false, fetching: false, valid: false })

    const initialData = {
        rate: editedInterestRate(movement) ? getEditedAnualRate(movement) + "" : getOriginalAnualRate(movement) + "",
        days: editedDuration(movement) ? getEditedDuration(movement) + "" : getOriginalDuration(movement) + "",
    }
    const [data, setData] = useState(initialData)
    const [validated, setValidated] = useState(true);

    const handleSubmit = (event) => {
        event.preventDefault();
        event.stopPropagation();
        const form = event.currentTarget;
        if (form.checkValidity() === true && !ActionFetch.fetching) {
            editConditions()
        }
        setValidated(true);
    }
    const [FixedDeposit, setFixedDeposit] = useState({ fetching: true, fetched: false, valid: false, content: {} })

    const getFixedDepositPlans = useCallback((signal) => {
        setFixedDeposit((prevState) => ({ fetching: true, fetched: false }))
        axios.get(`/fixed-deposits/plans`, {
            signal: signal,
        }).then(function (response) {
            if (response.status < 300 && response.status >= 200) {
                setFixedDeposit((prevState) => ({ ...prevState, ...{ fetching: false, fetched: true, valid: true, content: response?.data[0] || {} } }))
            } else {
                switch (response.status) {
                    case 401:
                        toLogin();
                        break;
                    default:
                        setFixedDeposit((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
                        break
                }
            }
        }).catch((err) => {
            if (err.message !== "canceled") {
                setFixedDeposit((prevState) => ({ ...prevState, ...{ fetching: false, valid: false, fetched: true } }))
            }
        });
    }, [toLogin]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        getFixedDepositPlans(signal)

        return () => {
            controller.abort();
        };
        //eslint-disable-next-line
    }, [getFixedDepositPlans])

    const handleChange = (event) =>
        setData(prevState => ({ ...prevState, [event?.target?.id]: event?.target?.value }))

    const FixedDepositRules = Object.keys(FixedDeposit?.content?.interest ?? [])

    const minDuration = Decimal.min(...[...FixedDepositRules.map(string => parseInt(string)), 365]).toNumber()
    const maxDuration = Decimal.max(...[...FixedDepositRules.map(string => parseInt(string)), 730]).toNumber()

    const maxRate = 100
    const minRate = 1

    const handleClose = () => {
        setActionFetch({
            ...ActionFetch,
            fetching: false,
            fetched: false,
            valid: false
        })
        setData(prevState => ({ ...prevState, ...initialData }))
        setShowModal(false)
    }

    const editConditions = async () => {
        setActionFetch({
            ...ActionFetch,
            fetching: true,
            fetched: false,
            valid: false
        })
        axios.post(
            `/fixed-deposits/${movement.id}/conditions`,
            {
                newInterestRate: data.rate,
                newDuration: data.days
            }
        )
            .then(function (response) {
                setActionFetch({
                    ...ActionFetch,
                    fetching: false,
                    fetched: true,
                    valid: true
                })
            }).catch((err) => {
                if (err.message !== "canceled") {
                    setActionFetch({
                        ...ActionFetch,
                        fetching: false,
                        fetched: true,
                        valid: false
                    })
                }
            });
    }

    return (
        <Modal className="deleteModal" size="md" show={show} onHide={handleClose}>
            <Modal.Body className="body">
                <div className={!ActionFetch.fetched && !ActionFetch.fetching ? "show" : "hidden"}>
                    <>
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
                        <h2 className="subTitle">{t("You are about to")} {t("edit")} {t("the ticket with the id")} #{movement.id}</h2>
                        <Container className='mt-4'>
                            <Row>
                                <Form id='edit-time-deposit' noValidate validated={validated} onSubmit={handleSubmit}>
                                    <Form.Label>{t("Anual rate")} (%)</Form.Label>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            onWheel={event => event.currentTarget.blur()}
                                            value={data.rate}
                                            step="0.01"
                                            onChange={handleChange}

                                            min={minRate}
                                            max={maxRate}

                                            id="rate"
                                            type="number"
                                            required
                                            placeholder={t("Anual rate")}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {
                                                data.rate === "" ?
                                                    t("You must enter the anual rate")
                                                    :
                                                    data.rate < minRate ?
                                                        t("The minimum anual rate is {{minAnualRate}}", { minAnualRate: minRate })
                                                        :
                                                        data.rate > maxRate ?
                                                            t("The maximum anual rate is {{maxAnualRate}}", { maxAnualRate: maxRate })
                                                            :
                                                            t("You can enter at most 2 decimal places")

                                            }
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Label>{t("Duration")} ({t("days")})</Form.Label>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            onWheel={event => event.currentTarget.blur()}
                                            value={data.days}
                                            step="1"
                                            onChange={handleChange}

                                            min={minDuration}
                                            max={maxDuration}
                                            disabled={maxDuration === minDuration}

                                            id="days"
                                            type="number"
                                            required
                                            placeholder={t("Days")}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {
                                                data.days === "" ?
                                                    t("You must enter how long the investment will last")
                                                    :
                                                    data.days < minDuration ?
                                                        t("The minimum duration is () days", { days: minDuration })
                                                        :
                                                        data.days > maxDuration ?
                                                            t("The maximum duration is () days", { days: maxDuration })
                                                            :
                                                            t("Decimal values ​​are not allowed")
                                            }
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form>
                            </Row>
                        </Container>
                        <h3 className="heading">{t("This action cannot be undone")}</h3>
                    </>
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
                                <h2 className="subTitle mt-4">{t("The ticket has been")} {t("edited")} {t("succesfully")}</h2>
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
                                <h2 className="subTitle mt-4">{t("Failed to")}{" "}{t("edit")}{" "}{t("the ticket")}</h2>
                            </>
                    }

                </div>
                <div className="placeHolder">
                    <>
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
                        <h2 className="subTitle">{t("You are about to")} {t("edit")} {t("the ticket with the id")} #{movement.id}</h2>
                        <Container className='mt-4'>
                            <Row>
                                <Form noValidate validated={validated} >
                                    <Form.Label>{t("Anual rate")} (%)</Form.Label>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            onWheel={event => event.currentTarget.blur()}
                                            value={data.rate}
                                            step="0.01"
                                            onChange={handleChange}

                                            min={minRate}
                                            max={maxRate}

                                            id="rate"
                                            type="number"
                                            required
                                            placeholder={t("Anual rate")}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {
                                                data.rate === "" ?
                                                    t("You must enter the anual rate")
                                                    :
                                                    data.rate < minRate ?
                                                        t("The minimum anual rate is {{minAnualRate}}", { minAnualRate: minRate })
                                                        :
                                                        data.rate > maxRate ?
                                                            t("The maximum anual rate is {{maxAnualRate}}", { maxAnualRate: maxRate })
                                                            :
                                                            t("You can enter at most 2 decimal places")

                                            }
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Label>{t("Duration")} ({t("days")})</Form.Label>
                                    <Form.Group className="mb-3">
                                        <Form.Control
                                            onWheel={event => event.currentTarget.blur()}
                                            value={data.days}
                                            step="1"
                                            onChange={handleChange}

                                            min={minDuration}
                                            max={maxDuration}
                                            disabled={maxDuration === minDuration}

                                            id="days"
                                            type="number"
                                            required
                                            placeholder={t("Days")}
                                        />
                                        <Form.Control.Feedback type="invalid">
                                            {
                                                data.days === "" ?
                                                    t("You must enter how long the investment will last")
                                                    :
                                                    data.days < minDuration ?
                                                        t("The minimum duration is () days", { days: minDuration })
                                                        :
                                                        data.days > maxDuration ?
                                                            t("The maximum duration is () days", { days: maxDuration })
                                                            :
                                                            t("Decimal values ​​are not allowed")
                                            }
                                        </Form.Control.Feedback>
                                    </Form.Group>
                                </Form>
                            </Row>
                        </Container>
                        <h3 className="heading">{t("This action cannot be undone")}</h3>
                    </>
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

                            <Button variant="outline-secondary" type="button" onClick={() => handleClose()}>
                                {t("Cancel")}
                            </Button>
                            <Button variant="outline-success" type="submit" form='edit-time-deposit'
                                disabled={initialData.days === data.days && initialData.rate === data.rate} >
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
export default EditModal
