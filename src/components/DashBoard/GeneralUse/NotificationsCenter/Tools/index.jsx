
import { faCheckCircle, faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { faSlidersH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { fetchNotifications, markAllAsRead, selectAllNotifications } from "Slices/DashboardUtilities/notificationsSlice";
import { DashBoardContext } from "context/DashBoardContext";
import moment from "moment";
import React, { useMemo } from "react";
import { useState } from "react";
import { useContext } from "react";
import { Accordion, AccordionContext, Button, Col, Form, Row, useAccordionButton } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import axios from 'axios'

const Tools = () => {

    const { t } = useTranslation();
    const { DashboardToastDispatch, ClientSelected } = useContext(DashBoardContext)
    const notifications = useSelector(selectAllNotifications)

    const unreadNotifications = useMemo(
        () => {
            return notifications?.notifications?.filter(notification => !notification.read)
        },
        [notifications?.notifications],
    )


    const ApiMarkAllAsRead = (showToast = true) => {
        axios.patch(`/notifications`,
            {
                notificationIds: unreadNotifications?.map(notification => notification.id)
            },
            {
                params: {
                    client: ClientSelected.id
                }
            }
        ).then(function () {
            if (showToast) {
                DashboardToastDispatch({ type: "create", toastContent: { Icon: faCheckCircle, Title: "All notifications have been marked as read" } });
            }
            dispatch(markAllAsRead({ id: unreadNotifications?.map(notification => notification.id) }))
        }).catch((err) => {
            if (err.message !== "canceled") {
                if (showToast) {
                    DashboardToastDispatch({ type: "create", toastContent: { Icon: faTimesCircle, Title: "There was an error marking all the notifications as read" } });
                }
            }
        });
    }

    const dispatch = useDispatch()

    //eslint-disable-next-line
    const [Pagination, setPagination] = useState({
        skip: 0,//Offset (in quantity of logs)
        take: 15,//Logs per page
    })

    const defaultMinDate = moment().subtract(1, "month").isSameOrAfter(moment("2023-02-01")) ? moment().subtract(1, "month").format(moment.HTML5_FMT.DATE) : "2023-02-01"
    const defaultMaxDate = moment().format(moment.HTML5_FMT.DATE)

    const [validated, setValidated] = useState(false)

    const FilterOptionsDefaultState = {
        client: "",
        type: "",
        from: defaultMinDate,
        to: defaultMaxDate
    }
    const [FilterOptions, setFilterOptions] = useState(FilterOptionsDefaultState)

    const fromMinDate = defaultMinDate
    const fromMaxDate = moment(FilterOptions.to).isValid() ? FilterOptions.to : defaultMaxDate

    const toMinDate = moment(FilterOptions.from).isValid() ? FilterOptions.from : defaultMinDate
    const toMaxDate = defaultMaxDate

    const ContextAwareToggle = ({ children, eventKey, callback }) => {
        const { activeEventKey } = useContext(AccordionContext);

        const decoratedOnClick = useAccordionButton(
            eventKey,
            () => callback && callback(eventKey),
        );

        const isCurrentEventKey = activeEventKey === eventKey;

        return (
            <div
                className="header d-flex  mb-0">
                <h1 className="title">{children}</h1>
                <div className="ms-auto" />
                {
                    unreadNotifications.length > 0 &&
                    <Button className="me-2" type="button" onClick={ApiMarkAllAsRead}>
                        {t("Mark all as read")}
                    </Button>
                }
                <Button
                    style={{ backgroundColor: isCurrentEventKey ? 'purple' : '' }}
                    onClick={decoratedOnClick}
                    type="button">
                    <FontAwesomeIcon icon={faSlidersH} />
                </Button>
            </div>

        );
    }

    const handleChage = (e) => {
        setFilterOptions(prevState => ({ ...prevState, [e.target.id]: e.target.value }))
    }

    const handleSubmit = (event) => {
        const form = event.currentTarget;
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity()) {
            setPagination(prevState => ({ ...prevState, skip: 0 }))
            dispatch(fetchNotifications({ client: ClientSelected?.id, startDate: FilterOptions.from, endDate: FilterOptions.to }))
        } else {
            setValidated(true)
        }
    }


    return (
        <Accordion >
            <ContextAwareToggle eventKey="0">{t("Notifications center")}</ContextAwareToggle>
            <Accordion.Collapse eventKey="0">
                <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    <Row className="pt-2 g-2">
                        <Col sm="12" md="6" lg="4">
                            <Row className="g-2 p-relative">
                                <Col sm="12" md="6">

                                    <Form.Label>{t("from_date")}</Form.Label>
                                    <Form.Control
                                        placeholder={t('from_date')}
                                        id="from"
                                        type="date"
                                        required
                                        value={FilterOptions.from}
                                        onChange={handleChage}
                                        min={fromMinDate}
                                        max={fromMaxDate}
                                    />
                                    <Form.Control.Feedback type="invalid" tooltip>
                                        {t("Enter a valid date range between {{defaultMinDate}} and today", { defaultMinDate })}
                                    </Form.Control.Feedback>
                                </Col>
                                <Col sm="12" md="6">
                                    <Form.Label>{t("to_date")}</Form.Label>
                                    <Form.Control
                                        placeholder={t('to_date')}
                                        id="to"
                                        type="date"
                                        required
                                        value={FilterOptions.to}
                                        onChange={handleChage}
                                        min={toMinDate}
                                        max={toMaxDate}
                                    />
                                </Col>
                            </Row>
                        </Col>
                        <div className="w-100 m-0"></div>
                        <Col xs="auto" className="ms-auto">
                            <Button type="button" onClick={() => {
                                dispatch(fetchNotifications({ client: ClientSelected?.id }))
                                setFilterOptions({ ...FilterOptionsDefaultState })
                            }}>
                                Cancelar
                            </Button>
                        </Col>
                        <Col xs="auto">
                            <Button type="submit">
                                Confirmar
                            </Button>
                        </Col>
                        <Col xs="12">
                            <div className="w-100" style={{ borderBottom: "1px solid black" }} />
                        </Col>
                    </Row>
                </Form>
            </Accordion.Collapse>
        </Accordion>

    );
}

export default Tools